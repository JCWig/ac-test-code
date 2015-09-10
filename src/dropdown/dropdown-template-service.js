import angular from 'angular';
import DropdownSelectedRenderer from './dropdown-renderers/dropdown-selected-renderer';
import DropdownMenuRenderer from './dropdown-renderers/dropdown-menu-renderer';

function DropdownTemplateService() {

  return {
    stashTemplate: function(tElem, dropdownTemplate, tagName) {
      let dropdownTemplateElem = angular.element(dropdownTemplate);

      if (tElem.find(tagName).length) {
        dropdownTemplateElem.find(tagName + '-placeholder').html(tElem.find(tagName).html());
      }
      return dropdownTemplateElem[0].outerHTML;
    },
    DropdownSelectedRenderer: DropdownSelectedRenderer,
    DropdownMenuRenderer: DropdownMenuRenderer
  };
}

export default DropdownTemplateService;