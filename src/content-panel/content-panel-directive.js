var angular = require('angular');

module.exports = function($log) {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      header: '@?',
      isCollapsed: '=?',
      onToggle: '&?'
    },
    template: require('./templates/content-panel.tpl.html'),
    compile: function compile(tElement, tAttrs) {
      //If the header attribute is not specified, assume
      // the developer provided their own akam-content-panel-header
      // and akam-content-panel-body inner directives.
      if (!tAttrs.header) {
        tElement.empty();
      }

      return function(scope, iElement, iAttrs, controller, transclude) {
        var hasHeaderTranscluded, customContentScope, transcludedContent;

        scope.collapsable = angular.isUndefined(tAttrs.notCollapsable);
        scope.isCollapsed = scope.isCollapsed === true;

        scope.headerClick = function(e) {
          if (scope.collapsable) {
            scope.isCollapsed = !scope.isCollapsed;
            if (customContentScope) {
              customContentScope.isCollapsed = !customContentScope.isCollapsed;
            }
          }
          e.preventDefault();
          e.stopPropagation();
        };

        scope.$watch('isCollapsed', function(newValue, oldValue) {
          if (newValue !== oldValue && typeof scope.onToggle === 'function') {
            scope.onToggle({
              value: newValue
            });
          }
        });

        if (!iAttrs.header) {
          transclude(function(clone, cloneScope) {
            iElement.append(clone);
            transcludedContent = clone;
            customContentScope = cloneScope;
            customContentScope.headerClick = scope.headerClick;
            customContentScope.collapsable = scope.collapsable;
            customContentScope.isCollapsed = scope.isCollapsed;
          });

          //This doesn't appear to be necessary but garbage clean up just in case,
          // for added robustness against future issues.
          //Chrome node/listener graphs appear the same whether or not this is done.
          scope.$on('$destroy', function() {
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
