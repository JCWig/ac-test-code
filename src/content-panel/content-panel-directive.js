'use strict';

/* @ngInject */
module.exports = function() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      header: '@',
      isCollapsed: '=?',
      onToggle: '&?'
    },
    template: require('./templates/content-panel.tpl.html'),
    compile:  function compile(tElement, tAttrs) {
      //If the header attribute is not specified, assume that the developer provided their own akam-content-panel-header
      // and akam-content-panel-body inner directives.
      if ( !tAttrs.header ) {
        tElement.empty();
      }

      return {
        pre: function preLink(scope, iElement, iAttrs, controller, transclude) {
          //This is essentially the same as if this directive's template had ng-transclude on the root element.
          if ( !iAttrs.header ) {
            iElement.append(transclude());
          }
        },
        post: function postLink(scope, iElement, iAttrs, controller) {
          scope.isCollapsed = !!scope.isCollapsed;
          scope.$watch('isCollapsed', function(newValue, oldValue) {
            if (newValue !== oldValue && typeof scope.onToggle === 'function') {
              scope.onToggle({value: newValue});
            }
          });
        }
      }
    }
  };
};
