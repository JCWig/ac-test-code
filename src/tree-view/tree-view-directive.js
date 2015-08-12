import angular from 'angular';
import template from './templates/tree-view.tpl.html';

class TreeViewController {

  static get $inject() {
    return ['$scope', '$q', '$timeout', '$parse'];
  }

  constructor($scope, $q, $timeout, $parse) {

    this.$timeout = $timeout;
    this.$q = $q;
    this.$parse = $parse;

    this.rootProperty = this.rootProperty || 'root';
    this.parentProperty = this.parentProperty || 'parent';
    this.childrenProperty = this.childrenProperty || 'children';
    this.textProperty = this.textProperty || 'title';
    this.ships = 'ships';

    console.log(this.textProperty);

    this.childrenGetter = this.$parse(this.childrenProperty);
    this.parentGetter = this.$parse(this.parentProperty);

    this.haveParentsFlag = null;
    this.inputCurrent = null;
    this.inputChildren = null;
    this.inputParents = null;
    this.loading = true;
    this.parentTree = [];
    this.children = [];
    this.hasParents = () => !!this.parentTree.length;

    //this.itemChangeFn();

    $scope.$watch('treeview.item', () => this.itemChangeFn());
  }

  contextChangeNew(index, up) {
    let spliceIndex = this.inputParents.length - 1 - index;

    this.haveParentsFlag = true;
    if (up) {
      this.inputCurrent = this.inputParents[spliceIndex];
      this.current = this.parentTree[spliceIndex];
      this.inputParents.splice(spliceIndex, this.inputParents.length);
      this.parentTree.splice(spliceIndex, this.parentTree.length);
      if (this.parentTree.length === 0) {
        this.haveParentsFlag = false;
      }
    } else {
      this.inputParents.push(this.inputCurrent);
      this.parentTree.push(this.current);
      this.current = this.children[index];
      this.inputCurrent = this.inputChildren[index];
    }
    this.retrievedData = false;
    this.$timeout(() => {
      if (!this.retrievedData) {
        this.loading = true;
      }
    }, 300);
    this.failed = false;
    this.$q.when(this.onChange({item: this.inputCurrent})).then(
      (resp) => {
        if (resp) {
          this.retrieveAndHandleNewChildrenAndParents(resp.data ? resp.data : resp);
        }
      }).catch(() => this.failed = true);
  }

  itemChangeFn() {
    this.retrievedData = false;
    this.$timeout(() => {
      if (!this.retrievedData) {
        this.loading = true;
      }
    }, 300);
    this.failed = false;
    if (this.item) {
      this.$q.when(this.item).then((resp) => {
        let data = resp.data ? resp.data : resp;

        if (!this.current) {
          this.inputCurrent = data;
          this.current = {title: this.$parse(this.textProperty)(data)};
        }
        var t = 1;
        this.retrieveAndHandleNewChildrenAndParents(data);
        console.log(this);
      }).catch(() => this.failed = true);
    }
  }

  retrieveAndHandleNewChildrenAndParents(data) {
    var value;

    this.inputChildren = this.childrenGetter(data);

    if (!this.haveParentsFlag) {
      this.inputParents = this.parentGetter(data);
      this.parentTree = this.parentTree.concat(
        this.convertData(this.inputParents, this.parentProperty, data));
      if (this.inputParents && !angular.isArray(this.inputParents)) {
        value = this.inputParents;
        this.inputParents = [value];
      }
      if (this.parentTree.length === 0) {
        this.inputParents = [];
        this.current.root = true;
      }
    }

    if (this.inputChildren) {
      this.children = this.convertData(this.inputChildren, this.childrenProperty, data);
    } else {
      this.children = [];
    }

    this.loading = false;
    this.retrievedData = true;
  }

  convertData(data, prop, convertFrom) {
    let converted = [];

    if (angular.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        converted.push({
          title: this.$parse(prop + '[' + i + '].' + this.textProperty)(convertFrom),
          root: this.$parse(prop + '[' + i + '].' + this.rootProperty)(convertFrom)
        });
      }
      return converted;
    } else if (data) {
      return [{
        title: this.$parse(prop + '.' + this.textProperty)(convertFrom),
        root: this.$parse(prop + '.' + this.rootProperty)(convertFrom)
      }];
    } else {
      return [];
    }
  }

  maintainParentTree(obj) {
    this.parentTree = this.parentTree.concat(obj);
  }

}

export default function() {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      item: '=',
      rootProperty: '@?',
      parentProperty: '@?',
      childrenProperty: '@?',
      textProperty: '@?',
      onChange: '&?'
    },
    controller: TreeViewController,
    controllerAs: 'treeview',
    template: template
  };
}
