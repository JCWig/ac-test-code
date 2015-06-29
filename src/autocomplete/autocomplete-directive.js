'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function(translate, uuid, $q, $log, $templateCache) {

  var consts = {
    ITEM_TEMPLATE_URL_PARTIAL: 'template/typeahead/',
    DEFAULT_TEMPLATE_NAME: 'akam-autocomplete.item.html',
    CUSTOM_CONTENT_PLACEHOLDER: 'akam-autocomplete-item',
    SEARCH_MINIMUM: 1
  };

  function setTemplate(customContent, contentUrl) {
    var itemContentHtml;

    if (customContent.length) {
      itemContentHtml = customContent[1].innerHTML;
    } else {
      itemContentHtml = require('./templates/autocomplete-item.tpl.html');
    }
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

    var langKey;

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

    //translate serach tip text
    langKey = this.searchLength === 1 ?
      'components.autocomplete.search-tip' : 'components.autocomplete.search-tip-plural';

    translate.async(langKey, {
        length: this.searchLength
      })
      .then(function(value) {
        $scope.ac.searchTip = value;
      });

    //$scope methods names mapping
    this.selectItem = selectItem;
    this.deleteSelected = deleteSelected;
    this.searchMatches = searchMatches;

    setTemplate($transclude(), this.contentTemplateUrl);
    buildStaticQuery(this);

    //private functions
    function searchMatches(term) {
      var ctrl = $scope.ac,
        deferred = $q.defer();

      term = term || ctrl.selectedItem;

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

    //we could do something about raw data, like filtering...
    function normalizeData(rawData) {
      var normalized = rawData;

      $scope.ac.isOpen = true;
      return normalized;
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

    function deleteSelected() {
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
