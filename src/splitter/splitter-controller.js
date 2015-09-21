import angular from 'angular';

function setPaneVisibility(shouldCollapse) {
  switch (this.direction) {
    case "left":
      shouldCollapse ? this._panes[0].hide() : this._panes[0].show();
      break;
    case "right":
      shouldCollapse ? this._panes[1].hide() : this._panes[1].show();
      break;
    case "top":
      shouldCollapse ? this._panes[0].hide() : this._panes[0].show();
      break;
    case "bottom":
      shouldCollapse ? this._panes[1].hide() : this._panes[1].show();
      break;
    }
}

class SplitterController{

  static get $inject() {
    return ['$scope', '$timeout'];
  }

  constructor($scope, $timeout) {

    this._panes = [];
    this._scope = $scope;
    this._timeout = $timeout;

    angular.isUndefined(this.collapsed) && (this.collapsed = false);
    this.collapsed = !!this.collapsed ? true : false;

    angular.isUndefined(this.freezeDivider) && (this.freezeDivider = false);
    this.freezeDivider = !!this.freezeDivider ? true : false;

    angular.isUndefined(this.freezeCollapse) && (this.freezeCollapse = false);
    this.freezeCollapse = !!this.freezeCollapse ? true : false;

    ["horizontal", "vertical"].indexOf(this.type) < 0 && (this.type = "vertical");

    if (this.type == "vertical"){
      ["left", "right"].indexOf(this.direction) < 0 && (this.direction = "left");
    }else{
      ["top", "bottom"].indexOf(this.direction) < 0 && (this.direction = "bottom");
    }
  }

  initialize($element, $attrs) {
    let self = this;

    setPaneVisibility.call(this, this.collapsed);

    this._scope.$watch(() => {
      return self.collapsed;
    }, (newValue, oldValue) => {
      if (newValue != oldValue){
        setPaneVisibility.call(self, newValue);
        /*this._timeout(() => {
          $($window).trigger("resize");
      }, 0);*/
      }
    });
  }

  collapse() {
    !this.freezeCollapse && (this.collapsed = true);
  }

  expand() {
    !this.freezeCollapse && (this.collapsed = false);
  }

  toggle() {
      this.collapsed ? this.expand() : this.collapse();
  }

  registerPane(pane) {
      this._panes.length < 2 && this._panes.push(pane);
  }
}

export default SplitterController;
