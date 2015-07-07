'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function(translate, uuid, $q, $log, $compile, $document, autocompleteService) {

  var config = {
    SEARCH_MINIMUM: 1,
    ITEMS_TEMPLATE_NAME: 'AKAM-AUTOCOMPLETE-ITEMS',
    SELECTED_ITEM_TEMPLATE_NAME: 'AKAM-AUTOCOMPLETE-SELECTED-ITEM'
  };

  /**
   * buildStaticQuery builds atring to tell typeahead to call async method specified
   * @param  {object} ctrl a controller
   */
  function buildStaticQuery(ctrl) {
    var itemAsText = 'item';

    if (ctrl.textProperty) {
      itemAsText = 'item.selectedText';
    }
    ctrl.query = 'item as ' + itemAsText + ' for item in ac.searchMatches($viewValue)';
  }

  /* @ngInject */
  function AutocompleteController($scope, $element, $attrs) {

    //scope vars
    this.isOpen = false;
    this.autocompleteId = 'akam-autocomplete-' + $scope.$id + '-' + uuid.guid();
    this.searchLength = this.minimumSearch || config.SEARCH_MINIMUM;
    this.placeholder = this.placeholder || '';
    this.showSearchTip = this.showSearchTip || true;
    this.currentSearchTerm = '';
    this.childControls = [];
    this.itemSelected = false;

    if (angular.isDefined($attrs.textProperty) && $attrs.textProperty.length > 0) {
      this.textProperties = this.textProperty.split(' ');
    }

    translate.async('components.autocomplete.search-tip')
      .then(function(value) {
        $scope.ac.searchTip = value;
      });

    //$scope methods
    this.searchMatches = searchMatches;
    this.selectItem = selectItem;
    this.clearSelected = clearSelected;
    this.register = register;
    this.inputFocus = inputFocus;

    /**
     * register a scope method to add child directive controller to this controller list
     * @param  {object} childCtrl child ditective controller
     */
    function register(childCtrl) {
      this.childControls.unshift(childCtrl);
    }

    /**
     * searchMatches a scope method gets called from typeahead for async searching
     * @param  {String} term User typed character
     * @return {Object} return Promise object
     */
    function searchMatches(term) {
      var ctrl = $scope.ac,
        deferred = $q.defer();

      this.currentSearchTerm = term;

      if (term.length < ctrl.searchLength) {
        return deferred.resolve([]);
      }

      if (!angular.isFunction(ctrl.onSearch) || !$attrs.onSearch) {
        $log.error('onSearch function is required to make asynchronous calls.');
        return deferred.reject('error');
      }
      return autocompleteService.asyncSearch(ctrl, term);
    }

    /**
     * selectItem a scope method, it will gets call from typeahead when selected an item
     * sets new selected data and state and callback to parent with data
     * @param  {String|Object} item string or object user selected
     * @param  {Object} model object user selected
     * @param  {String} label string user selected and displayed
     */
    function selectItem(item, model, label) {
      $scope.setViewValue(item);

      this.item = item;
      this.itemSelected = true;
      //this.isOpen = false;
      this.selectedItem = this.currentSearchTerm;

      if (angular.isFunction(this.onSelect) && $attrs.onSelect) {
        this.onSelect({
          item: item,
          displayText: label
        });
      }
    }

    /**
     * clearSelected a scope method triggered from user click close icon, then resets every states
     */
    function clearSelected() {
      this.selectedItem = '';
      this.items = [];
      this.isOpen = false;
      this.currentSearchTerm = '';
    }

    $document.on('click', angular.bind(this, clickHandler));

    $scope.$on('$destroy', function() {
      $document.off('click', angular.bind(this, clickHandler));
    });

    function clickHandler(e) {
      var tagName = angular.lowercase(e.target.tagName),
        inputElem, isInput = false;

      if (tagName === 'input') {
        inputElem = angular.element(e.target);
        if (inputElem.attr('id') === $scope.ac.autocompleteId) {
          isInput = true;
        }
      }

      if (this.selectedItem && !isInput) {
        $scope.$apply('ac.itemSelected=true;');
      }
    }

    function inputFocus(e) {
      e.preventDefault();
      e.stopPropagation();

      this.itemSelected = false;
    }

    buildStaticQuery(this);
  }

  /* @ngInject */
  function linkFn(scope, elem, attrs, ctrls) {
    var ctrl = ctrls[0],
      ngModel = ctrls[1],
      selectedContent = '',
      itemsContent = '',
      selectedElem, el;

    //get the content from child directives
    angular.forEach(ctrl.childControls, function(c) {
      if (c.name === config.ITEMS_TEMPLATE_NAME) {
        itemsContent = c.getContent();
      } else if (c.name === config.SELECTED_ITEM_TEMPLATE_NAME) {
        selectedContent = c.getContent();
      }
    });
    autocompleteService.setItemsTemplate(ctrl, itemsContent);
    selectedElem = autocompleteService.setSelectedItemTemplate(ctrl, selectedContent);

    el = angular.element(require('./templates/autocomplete.tpl.html'));
    el.append(selectedElem);
    $compile(el)(scope, function(clonedElement) {
      elem.replaceWith(clonedElement);
    });

    scope.setViewValue = function(value) {
      ngModel.$setViewValue(value);
    };

    ngModel.$render = function() {
      scope.ac.selectedItem = ngModel.$modelValue;
    };
  }

  return {
    restrict: 'E',
    require: ['akamAutocomplete', '^ngModel'],
    controller: AutocompleteController,
    controllerAs: 'ac',
    bindToController: {
      items: '=',
      onSelect: '&?',
      onSearch: '&',
      textProperty: '@?',
      placeholder: '@?',
      minimumSearch: '=?',
      isDisabled: '=?',
      showSearchTip: '=?'
    },
    scope: {},
    link: linkFn
  };
};
