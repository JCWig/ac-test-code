'use strict';
var debounce = require('lodash/function/debounce');
var foreach = require('lodash/collection/foreach');
var angular = require('angular');

/* @ngInject */
module.exports = function($timeout, $compile, $document) {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      parentTree: '=',
      changeParent: '='
    },
    link: function(scope, element) {
      var template, toolTip, triggerElement;
      scope.toggle = function() {
        scope.opened = !scope.opened;
        toolTip.toggleClass('in', scope.opened);
        if (!scope.opened) {
          triggerElement.removeClass('opened');
          $document.unbind('click', documentClickBind);
        } else {
          triggerElement.addClass('opened');
          $document.bind('click', documentClickBind);
        }
      };
      scope.triggerParentChange = function(parent) {
        scope.toggle();
        scope.changeParent(parent, true);
      };
      scope.isOpen = function() {
        return scope.opened;
      };
      function hasParents() {
        return scope.parentTree.length > 0;
      }
      function documentClickBind(e) {
        if (scope.opened && e.currentTarget !== toolTip[0]) {
          scope.toggle();
        }
      }
      function setCoords() {
        var triggerElementOffsetLeft = triggerElement[0].offsetLeft;
        var elementOffsetTop = triggerElement[0].offsetTop;
        var triggerElementHeight = triggerElement[0].offsetHeight;
        var arrowHeight = 10;
        var toolTipArrowOffset = 21;

        scope.toolTipLeft = triggerElementOffsetLeft - toolTipArrowOffset;
        scope.toolTipTop = elementOffsetTop + arrowHeight + triggerElementHeight;
        scope.arrowLeft = toolTipArrowOffset;
        scope.arrowTop = -arrowHeight;

        scope.toolTipTop = scope.toolTipTop + 'px';
        scope.toolTipLeft = scope.toolTipLeft + 'px';
        scope.arrowTop = scope.arrowTop + 'px';
        scope.arrowLeft = scope.arrowLeft + 'px';
      }
      scope.$watch('parentTree', function(newTree){
        console.log(newTree);
        newTree.reverse();
        scope.parentTree = newTree;
      });
      scope.opened = false;
      template = require('./templates/tree-view-parent-selector.tpl.html');
      toolTip = $compile(template)(scope, function(toolTipEle) {
        element.after(toolTipEle);
      });
      triggerElement = element;
      triggerElement.on('click', function(e) {
        if (hasParents()) {
          e.stopPropagation();
          scope.toggle();
          toolTip.on('click', function(e) {
            e.stopPropagation();
          });
        } 

      });
      angular.element(window).on('resize', debounce(setCoords, 200));
      $timeout(function() {
        setCoords();
      }, 0);
    }
  };
};