'use strict';

/* @ngInject */
module.exports = function(autocompleteService) {

  /* @ngInject */
  function AutocompleteItemsController($transclude) {
    var content = autocompleteService.extractContent($transclude);

    this.getContent = function() {
      return content;
    };
  }

  function linkFn($scope, $element, $attrs, ctrls) {
    autocompleteService.addToParent(ctrls, 'AKAM-AUTOCOMPLETE-ITEMS');
  }

  return {
    transclude: true,
    require: ['akamAutocompleteItems', '^akamAutocomplete'],
    controller: AutocompleteItemsController,
    link: linkFn
  };
};
