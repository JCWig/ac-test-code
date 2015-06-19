'use strict';

var angular = require('angular');
var debounce = require('lodash/function/debounce');

require('angular-sanitize');

/* @ngInject */
module.exports = function($compile, dropdownTransformer, translate, $document, $timeout) {

  function updateTemplate(tElem, dropdownTemplate, tagName) {
    var customTemplate, dropdownTemplateElem = angular.element(dropdownTemplate);

    if (tElem.find(tagName).length) {
      customTemplate = tElem.find(tagName);
      dropdownTemplateElem.find(tagName + '-placeholder').html(customTemplate.html());
    }
    return dropdownTemplateElem[0].outerHTML;
  }

  function getCustomMarkup(tElem, tagName) {
    return tElem.find(tagName).remove().html() || undefined;
  }

  function setPlaceholder(placeholderProp, scope, customMarkupScope, value) {
    scope[placeholderProp] = value;
    if (typeof customMarkupScope !== 'undefined') {
      customMarkupScope[placeholderProp] = scope[placeholderProp];
    }
  }

  return {
    restrict: 'E',
    require: '^ngModel',
    scope: {
      items: '=',
      textProperty: '@?',
      onChange: '&?',
      placeholder: '@?',
      filterPlaceholder: '@?'
    },

    template: function(tElem) {
      var dropdownTemplate = require('./templates/dropdown-directive.tpl.html');

      dropdownTemplate = updateTemplate(tElem, dropdownTemplate, 'akam-dropdown-selected');
      dropdownTemplate = updateTemplate(tElem, dropdownTemplate, 'akam-dropdown-option');

      return dropdownTemplate;
    },

    link: function(scope, elem, attrs, ngModel) {
      var selectedScope, selectedContentTemplate, selectedElem,
        menuScope, menuTemplate, menuElem, selectedTemplate, optionTemplate, windowElement,
        inputClick;

      var appendToBody = typeof attrs.appendToBody !== 'undefined';

      selectedTemplate = getCustomMarkup(elem, 'akam-dropdown-selected-placeholder');
      optionTemplate = getCustomMarkup(elem, 'akam-dropdown-option-placeholder');

      if (typeof selectedTemplate !== 'undefined') {
        selectedScope = scope.$parent.$new();
      }

      if (typeof optionTemplate !== 'undefined') {
        menuScope = scope.$parent.$new();
      }

      scope.hasFilter = typeof attrs.filterable !== 'undefined';
      scope.isClearable = typeof attrs.clearable !== 'undefined';

      scope.filterProperty = attrs.filterable;

      scope.isOpen = false;

      scope.setSelectedItem = function(item) {
        ngModel.$setViewValue(item);
      };
      scope.clearSelectedItem = function($event) {
        $event.stopPropagation();
        ngModel.$setViewValue();
      };

      scope.setOpen = function(isOpen) {
        scope.isOpen = isOpen;
      };
      scope.setInputClick = function() {
        inputClick = true;
      };
      function setAppendToBodyCoords() {
        var menu = elem.children(0)[0];

        menuElem.css({
          left: menu.offsetLeft + 'px',
          top: menu.offsetTop + menu.offsetHeight + 'px'
        });
      }
      if (typeof scope.placeholder !== 'string') {
        translate.async('components.dropdown.placeholder.noSelection')
          .then(function(value) {
            setPlaceholder('placeholder', scope, selectedScope, value);
          });
      } else {
        setPlaceholder('placeholder', scope, selectedScope, scope.placeholder);
      }

      if (typeof scope.filterPlaceholder !== 'string') {
        translate.async('components.dropdown.placeholder.filter')
          .then(function(value) {
            setPlaceholder('filterPlaceholder', scope, menuScope, value);
          });
      } else {
        setPlaceholder('filterPlaceholder', scope, menuScope, scope.filterPlaceholder);
      }
      scope.$watch(function() {
        return ngModel.$viewValue;
      }, function(modelValue) {

        scope.selectedItem = modelValue;
        if (typeof selectedScope !== 'undefined') {
          selectedScope.selectedItem = modelValue;
        }
        scope.isOpen = false;

        if (typeof scope.onChange === 'function') {
          scope.onChange({item: modelValue});
        }
      });

      selectedContentTemplate = dropdownTransformer.getSelected(selectedTemplate);
      if (typeof selectedTemplate !== 'undefined') {
        selectedScope.selectedItem = scope.selectedItem;
        selectedScope.textProperty = scope.textProperty;
        selectedScope.clearSelectedItem = scope.clearSelectedItem;
        selectedScope.setOpen = scope.setOpen;

        selectedElem = $compile(selectedContentTemplate)(selectedScope);
      } else {
        selectedElem = $compile(selectedContentTemplate)(scope);
      }
      elem.children(0).children(0).append(selectedElem);

      menuTemplate = dropdownTransformer.getMenu(optionTemplate);
      if (typeof optionTemplate !== 'undefined') {
        menuScope.items = scope.items;
        menuScope.textProperty = scope.textProperty;
        menuScope.setSelectedItem = scope.setSelectedItem;
        menuScope.hasFilter = scope.hasFilter;
        menuScope.filterProperty = scope.filterProperty;
        menuScope.setOpen = scope.setOpen;
        menuScope.reshow = scope.reshow;
        menuElem = $compile(menuTemplate)(menuScope);
      } else {
        menuElem = $compile(menuTemplate)(scope);
      }
      if (appendToBody) {
        $timeout(function() {
          menuElem.addClass('append-body');
          menuElem.css({
            display: 'none',
            width: elem.children(0)[0].offsetWidth + 'px'
          });
          setAppendToBodyCoords();
          angular.element($document.find('body')).append(menuElem);
          windowElement = angular.element(window);
          windowElement.on('resize', debounce(setAppendToBodyCoords, 200));
          elem.on('$destroy', function() {
            windowElement.off('resize');
          });
          scope.$watch('isOpen', function(isOpen) {
            menuElem.css({display: isOpen ? 'block' : 'none'});
            if (inputClick) {
              scope.isOpen = true;
              inputClick = false;
            }
          });
        }, 0);
      } else {
        elem.children(0).append(menuElem);
      }
    }
  };
};