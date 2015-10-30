import angular from 'angular';
import selectedElemTemplate from './templates/dropdown-selected.tpl.html';
import menuElemTemplate from './templates/dropdown-menu.tpl.html';

const PLACEHOLDER_KEY = 'components.dropdown.placeholder.noSelection';

export default class DropdownController {

  static get $inject() {
    return ['$scope', '$parse', '$translate', 'dropdownTemplateService', 'appendToBodyService',
      '$compile', '$log', '$q'];
  }

  constructor($scope, $parse, $translate, dropdownTemplateService, appendToBodyService, $compile,
              $log, $q) {
    this.name = 'dropdown';
    this.textPropertyFn = $parse(this.textProperty);
    this.textPropertySetter = this.textPropertyFn.assign;
    this.isOpen = false;
    this.itemSet = {};
    this.$translate = $translate;
    this.dropdownTemplateService = dropdownTemplateService;
    this.$parse = $parse;
    this.appendToBodyService = appendToBodyService;
    this.$scope = $scope;
    this.$compile = $compile;
    this.$log = $log;
    this.$q = $q;
    this.templateData = {
      selected: {
        template: selectedElemTemplate,
        customSelector: 'span.selected-option'
      },
      menu: {
        template: menuElemTemplate,
        customSelector: 'a.dropdown-item-link'
      }
    };

    this.promiseLoading = false;

    $translate('components.dropdown.itemFailureMessage')
      .then(value => this.itemFailureMessage = value);
  }

  initialize(elem, attrs, ngModel) {
    this.elem = elem;
    this.ngModel = ngModel;

    this.ngModel.$render = () => {
      this.selectedItem = this.ngModel.$viewValue;
    };

    this.$scope.$watchCollection(`${this.name}.items`, items => {
      this.createItemMap(items);
    });

    if (angular.isDefined(attrs.keyProperty)) {
      this.keyProperty = attrs.keyProperty;
      this.keyPropertyFn = this.$parse(this.keyProperty || 'id');

      this.createItemMap(this.items);
    }

    this.isClearable = angular.isDefined(attrs.clearable);
    this.appendToBody = angular.isDefined(attrs.appendedToBody);

    this.selected =
      new this.dropdownTemplateService.DropdownSelectedRenderer(this);
    this.menu =
      new this.dropdownTemplateService.DropdownMenuRenderer(this);

    this.setPlaceholders();
    this.translateTextProperty();

    this.selected.render();
    this.menu.render();
  }

  hasSelectedItem() {
    return this.selectedItem || this.selectedItem === 0 ? true : false;
  }

  getSelectedItemText() {
    if (this.keyProperty && this.hasSelectedItem()) {
      return this.textPropertyFn(this.itemSet[this.selectedItem]);
    } else if (this.textProperty) {
      return this.textPropertyFn(this.selectedItem);
    } else if (angular.isString(this.selectedItem)) {
      return this.selectedItem;
    }
  }

  createItemMap(items) {

    if (angular.isDefined(items) && items !== null && angular.isFunction(items.then)) {
      this.items = [];
      this.promiseLoading = true;
      items.then(promiseItems => {
        this.items = promiseItems;
        this.promiseLoading = false;
      }, rejectReason => {
        this.$log.error(rejectReason);
        this.promiseLoading = false;
      });
    }

    this.itemSet = [];
    if (!this.keyPropertyFn) {
      return [];
    }

    angular.forEach(items, (item) => {
      let keyId = this.keyPropertyFn(item);

      if (!(this.itemSet.hasOwnProperty(keyId) && this.itemSet[keyId])) {
        this.itemSet[keyId] = item;
      } else {
        throw new Error('Keys must be unique when using the key-property attribute');
      }
    });
  }

  setPlaceholders() {
    this.$translate(this.placeholder || PLACEHOLDER_KEY)
      .then(value => {
        this.placeholder = value;
        this.selected.placeholder = this.placeholder;
      });
  }

  translateTextProperty() {
    if (angular.isDefined(this.textProperty)) {
      if (angular.isDefined(this.keyProperty)) {
        Object.keys(this.itemSet).forEach(key => {
          this.$translate(this.textPropertyFn(this.itemSet[key]))
            .then(value => {
              this.textPropertySetter(this.itemSet[key], value);
            });
        });
      } else {
        angular.forEach(this.items, (item) => {
          this.$translate(item[this.textProperty])
            .then(value => {
              item[this.textProperty] = value;
            });
        });
      }
    }
  }

  setSelectedItem(item) {
    item = this.keyProperty ? this.keyPropertyFn(item) : item;

    this.selectedItem = item;
    this.selected.selectedItem = this.selectedItem;

    this.isOpen = false;

    this.ngModel.$setViewValue(this.selectedItem);
  }

  clearSelectedItem($event) {
    $event.stopPropagation();
    $event.preventDefault();
    this.ngModel.$setViewValue();
    this.selectedItem = undefined;
  }

  renderMenu() {
    return angular.isArray(this.items);
  }

  getItems() {
    return this.renderMenu() ? this.items : [];
  }
}
