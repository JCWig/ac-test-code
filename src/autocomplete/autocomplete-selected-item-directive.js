module.exports = function(autocompleteService, autocompleteConfig) {

  function AutocompleteSelectedItemController($transclude) {
    var content = autocompleteService.extractContent($transclude);

    this.name = autocompleteConfig.SELECTED_ITEM_TEMPLATE_NAME;
    this.getContent = function() {
      return content;
    };
  }
  AutocompleteSelectedItemController.$inject = ['$transclude'];

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

module.exports.$inject = ['autocompleteService', 'autocompleteConfig'];

