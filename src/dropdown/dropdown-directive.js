'use strict';

/* @ngInject */
module.exports = function($log, $compile, dropdownTransformer) {

  var dropdownTemplate = require('./templates/dropdown-directive.tpl.html');
  var optionTemplate, selectedTemplate;

  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {
      selectedOption: '=ngModel',
      options: "=",
      optionProperty: "@?"
    },
    template: function (elem) {
      optionTemplate = elem.find('akam-dropdown-option').html();
      selectedTemplate = elem.find('akam-dropdown-selected').html();
      return dropdownTemplate;
    },

    link: function (scope, elem, attrs) {
      scope.setSelectedOption = function (option) {
        scope.selectedOption = option;
      };

      scope.clearSelectedOption = function($event) {
        $event.stopPropagation();
        scope.selectedOption = undefined;
      };
      var dropdownMenuElem = dropdownTransformer.getDropdownMenu(scope, optionTemplate);
      elem.children(0).append(dropdownMenuElem);
    }

  };
};