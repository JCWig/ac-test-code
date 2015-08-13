class AutocompleteSelectedItemController {
  constructor(autocompleteService, autocompleteConfig, $transclude) {
    this.autocompleteService = autocompleteService;
    this.autocompleteConfig = autocompleteConfig;
    this.$transclude = $transclude;

    this.name = this.autocompleteConfig.SELECTED_ITEM_TEMPLATE_NAME;
    this.content = this.autocompleteService.extractContent(this.$transclude);
  }

  getContent() {
    return this.content;
  }
}

AutocompleteSelectedItemController.$inject = ['autocompleteService', 'autocompleteConfig',
  '$transclude'];

function linkFn($scope, $element, $attrs, ctrls) {
  let ctrl = ctrls[0],
    parentCtrl = ctrls[1];

  parentCtrl.childControls.push(ctrl);
}

export default () => {
  return {
    transclude: true,
    require: ['akamAutocompleteSelectedItem', '^akamAutocomplete'],
    controller: AutocompleteSelectedItemController,
    link: linkFn
  };
};
