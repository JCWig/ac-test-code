import angular from 'angular';
import selectedElemTemplate from './templates/dropdown-selected.tpl.html';
import menuElemTemplate from './templates/dropdown-menu.tpl.html';

export default function() {

  return {
    getSelected: function(selectedTemplate) {
      let selectedElem = angular.element(selectedElemTemplate);

      if (angular.isDefined(selectedTemplate)) {
        selectedElem[0] = angular.element(selectedTemplate)[0];
      }
      return selectedElem;
    },

    getMenu: function(optionTemplate) {
      let menuElem = angular.element(menuElemTemplate);

      if (angular.isDefined(optionTemplate)) {
        angular.element(menuElem[0].querySelector('a')).html(optionTemplate);
      }
      return menuElem;
    }
  };
}
