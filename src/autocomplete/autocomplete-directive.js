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

    this.minimumSearch = this.minimumSearch || 1;
  }

  initialize(elem, attrs, ngModel) {
    super.initialize(elem, attrs, ngModel);
    this.dropdownElem = elem.children(0);
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
    if (this.minimumSearch &&
      (this.searchTerm.length < this.minimumSearch || !this.searchTerm.length)) {
      this.dropdownElem.removeClass('open');
      return;
    }

    let searchResult = this.onSearch({searchTerm: this.searchTerm});

    if (angular.isArray(searchResult)) {
      this.items = searchResult;
      this.setDropdownOpen();
    } else if (angular.isFunction(searchResult.then)) {
      searchResult.then((resultItems) => {
        this.items = resultItems;
        this.setDropdownOpen();
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
    this.dropdownElem.removeClass('open');
    this.isOpen = false;
  }

  setDropdownOpen() {
    this.dropdownElem.addClass('open');
    this.isOpen = true;
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
      onSearch: '&',
      minimumSearch: '@'
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
