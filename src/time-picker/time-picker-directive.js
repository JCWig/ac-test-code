import angular from 'angular';
import template from './templates/time-picker.tpl.html';

const timepickerConfig = {
  MINUTE_STEP: 15,
  HOUR_STEP: 1,
  MERIDIAN_ON: 'hh:mm a',
  MERIDIAN_OFF: 'HH:mm'
};

class TimepickerController {
  constructor($scope, $document, $parse) {
    this.$scope = $scope;
    this.$document = $document;
    this.$parse = $parse;
    TimepickerController.$scope = $scope;

    this.isOpen = false;

    this.$document.on('click', this.clickHandler);

    this.$scope.$on('$destroy', () => {
      this.$document.off('click', this.clickHandler);
    });
  }

  clickHandler() {
    TimepickerController.$scope.$apply('timepicker.isOpen=false');
  }

  isDisabled() {
    return this.disabled === true || this.$scope.$eval(this.disabled) === true;
  }
}

TimepickerController.$inject = ['$scope', '$document', '$parse'];

function linkFn(scope, element, attrs, ngModel) {
  let notShowMeridian = false,
    defaultPlaceholder = '',
    ctrl = scope.timepicker;

  //only the first time rendering, $render gets called
  ngModel.$render = () => {
    ctrl.inputTime = ngModel.$modelValue;
  };

  element.on('input', () => {
    scope.$apply('timepicker.changed()');
  });

  ctrl.changed = () => {
    ngModel.$setViewValue(ctrl.inputTime);
    ngModel.$setValidity('time', !(angular.isUndefined(ctrl.inputTime) || ctrl.inputTime === null));
  };

  ctrl.disabled = ctrl.disabled === true || attrs.isDisabled === 'disabled';

  ctrl.minuteStep = timepickerConfig.MINUTE_STEP;
  ctrl.$parse(attrs.minuteStep, (value) => {
    ctrl.minuteStep = parseInt(value, 10);
  });

  ctrl.hourStep = timepickerConfig.HOUR_STEP;
  ctrl.$parse(attrs.hourStep, (value) => {
    ctrl.hourStep = parseInt(value, 10);
  });

  notShowMeridian = ctrl.showMeridian === false ||
    scope.$eval(attrs.showMeridian) === false;
  ctrl.showMeridian = !notShowMeridian;

  defaultPlaceholder = ctrl.showMeridian ?
    timepickerConfig.MERIDIAN_ON : timepickerConfig.MERIDIAN_OFF.toLowerCase();
  ctrl.placeholder = attrs.placeholder ? attrs.placeholder : defaultPlaceholder;

  element.find('input').on('keypress', (e) => {
    let k = e.which || e.keyCode,
      isMeridian = angular.element(this).attr('name') === 'meridian';

    //to prevent enter key to close dropdown and
    //still making meridian button functional
    if (k === 13 && !isMeridian) {
      preventDefaultEvents(e);
    }
  });

  element.on('click', (e) => {
    preventDefaultEvents(e);
  });

  function preventDefaultEvents(e) {
    e.preventDefault();
    e.stopPropagation();
  }
}

export default () => {
  return {
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
    controller: TimepickerController,
    controllerAs: 'timepicker',
    template: template,
    link: linkFn
  };
};
