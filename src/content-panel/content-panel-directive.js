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
    link: function(scope) {
      scope.isCollapsed = !!scope.isCollapsed;

      scope.$watch('isCollapsed', function(newValue, oldValue) {
        if (newValue !== oldValue && scope.onToggle) {
          scope.onToggle({value: newValue});
        }
      });
    }
  };
};
