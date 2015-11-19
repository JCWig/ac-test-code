function popoverTemplatePopupDirective() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      title: '@',
      contentExp: '&',
      placement: '@',
      popupClass: '@',
      animation: '&',
      isOpen: '&',
      originScope: '&'
    },
    template: `<div class="popover"
      tooltip-animation-class="fade"
      tooltip-classes
      ng-class="{ in: isOpen() }">
      <div class="arrow"></div>

        <h4 class="popover-title" ng-bind="title | translate" ng-if="title"></h4>
        <div class="popover-content"
          tooltip-template-transclude="contentExp()"
          tooltip-template-transclude-scope="originScope()"></div>
    </div>`
  };
}

export default popoverTemplatePopupDirective;