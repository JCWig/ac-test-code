import angular from 'angular';
import template from './templates/content-panel.tpl.html';

module.exports = function($log) {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {},
    bindToController: {
      header: '@?',
      isCollapsed: '=?',
      onToggle: '&?'
    },
    controller: () => {},
    controllerAs: 'contentPanel',
    template: template,
    compile: function compile(tElement, tAttrs) {
      // If the header attribute is not specified, assume
      // the developer provided their own akam-content-panel-header
      // and akam-content-panel-body inner directives.
      if (!tAttrs.header) {
        tElement.empty();
      }

      return function(scope, iElement, iAttrs, controller, transclude) {
        let ctrl = scope.contentPanel;
        let hasHeaderTranscluded, customContentScope, transcludedContent;

        ctrl.collapsable = angular.isUndefined(tAttrs.notCollapsable);
        ctrl.isCollapsed = ctrl.isCollapsed === true;

        scope.headerClick = (e) => {
          if (ctrl.collapsable) {
            ctrl.isCollapsed = !ctrl.isCollapsed;
            if (customContentScope) {
              customContentScope.isCollapsed = !customContentScope.isCollapsed;
            }
          }
          e.preventDefault();
          e.stopPropagation();
        };

        scope.$watch('contentPanel.isCollapsed', (newValue, oldValue) => {
          if (newValue !== oldValue && typeof ctrl.onToggle === 'function') {
            ctrl.onToggle({
              value: newValue
            });
          }
        });

        if (!iAttrs.header) {
          transclude( (clone, cloneScope) => {
            iElement.append(clone);
            transcludedContent = clone;
            customContentScope = cloneScope;
            customContentScope.headerClick = scope.headerClick;
            customContentScope.collapsable = ctrl.collapsable;
            customContentScope.isCollapsed = ctrl.isCollapsed;
          });

          // This doesn't appear to be necessary but garbage clean up just in case,
          // for added robustness against future issues.
          // Chrome node/listener graphs appear the same whether or not this is done.
          scope.$on('$destroy', () => {
            transcludedContent.remove();
            customContentScope.$destroy();
          });

          hasHeaderTranscluded = !!iElement[0].querySelector('.panel-heading');
          if (!hasHeaderTranscluded) {
            $log.error('No "akam-content-panel-header" tag found. Header will not render.');
          }
        }
      };
    }
  };
};

module.exports.$inject = ['$log'];
