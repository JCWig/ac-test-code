import angular from 'angular';
import template from './templates/date-picker.tpl.html';

const [DAY, MONTH] = ['day', 'month'];
const DEFAULT_MORMAT = {
  DAY: 'EEE, MMM dd, yyyy',
  MONTH: 'MMM yyyy'
};

class DatepickerController {
  constructor(scope, $filter, $timeout, translate) {
    this.scope = scope;
    this.$filter = $filter;
    this.$timeout = $timeout;
    this.translate = translate;

    this.opened = false;
    this.mode = this.mode === DAY || this.mode === MONTH ? this.mode : DAY;

    if (this.mode === DAY) {
      if (!this.placeholder) {
        this.translate.async('components.date-picker.placeholder.date')
          .then((value) => this.placeholder = value);
      }
      this.dateOptions = {
        startingDay: 0,
        showWeeks: false,
        autoclose: true,
        minMode: DAY,
        maxMode: DAY
      };
    } else {
      if (!this.placeholder) {
        this.translate.async('components.date-picker.placeholder.month')
          .then((value) => scope.placeholder = value);
      }
      this.dateOptions = {
        startingDay: 0,
        minMode: MONTH,
        maxMode: MONTH,
        showWeeks: false,
        datepickerMode: MONTH,
        autoclose: true,
        formatMonth: 'MMM'
      };
    }
  }
}

DatepickerController.$inject = ['$scope', '$filter', '$timeout', 'translate'];

function linkFn(scope, element, attrs, ngModel) {
  let noClear = angular.isDefined(attrs.noClear),
    ctrl = scope.datepicker;

  if (!ngModel) {
    return;
  }

  ngModel.$render = () => {
    ctrl.value =
      ctrl.$filter('date')(ngModel.$modelValue, ctrl.format);
  };

  scope.change = () => {
    ngModel.$setViewValue(ctrl.value);
    ngModel.$setTouched();
  };

  scope.toggle = ($event) => {
    $event.preventDefault();
    $event.stopPropagation();

    ctrl.opened = !ctrl.opened;
  };

  scope.showClear = () => {
    return ctrl.value && !noClear && !ctrl.isDisabled;
  };

  scope.clearDate = () => {
    ctrl.value = null;
    ngModel.$setViewValue(null);
  };

  scope.$watch('datepicker.opened', (newValue) => element.toggleClass('opened', newValue));

  ctrl.$timeout(() => {
    if (ctrl.mode === DAY) {
      ctrl.format = ctrl.format || DEFAULT_MORMAT.DAY;
    } else {
      ctrl.format = ctrl.format || DEFAULT_MORMAT.MONTH;
    }
  });
}

export default () => {
  return {
    replace: true,
    restrict: 'E',
    require: 'ngModel',
    scope: {},
    bindToController: {
      placeholder: '@',
      mode: '@',
      min: '@',
      max: '@',
      format: '@',
      isDisabled: '=?'
    },
    controller: DatepickerController,
    controllerAs: 'datepicker',
    template: template,
    link: linkFn
  };
};
