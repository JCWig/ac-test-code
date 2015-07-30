var angular = require('angular');

module.exports = function() {

  return {
    getSelected: function(selectedTemplate) {
      var selectedElem = angular.element(require('./templates/dropdown-selected.tpl.html'));

      if (typeof selectedTemplate !== 'undefined') {
        selectedElem[0] = angular.element(selectedTemplate)[0];
      }
      return selectedElem;
    },

    getMenu: function(optionTemplate) {
      var menuElem = angular.element(require('./templates/dropdown-menu.tpl.html'));

      if (typeof optionTemplate !== 'undefined') {
        angular.element(menuElem[0].querySelector('a')).html(optionTemplate);
      }
      return menuElem;
    }
  };
};
