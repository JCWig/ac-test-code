'use strict';

var angular = require('angular');

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
    scope: {},
    require: 'ngModel',
    bindToController: {
      showMeridian: '=?',
      disabled: '=isDisabled',
      hourStep: '=?',
      minuteStep: '=?'
    },
    controller: TimePickerController,
    controllerAs: 'timepicker',
    template: require('./templates/time-picker.tpl.html'),
    link: linkFn
  };

  return directive;

  /* @ngInject */
  function TimePickerController($scope) {

    this.isOpen = false;
    this.isDisabled = isDisabled;

    $document.on('click', clickHandler);

    $scope.$on('$destroy', function() {
      $document.off('click', clickHandler);
    });

    function clickHandler() {
      $scope.$apply('timepicker.isOpen=false');
    }

    function isDisabled() {
      return this.disabled === true || $scope.$eval(this.disabled) === true;
    }
  }

  /* @ngInject */
  function linkFn(scope, element, attrs, ngModel) {

    var notShowMeridian = false,
      defaultPlaceholder = '',
      ctrl = scope.timepicker;

    //only the first time rendering, $render gets called
    ngModel.$render = function() {
      ctrl.inputTime = ngModel.$modelValue;
    };

    element.on('input', function() {
      scope.$apply('timepicker.changed()');
    });

    ctrl.changed = function() {
      ngModel.$setViewValue(ctrl.inputTime);
      ngModel.$setValidity('time',
        !(angular.isUndefined(ctrl.inputTime) || ctrl.inputTime === null));
    };

    ctrl.disabled = ctrl.disabled === true || attrs.isDisabled === 'disabled';

    ctrl.minuteStep = timepickerConfig.MINUTE_STEP;
    $parse(attrs.minuteStep, function(value) {
      ctrl.minuteStep = parseInt(value, 10);
    });

    ctrl.hourStep = timepickerConfig.HOUR_STEP;
    $parse(attrs.hourStep, function(value) {
      ctrl.hourStep = parseInt(value, 10);
    });

    notShowMeridian = ctrl.showMeridian === false ||
      scope.$eval(attrs.showMeridian) === false;
    ctrl.showMeridian = !notShowMeridian;

    defaultPlaceholder = ctrl.showMeridian ?
      timepickerConfig.MERIDIAN_ON : timepickerConfig.MERIDIAN_OFF.toLowerCase();
    ctrl.placeholder = attrs.placeholder ? attrs.placeholder : defaultPlaceholder;

    element.bind('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
    });
  }
};
