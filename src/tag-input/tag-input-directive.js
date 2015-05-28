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
      restricted: '@',
      validateFunction: '='
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
      function removeClasses() {
        var stillDropping =
          element.querySelectorAll('.droppping, .dropping-before, .dropping-after');

        angular.forEach(stillDropping, function(ele) {
          angular.element(ele).removeClass('dropping dropping-before dropping-after');
        });
      }
      ngModel.$isEmpty = function(value) {
        return value.length === 0;
      };
      ngModel.$validators.validInputs = function(modelValue, viewValue) {
        var flag = true;

        angular.forEach(viewValue, function(value) {
          if (!scope.validate(value)) {
            flag = false;
          }
        });
        return flag;
      };
      scope.sortItems = function(items) {
        if (typeof scope.sortFunction === 'function') {
          return scope.sortFunction(items);
        } else {
          return items;
        }
      };
      scope.validate = function(item) {
        if (typeof scope.validateFunction === 'function') {
          return scope.validateFunction(item);
        }
        return true;
      };
      scope.removeItem = function(item) {
        var index = scope.data.items.indexOf(item);

        if (index > -1) {
          scope.items.splice(index, 1);
          scope.data.items = scope.items;
        }
      };
      scope.setValues = function(newItems) {
        scope.items = newItems;
        ngModel.$setViewValue(newItems);
        ngModel.$setTouched();
      };
      scope.onSelect = function(item) {
        var index = scope.availableItems.indexOf(item);

        if (!item) {
          scope.removeItem(item);
        } else if (scope.restricted && scope.restricted === 'true' &&
                    scope.availableItems && index < 0) {
          scope.removeItem(item);
        }
        ngModel.$validate();
      };
      scope.$watch('data.items', function(newItems) {
        var sortedItems = scope.sortItems(newItems);

        scope.setValues(sortedItems);
      });
      scope.$on('uiSelectSort:change', function(e, model) {
        removeClasses();
        scope.setValues(model.array);
      });
    }
  };
};