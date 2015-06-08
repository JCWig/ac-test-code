'use strict';

var angular = require('angular');
var includes = require('lodash/collection/includes');
var debounce = require('lodash/function/debounce');
var POPUP_DELAY = 200;

/* @ngInject */
module.exports = function($log, $position, $compile, $timeout) {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      position: '@',
      header: '@',
      trigger: '@',
      popoverContent: '@',
      customContent: '@',
      linkText: '@',
      linkUrl: '@',
      buttonText: '@',
      buttonFunction: '='
    },
    link: function(scope, element) {
      var template, popover, triggerElement;

      scope.useCustomContent = function() {
        return !!scope.customContent;
      };
      scope.isOpen = function() {
        return scope.opened;
      };
      scope.toggle = function() {
        $timeout(function() {
          scope.opened = !scope.opened;
          popover.toggleClass('in', scope.opened);
        });
      };
      scope.hasHeader = function() {
        return scope.header && scope.header.length > 0;
      };
      scope.hasButton = function() {
        return scope.buttonText && scope.buttonText.length > 0;
      };
      scope.hasLink = function() {
        return scope.linkText && scope.linkText.length > 0 &&
          scope.linkUrl && scope.linkUrl.length > 0;
      };
      scope.isTriggerClick = function() {
        return scope.trigger === 'click';
      };
      function setCoords() {
        var pageMidCoords = document.body.clientWidth / 2;
        var triggerElementOffsetLeft = triggerElement[0].offsetLeft;
        var isOnLeftSide = triggerElementOffsetLeft < pageMidCoords;
        var elementOffsetTop = triggerElement[0].offsetTop;
        var popoverWidth = popover[0].offsetWidth;
        var popoverHeight = popover[0].offsetHeight;
        var triggerElementWidth = triggerElement[0].offsetWidth;
        var triggerElementHeight = triggerElement[0].offsetHeight;
        var arrowWidth = 16;
        var arrowHeight = 10;
        var popoverArrowOffset = 21;

        if (scope.position === 'right') {
          scope.popoverLeft = triggerElementOffsetLeft + arrowHeight + triggerElementWidth;
          scope.popoverTop = elementOffsetTop - popoverArrowOffset;
          scope.arrowTop = popoverArrowOffset;
          scope.arrowLeft = -arrowHeight;
        } else if (scope.position === 'left') {
          scope.popoverLeft = triggerElementOffsetLeft - popoverWidth - arrowHeight;
          scope.popoverTop = elementOffsetTop - popoverArrowOffset;
          scope.arrowTop = popoverArrowOffset;
          scope.arrowLeft = popoverWidth - 1;
        } else if (scope.position === 'bottom') {
          scope.popoverLeft = isOnLeftSide ?
            triggerElementOffsetLeft - popoverArrowOffset :
            triggerElementOffsetLeft - popoverWidth + triggerElementWidth + popoverArrowOffset;
          scope.popoverTop = elementOffsetTop + arrowHeight + triggerElementHeight;
          scope.arrowLeft = isOnLeftSide ?
            popoverArrowOffset :
            popoverWidth - popoverArrowOffset - arrowWidth;
          scope.arrowTop = -arrowHeight;
        } else {
          scope.popoverLeft = isOnLeftSide ?
            triggerElementOffsetLeft - popoverArrowOffset :
            triggerElementOffsetLeft - popoverWidth + triggerElementWidth + popoverArrowOffset;
          scope.popoverTop = elementOffsetTop - popoverHeight - arrowHeight;
          scope.arrowTop = popoverHeight;
          scope.arrowLeft = isOnLeftSide ?
            popoverArrowOffset :
            popoverWidth - arrowWidth - popoverArrowOffset;
        }

        scope.popoverTop = scope.popoverTop + 'px';
        scope.popoverLeft = scope.popoverLeft + 'px';
        scope.arrowTop = scope.arrowTop + 'px';
        scope.arrowLeft = scope.arrowLeft + 'px';
      }
      function validParameters() {
        var validPositions = ['right', 'left', 'top', 'bottom'];

        if (!scope.position || !includes(validPositions, scope.position)) {
          return false;
        }
        return true;
      }
      if (validParameters()) {
        scope.opened = false;
        template = require('./templates/popover.tpl.html');
        popover = $compile(template)(scope, function(popoverEle) {
          element.after(popoverEle);
        });
        triggerElement = element;
        if (scope.trigger === 'click') {
          triggerElement.on('click', function() {
            scope.toggle();
          });
        } else {
          triggerElement.on('mouseover', function() {
            $timeout(function() {
              scope.toggle();
            }, POPUP_DELAY);
          });
          triggerElement.on('mouseleave', function() {
            scope.toggle();
          });
        }
        angular.element(window).on('resize', debounce(setCoords, 200));
        $timeout(function() {
          setCoords();
        }, 0);
      }
    }
  };
};
