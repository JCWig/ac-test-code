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
      if ( !tAttrs.header ) {
        tElement.empty();
      }

      return {
        pre: function preLink(scope, iElement, iAttrs, controller, transclude) {
          var hasHeaderTranscluded;

          //This is essentially the same as if this directive's template had
          // ng-transclude on the root element.
          if ( !iAttrs.header ) {
            iElement.append(transclude());
            hasHeaderTranscluded = !!iElement[0].querySelector('.panel-heading');
            if (!hasHeaderTranscluded) {
              $log.error('No "akam-content-panel-header" tag found. Header will not render.');
            }
          }
        },
        post: function postLink(scope) {
          scope.showIcon = angular.isUndefined(tAttrs.notCollapsable);
          scope.isCollapsed = scope.isCollapsed === true;
          scope.$watch('isCollapsed', function(newValue, oldValue) {
            if (newValue !== oldValue && typeof scope.onToggle === 'function') {
              scope.onToggle({value: newValue});
            }
          });
        }
      };
    }
  };
};

module.exports.$inject = ['$log'];
