'use strict';

/* @ngInject */
module.exports = function(autocompleteService) {

  /* @ngInject */
  function AutocompleteItemsController($transclude) {
    var content = autocompleteService.extractContent($transclude);

    this.name = 'AKAM-AUTOCOMPLETE-ITEMS';
    this.getContent = function() {
      return content;
    };
  }

  function linkFn($scope, $element, $attrs, ctrls) {
    autocompleteService.addToParent(ctrls);
  }

  return {
    transclude: true,
    require: ['akamAutocompleteItems', '^akamAutocomplete'],
    controller: AutocompleteItemsController,
    link: linkFn
  };
};

module.exports.$inject = ['autocompleteService'];
