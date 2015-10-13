import angular from 'angular';
import template from './templates/date-picker.tpl.html';

const [DAY, MONTH] = ['day', 'month'];
const DEFAULT_MORMAT = {
  DAY: 'EEE, MMM dd, yyyy',
  MONTH: 'MMM yyyy'
};
const REGEX = /^"(.+)"$/;

class DatepickerController {
  constructor($filter, $timeout, $translate) {
    this.$filter = $filter;
    this.$timeout = $timeout;
    this.$translate = $translate;

    this.opened = false;
    this.mode = this.mode === DAY || this.mode === MONTH ? this.mode : DAY;

    if (this.mode === DAY) {
      this.$translate(this.placeholder || 'components.date-picker.placeholder.date')
        .then((value) => this.placeholder = value);

      this.dateOptions = {
        startingDay: 0,
        showWeeks: false,
        autoclose: true,
        minMode: DAY,
        maxMode: DAY
      };
    } else {
      this.$translate(this.placeholder || 'components.date-picker.placeholder.month')
        .then((value) => this.placeholder = value);

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

    this.$timeout(() => {
      if (this.mode === DAY) {
        this.format = this.format || DEFAULT_MORMAT.DAY;
      } else {
        this.format = this.format || DEFAULT_MORMAT.MONTH;
      }
    });
  }

  toggle(e) {
    e.preventDefault();
    e.stopPropagation();

    this.opened = !this.opened;
  }

  static getDateOnly(d) {
    let date = angular.isDate(d) ? d : new Date();

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}

DatepickerController.$inject = ['$filter', '$timeout', '$translate'];

function linkFn(scope, element, attrs, ngModel) {
  let noClear = angular.isDefined(attrs.noClear),
    ctrl = scope.datepicker;

  if (!ngModel) {
    return;
  }

  ngModel.$render = () => {
    ctrl.value = ngModel.$modelValue;
  };

  scope.change = () => {
    ngModel.$setViewValue(ctrl.value);
    ngModel.$setTouched();
  };

  scope.showClear = () => {
    return ctrl.value && !noClear && !ctrl.isDisabled;
  };

  scope.clearDate = () => {
    ctrl.value = null;
    ngModel.$setViewValue(null);
  };

  scope.$watch('datepicker.opened', (newValue) => element.toggleClass('opened', newValue));

  scope.$watch('datepicker.max', (newValue) => {
    if (!newValue) {
      return;
    }
    newValue = newValue.replace(REGEX, '$1');
    let max = DatepickerController.getDateOnly(new Date(newValue)),
      selected = DatepickerController.getDateOnly(ctrl.value),
      toReset = false;

    if (max.getTime() < selected.getTime() || !ctrl.value) {
      scope.clearDate();
      toReset = true;
    }

    if (angular.isDate(max)) {
      scope.$broadcast('datepicker.updateMaxDate', {
        maxDate: max,
        selectedDate: angular.isDate(ctrl.value) ? ctrl.value : undefined,
        reset: toReset
      });
    }
  });

  scope.$watch('datepicker.min', (newValue) => {
    if (!newValue) {
      return;
    }
    newValue = newValue.replace(REGEX, '$1');
    let min = DatepickerController.getDateOnly(new Date(newValue)),
      selected = DatepickerController.getDateOnly(ctrl.value),
      toReset = false;

    if (min.getTime() > selected.getTime() || !ctrl.value) {
      scope.clearDate();
      toReset = true;
    }

    if (angular.isDate(min)) {
      scope.$broadcast('datepicker.updateMinDate', {
        minDate: min,
        selectedDate: angular.isDate(ctrl.value) ? ctrl.value : undefined,
        reset: toReset
      });
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
      min: '@?',
      max: '@?',
      format: '@',
      isDisabled: '=?'
    },
    controller: DatepickerController,
    controllerAs: 'datepicker',
    template: template,
    link: linkFn
  };
};
