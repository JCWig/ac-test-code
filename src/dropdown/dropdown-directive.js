'use strict';

/* @ngInject */
module.exports = function($log, $compile, dropdownTransformer) {

  var dropdownTemplate = require('./templates/dropdown-directive.tpl.html');

  function getCustomMarkup(tElem, tagName) {
    if (tElem.find(tagName).length) {
      return tElem.find(tagName).remove().html();
    }
  }

  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {
      selectedOption: '=ngModel',
      options: '=',
      optionProperty: '@?',
      onChange: '&?'
    },

    compile: function(tElem) {
      var selectedTemplate = getCustomMarkup(tElem, 'akam-dropdown-selected');
      var optionTemplate = getCustomMarkup(tElem, 'akam-dropdown-option');

      tElem.append(dropdownTemplate);

      return function(scope, elem) {
        var selectedScope, selectedContentTemplate, selectedElem,
          menuScope, menuTemplate, menuElem;

        scope.setSelectedOption = function(option) {
          scope.selectedOption = option;
        };

        scope.clearSelectedOption = function($event) {
          $event.stopPropagation();
          scope.selectedOption = undefined;
        };

        scope.$watch('selectedOption', function(selectedOption) {
          if (typeof selectedScope !== 'undefined') {
            selectedScope.selectedOption = selectedOption;
          }

          if (typeof scope.onChange === 'function') {
            scope.onChange();
          }
        });

        selectedContentTemplate = dropdownTransformer.getSelected(scope, selectedTemplate);
        if (typeof selectedTemplate !== 'undefined') {
          selectedScope = scope.$parent.$new();
          selectedScope.selectedOption = scope.selectedOption;
          selectedScope.optionProperty = scope.optionProperty;
          selectedScope.clearSelectedOption = scope.clearSelectedOption;

          selectedElem = $compile(selectedContentTemplate)(selectedScope);
        } else {
          selectedElem = $compile(selectedContentTemplate)(scope);
        }
        elem.children(0).children(0).append(selectedElem);

        menuTemplate = dropdownTransformer.getMenu(scope, optionTemplate);
        if (typeof optionTemplate !== 'undefined') {
          menuScope = scope.$parent.$new();
          menuScope.options = scope.options;
          menuElem = $compile(menuTemplate)(menuScope);
        } else {
          menuElem = $compile(menuTemplate)(scope);
        }
        elem.children(0).append(menuElem);
      };
    }
  };
};