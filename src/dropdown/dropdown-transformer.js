'use strict';

//var angular = require('angular');

/* @ngInject */
module.exports = function($compile, $log) {

  return {

    getDropdownMenu: function(scope, optionTemplate) {
      var dropdownMenuScope;
      var dropdownMenuElem = angular.element(require('./templates/dropdown-menu.tpl.html'));

      if (typeof optionTemplate !== 'undefined') {
        dropdownMenuElem.children(0).html(optionTemplate);
        dropdownMenuScope = scope.$parent.$new();
        dropdownMenuScope.options = scope.options;
        return $compile(dropdownMenuElem)(dropdownMenuScope);
      }

      return $compile(dropdownMenuElem)(scope);
    }
  };
};
