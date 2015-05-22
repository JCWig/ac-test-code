'use strict';
var angular = require('angular');
var tagInputTemplate = require('./templates/tag-input.tpl.html');

/* @ngInject */
module.exports = function($document, $timeout) {
  return {
    restrict: 'E',
    scope: {
      items: '=',
      availableItems:'='
    },
    template: tagInputTemplate, 
    link: function(scope, element) {
      function removeClasses() {
        var stillDropping = element.querySelectorAll('.droppping, .dropping-before, .dropping-after');
        var stillDroppingBefore, stillDroppingAfter;
        angular.forEach(stillDropping, function(ele) {
          angular.element(ele).removeClass('dropping dropping-before dropping-after'); 
        });
      };
      scope.onSelect = function(item) {
        scope.items.push(item);
      };
      scope.onRemove = function(item, model) {
        var index = scope.items.indexOf(item);
        if (index > -1) {
          scope.items.splice(index, 1);
        }
      };
      scope.$on('uiSelectSort:change', function(e, model) {
        scope.items = model.array;
        removeClasses();
      });
    }
  };
};