'use strict';
var angular = require('angular');
var tagInputTemplate = require('./templates/tag-input.tpl.html');

/* @ngInject */
module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      items: '=',
      availableItems:'='
    },
    template: tagInputTemplate, 
    link: function(scope, element){
      scope.selectedItems = scope.items || [];
      scope.onSelect = function(item, model){
        console.log(item);
        console.log(model);
      };
      scope.onRemove = function(item, model){
        console.log(item);
        console.log(model);
      }
    }
  };
};