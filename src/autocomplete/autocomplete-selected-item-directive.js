'use strict';

/* @ngInject */
module.exports = function(autocompleteService) {

  /* @ngInject */
  function AutocompleteSelectedItemController($transclude) {
    var content = autocompleteService.extractContent($transclude);

    this.getContent = function() {
      return content;
    };
  }

  function linkFn($scope, $element, $attrs, ctrls) {
    autocompleteService.addToParent(ctrls, 'AKAM-AUTOCOMPLETE-SELECTED-ITEM');
  }

  return {
    transclude: true,
    require: ['akamAutocompleteSelectedItem', '^akamAutocomplete'],
    controller: AutocompleteSelectedItemController,
    link: linkFn
  };
};
