var debounce = require('lodash/function/debounce');
var angular = require('angular');

module.exports = function($timeout, $compile, $document) {
  return {
    restrict: 'A',
    replace: true,
    scope: {},
    require: '^akamTreeView',
    link: function(scope, element, attrs, ctrl) {
      var template, parentSelector, triggerElement, windowElement;

      scope.treeview = ctrl;
      scope.toggle = function() {
        scope.opened = !scope.opened;
        parentSelector.toggleClass('in', scope.opened);
        triggerElement.toggleClass('opened', scope.opened);
        if (!scope.opened) {
          $document.unbind('click', documentClickBind);
        } else {
          $document.bind('click', documentClickBind);
        }
      };
      scope.triggerParentChange = function(index) {
        scope.toggle();
        scope.treeview.contextChangeNew(index, true);
      };
      scope.isOpen = function() {
        return scope.opened;
      };
      function hasParents() {
        return scope.treeview.parentTree.length > 0;
      }

      function documentClickBind(e) {
        if (scope.opened && e.currentTarget !== parentSelector[0]) {
          scope.toggle();
        }
      }

      function setCoords() {
        var triggerElementOffsetLeft = triggerElement[0].offsetLeft;
        var elementOffsetTop = triggerElement[0].offsetTop;
        var triggerElementHeight = triggerElement[0].offsetHeight;
        var arrowHeight = 10;
        var parentSelectorArrowOffset = 21;

        scope.parentSelectorLeft = triggerElementOffsetLeft - parentSelectorArrowOffset + 'px';
        scope.parentSelectorTop = elementOffsetTop + arrowHeight + triggerElementHeight + 'px';
        scope.arrowLeft = parentSelectorArrowOffset + 'px';
        scope.arrowTop = -arrowHeight + 'px';
      }

      scope.opened = false;
      template = require('./templates/tree-view-parent-selector.tpl.html');
      parentSelector = $compile(template)(scope, function(parentSelectorEle) {
        element.after(parentSelectorEle);
      });
      triggerElement = element;
      triggerElement.on('click', function(e) {
        if (hasParents()) {
          e.stopPropagation();
          scope.toggle();
          parentSelector.on('click', function(ev) {
            ev.stopPropagation();
          });
        }
      });
      windowElement = angular.element(window);
      windowElement.on('resize', debounce(setCoords, 200));
      element.on('$destroy', function() {
        windowElement.off('resize');
      });
      $timeout(function() {
        setCoords();
      }, 0);
    }
  };
};
module.exports.$inject = ['$timeout', '$compile', '$document'];