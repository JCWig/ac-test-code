'use strict';

/* @ngInject */
module.exports = function() {

  var c = {
    SMALL: 'small',
    MEDIUM: 'medium',
    GRAYSCALE: 'grayscale',
    COLOR: 'color',
    ON: 'On',
    OFF: 'Off'
  };

  function setDefaultAttrsValues(scope) {
    scope.size = scope.size !== c.small && scope.size !== c.MEDIUM ? c.SMALL : scope.size;
    scope.theme = scope.theme === c.GRAYSCALE ? scope.theme : c.COLOR;
    scope.onLabel = typeof scope.onLabel === 'string' ? scope.onLabel : c.ON;
    scope.offLabel = typeof scope.offLabel === 'string' ? scope.offLabel : c.OFF;
    scope.disabled = scope.disabled === 'true' ? scope.disabled : 'false';
  }

  return {
    restrict: 'E',
    require: 'ngModel',
    replace: true,
    scope: {
      on: '=ngModel',
      size: '@?',
      theme: '@?',
      disabled: '@?',
      onLabel: '@?',
      offLabel: '@?'
    },
    template: require('./templates/switch-button-directive.tpl.html'),

    link: function(scope, elem, attrs, ngModel) {
      setDefaultAttrsValues(scope);

      if (scope.size === c.MEDIUM) {
        elem.addClass(c.MEDIUM);
      } else {
        elem.removeClass(c.MEDIUM);
      }

      if (scope.theme === c.GRAYSCALE) {
        elem.addClass(c.GRAYSCALE);
      } else {
        elem.removeClass(c.GRAYSCALE);
      }

      if (scope.disabled === 'false') {
        elem.on('click', function() {
          ngModel.$setViewValue(!ngModel.$viewValue);
        });
      }
    }
  };
};