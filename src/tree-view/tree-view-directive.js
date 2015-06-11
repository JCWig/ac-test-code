'use strict';
var angular = require('angular');
var treeViewTemplate = require('./templates/tree-view.tpl.html');

/* @ngInject */
module.exports = function($q, $compile, $log, $timeout, $parse) {
  return {
    restrict: 'E',
    scope: {
      items: '=',
      currentProperty: '@',
      parentProperty: '@',
      childrenProperty: '@',
      textProperty: '@',
      onChange: '&'
    },
    template: treeViewTemplate,
    link: function(scope) {
      var haveParentsFlag, currentGetter, childrenGetter, parentGetter,
          rootGetter, inputParents, inputChildren, inputCurrent;
      scope.rootProperty = scope.rootProperty || 'root';
      scope.parentProperty = scope.parentProperty || 'parent';
      scope.currentProperty = scope.currentProperty || 'current';
      scope.childrenProperty = scope.childrenProperty || 'children';
      scope.textProperty = scope.textProperty || 'title';

      currentGetter = $parse(scope.currentProperty);
      childrenGetter = $parse(scope.childrenProperty);
      parentGetter = $parse(scope.parentProperty);
      rootGetter = $parse(scope.rootProperty);

      scope.loading = true;
      scope.items = scope.items;
      scope.parentTree = [];
      scope.children = [];

      scope.contextChangeNew = function(index, up) {
        var spliceIndex = inputParents.length - 1 - index;

        haveParentsFlag = true;
        if (up) {
          inputCurrent = inputParents[spliceIndex];
          scope.current = scope.parentTree[spliceIndex];
          inputParents.splice(spliceIndex, inputParents.length);
          scope.parentTree.splice(spliceIndex, scope.parentTree.length);
          if (scope.parentTree.length === 0) {
            haveParentsFlag = false;
          }
        } else {
          inputParents.push(inputCurrent);
          scope.parentTree.push(scope.current);
          scope.current = scope.children[index];
          inputCurrent = inputChildren[index];
        }
        scope.retrievedData = false;
        $timeout(function() {
          if (!scope.retrievedData) {
            scope.loading = true;
          }
        }, 300);
        scope.failed = false;
        $q.when(scope.onChange({item: inputCurrent})).then(function(resp) {
          var data;

          if (resp) {
            data = resp.data ? resp.data : resp;
            scope.retrieveAndHandleNewChildrenAndParents(data);
          }
        }).catch(function() {
          scope.failed = true;
        });
      };

      scope.$watch('items', function() {
        scope.retrievedData = false;
        $timeout(function() {
          if (!scope.retrievedData) {
            scope.loading = true;
          }
        }, 300);
        scope.failed = false;
        if (scope.items) {
          $q.when(scope.items).then(function(resp) {
            var data = resp.data ? resp.data : resp;

            if (!scope.current) {
              inputCurrent = currentGetter(data);
              scope.current = convertData(inputCurrent, scope, scope.currentProperty, data)[0];
            }
            scope.retrieveAndHandleNewChildrenAndParents(data);
          }).catch(function() {
            scope.failed = true;
          });
        }
      });
      scope.hasParents = function() {
        return !!scope.parentTree.length;
      };
      scope.retrieveAndHandleNewChildrenAndParents = function(data) {
        var value;

        inputChildren = childrenGetter(data);

        if (!haveParentsFlag) {
          inputParents = parentGetter(data);
          maintainParentTree(convertData(inputParents, scope, scope.parentProperty, data));
          if (inputParents && !angular.isArray(inputParents)) {
            value = inputParents;
            inputParents = [value];
          }
          if (scope.parentTree.length === 0) {
            inputParents = [];
            scope.current.root = true;
          }
        }

        if (inputChildren) {
          scope.children = convertData(inputChildren, scope, scope.childrenProperty, data);
        } else {
          scope.children = [];
        }
        scope.loading = false;
        scope.retrievedData = true;
      };
      function convertData(data, scopeParam, prop, convertFrom) {
        var converted, i;

        if (angular.isArray(data)) {
          converted = [];
          for (i = 0; i < data.length; i++) {
            converted.push({
              title: $parse(prop + '[' + i + '].' + scopeParam.textProperty)(convertFrom),
              root:$parse(prop + '[' + i + '].' + scopeParam.rootProperty)(convertFrom)
            });
          }
          return converted;
        } else if (data) {
          return [{title: $parse(prop + '.' + scopeParam.textProperty)(convertFrom), 
            root:$parse(prop + '.' + scopeParam.rootProperty)(convertFrom)}];
        } else {
          return [];
        }
      }
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