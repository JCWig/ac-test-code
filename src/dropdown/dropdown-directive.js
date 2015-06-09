'use strict';

var angular = require('angular');

require('angular-sanitize');

/* @ngInject */
module.exports = function($compile, dropdownTransformer) {

  function updateTemplate(tElem, dropdownTemplate, tagName) {
    var customTemplate, dropdownTemplateElem = angular.element(dropdownTemplate);

    if (tElem.find(tagName).length) {
      customTemplate = tElem.find(tagName);
      dropdownTemplateElem.find(tagName + '-placeholder').html(customTemplate.html());
    }
    return dropdownTemplateElem[0].outerHTML;
  }

  function getCustomMarkup(tElem, tagName) {
    return tElem.find(tagName).remove().html() || undefined;
  }

  return {
    restrict: 'E',
    require: '^ngModel',
    scope: {
      items: '=',
      textProperty: '@?',
      onChange: '&?'
    },

    template: function(tElem) {
      var dropdownTemplate = require('./templates/dropdown-directive.tpl.html');

      dropdownTemplate = updateTemplate(tElem, dropdownTemplate, 'akam-dropdown-selected');
      dropdownTemplate = updateTemplate(tElem, dropdownTemplate, 'akam-dropdown-option');

      return dropdownTemplate;
    },

    link: function(scope, elem, attrs, ngModel) {
      var selectedScope, selectedContentTemplate, selectedElem,
        menuScope, menuTemplate, menuElem, selectedTemplate, optionTemplate;

      selectedTemplate = getCustomMarkup(elem, 'akam-dropdown-selected-placeholder');
      optionTemplate = getCustomMarkup(elem, 'akam-dropdown-option-placeholder');

      scope.hasFilter = typeof attrs.filterable !== 'undefined';
      scope.filterProperty = attrs.filterable;
      scope.dropdownFilter = undefined;

      scope.isOpen = false;

      scope.setSelectedItem = function(item) {
        ngModel.$setViewValue(item);
      };

      scope.clearSelectedItem = function($event) {
        $event.stopPropagation();
        ngModel.$setViewValue();
      };

      scope.$watch(function() {
        return ngModel.$viewValue;
      }, function(modelValue) {
        scope.selectedItem = modelValue;
        if (typeof selectedScope !== 'undefined') {
          selectedScope.selectedItem = modelValue;
        }
        scope.isOpen = false;
        if (typeof scope.onChange === 'function') {
          scope.onChange();
        }
      });

      selectedContentTemplate = dropdownTransformer.getSelected(selectedTemplate);
      if (typeof selectedTemplate !== 'undefined') {
        selectedScope = scope.$parent.$new();
        selectedScope.selectedItem = scope.selectedItem;
        selectedScope.textProperty = scope.textProperty;
        selectedScope.clearSelectedItem = scope.clearSelectedItem;

        selectedElem = $compile(selectedContentTemplate)(selectedScope);
      } else {
        selectedElem = $compile(selectedContentTemplate)(scope);
      }
      elem.children(0).children(0).append(selectedElem);

      menuTemplate = dropdownTransformer.getMenu(optionTemplate);
      if (typeof optionTemplate !== 'undefined') {
        menuScope = scope.$parent.$new();
        menuScope.items = scope.items;
        menuScope.textProperty = scope.textProperty;
        menuScope.setSelectedItem = scope.setSelectedItem;
        menuScope.hasFilter = scope.hasFilter;
        menuScope.filterProperty = scope.filterProperty;

        menuElem = $compile(menuTemplate)(menuScope);
      } else {
        menuElem = $compile(menuTemplate)(scope);
      }
      elem.children(0).append(menuElem);

    }
  };
};