'use strict';

/* @ngInject */
module.exports = function(translate) {

  var c = {
    SMALL: 'small',
    MEDIUM: 'medium',
    GRAYSCALE: 'grayscale',
    COLOR: 'color',
    ON: 'On',
    OFF: 'Off'
  };

  function setDefaultScopeValues(scope) {

    if (typeof scope.onLabel !== 'string') {
      translate.async('components.switch-button.onLabel')
        .then(function(value) {
          scope.onLabel = value;
        });
    }

    if (typeof scope.offLabel !== 'string') {
      translate.async('components.switch-button.offLabel')
        .then(function(value) {
          scope.offLabel = value;
        });
    }

    scope.disabled = scope.disabled === 'true';
  }

  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {
      on: '=ngModel',
      disabled: '@?',
      onLabel: '@?',
      offLabel: '@?'
    },
    template: require('./templates/switch-button-directive.tpl.html'),

    link: function(scope, elem, attrs, ngModel) {
      var size = attrs.size !== c.SMALL && attrs.size !== c.MEDIUM ? c.SMALL : attrs.size;
      var theme = attrs.theme === c.GRAYSCALE ? attrs.theme : c.COLOR;
      var element = elem.children(0);

      setDefaultScopeValues(scope);

      element.toggleClass(c.MEDIUM, size === c.MEDIUM);
      element.toggleClass(c.GRAYSCALE, theme === c.GRAYSCALE);

      if (scope.disabled === false) {
        elem.on('click', function() {
          ngModel.$setViewValue(!ngModel.$viewValue);
        });
      }
    }
  };
};