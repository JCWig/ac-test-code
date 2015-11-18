import template from './templates/dropdown-directive.tpl.html';

import DropdownController from './dropdown-controller';

function dropdownDirective(dropdownTemplateService) {

  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {},
    bindToController: {
      items: '=',
      textProperty: '@?',
      keyProperty: '=?',
      placeholder: '@?',
      filterPlaceholder: '@?',
      isDisabled: '=?',
      isReadonly: '=?'
    },
    controller: DropdownController,
    controllerAs: 'dropdown',

    template: function(tElem) {
      return dropdownTemplateService.transformTemplate(tElem, template, 'akam-dropdown-selected',
        'akam-dropdown-option');
    },

    link: function(scope, elem, attrs, ngModel) {
      scope.dropdown.initialize(elem, attrs, ngModel);
    }

  };
}

dropdownDirective.$inject = ['dropdownTemplateService'];

export default dropdownDirective;
