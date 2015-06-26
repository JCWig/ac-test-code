'use strict';

var angular = require('angular');
var debounce = require('lodash/function/debounce');

/* @ngInject */
module.exports = function(translate, uuid, $q) {

  /* @ngInject */
  function AutoCompleteController($scope, $element, $attrs) {

    var key;

    this.isOpen = false;
    this.autoCompleteId = uuid.guid();
    this.searchLength = this.minimumSearch || 1;
    this.placeholder = this.placeholder || '';
    this.selected = false;
    this.selectItem = selectItem;
    this.deleteSelected = deleteSelected;

    if (angular.isDefined($attrs.textProperty) && $attrs.textProperty.length > 0) {
      this.textProperty = $attrs.textProperty;
    }

    key = this.searchLength === 1 ?
    'components.auto-complete.search-tip' : 'components.auto-complete.search-tip_plural';

    translate.async(key, {length: this.searchLength})
      .then(function(value) {
        $scope.ac.searchTip = value;
      });

    buildStaticQuery();

    //this call from child directive to passing in the text or object
    function selectItem(item) {
      var modelValue = item;

      if (this.propertyText) {
        modelValue = item[this.propertyText];
      }
      this.selectedItem = modelValue;
      $scope.setViewValue(item);

      this.isOpen = false;
      this.selected = true;

      if (angular.isFunction(this.onSelect)) {
        this.onSelect({
          item: item
        });
      }
    }

    function deleteSelected() {
      this.selectedItem = '';
      this.selected = false;
      this.items = [];
    }

    function buildStaticQuery() {
      var itemAsText = 'item',
        c = $scope.ac;

      if (c.textProperty) {
        itemAsText = 'item[ac.textProperty]';
      }
      c.query = 'item as ' + itemAsText + ' for item in ac.items | filter:{name:$viewValue}';
      return c.query;
    }

    function searchMatches() {
      if (this.selectedItem.length < this.searchDefinedLength) {
        return;
      }
      if (angular.isFunction(this.onSearch)) {
        $q.when(this.onSearch({
            term: this.selectedItem
          }))
          .then(angular.bind(this, setSearchData))
          .catch(angular.bind(this, setNullData));
      }
    }

    function setSearchData(data) {
      this.items = data;
      this.isOpen = true;
    }

    function setNullData() {
      this.items = [];
      //this.isOpen = true;
    }

    this.debounceSearch = debounce(searchMatches, 300);

    $element.on('input', angular.bind(this, this.debounceSearch, this.selectedItem));
  }

  /* @ngInject */
  function linkFn(scope, elem, attrs, ngModel) {

    scope.setViewValue = function(value) {
      ngModel.$setViewValue(value);
    };

    ngModel.$render = function() {
      scope.ac.selectedItem = ngModel.$modelValue;
    };
  }

  return {
    restrict: 'E',
    //transclude: true,
    require: '^ngModel',
    controller: AutoCompleteController,
    controllerAs: 'ac',
    bindToController: {
      items: '=',
      onSelect: '&?',
      onSearch: '&?',
      textProperty: '@',
      placeholder: '@?',
      minimumSearch: '=?'
    },
    scope: {},
    template: require('./templates/auto-complete.tpl.html'),
    link: linkFn
  };
};
