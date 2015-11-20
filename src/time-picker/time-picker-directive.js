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
    this.isOpen = false;
    this.$document.on('click', angular.bind(this, this.clickHandler));
    this.$scope.$on('$destroy', () => this.$document.off('click', this.clickHandler));
  }

  clickHandler(e) {
    if (!this.inputTime || !angular.isDate(this.inputTime)) {
      this.inputTime = new Date();
      this.changed();
    }

    this.onClickAway(e);
  }

  isMinuteDisabled() {
    return this.disableMinutes === true || this.$scope.$eval(this.disableMinutes) === true;
  }

  toggle() {
    if (this.isDisabled || this.isReadonly) {
      return;
    }
    //if there is no value, add current time for first time
    if (!this.isOpen && !angular.isDate(this.inputTime)) {
      this.inputTime = new Date();
      this.changed();
    }
    this.isOpen = !this.isOpen;
  }

  preventDefaultEvents(e) {
    e.preventDefault();
    e.stopPropagation();
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
    ctrl.changed();
  });

  ctrl.changed = () => {
    ngModel.$setViewValue(ctrl.inputTime);
    ngModel.$setValidity('time', !(angular.isUndefined(ctrl.inputTime) || ctrl.inputTime === null));
  };

  ctrl.onClickAway = (e) => {
    if (ctrl.isOpen && !element[0].contains(e.target)) {
      ctrl.$scope.$apply(() => {
        ctrl.isOpen = false;
      });
    }
  };

  ctrl.disableMinutes = ctrl.disableMinutes === true || attrs.disableMinutes === 'disabled';

  ctrl.minuteStep = ctrl.minuteStep ? ctrl.minuteStep : timepickerConfig.MINUTE_STEP;
  ctrl.hourStep = ctrl.hourStep ? ctrl.hourStep : timepickerConfig.HOUR_STEP;

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
      ctrl.preventDefaultEvents(e);
    }
  });

  ctrl.dropdownElement = angular.element(element[0].querySelector('.dropdown-menu'));
  ctrl.dropdownElement.on('click', (e) => ctrl.preventDefaultEvents(e));
  scope.$on('$destroy', () => ctrl.dropdownElement.off('click'));
}

export default () => {
  return {
    restrict: 'E',
    transclude: false,
    scope: {},
    require: 'ngModel',
    bindToController: {
      showMeridian: '=?',
      isDisabled: '=?',
      isReadonly: '=?',
      disableMinutes: '=isMinuteDisabled',
      hourStep: '=?',
      minuteStep: '=?'
    },
    controller: TimepickerController,
    controllerAs: 'timepicker',
    template: template,
    link: linkFn
  };
};
