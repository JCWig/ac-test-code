import angular from 'angular';
import template from './templates/autocomplete.tpl.html';

class AutocompleteController {

  constructor($scope, translate, uuid, $q, $log, $compile, $timeout, $document,
    autocompleteService, autocompleteConfig) {

    this.$scope = $scope;
    this.translate = translate;
    this.uuid = uuid;
    this.$q = $q;
    this.$compile = $compile;
    this.$timeout = $timeout;
    this.$document = $document;
    this.autocompleteService = autocompleteService;
    this.autocompleteConfig = autocompleteConfig;

    //scope vars
    this.isOpen = false;
    this.autocompleteId = `akam-autocomplete-${this.$scope.$id}-${this.uuid.guid()}`;
    this.searchLength = this.autocompleteConfig.SEARCH_MINIMUM;
    this.placeholder = this.placeholder || '';
    this.showSearchTip = this.showSearchTip || true;
    this.currentSearchTerm = '';
    this.childControls = [];
    this.itemSelected = false;
    this.searchTerm = '';
    this.selectItem = '';

    translate.async('components.autocomplete.search-tip')
      .then((value) => {
        this.searchTip = value;
      });

    this.$scope.$on('$destroy', () => {
      this.$document.off('keyup', this.handleTabEvent);
    });

    this.$document.on('keyup', this.handleTabEvent);

    this.buildStaticQuery(this);
  }

  /**
   * register a scope method to add child directive controller to this controller list
   * @param  {object} childCtrl child ditective controller
   */
  register(childCtrl) {
    this.childControls.unshift(childCtrl);
  }

  /**
   * buildStaticQuery builds a query string to tell typeahead to call async method that specified
   * @param  {object} ctrl a controller
   */
  buildStaticQuery() {
    let itemAsText = 'item';

    if (this.textProperty) {
      itemAsText = 'item.selectedText';
    }
    this.query = 'item as ' + itemAsText + ' for item in autocomplete.searchMatches($viewValue)';
  }

  /**
   * searchMatches a scope method gets called from typeahead for async searching
   * @param  {String} term User typed character
   * @return {Object} return Promise object
   */
  searchMatches(term) {
    let deferred = this.$q.defer();

    this.currentSearchTerm = term;

    if (term.length < this.searchLength) {
      return deferred.resolve([]);
    }

    if (!angular.isFunction(this.onSearch)) {
      this.$log.error(`onSearch function is required to make asynchronous calls.`);
      return deferred.reject('error');
    }
    return this.autocompleteService.asyncSearch(this, term);
  }

  onSelectItem(item, model, label) {
    //only here to update ng-model of selectedItem
    //still have to figure out which ng-model(search input or selected)
    //connecting to parent form as form validation concerns and require attribute used
    //$scope.setViewValue(item);

    this.itemSelected = true;
    this.selectedItem = item;
    this.isOpen = false;
    this.searchTerm = this.currentSearchTerm;

    this.$scope.setViewValue(item);

    this.notifySelected(item, label);
  }

  /**
   * clearSelected a scope method triggered from user click selected item close icon,
   * either by clear selected and notify app with empty data
   * then resets seted state
   * @param  {event} e event
   */
  clearSelected(e) {
    e.preventDefault();
    e.stopPropagation();

    this.selectedItem = '';
    this.itemSelected = false;
    this.searchTerm = '';
    //$scope.setViewValue('');
    this.notifySelected();
    this.setInputFocus();
  }

  /**
   * clearSearch a scope method to clear the search term user has entered.
   * @param  {event} e event
   */
  clearSearch() {
    this.searchTerm = '';
    this.isOpen = false;
    this.currentSearchTerm = '';
    this.setInputFocus();
  }

  /**
   * setInputFocus private function to force input focus
   */
  setInputFocus() {
    let inputEl = this.$document[0].getElementById(this.autocompleteId);

    this.$timeout(() => {
      this.$scope.$apply(() => {
        inputEl.focus();
      });
    });
  }

  /**
   * notifySelected a private method to call into app with data selected or unselected
   * @param  {String|Object} item string or object user selected
   * @param  {String} label string user selected and displayed
   */
  notifySelected(item, label) {
    if (angular.isFunction(this.onSelect)) {
      this.onSelect({
        item: item,
        displayText: label
      });
    }
  }

  /**
   * handleTabEvent a private function trigged by keyup event and handle it
   * only if it is tab key and has open class, then manually trigger click to close it
   * @param  {object} e event object
   */
  handleTabEvent(e) {
    let dirElem;

    e.preventDefault();
    e.stopPropagation();

    if ((e.keyCode || e.which) === 9) {
      dirElem = this.$document[0].querySelector('.akam-autocomplete.open');
      if (dirElem) {
        this.$timeout(() => {
          this.$document.triggerHandler('click');
          this.isOpen = false;
        });
      }
    }
  }
}

AutocompleteController.$inject = ['$scope', 'translate', 'uuid', '$q', '$log', '$compile',
  '$timeout', '$document', 'autocompleteService', 'autocompleteConfig'
];

function linkFn(scope, elem, attrs, ctrls) {
  let ctrl = ctrls[0],
    ngModel = ctrls[1],
    selectedContent = '',
    itemsContent = '',
    selectedElem, el;

  if (angular.isDefined(attrs.minimumSearch) && attrs.minimumSearch.length > 0) {
    ctrl.searchLength = attrs.minimumSearch;
  }

  if (angular.isDefined(attrs.textProperty) && attrs.textProperty.length > 0) {
    ctrl.textProperties = ctrl.textProperty.split(' ');
  }

  //get the content from child directives
  angular.forEach(ctrl.childControls, (c) => {
    if (c.name === ctrl.autocompleteConfig.ITEMS_TEMPLATE_NAME) {
      itemsContent = c.getContent();
    } else if (c.name === ctrl.autocompleteConfig.SELECTED_ITEM_TEMPLATE_NAME) {
      selectedContent = c.getContent();
    }
  });

  ctrl.autocompleteService.setItemsTemplate(ctrl, itemsContent);
  selectedElem = ctrl.autocompleteService.setSelectedItemTemplate(ctrl, selectedContent);

  el = angular.element(template);
  el.append(selectedElem);
  ctrl.$compile(el)(scope, (clonedElement) => {
    elem.replaceWith(clonedElement);
  });

  scope.setViewValue = (value) => {
    ngModel.$setViewValue(value);
  };

  ngModel.$render = () => {
    ctrl.selectedItem = ngModel.$modelValue;
  };
}

export default () => {
  return {
    restrict: 'E',
    require: ['akamAutocomplete', '^ngModel'],
    controller: AutocompleteController,
    controllerAs: 'autocomplete',
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
