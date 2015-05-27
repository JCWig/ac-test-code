'use strict';
var angular = require('angular');
var tagInputTemplate = require('./templates/tag-input.tpl.html');

/* @ngInject */
module.exports = function(translate) {
  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {
      items: '=ngModel',
      availableItems: '=',
      taggingLabel: '@',
      sortFunction: '=',
      dragDropable: '@',
      placeholder: '@',
      restricted: '@'
    },
    template: tagInputTemplate,
    link: function(scope, element, attrs, ngModel) {
      scope.data = { items: scope.items };
      if (!scope.taggingLabel) {
        translate.async('components.tag-input.taggingLabel').then(function(value) {
          scope.taggingLabel = value;
        });
      }
      if (!scope.placeholder) {
        translate.async('components.tag-input.placeholder').then(function(value) {
          scope.placeholder = value;
        });
      }
      ngModel.$isEmpty = function(value) {
        return value.length === 0;
      };
      function sortItems(scopeVar, items) {
        if (typeof scopeVar.sortFunction === 'function') {
          return scopeVar.sortFunction(items);
        } else {
          return items;
        }
      }
      function removeClasses() {
        var stillDropping =
          element.querySelectorAll('.droppping, .dropping-before, .dropping-after');

        angular.forEach(stillDropping, function(ele) {
          angular.element(ele).removeClass('dropping dropping-before dropping-after');
        });
      }
      scope.setValues = function(newItems) {
        scope.items = newItems;
        ngModel.$setViewValue(newItems);
        ngModel.$setTouched();
      };
      scope.onSelect = function(item) {
        var index = scope.availableItems.indexOf(item);

        if (scope.restricted && scope.restricted === 'true' && scope.availableItems && index < 0) {
          scope.items.splice(index, 1);
          scope.data.items = scope.items;
        }
      };
      scope.$watch('data.items', function(newItems) {
        var sortedItems = sortItems(scope, newItems);

        scope.setValues(sortedItems);
      });
      scope.$on('uiSelectSort:change', function(e, model) {
        removeClasses();
        scope.setValues(model.array);
      });
    }
  };
};