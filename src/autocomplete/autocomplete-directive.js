var angular = require('angular');

module.exports = function(translate, uuid, $q, $log, $compile, $timeout, $document,
  autocompleteService, autocompleteConfig) {

  /**
   * buildStaticQuery builds a query string to tell typeahead to call async method that specified
   * @param  {object} ctrl a controller
   */
  function buildStaticQuery(ctrl) {
    var itemAsText = 'item';

    if (ctrl.textProperty) {
      itemAsText = 'item.selectedText';
    }
    ctrl.query = 'item as ' + itemAsText + ' for item in ac.searchMatches($viewValue)';
  }

  function AutocompleteController($scope, $element, $attrs) {

    //scope vars
    this.isOpen = false;
    this.autocompleteId = 'akam-autocomplete-' + $scope.$id + '-' + uuid.guid();
    this.searchLength = autocompleteConfig.SEARCH_MINIMUM;
    this.placeholder = this.placeholder || '';
    this.showSearchTip = this.showSearchTip || true;
    this.currentSearchTerm = '';
    this.childControls = [];
    this.itemSelected = false;
    this.searchTerm = '';
    this.selectItem = '';

    if (angular.isDefined($attrs.minimumSearch) && $attrs.minimumSearch.length > 0) {
      this.searchLength = $attrs.minimumSearch;
    }

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
    this.clearSearch = clearSearch;
    this.register = register;

    buildStaticQuery(this);

    //handle tab key handling loose focus to close dropdown
    $document.on('keyup', function(e) {
      if (e.which === 9) {
        $timeout(function() {
          $document.triggerHandler('click');
        });
      }
    });

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
      //only here to update ng-model of selectedItem
      //still have to figure out which ng-model(search input or selected)
      //connecting to parent form as form validation concerns and require attribute used
      $scope.setViewValue(item);

      this.itemSelected = true;
      this.selectedItem = item;
      this.isOpen = false;
      this.searchTerm = this.currentSearchTerm;

      notifySelected(item, label);
    }

    /**
     * clearSelected a scope method triggered from user click selected item close icon,
     * either by clear selected and notify app with empty data
     * then resets seted state
     * @param  {event} e event
     */
    function clearSelected(e) {
      e.preventDefault();
      e.stopPropagation();

      this.selectedItem = '';
      this.itemSelected = false;
      this.searchTerm = '';
      $scope.setViewValue('');
      notifySelected();
      setInputFocus();
    }

    /**
     * clearSearch a scope method to clear the search term user has entered.
     * @param  {event} e event
     */
    function clearSearch() {
      this.searchTerm = '';
      this.isOpen = false;
      this.currentSearchTerm = '';
      setInputFocus();
    }

    function setInputFocus() {
      var inputEl = $document[0].getElementById($scope.ac.autocompleteId);

      $timeout(function() {
        $scope.$apply(function() {
          inputEl.focus();
        });
      });
    }

    /**
     * notifySelected a private method to call into app with data selected or unselected
     * @param  {String|Object} item string or object user selected
     * @param  {String} label string user selected and displayed
     */
    function notifySelected(item, label) {
      var ctrl = $scope.ac;

      if (angular.isFunction(ctrl.onSelect) && $attrs.onSelect) {
        ctrl.onSelect({
          item: item,
          displayText: label
        });
      }
    }
  }

  AutocompleteController.$inject = ['$scope', '$element', '$attrs'];

  function linkFn(scope, elem, attrs, ctrls) {
    var ctrl = ctrls[0],
      ngModel = ctrls[1],
      selectedContent = '',
      itemsContent = '',
      selectedElem, el;

    //get the content from child directives
    angular.forEach(ctrl.childControls, function(c) {
      if (c.name === autocompleteConfig.ITEMS_TEMPLATE_NAME) {
        itemsContent = c.getContent();
      } else if (c.name === autocompleteConfig.SELECTED_ITEM_TEMPLATE_NAME) {
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
      onSelect: '&?',
      onSearch: '&',
      textProperty: '@?',
      placeholder: '@?',
      isDisabled: '=?',
      showSearchTip: '=?'
    },
    scope: {},
    link: linkFn
  };
};

module.exports.$inject = ['translate', 'uuid', '$q', '$log', '$compile', '$timeout', '$document',
  'autocompleteService', 'autocompleteConfig'
];
