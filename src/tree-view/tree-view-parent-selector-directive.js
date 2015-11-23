import debounce from 'lodash/function/debounce';
import template from './templates/tree-view-parent-selector.tpl.html';
import angular from 'angular';

class TreeViewParentSelectorController {

  static get $inject() {
    return ['$document'];
  }

  constructor($document) {
    this.$document = $document;

    this.opened = false;
    this.treeViewCtrl = null;
    this.parentSelector = null;
    this.triggerElement = null;
  }

  toggle() {
    this.opened = !this.opened;
    this.parentSelector.toggleClass('in', this.opened);
    this.triggerElement.toggleClass('opened', this.opened);

    let documentClickBind = (e) => {
      if (this.opened && e.currentTarget !== this.parentSelector[0]) {
        this.toggle();
      }
    };

    if (!this.opened) {
      this.$document.unbind('click', documentClickBind);
    } else {
      this.$document.bind('click', documentClickBind);
    }
  }

  triggerParentChange(index) {
    this.toggle();
    this.treeViewCtrl.contextChangeNew(index, true);
  }

  setCoords() {
    var triggerElementOffsetLeft = this.triggerElement[0].offsetLeft;
    var elementOffsetTop = this.triggerElement[0].offsetTop;
    var triggerElementHeight = this.triggerElement[0].offsetHeight;
    var arrowHeight = 11;
    var parentSelectorArrowOffset = 21;
    var arrowOffset = 28;

    this.parentSelectorLeft = triggerElementOffsetLeft - parentSelectorArrowOffset + 'px';
    this.parentSelectorTop = elementOffsetTop + arrowHeight + triggerElementHeight + 'px';
    this.arrowLeft = arrowOffset + 'px';
    this.arrowTop = -arrowHeight + 'px';
  }
}

function treeViewParentSelector($timeout, $compile, $window) {
  return {
    restrict: 'A',
    replace: true,
    scope: {},
    require: '^akamTreeView',
    bindToController: {},
    controller: TreeViewParentSelectorController,
    controllerAs: 'treeViewParentSelector',
    link: function(scope, element, attrs, treeViewCtrl) {

      let ctrl = scope.treeViewParentSelector;

      ctrl.treeViewCtrl = treeViewCtrl;

      ctrl.parentSelector = $compile(template)(
        scope, parentSelectorEle => element.after(parentSelectorEle)
      );

      ctrl.triggerElement = element;

      ctrl.triggerElement.on('click', function(e) {
        if (treeViewCtrl.parentTree.length > 0) {
          e.stopPropagation();
          ctrl.toggle();
          ctrl.parentSelector.on('click', (ev) => ev.stopPropagation());
        }
      });

      let setCoords = debounce(angular.bind(ctrl, ctrl.setCoords));

      $window.addEventListener('resize', setCoords);
      scope.$on('$destroy', () => $window.removeEventListener('resize', setCoords));

      $timeout(() => ctrl.setCoords(), 0);
    }
  };
}
treeViewParentSelector.$inject = ['$timeout', '$compile', '$window'];

export default treeViewParentSelector;