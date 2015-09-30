import angular from 'angular';
import template from './templates/autocomplete-directive.tpl.html';
import selectedElemTemplate from './templates/autocomplete-selected.tpl.html';
import menuElemTemplate from './templates/autocomplete-menu.tpl.html';

import DropdownController from '../dropdown/dropdown-controller';

class AutocompleteController extends DropdownController {

  static get $inject() {
    return ['$scope', '$parse', '$translate', 'dropdownTemplateService', 'appendToBodyService',
      '$compile', '$log', '$timeout'];
  }

  constructor($scope, $parse, $translate, dropdownTemplateService, appendToBodyService, $compile,
              $log, $timeout) {
    super($scope, $parse, $translate, dropdownTemplateService, appendToBodyService, $compile, $log);

    this.name = 'autocomplete';
    this.$timeout = $timeout;
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
    this.searchTerm = '';
  }

  initialize(elem, attrs, ngModel) {
    super.initialize(elem, attrs, ngModel);
    this.initialSearch();
    this.searchInput = elem[0].querySelector('input.autocomplete-search');
  }

  clearSelectedItem(e) {
    super.clearSelectedItem(e);
    this.clickSelected(e);
  }

  clickSelected(e) {
    e.stopPropagation();
    e.preventDefault();

    if (!this.isDisabled) {
      this.searchShown = true;
      this.$timeout(() => this.searchInput.focus());
    }
  }

  isSearchShown() {
    return this.searchShown;
  }

  initialSearch() {
    if (this.keyProperty) {
      this.items = this.onSearch({searchTerm: this.searchTerm});
    }
  }

  search() {
    let searchResult = this.onSearch({searchTerm: this.searchTerm});

    if (angular.isArray(searchResult)) {
      this.items = searchResult;
      this.isOpen = true;
    } else if (angular.isFunction(searchResult.then)) {
      searchResult.then((resultItems) => {
        this.items = resultItems;
      }, (rejectReason) => {
        this.$log.warn(rejectReason);
        this.items = [];
      });
    } else {
      this.items = [];
      throw new Error('on-search callback is required to return an Array or Promise');
    }
  }

  blurSearch() {
    this.searchShown = false;
    this.searchTerm = '';
  }
}

function AutocompleteDirective(dropdownTemplateService) {

  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {},
    bindToController: {
      textProperty: '@?',
      keyProperty: '=?',
      placeholder: '@?',
      isDisabled: '=?',
      onSearch: '&'
    },
    controller: AutocompleteController,
    controllerAs: 'autocomplete',

    template: function(tElem) {
      return dropdownTemplateService.transformTemplate(tElem, template,
        'akam-autocomplete-selected', 'akam-autocomplete-option');
    },

    link: function(scope, elem, attrs, ngModel) {
      scope.autocomplete.initialize(elem, attrs, ngModel);
    }

  };
}

AutocompleteDirective.$inject = ['dropdownTemplateService'];

export default AutocompleteDirective;
