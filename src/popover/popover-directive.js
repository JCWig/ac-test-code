import angular from 'angular';
import debounce from 'lodash/function/debounce';
import template from './templates/popover.tpl.html';

const VALID_POSITIONS = ['right', 'left', 'top', 'bottom'];
const ARROW_WIDTH = 16;
const ARROW_HEIGHT = 10;
const POPOVER_ARROW_OFFSET = 21;
const POPUP_DELAY = 300;

function popoverDirective($log, $position, $compile, $timeout, $templateCache,
  $parse, $window, $translate) {
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
      newScope.labelValues = attrs.labelValues;

      newScope.useCustomContent = !!attrs.customContent;
      newScope.hasHeader = newScope.header && newScope.header.length > 0;
      newScope.hasButton = newScope.buttonText && newScope.buttonText.length > 0;
      newScope.hasLink =
        newScope.linkText && newScope.linkText.length > 0 &&
        newScope.linkUrl && newScope.linkUrl.length > 0;
      newScope.isTriggerClick = attrs.trigger === 'click';

      attrs.$observe('popoverContent', (newValue) => {
        $translate(newValue, $parse(newScope.labelValues)())
          .then(value => {
            newScope.popoverContent = value;
          });
      });

      newScope.isOpen = () => {
        return newScope.opened;
      };
      newScope.toggle = () => {
        $timeout(() => {
          newScope.opened = !newScope.opened;
          popover.toggleClass('in', newScope.opened);
          setCoords();
        });
      };

      newScope.buttonFunctionNew = () => {
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

        if (newScope.position === 'right') {
          newScope.popoverLeft = triggerElementOffsetLeft + ARROW_HEIGHT + triggerElementWidth;
          newScope.popoverTop = elementOffsetTop - POPOVER_ARROW_OFFSET;
          newScope.arrowTop = POPOVER_ARROW_OFFSET;
          newScope.arrowLeft = -ARROW_HEIGHT;
        } else if (newScope.position === 'left') {
          newScope.popoverLeft = triggerElementOffsetLeft - popoverWidth - ARROW_HEIGHT;
          newScope.popoverTop = elementOffsetTop - POPOVER_ARROW_OFFSET;
          newScope.arrowTop = POPOVER_ARROW_OFFSET;
          newScope.arrowLeft = popoverWidth - 1;
        } else if (newScope.position === 'bottom') {
          newScope.popoverLeft = isOnLeftSide ?
            triggerElementOffsetLeft - POPOVER_ARROW_OFFSET :
            triggerElementOffsetLeft - popoverWidth + triggerElementWidth + POPOVER_ARROW_OFFSET;
          newScope.popoverTop = elementOffsetTop + ARROW_HEIGHT + triggerElementHeight;
          newScope.arrowLeft = isOnLeftSide ?
            POPOVER_ARROW_OFFSET :
            popoverWidth - POPOVER_ARROW_OFFSET - ARROW_WIDTH;
          newScope.arrowTop = -ARROW_HEIGHT;
        } else {
          newScope.popoverLeft = isOnLeftSide ?
            triggerElementOffsetLeft - POPOVER_ARROW_OFFSET :
            triggerElementOffsetLeft - popoverWidth + triggerElementWidth + POPOVER_ARROW_OFFSET;
          newScope.popoverTop = elementOffsetTop - popoverHeight - ARROW_HEIGHT;
          newScope.arrowTop = popoverHeight;
          newScope.arrowLeft = isOnLeftSide ?
            POPOVER_ARROW_OFFSET :
            popoverWidth - ARROW_WIDTH - POPOVER_ARROW_OFFSET;
        }

        newScope.popoverTop += 'px';
        newScope.popoverLeft += 'px';
        newScope.arrowTop += 'px';
        newScope.arrowLeft += 'px';
      }

      function validParameters() {
        let valid = VALID_POSITIONS.filter(el => el === newScope.position);

        return valid.length > 0;
      }

      if (!validParameters()) {
        return;
      }

      newScope.opened = false;
      popover = $compile(template)(newScope);
      if (newScope.useCustomContent) {
        customTemplate = $templateCache.get(attrs.customContent);
        try {
          angular.element(customTemplate);
        } catch (e) {
          customTemplate = `<span>${customTemplate}</span>`;
        }
        $timeout(() => angular.element(
          popover[0].querySelector('.popover-custom-content'))
            .append($compile(customTemplate)(newScope)));
      }
      element.after(popover);

      triggerElement = element;
      if (newScope.isTriggerClick) {
        triggerElement.on('click', () => newScope.toggle());
      } else {
        triggerElement.on('mouseover', () => {
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
        triggerElement.on('mouseleave', () => {
          if (triggerHovering) {
            $timeout.cancel(enterTimeout);
          } else {
            leaveTimeout = $timeout(() => {
              newScope.toggle();
            }, POPUP_DELAY);
          }
          triggerHovering = false;
        });
        popover.on('mouseover', () => $timeout.cancel(leaveTimeout));
        popover.on('mouseleave', () => {
          leavePopover = true;
          leavePopoverTimeout = $timeout(() => {
            newScope.toggle();
            leavePopover = false;
          }, POPUP_DELAY);
        });
      }

      setCoordsDebounced = debounce(setCoords, 200);

      $window.addEventListener('resize', setCoordsDebounced);

      $timeout(()=>setCoords());

      scope.$on('$destroy', () => {
        $window.removeEventListener('resize', setCoordsDebounced);
        newScope.$destroy();
      });
    }
  };
}

popoverDirective.$inject = ['$log', '$position', '$compile', '$timeout', '$templateCache', '$parse',
  '$window', '$translate'];

export default popoverDirective;