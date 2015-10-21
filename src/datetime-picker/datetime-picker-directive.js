import angular from 'angular';

import template from './templates/datetime-picker.tpl.html';

const REGEX = /^"(.+)"$/;

class DatetimePickerController {
  constructor() {
    this.datetimeValue = undefined;
  }

  setDatetime(d, t) {
    if (!d && !t) {
      return;
    }

    let date = new Date();

    if (!d || !angular.isDate(d)) {
      this.date = date;
    }

    if (!t || !angular.isDate(t)) {
      this.time = date;
    }

    if (this.time) {
      this.date.setHours(this.time.getHours(), this.time.getMinutes());
    }
    this.datetimeValue = this.date;
  }
}

function LinkFn(scope, elem, attr, ngModel) {
  let datetime = scope.datetime;

  if (!ngModel) {
    return;
  }

  scope.dateChanged = (dt) => {
    datetime.setDatetime(dt.date, datetime.time);
    ngModel.$setViewValue(datetime.datetimeValue);
  };

  scope.timeChanged = (dt) => {
    datetime.setDatetime(datetime.date, dt.time || dt.date);
    ngModel.$setViewValue(datetime.datetimeValue);
  };

  ngModel.$render = () => {
    datetime.date = ngModel.$modelValue;
    datetime.time = ngModel.$modelValue;
    datetime.setDatetime(datetime.date, datetime.time);
  };

  scope.$watch('datetime.max', (newValue) => {
    if (!newValue) {
      return;
    }
    if (angular.isDate(newValue)) {
      datetime.max = newValue;
    } else {
      newValue = newValue.replace(REGEX, '$1');
      datetime.max = new Date(newValue);
    }
  });

  scope.$watch('datetime.min', (newValue) => {
    if (!newValue) {
      return;
    }
    if (angular.isDate(newValue)) {
      datetime.min = newValue;
    } else {
      newValue = newValue.replace(REGEX, '$1');
      datetime.min = new Date(newValue);
    }
  });
}

export default () => {
  return {
    restrict: 'E',
    require: '^ngModel',
    controller: DatetimePickerController,
    controllerAs: 'datetime',
    bindToController: {
      format: '@?',
      min: '@?',
      max: '@?',
      minuteStep: '=?',
      hourStep: '=?',
      showMeridian: '=?',
      isDisabled: '=?'
    },
    scope: {},
    link: LinkFn,
    template: template
  };
};
