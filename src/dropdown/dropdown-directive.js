import angular from 'angular';
import debounce from 'lodash/function/debounce';
import template from './templates/dropdown-directive.tpl.html';

class DropdownController {
  constructor($scope, $parse, translate) {
    this.textPropertyFn = $parse(this.textProperty);
    this.isOpen = false;
    this.itemSet = [];
    this.translate = translate;

    $scope.$watchCollection('dropdown.items', (items) => {
      this.createItemMap(items);
    });
  }

  getSelectedItemText() {
    if (this.keyProperty && this.selectedItem) {
      return this.textPropertyFn(this.itemSet[this.selectedItem]);
    } else if (this.textProperty) {
      return this.textPropertyFn(this.selectedItem);
    } else if (angular.isString(this.selectedItem)) {
      return this.selectedItem;
    }
  }

  setOpen(isOpen) {
    this.isOpen = isOpen;
  }

  createItemMap(items) {
    this.itemSet = [];
    if (!this.keyPropertyFn) {
      return [];
    }

    angular.forEach(items, (item) => {
      let keyId = this.keyPropertyFn(item);

      if (!this.itemSet[keyId]) {
        this.itemSet[keyId] = item;
      } else {
        throw new Error('Keys must be unique when using the key-property attribute');
      }
    });
  }

  setPlaceholder(placeholderProp, customMarkupScope, key) {
      let setCustomMarkupPlaceholder = () => {
        if (angular.isDefined(customMarkupScope)) {
          customMarkupScope[placeholderProp] = this[placeholderProp];
        }
      };

      this.translate.async(this[placeholderProp], null, key)
        .then(value => {
          this[placeholderProp] = value;
          setCustomMarkupPlaceholder();
        });
    }
}
DropdownController.$inject = ['$scope', '$parse', 'translate'];

function dropdown($compile, dropdownTransformer, $document, $timeout, $parse) {

  function updateTemplate(tElem, dropdownTemplate, tagName) {
    let dropdownTemplateElem = angular.element(dropdownTemplate);

    if (tElem.find(tagName).length) {
      dropdownTemplateElem.find(tagName + '-placeholder').html(tElem.find(tagName).html());
    }
    return dropdownTemplateElem[0].outerHTML;
  }

  function getCustomMarkup(tElem, tagName) {
    return tElem.find(tagName).remove().html() || undefined;
  }

  return {
    restrict: 'E',
    require: '^ngModel',
    scope: {},
    bindToController: {
      items: '=',
      textProperty: '@?',
      keyProperty: '=?',
      onChange: '&?',
      placeholder: '@?',
      filterPlaceholder: '@?',
      isDisabled: '=?',
    },
    controller: DropdownController,
    controllerAs: 'dropdown',

    template: function(tElem) {
      let dropdownTemplate = updateTemplate(tElem, template, 'akam-dropdown-selected');

      return updateTemplate(tElem, dropdownTemplate, 'akam-dropdown-option');
    },

    link: function(scope, elem, attrs, ngModel) {
      let selectedContentTemplate, selectedElem,
        menuTemplate, menuElem, windowElement,
        inputClick, selectedScope, menuScope;


      let ctrl = scope.dropdown;

      ngModel.$render = function() {
        ctrl.selectedItem = ngModel.$viewValue;
      };

      let selectedTemplate = getCustomMarkup(elem, 'akam-dropdown-selected-placeholder');
      let optionTemplate = getCustomMarkup(elem, 'akam-dropdown-option-placeholder');

      if (angular.isDefined(selectedTemplate)) {
        selectedScope = scope.$parent.$new();
        selectedScope.dropdown = ctrl;
      }

      if (angular.isDefined(optionTemplate)) {
        menuScope = scope.$parent.$new();
        menuScope.dropdown = ctrl;
      }

      ctrl.hasFilter = angular.isDefined(attrs.filterable);

      if (angular.isDefined(attrs.keyProperty)) {
        ctrl.keyProperty = attrs.keyProperty;
        ctrl.keyPropertyFn = $parse(ctrl.keyProperty || 'id');

        ctrl.createItemMap(ctrl.items);
      }

      ctrl.filterProperty = attrs.filterable;
      ctrl.isClearable = angular.isDefined(attrs.clearable);

      ctrl.setSelectedItem = function(item) {

        item = ctrl.keyProperty ? ctrl.keyPropertyFn(item) : item;

        ctrl.selectedItem = item;

        if (angular.isDefined(selectedScope)) {
          selectedScope.dropdown.selectedItem = ctrl.selectedItem;
        }
        if (angular.isFunction(ctrl.onChange) &&
            !angular.equals(ctrl.selectedItem, ngModel.$modelValue)) {
          ctrl.onChange({item: ctrl.selectedItem});
        }
        ctrl.isOpen = false;

        ngModel.$setViewValue(ctrl.selectedItem);

      };

      ctrl.clearSelectedItem = function($event) {
        $event.stopPropagation();
        ngModel.$setViewValue();
      };

      ctrl.setInputAsClicked = function() {
        inputClick = true;
      };

      function toggleDropdown(isOpen) {
        menuElem.toggleClass('util-show', isOpen);
        menuElem.toggleClass('util-hide', !isOpen);
      }

      function setAppendToBodyCoords() {
        let menu = elem.children(0)[0];

        menuElem.css({
          left: menu.offsetLeft + 'px',
          top: menu.offsetTop + menu.offsetHeight + 'px'
        });
      }

      ctrl.setPlaceholder('placeholder', selectedScope,
        'components.dropdown.placeholder.noSelection');

      ctrl.setPlaceholder('filterPlaceholder', menuScope,
        'components.dropdown.placeholder.filter');

      selectedContentTemplate = dropdownTransformer.getSelected(selectedTemplate);
      if (angular.isDefined(selectedTemplate)) {
        selectedElem = $compile(selectedContentTemplate)(selectedScope);
      } else {
        selectedElem = $compile(selectedContentTemplate)(scope);
      }
      elem.children(0).children(0).append(selectedElem);

      menuTemplate = dropdownTransformer.getMenu(optionTemplate);
      if (angular.isDefined(optionTemplate)) {
        menuElem = $compile(menuTemplate)(menuScope);
      } else {
        menuElem = $compile(menuTemplate)(scope);
      }

      if (angular.isDefined(attrs.appendToBody)) {
        $timeout(() => {
          menuElem.addClass('append-body util-hide');
          setAppendToBodyCoords();
          angular.element($document.find('body')).append(menuElem);
          windowElement = angular.element(window);
          windowElement.on('resize', debounce(setAppendToBodyCoords, 200));
          elem.on('$destroy', function() {
            windowElement.off('resize');
          });
          scope.$watch('dropdown.isOpen', (isOpen) => {
            toggleDropdown(isOpen);
            if (inputClick) {
              ctrl.isOpen = true;
              inputClick = false;
            }
          });
        }, 0);
      } else {
        elem.children(0).append(menuElem);
      }
    }
  };
}

dropdown.$inject = ['$compile', 'dropdownTransformer', '$document', '$timeout', '$parse'];

export default dropdown;
