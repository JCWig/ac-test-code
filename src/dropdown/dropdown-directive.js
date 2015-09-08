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
      onChange: '&?',
      placeholder: '@?',
      filterPlaceholder: '@?',
      isDisabled: '=?'
    },
    controller: DropdownController,
    controllerAs: 'dropdown',

    template: function(tElem) {
      let dropdownTemplate =
        dropdownTemplateService.stashTemplate(tElem, template, 'akam-dropdown-selected');

      return dropdownTemplateService.stashTemplate(tElem, dropdownTemplate, 'akam-dropdown-option');
    },

    link: function(scope, elem, attrs, ngModel) {
      scope.dropdown.initialize(elem, attrs, ngModel);
    }

  };
}

dropdownDirective.$inject = ['dropdownTemplateService'];

export default dropdownDirective;
