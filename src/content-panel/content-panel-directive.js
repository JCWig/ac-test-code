var angular = require('angular');

module.exports = function($log, $compile) {
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
        var hasHeaderTranscluded, customContentScope;

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
          customContentScope = scope.$parent.$new();
          customContentScope.headerClick = scope.headerClick;
          customContentScope.collapsable = scope.collapsable;
          customContentScope.isCollapsed = scope.isCollapsed;
          iElement.append($compile(transclude())(customContentScope));

          hasHeaderTranscluded = !!iElement[0].querySelector('.panel-heading');
          if (!hasHeaderTranscluded) {
            $log.error('No "akam-content-panel-header" tag found. Header will not render.');
          }
        }
      };
    }
  };
};

module.exports.$inject = ['$log', '$compile'];
