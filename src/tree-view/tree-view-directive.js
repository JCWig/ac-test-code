'use strict';
var angular = require('angular');
var treeViewTemplate = require('./templates/tree-view.tpl.html');

/* @ngInject */
module.exports = function($q, $compile, $log, $timeout) {
  return {
    restrict: 'E',
    scope: {
      contextData: '=',
      onContextChange: '=',
      loadingMessage: '@'
    },
    template: treeViewTemplate,
    link: function(scope) {
      var haveDataFlag;

      scope.parentTree = [];
      scope.children = [];
      scope.contextChangeNew = function(clickedObj, up) {
        haveDataFlag = true;
        if (up) {
          maintainParentTree(clickedObj, up);
        } else {
          maintainParentTree(scope.current, up);
        }
        if (scope.parentTree.length === 0) {
          clickedObj.root = true;
        }
        scope.current = clickedObj;
        scope.onContextChange(clickedObj, up);
      };
      scope.$watch('contextData', function() {
        scope.retrievedData = false;
        $timeout(function() {
          if (!scope.retrievedData) {
            scope.loading = true;
          }
        }, 300);
        scope.failed = false;
        $q.when(scope.contextData).then(function(data) {
          if (data.parent && !haveDataFlag) {
            maintainParentTree(data.parent);
          }

          if (!scope.current) {
            scope.current = data.current;
          }

          scope.children = data.children || [];

          scope.loading = false;
          scope.retrievedData = true;
        }).catch(function() {
          scope.failed = true;
        });
      });
      scope.hasParents = function() {
        return !!scope.parentTree.length;
      };
      function maintainParentTree(obj, toRemove) {
        if (toRemove) {
          scope.parentTree.splice(scope.parentTree.indexOf(obj), scope.parentTree.length);
        } else if (angular.isArray(obj)) {
          scope.parentTree = scope.parentTree.concat(obj);
        } else {
          scope.parentTree.push(obj);
        }
      }
    }
  };
};