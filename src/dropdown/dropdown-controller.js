import angular from 'angular';
const PLACEHOLDER_KEY = 'components.dropdown.placeholder.noSelection';
const FILTER_PLACEHOLDER_KEY = 'components.dropdown.placeholder.filter';

export default class DropdownController {

  static get $inject() {
    return ['$scope', '$parse', '$translate', 'dropdownTemplateService', 'appendToBodyService',
      '$compile'];
  }

  constructor($scope, $parse, $translate, dropdownTemplateService, appendToBodyService, $compile) {
    this.name = 'dropdown';
    this.textPropertyFn = $parse(this.textProperty);
    this.isOpen = false;
    this.itemSet = [];
    this.$translate = $translate;
    this.dropdownTemplateService = dropdownTemplateService;
    this.$parse = $parse;
    this.appendToBodyService = appendToBodyService;
    this.$scope = $scope;
    this.$compile = $compile;
    this.filterClick = false;

    $scope.$watchCollection('dropdown.items', items => this.createItemMap(items));
  }

  initialize(elem, attrs, ngModel) {
    this.elem = elem;
    this.ngModel = ngModel;

    this.ngModel.$render = () => {
      this.selectedItem = this.ngModel.$viewValue;
    };

    this.hasFilter = angular.isDefined(attrs.filterable);

    if (angular.isDefined(attrs.keyProperty)) {
      this.keyProperty = attrs.keyProperty;
      this.keyPropertyFn = this.$parse(this.keyProperty || 'id');

      this.createItemMap(this.items);
    }

    this.isClearable = angular.isDefined(attrs.clearable);
    this.appendToBody = angular.isDefined(attrs.appendToBody);

    this.selected =
      new this.dropdownTemplateService.DropdownSelectedTemplate(this.elem, this);
    this.menu =
      new this.dropdownTemplateService.DropdownMenuTemplate(this.elem, this,
        this.appendToBodyService);

    this.setPlaceholders();

    this.selected.render(this.$compile);
    this.menu.render(this.$compile);
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

  setPlaceholders() {
    this.$translate(this.placeholder || PLACEHOLDER_KEY)
      .then(value => {
        this.placeholder = value;
        this.selected.placeholder = this.placeholder;
      });

    this.$translate(this.filterPlaceholder || FILTER_PLACEHOLDER_KEY)
      .then(value => {
        this.filterPlaceholder = value;
        this.selected.placeholder = this.placeholder;
      });
  }

  setSelectedItem(item) {
    item = this.keyProperty ? this.keyPropertyFn(item) : item;

    this.selectedItem = item;
    this.selected.selectedItem = this.selectedItem;

    if (angular.isFunction(this.onChange) &&
      !angular.equals(this.selectedItem, this.ngModel.$modelValue)) {
      this.onChange({item: this.selectedItem});
    }
    this.isOpen = false;

    this.ngModel.$setViewValue(this.selectedItem);
  }

  clearSelectedItem($event) {
    $event.stopPropagation();
    this.ngModel.$setViewValue();
    this.selectedItem = undefined;
  }

  initFilterClick() {
    if (this.filterClick) {
      this.isOpen = true;
      this.filterClick = false;
    }
  }
}