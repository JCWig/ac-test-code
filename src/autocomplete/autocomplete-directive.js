'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function(translate, uuid, $q, $log, $templateCache) {

  var consts = {
    ITEM_TEMPLATE_URL_PARTIAL: 'template/typeahead/',
    DEFAULT_TEMPLATE_NAME: 'akam-autocomplete.item.html',
    CUSTOM_CONTENT: 'akam-autocomplete-item',
    SEARCH_MINIMUM: 1
  };

  function setTemplate(transcludeFn, contentUrl) {
    var itemContentHtml, itemContent, html;

    transcludeFn(function(clone) {
      if (clone.length && clone[1]) {
        itemContent = clone[1];
        html = itemContent.innerHTML.trim();

        if (angular.lowercase(itemContent.tagName) === consts.CUSTOM_CONTENT && html.length) {
          itemContentHtml = html;
        } else {
          itemContentHtml = require('./templates/autocomplete-item.tpl.html');
        }
      } else {
        itemContentHtml = require('./templates/autocomplete-item.tpl.html');
      }
    });
    $templateCache.put(contentUrl, itemContentHtml);
  }

  function buildStaticQuery(ctrl) {
    var itemAsText = 'item',
      c = ctrl;

    if (c.textProperty) {
      itemAsText = 'item[ac.textProperty]';
    }
    c.query = 'item as ' + itemAsText + ' for item in ac.searchMatches($viewValue)';
    return ctrl; //for chainable
  }

  /* @ngInject */
  function AutocompleteController($scope, $element, $attrs, $transclude) {

    //adjust values for $scope vars
    this.isOpen = false;
    this.autocompleteId = 'akam-autocomplete-' + $scope.$id + '-' + uuid.guid();
    this.searchLength = this.minimumSearch || consts.SEARCH_MINIMUM;
    this.placeholder = this.placeholder || '';
    this.selected = false;
    this.contentTemplateUrl = this.contentProperty ?
      consts.ITEM_TEMPLATE_URL_PARTIAL + this.contentProperty + '.html' :
      consts.ITEM_TEMPLATE_URL_PARTIAL + consts.DEFAULT_TEMPLATE_NAME;

    if (angular.isDefined($attrs.textProperty) && $attrs.textProperty.length > 0) {
      this.textProperty = $attrs.textProperty;
    }

    translate.async('components.autocomplete.search-tip')
      .then(function(value) {
        $scope.ac.searchTip = value;
      });

    //$scope methods names mapping
    this.selectItem = selectItem;
    this.clearSelected = clearSelected;
    this.searchMatches = searchMatches;

    setTemplate($transclude, this.contentTemplateUrl);
    buildStaticQuery(this);

    //private functions
    function searchMatches(term) {
      var ctrl = $scope.ac,
        deferred = $q.defer();

      term = term || ctrl.selectedItem;
      ctrl.selected = false;

      if (term.length < ctrl.searchLength) {
        return deferred.resolve([]);
      }

      if (!angular.isFunction(ctrl.onSearch)) {
        $log.error('onSearch function is required to make asynchronous calls.');
        deferred.reject();
      }

      return new Promise(function(resolve, reject) {
        var asyncSearch = ctrl.onSearch({
          term: term
        });

        $q.when(asyncSearch)
          .then(function(raw) {
            resolve(normalizeData(raw));
          })
          .catch(function() {
            $log.error('ajax call return error.');
            ctrl.items = [];
            reject([]);
          });
      });
    }

    //we could do something about raw data,
    //like filtering, update pen class, turn off loading...
    function normalizeData(rawData) {
      var data = rawData,
        hasData = false;

      if (angular.isArray(data) && data.length) {
        hasData = true;
      } else if (angular.isObject(data) || angular.isString(data)) {
        hasData = true;
        data = [data];
      }
      $scope.ac.isOpen = hasData;
      //hide loading
      return data;
    }

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

    function clearSelected() {
      this.selectedItem = '';
      this.selected = false;
      this.items = [];
    }

    //$element.on('input', angular.bind(this, this.debounceSearch, this.selectedItem));
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
    transclude: true,
    require: '^ngModel',
    controller: AutocompleteController,
    controllerAs: 'ac',
    bindToController: {
      items: '=',
      onSelect: '&?',
      onSearch: '&',
      textProperty: '@?',
      contentProperty: '@?',
      placeholder: '@?',
      minimumSearch: '=?'
    },
    scope: {},
    template: require('./templates/autocomplete.tpl.html'),
    link: linkFn
  };
};
