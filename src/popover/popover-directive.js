'use strict';

var angular = require('angular');
var includes = require('lodash/collection/includes');
var debounce = require('lodash/function/debounce');
var POPUP_DELAY = 200;

/* @ngInject */
module.exports = function($log, $position, $compile, $timeout, $templateCache, $parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var template, popover, triggerElement, customTemplate;
      var newScope = scope.$new();

      newScope.position = attrs.position;
      newScope.header = attrs.header;
      newScope.popoverContent = attrs.popoverContent;
      newScope.linkText = attrs.linkText;
      newScope.linkUrl = attrs.linkUrl;
      newScope.buttonText = attrs.buttonText;
      newScope.buttonFunction = $parse(attrs.buttonFunction);

      newScope.useCustomContent = !!attrs.customContent;
      newScope.hasHeader = newScope.header && newScope.header.length > 0;
      newScope.hasButton = newScope.buttonText && newScope.buttonText.length > 0;
      newScope.hasLink = 
          newScope.linkText && newScope.linkText.length > 0 &&
          newScope.linkUrl && newScope.linkUrl.length > 0;
      newScope.isTriggerClick = attrs.trigger === 'click';

      newScope.isOpen = function() {
        return newScope.opened;
      };
      newScope.toggle = function() {
        $timeout(function() {
          newScope.opened = !newScope.opened;
          popover.toggleClass('in', newScope.opened);
        });
      };
      newScope.buttonFunctionNew = function() {
        newScope.buttonFunction(newScope);
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

        if (newScope.position === 'right') {
          newScope.popoverLeft = triggerElementOffsetLeft + arrowHeight + triggerElementWidth;
          newScope.popoverTop = elementOffsetTop - popoverArrowOffset;
          newScope.arrowTop = popoverArrowOffset;
          newScope.arrowLeft = -arrowHeight;
        } else if (newScope.position === 'left') {
          newScope.popoverLeft = triggerElementOffsetLeft - popoverWidth - arrowHeight;
          newScope.popoverTop = elementOffsetTop - popoverArrowOffset;
          newScope.arrowTop = popoverArrowOffset;
          newScope.arrowLeft = popoverWidth - 1;
        } else if (newScope.position === 'bottom') {
          newScope.popoverLeft = isOnLeftSide ?
            triggerElementOffsetLeft - popoverArrowOffset :
            triggerElementOffsetLeft - popoverWidth + triggerElementWidth + popoverArrowOffset;
          newScope.popoverTop = elementOffsetTop + arrowHeight + triggerElementHeight;
          newScope.arrowLeft = isOnLeftSide ?
            popoverArrowOffset :
            popoverWidth - popoverArrowOffset - arrowWidth;
          newScope.arrowTop = -arrowHeight;
        } else {
          newScope.popoverLeft = isOnLeftSide ?
            triggerElementOffsetLeft - popoverArrowOffset :
            triggerElementOffsetLeft - popoverWidth + triggerElementWidth + popoverArrowOffset;
          newScope.popoverTop = elementOffsetTop - popoverHeight - arrowHeight;
          newScope.arrowTop = popoverHeight;
          newScope.arrowLeft = isOnLeftSide ?
            popoverArrowOffset :
            popoverWidth - arrowWidth - popoverArrowOffset;
        }

        newScope.popoverTop = newScope.popoverTop + 'px';
        newScope.popoverLeft = newScope.popoverLeft + 'px';
        newScope.arrowTop = newScope.arrowTop + 'px';
        newScope.arrowLeft = newScope.arrowLeft + 'px';
      }
      function validParameters() {
        var validPositions = ['right', 'left', 'top', 'bottom'];

        if (!newScope.position || !includes(validPositions, newScope.position)) {
          return false;
        }
        return true;
      }
      if (validParameters()) {
        newScope.opened = false;
        template = require('./templates/popover.tpl.html');
        popover = $compile(template)(newScope, function(popoverEle) {
          if (newScope.useCustomContent) {
            customTemplate = $templateCache.get(attrs.customContent);
            $timeout(function() {
              $compile(customTemplate)(newScope, function(customEle) {
                popoverEle[0].querySelector('.popover-custom-content').appendChild(customEle[0]);
                element.after(popoverEle);
              });
            }, 0);
          } else {
            element.after(popoverEle);
          }
        });
        triggerElement = element;
        if (newScope.isTriggerClick) {
          triggerElement.on('click', function() {
            newScope.toggle();
          });
        } else {
          triggerElement.on('mouseover', function() {
            $timeout(function() {
              newScope.toggle();
            }, POPUP_DELAY);
          });
          triggerElement.on('mouseleave', function() {
            newScope.toggle();
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
