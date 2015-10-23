function popoverPopupDirective() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      content: '@',
      title: '@',
      placement: '@',
      popupClass: '@',
      animation: '&',
      isOpen: '&'
    },
    template: `<div class="popover"
      tooltip-animation-class="fade"
      tooltip-classes
      ng-class="{ in: isOpen() }">
        <div class="arrow"></div>
          <h3 class="popover-title" ng-bind="title | translate" ng-if="title"></h3>
          <div class="popover-content" ng-bind-html="content | translate"></div>

      </div>`
  };
}

export default popoverPopupDirective;