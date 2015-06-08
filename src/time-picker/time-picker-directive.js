'use strict';

var timepickerConfig = {
  MINUTE_STEP: 15,
  HOUR_STEP: 1,
  MERIDIAN_ON: 'hh:mm a',
  MERIDIAN_OFF: 'HH:mm'
};

/* @ngInject */
module.exports = function($document, $parse) {
  var directive = {
    restrict: 'E',
    transclude: false,
    template: require('./templates/time-picker.tpl.html'),
    link: link,
    scope: {
      inputTime: '=ngModel',
      showMeridian: '=?',
      disabled: '=?',
      hourStep: '=?',
      minuteStep: '=?'
    }
  };

  return directive;

  function link(scope, element, attrs) {

    var notShowMeridian = false,
      defaultPlaceholder = '';

    scope.disabled = scope.disabled === true || attrs.disabled === 'disabled';

    scope.minuteStep = timepickerConfig.MINUTE_STEP;
    $parse(attrs.minuteStep, function(value) {
      scope.minuteStep = parseInt(value, 10);
    });

    scope.hourStep = timepickerConfig.HOUR_STEP;
    $parse(attrs.hourStep, function(value) {
      scope.hourStep = parseInt(value, 10);
    });

    notShowMeridian = scope.showMeridian === false ||
      scope.$eval(attrs.showMeridian) === false;
    scope.showMeridian = !notShowMeridian;

    defaultPlaceholder = scope.showMeridian ?
      timepickerConfig.MERIDIAN_ON : timepickerConfig.MERIDIAN_OFF;
    scope.placeholder = attrs.placeholder ? attrs.placeholder : defaultPlaceholder;

    scope.isOpen = false;

    scope.isDisabled = function() {
      return scope.disabled === true || scope.$eval(scope.disabled) === true;
    };

    element.bind('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
    });

    $document.on('click', clickHandler);

    scope.$on('$destroy', function() {
      $document.off('click', clickHandler);
    });

    function clickHandler() {
      scope.$apply(function() {
        scope.isOpen = false;
      });
    }
  }
};
