'use strict';
var angular = require('angular');

/* @ngInject */
module.exports = function($q, $compile, $log, $timeout) {
  return {
    restrict: 'E',
    scope: {
      contextData: '=',
      onContextChange: '=',
      loadingMessage: '@'
    },
    template: require('./templates/tree-view.tpl.html'),
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

          if (data.children) {
            scope.children = data.children;
          } else {
            scope.children = [];
          }
          scope.loading = false;
          scope.retrievedData = true;
        }).catch(function() {
          scope.failed = true;
        });
      });
      scope.hasParents = function() {
        return scope.parentTree.length > 0;
      };
      function maintainParentTree(obj, toRemove) {
        if (toRemove) {
          scope.parentTree.splice(scope.parentTree.indexOf(obj), scope.parentTree.length);
        } else if (angular.isArray(obj)) {
          angular.forEach(obj, function(val) {
            scope.parentTree.push(val);
          });
        } else {
          scope.parentTree.push(obj);
        }
      }
    }
  };
};