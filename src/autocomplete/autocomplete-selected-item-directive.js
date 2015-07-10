'use strict';

module.exports = function(autocompleteService) {

  /* @ngInject */
  function AutocompleteSelectedItemController($transclude) {
    var content = autocompleteService.extractContent($transclude);

    this.name = 'AKAM-AUTOCOMPLETE-SELECTED-ITEM';
    this.getContent = function() {
      return content;
    };
  }

  function linkFn($scope, $element, $attrs, ctrls) {
    autocompleteService.addToParent(ctrls);
  }

  return {
    transclude: true,
    require: ['akamAutocompleteSelectedItem', '^akamAutocomplete'],
    controller: AutocompleteSelectedItemController,
    link: linkFn
  };
};

module.exports.$inject = ['autocompleteService'];

