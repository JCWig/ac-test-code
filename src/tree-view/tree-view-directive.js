'use strict';
var angular = require('angular');
var treeViewTemplate = require('./templates/tree-view.tpl.html');

/* @ngInject */
module.exports = function($q, $compile, $log, $timeout) {
  return {
    restrict: 'E',
    scope: {
      contextData: '=',
      onContextChange: '='
    },
    template: treeViewTemplate,
    link: function(scope) {
      var haveDataFlag;

      scope.loading = true;
      scope.contextData = scope.contextData;
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

        scope.retrievedData = false;
        $timeout(function() {
          if (!scope.retrievedData) {
            scope.loading = true;
          }
        }, 300);
        scope.failed = false;
        $q.when(scope.onContextChange(clickedObj, up)).then(function(children) {
          scope.children = children ? children.children || [] : [];
          scope.loading = false;
          scope.retrievedData = true;
        }).catch(function() {
          scope.failed = true;
        });
      };
      scope.$watch('contextData', function() {
        scope.retrievedData = false;
        $timeout(function() {
          if (!scope.retrievedData) {
            scope.loading = true;
          }
        }, 300);
        scope.failed = false;
        if (scope.contextData) {
          $q.when(scope.contextData).then(function(resp) {
            var data = resp.data ? resp.data : resp;

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
        }
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