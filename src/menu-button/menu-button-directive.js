'use strict';

/* @ngInject */
module.exports = function($log) {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      label: '@',
      iconOnly: '@',
      position: '@'
    },
    template: require('./templates/menu-button.tpl.html'),
    link: function(scope) {
      scope.iconOnly = (scope.iconOnly !== 'false') && !(scope.label);
    }
  };
};
