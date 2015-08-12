import angular from 'angular';
import debounce from 'lodash/function/debounce';
import template from './templates/popover.tpl.html';

const POPUP_DELAY = 300;

function popoverDirective($log, $position, $compile, $timeout, $templateCache, $parse, $window) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      let popover, triggerElement, customTemplate, triggerHovering,
        enterTimeout, leaveTimeout, leavePopover, leavePopoverTimeout;
      let newScope = scope.$new();
      let setCoordsDebounced = null;

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
          setCoords();
        });
      };
      newScope.buttonFunctionNew = function() {
        newScope.buttonFunction(newScope);
      };
      function setCoords() {
        let pageMidCoords = document.body.clientWidth / 2;
        let triggerElementOffsetLeft = triggerElement[0].offsetLeft;
        let isOnLeftSide = triggerElementOffsetLeft < pageMidCoords;
        let elementOffsetTop = triggerElement[0].offsetTop;
        let popoverWidth = popover[0].offsetWidth;
        let popoverHeight = popover[0].offsetHeight;
        let triggerElementWidth = triggerElement[0].offsetWidth;
        let triggerElementHeight = triggerElement[0].offsetHeight;
        let arrowWidth = 16;
        let arrowHeight = 10;
        let popoverArrowOffset = 21;

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

        newScope.popoverTop += 'px';
        newScope.popoverLeft += 'px';
        newScope.arrowTop += 'px';
        newScope.arrowLeft += 'px';
      }

      function validParameters() {
        let validPositions = ['right', 'left', 'top', 'bottom'];
        let valid = validPositions.filter(el => el === newScope.position);

        return valid.length > 0;
      }

      if (validParameters()) {
        newScope.opened = false;
        popover = $compile(template)(newScope);
        if (newScope.useCustomContent) {
          customTemplate = $templateCache.get(attrs.customContent);
          try {
            angular.element(customTemplate);
          } catch (e) {
            customTemplate = '<span>' + customTemplate + '</span>';
          }
          $timeout(function() {
            var customEle = $compile(customTemplate)(newScope);

            angular.element(popover[0].querySelector('.popover-custom-content')).append(customEle);
          }, 0);
        }
        element.after(popover);

        triggerElement = element;
        if (newScope.isTriggerClick) {
          triggerElement.on('click', function() {
            newScope.toggle();
          });
        } else {
          triggerElement.on('mouseover', function() {
            if (!leavePopover) {
              triggerHovering = true;
              enterTimeout = $timeout(function() {
                triggerHovering = false;
                newScope.toggle();
              }, POPUP_DELAY);
            } else {
              $timeout.cancel(leavePopoverTimeout);
            }
            leavePopover = false;
          });
          triggerElement.on('mouseleave', function() {
            if (triggerHovering) {
              $timeout.cancel(enterTimeout);
            } else {
              leaveTimeout = $timeout(function() {
                newScope.toggle();
              }, POPUP_DELAY);
            }
            triggerHovering = false;
          });
          popover.on('mouseover', function() {
            $timeout.cancel(leaveTimeout);
          });
          popover.on('mouseleave', function() {
            leavePopover = true;
            leavePopoverTimeout = $timeout(function() {
              newScope.toggle();
              leavePopover = false;
            }, POPUP_DELAY);
          });
        }

        setCoordsDebounced = debounce(setCoords, 200);

        $window.addEventListener('resize', setCoordsDebounced);

        $timeout(function() {
          setCoords();
        }, 0);

        scope.$on('$destroy', function() {
          $window.removeEventListener('resize', setCoordsDebounced);
          newScope.$destroy();
        });
      }
    }
  };
}

popoverDirective.$inject = ['$log', '$position', '$compile', '$timeout', '$templateCache', '$parse',
  '$window'];

export default popoverDirective;