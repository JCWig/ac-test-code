import angular from 'angular';
import template from './templates/date-picker.tpl.html';

const [DAY, MONTH] = ['day', 'month'];
const DEFAULT_MORMAT = {
  DAY: 'EEE, MMM dd, yyyy',
  MONTH: 'MMM yyyy'
};

class DatepickerController {
  constructor($filter, $timeout, translate) {
    this.$filter = $filter;
    this.$timeout = $timeout;
    this.translate = translate;

    this.opened = false;
    this.mode = this.mode === DAY || this.mode === MONTH ? this.mode : DAY;

    if (this.mode === DAY) {
      this.translate.async(this.placeholder, null, 'components.date-picker.placeholder.date')
        .then((value) => this.placeholder = value);

      this.dateOptions = {
        startingDay: 0,
        showWeeks: false,
        autoclose: true,
        minMode: DAY,
        maxMode: DAY
      };
    } else {
      this.translate.async(this.placeholder, null, 'components.date-picker.placeholder.month')
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
    this.setMinMaxDate();
  }

  toggle(e) {
    e.preventDefault();
    e.stopPropagation();

    this.opened = !this.opened;
  }

  setMinMaxDate(configuredYearSpan = 50) { //arbitury number
    let date = new Date(),
      minYr = date.getFullYear() - configuredYearSpan,
      maxYr = date.getFullYear() + configuredYearSpan,
      minMo = date.getMonth(),
      maxMo = date.getMonth() + 1,
      minDay = 1, maxDay = 0;


    if (this.min) {
      date = new Date(this.min);
      if (angular.isDate(date)) {
        minYr = date.getFullYear();
        minMo = date.getMonth();
        minDay = date.getDate();
      }
      this.min = new Date(minYr, minMo, minDay);
    }
    if (this.max) {
      date = new Date(this.max);
      if (angular.isDate(date)) {
        maxYr = date.getFullYear();
        maxMo = date.getMonth();
        maxDay = date.getDate();
      }
      this.max = new Date(maxYr, maxMo, maxDay);
    }
  }
}

DatepickerController.$inject = ['$filter', '$timeout', 'translate'];

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
    scope.$broadcast('datepicker.updateMax', {
      max: new Date(newValue)
    });
  });

  scope.$watch('datepicker.min', (newValue) => {
    if (!newValue) {
      return;
    }
    scope.$broadcast('datepicker.updateMin', {
      min: new Date(newValue)
    });
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
