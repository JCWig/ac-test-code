'use strict';
var debounce = require('lodash/function/debounce');
var angular = require('angular');

/* @ngInject */
module.exports = function($timeout, $compile, $document) {
  return {
    restrict: 'A',
    replace: true,
    link: function(scope, element) {
      var newScope = scope.$new();
      var template, parentSelector, triggerElement, windowElement;

      newScope.toggle = function() {
        newScope.opened = !newScope.opened;
        parentSelector.toggleClass('in', newScope.opened);
        triggerElement.toggleClass('opened', newScope.opened);
        if (!newScope.opened) {
          $document.unbind('click', documentClickBind);
        } else {
          $document.bind('click', documentClickBind);
        }
      };
      newScope.triggerParentChange = function(index) {
        newScope.toggle();
        scope.treeview.contextChangeNew(index, true);
      };
      newScope.isOpen = function() {
        return newScope.opened;
      };
      function hasParents() {
        return scope.treeview.parentTree.length > 0;
      }
      function documentClickBind(e) {
        if (newScope.opened && e.currentTarget !== parentSelector[0]) {
          newScope.toggle();
        }
      }
      function setCoords() {
        var triggerElementOffsetLeft = triggerElement[0].offsetLeft;
        var elementOffsetTop = triggerElement[0].offsetTop;
        var triggerElementHeight = triggerElement[0].offsetHeight;
        var arrowHeight = 10;
        var parentSelectorArrowOffset = 21;

        newScope.parentSelectorLeft = triggerElementOffsetLeft - parentSelectorArrowOffset + 'px';
        newScope.parentSelectorTop = elementOffsetTop + arrowHeight + triggerElementHeight + 'px';
        newScope.arrowLeft = parentSelectorArrowOffset + 'px';
        newScope.arrowTop = -arrowHeight + 'px';
      }

      newScope.opened = false;
      template = require('./templates/tree-view-parent-selector.tpl.html');
      parentSelector = $compile(template)(newScope, function(parentSelectorEle) {
        element.after(parentSelectorEle);
      });
      triggerElement = element;
      triggerElement.on('click', function(e) {
        if (hasParents()) {
          e.stopPropagation();
          newScope.toggle();
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