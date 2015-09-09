import template from './templates/ac-directive.tpl.html';
import selectedElemTemplate from './templates/ac-selected.tpl.html';
import menuElemTemplate from './templates/ac-menu.tpl.html';

import DropdownController from '../dropdown/dropdown-controller';

class AcController extends DropdownController {

  static get $inject() {
    return ['$scope', '$parse', '$translate', 'dropdownTemplateService', 'appendToBodyService',
      '$compile'];
  }

  constructor($scope, $parse, $translate, dropdownTemplateService, appendToBodyService, $compile) {
    super($scope, $parse, $translate, dropdownTemplateService, appendToBodyService, $compile);

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
  }
}

function acDirective(dropdownTemplateService) {

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
    controller: AcController,
    controllerAs: 'ac',

    template: function(tElem) {
      let dropdownTemplate =
        dropdownTemplateService.stashTemplate(tElem, template, 'akam-dropdown-selected');

      return dropdownTemplateService.stashTemplate(tElem, dropdownTemplate, 'akam-dropdown-option');
    },

    link: function(scope, elem, attrs, ngModel) {
      scope.ac.initialize(elem, attrs, ngModel);
    }

  };
}

acDirective.$inject = ['dropdownTemplateService'];

export default acDirective;
