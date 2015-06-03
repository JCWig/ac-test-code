'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($compile) {

  return {

    getSelected: function(scope, selectedTemplate) {
      var selectedElem = angular.element(require('./templates/dropdown-selected.tpl.html'));

      if (typeof selectedTemplate !== 'undefined') {
        selectedElem[0] = angular.element(selectedTemplate)[0];
      }
      return selectedElem;
    },

    getMenu: function(scope, optionTemplate) {
      var menuElem = angular.element(require('./templates/dropdown-menu.tpl.html'));

      if (typeof optionTemplate !== 'undefined') {
        menuElem.children(0).children(0).html(optionTemplate);
      }
      return $compile(menuElem)(scope);
    }
  };
};
