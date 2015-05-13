'use strict';

/* @ngInject */
module.exports = function($q, $compile, $log) {
  return {
    restrict: 'E',
    scope: {
      contextData: '=',
      onContextChange: '='
    },
    template: require('./templates/tree-view.tpl.html'),
    link: function(scope) {
      var haveDataFlag;

      scope.parentTree = [];
      scope.children = [];
      scope.contextChangeNew = function(clickedObj, up) {
        haveDataFlag = true;
        //up if (up === false) going down tree
        //if (up === true) going up tree
        if (up) {
          maintainParentTree(clickedObj, up);
        } else {
          maintainParentTree(scope.current, up);
        }
        if(scope.parentTree.length === 0){
          clickedObj.root = true;
        }
        scope.current = clickedObj;
        scope.onContextChange(clickedObj, up);
      };
      scope.$watch('contextData', function() {

        scope.loading = true;
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
        }).catch(function() {
          scope.failed = true;
          $log.error('failed getting data');
        });
      });
      scope.hasParents = function() {
        return scope.parentTree.length > 0;
      };
      function maintainParentTree(obj, toRemove) {
        if (toRemove) {
          scope.parentTree.splice(scope.parentTree.indexOf(obj), scope.parentTree.length);
        } else {
          scope.parentTree.push(obj);
        }
      }
    }
  };
};