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

  function setDefaultScopeValues(scope) {
    scope.onLabel = typeof scope.onLabel === 'string' ? scope.onLabel : c.ON;
    scope.offLabel = typeof scope.offLabel === 'string' ? scope.offLabel : c.OFF;
    scope.disabled = scope.disabled === 'true' ? true : false;
  }

  return {
    restrict: 'E',
    require: 'ngModel',
    replace: true,
    scope: {
      on: '=ngModel',
      disabled: '@?',
      onLabel: '@?',
      offLabel: '@?'
    },
    template: require('./templates/switch-button-directive.tpl.html'),

    link: function(scope, elem, attrs, ngModel) {
      var size = (attrs.size !== c.SMALL && attrs.size !== c.MEDIUM) ? c.SMALL : attrs.size;
      var theme = attrs.theme === c.GRAYSCALE ? attrs.theme : c.COLOR;

      setDefaultScopeValues(scope);

      elem.toggleClass(c.MEDIUM, size === c.MEDIUM);
      elem.toggleClass(c.GRAYSCALE, theme === c.GRAYSCALE);

      if (scope.disabled === false) {
        elem.on('click', function() {
          ngModel.$setViewValue(!ngModel.$viewValue);
        });
      }
    }
  };
};