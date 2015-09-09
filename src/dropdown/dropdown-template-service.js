import angular from 'angular';
import DropdownSelectedTemplate from './dropdown-custom-templates/dropdown-selected-template';
import DropdownMenuTemplate from './dropdown-custom-templates/dropdown-menu-template';

function DropdownTemplateService() {

  return {
    stashTemplate: function(tElem, dropdownTemplate, tagName) {
      let dropdownTemplateElem = angular.element(dropdownTemplate);

      if (tElem.find(tagName).length) {
        dropdownTemplateElem.find(tagName + '-placeholder').html(tElem.find(tagName).html());
      }
      return dropdownTemplateElem[0].outerHTML;
    },
    DropdownSelectedTemplate: DropdownSelectedTemplate,
    DropdownMenuTemplate: DropdownMenuTemplate
  };
}

export default DropdownTemplateService;