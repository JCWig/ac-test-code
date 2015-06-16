'use strict';
var angular = require('angular');
var treeViewTemplate = require('./templates/tree-view.tpl.html');

/* @ngInject */
module.exports = function($q, $compile, $log, $timeout, $parse) {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      items: '=',
      rootProperty: '@',
      currentProperty: '@',
      parentProperty: '@',
      childrenProperty: '@',
      textProperty: '@',
      onChange: '&'
    },
    controller: TreeviewController,
    controllerAs: 'treeview',
    template: treeViewTemplate
  };
  /* @ngInject */
  function TreeviewController($scope) {
    var haveParentsFlag, currentGetter, childrenGetter, parentGetter,
        inputParents, inputChildren, inputCurrent;

    this.rootProperty = this.rootProperty || 'root';
    this.parentProperty = this.parentProperty || 'parent';
    this.currentProperty = this.currentProperty || 'current';
    this.childrenProperty = this.childrenProperty || 'children';
    this.textProperty = this.textProperty || 'title';

    currentGetter = $parse(this.currentProperty);
    childrenGetter = $parse(this.childrenProperty);
    parentGetter = $parse(this.parentProperty);

    this.loading = true;
    this.items = this.items;
    this.parentTree = [];
    this.children = [];

    this.contextChangeNew = function(index, up) {
      var spliceIndex = inputParents.length - 1 - index;
      var self = this;

      haveParentsFlag = true;
      if (up) {
        inputCurrent = inputParents[spliceIndex];
        this.current = this.parentTree[spliceIndex];
        inputParents.splice(spliceIndex, inputParents.length);
        this.parentTree.splice(spliceIndex, this.parentTree.length);
        if (this.parentTree.length === 0) {
          haveParentsFlag = false;
        }
      } else {
        inputParents.push(inputCurrent);
        this.parentTree.push(this.current);
        this.current = this.children[index];
        inputCurrent = inputChildren[index];
      }
      this.retrievedData = false;
      $timeout(function() {
        if (!self.retrievedData) {
          self.loading = true;
        }
      }, 300);
      this.failed = false;
      $q.when(self.onChange({item: inputCurrent})).then(function(resp) {
        var data;

        if (resp) {
          data = resp.data ? resp.data : resp;
          self.retrieveAndHandleNewChildrenAndParents(data);
        }
      }).catch(function() {
        self.failed = true;
      });
    };
    $scope.$watch('treeview.items', angular.bind(this, itemChangeFn));
    function itemChangeFn() {
      var self = this;

      this.retrievedData = false;
      $timeout(function() {
        if (!self.retrievedData) {
          self.loading = true;
        }
      }, 300);
      this.failed = false;
      if (this.items) {
        $q.when(this.items).then(function(resp) {
          var data = resp.data ? resp.data : resp;

          if (!self.current) {
            inputCurrent = currentGetter(data);
            self.current = self.convertData(inputCurrent, self.currentProperty, data)[0] || {};
          }
          self.retrieveAndHandleNewChildrenAndParents(data);
        }).catch(function() {
          self.failed = true;
        });
      }
    }
    this.hasParents = function() {
      return !!this.parentTree.length;
    };
    this.retrieveAndHandleNewChildrenAndParents = function(data) {
      var value;

      inputChildren = childrenGetter(data);

      if (!haveParentsFlag) {
        inputParents = parentGetter(data);
        this.maintainParentTree(this.convertData(inputParents, this.parentProperty, data));
        if (inputParents && !angular.isArray(inputParents)) {
          value = inputParents;
          inputParents = [value];
        }
        if (this.parentTree.length === 0) {
          inputParents = [];
          this.current.root = true;
        }
      }

      if (inputChildren) {
        this.children = this.convertData(inputChildren, this.childrenProperty, data);
      } else {
        this.children = [];
      }

      this.loading = false;
      this.retrievedData = true;
    };
    this.convertData = function(data, prop, convertFrom) {
      var converted, i;

      if (angular.isArray(data)) {
        converted = [];
        for (i = 0; i < data.length; i++) {
          converted.push({
            title: $parse(prop + '[' + i + '].' + this.textProperty)(convertFrom),
            root: $parse(prop + '[' + i + '].' + this.rootProperty)(convertFrom)
          });
        }
        return converted;
      } else if (data) {
        return [{title: $parse(prop + '.' + this.textProperty)(convertFrom),
          root: $parse(prop + '.' + this.rootProperty)(convertFrom)}];
      } else {
        return [];
      }
    };
    this.maintainParentTree = function(obj, toRemove) {
      if (toRemove) {
        this.parentTree.splice(this.parentTree.indexOf(obj), this.parentTree.length);
      } else if (angular.isArray(obj)) {
        this.parentTree = this.parentTree.concat(obj);
      } else {
        this.parentTree.push(obj);
      }
    };
  }
};