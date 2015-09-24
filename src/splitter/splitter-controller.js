import angular from 'angular';

function setPaneVisibility(shouldCollapse) {
  switch (this.direction) {
    case 'left':
      shouldCollapse ? this.panes[0].hide() : this.panes[0].show();
      break;
    case 'right':
      shouldCollapse ? this.panes[1].hide() : this.panes[1].show();
      break;
    case 'top':
      shouldCollapse ? this.panes[0].hide() : this.panes[0].show();
      break;
    case 'bottom':
      shouldCollapse ? this.panes[1].hide() : this.panes[1].show();
      break;
  }
}

class SplitterController{

  static get $inject() {
    return ['$scope', '$timeout'];
  }

  constructor($scope, $timeout) {

    this.panes = [];
    this.scope = $scope;
    this.timeout = $timeout;

    angular.isUndefined(this.collapsed) && (this.collapsed = false);
    this.collapsed = !!this.collapsed;

    angular.isUndefined(this.freezeDivider) && (this.freezeDivider = false);
    this.freezeDivider = !!this.freezeDivider;

    angular.isUndefined(this.freezeCollapse) && (this.freezeCollapse = false);
    this.freezeCollapse = !!this.freezeCollapse;

    ['horizontal', 'vertical'].indexOf(this.type) < 0 && (this.type = 'vertical');

    if (this.type === 'vertical') {
      ['left', 'right'].indexOf(this.direction) < 0 && (this.direction = 'left');
    }else {
      ['top', 'bottom'].indexOf(this.direction) < 0 && (this.direction = 'bottom');
    }
  }

  initialize($element, $attrs, $resizer) {
    let self = this,
      firstPaneSizeInPx,
      panesInSize,
      isDrag = false,
      isMouseDown = false;

    setPaneVisibility.call(this, this.collapsed);

    this.scope.$watch(() => {
      return self.collapsed;
    }, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        setPaneVisibility.call(self, newValue);
      }
    });

    if (this.panes.length === 2) {
      $element.bind('mousemove', (eventObj) => {
        let elemBounds = $element[0].getBoundingClientRect(),
          dimension,
          offset,
          pos = 0;

        if (isMouseDown && !isDrag) {
          // TODO: sensitivity has been set as 3 for now.. make it configurable in the future
          if (Math.abs((
              self.type === 'vertical' ?
                eventObj.clientX - elemBounds.left : eventObj.clientY - elemBounds.top)
                  - firstPaneSizeInPx) > 3) {
            isDrag = self.isDrag = true;
          }
        }
        if (!isDrag) {
          return;
        }

        if (self.type === 'vertical') {
          dimension = elemBounds.right - elemBounds.left;
          pos = eventObj.clientX - elemBounds.left;
        } else {
          dimension = elemBounds.bottom - elemBounds.top;
          pos = eventObj.clientY - elemBounds.top;
        }

        if (pos <= 0 || dimension - pos <= 0) {
          return;
        }

        offset = panesInSize[0] - panesInSize[0] * pos / firstPaneSizeInPx;
        self.panes[0].setSize(panesInSize[0] - offset);
        self.panes[1].setSize(panesInSize[1] + offset);
        self.scope.$apply();
      });

      $resizer.bind('mousedown', (eventObj) => {
        eventObj.preventDefault();
        panesInSize = [self.panes[0].getSize(), self.panes[1].getSize()];
        firstPaneSizeInPx = self.type === 'vertical' ?
          $resizer[0].getBoundingClientRect().left
            - $element[0].getBoundingClientRect().left
              : $resizer[0].getBoundingClientRect().top
                - $element[0].getBoundingClientRect().top;
        isMouseDown = true;
      });

      angular.element(document).bind('mouseup', function() {
        isDrag = isMouseDown = false;
        // isDrag is set to false in timeout so that on end of explicit drag action
        // splitter doesn't collapse.
        self.timeout(() => self.isDrag = false, 0);
      });
    }
  }

  collapse() {
    !this.freezeCollapse && (this.collapsed = true);
  }

  expand() {
    !this.freezeCollapse && (this.collapsed = false);
  }

  toggle() {
    // on end of explicit drag action, splitter shouldn't toggle..
    if (!this.isDrag) {
      this.collapsed ? this.expand() : this.collapse();
    }
  }

  registerPane(pane) {
    this.panes.length < 2 && this.panes.push(pane);
  }
}

export default SplitterController;
