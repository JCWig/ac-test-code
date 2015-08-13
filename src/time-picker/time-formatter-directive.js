import angular from 'angular';

const formatterConfig = {
  MERIDIAN_ON: 'hh:mm a',
  MERIDIAN_OFF: 'HH:mm',
  TIME_MERIDIAN_REGEX: /^(0?[0-9]|1[0-2]):[0-5][0-9] ?[a|p]m$/i,
  TIME_REGEX: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  APM_REGEX: /[a|p]m/i
};

class TimepickerFormatterController {
  constructor(scope, $filter, $timeout) {
    this.scope = scope;
    this.$filter = $filter;
    this.$timeout = $timeout;

    this.scope.$watch('timepickerFormatter.minuteStep', (newValue) => {
      if (!newValue || isNaN(newValue)) {
        this.minuteStep = 15;
      }
    });

    this.scope.$watch('timepickerFormatter.hourStep', (newValue) => {
      if (!newValue || isNaN(newValue)) {
        this.hourStep = 1;
      }
    });
  }

  parse(value) {
    let sp = value.split(':'),
      apm = sp[1].match(formatterConfig.APM_REGEX),
      hr;

    if (apm) {
      hr = parseInt(sp[0], 10);
      if (hr === 12) {
        hr = 0;
      }
      sp[1] = sp[1].replace(formatterConfig.APM_REGEX, '');
      if (apm[0].toLowerCase() === 'pm') {
        sp[0] = hr + 12;
      }
    }
    return sp;
  }
}

TimepickerFormatterController.$inject = ['$scope', '$filter', '$timeout'];

function linkFn(scope, element, attrs, ngModel) {
  let initialized = false,
    ctrl = scope.timepickerFormatter;

  ngModel = ngModel ? ngModel : {
    $setViewValue: angular.noop
  };

  ngModel.$parsers.push(parseTime);
  ngModel.$formatters.push(displayTime);

  scope.$watch('timepickerFormatter.showMeridian', () => {
    let value = ngModel.$modelValue,
      timeFormat = ctrl.showMeridian ?
      formatterConfig.MERIDIAN_ON : formatterConfig.MERIDIAN_OFF.toLowerCase();

    if (value) {
      element.val(displayTime(value, true));
    }
    element.attr('placeholder', timeFormat);
  });

  function parseTime(value) {
    let timeRegex = formatterConfig.TIME_MERIDIAN_REGEX,
      date = new Date(),
      sp;

    if (initialized) {
      ngModel.$setDirty();
    }

    if (angular.isUndefined(value)) {
      if (!initialized) {
        setTimepickerValidState(true);
        return null;
      } else {
        setTimepickerValidState(false);
        return undefined;
      }
    }

    if (!value) {
      setTimepickerValidState(false);
      return undefined;
    }

    //date is always valid
    if (angular.isDate(value) && !isNaN(value)) {
      setTimepickerValidState(true);
      return value;
    }

    if (!angular.isString(value)) {
      setTimepickerValidState(false);
      return undefined;
    }

    if (!scope.showMeridian) {
      timeRegex = formatterConfig.TIME_REGEX;
    }

    if (!timeRegex.test(value)) {
      setTimepickerValidState(false);
      return undefined;
    }

    setTimepickerValidState(true);
    sp = ctrl.parse(value);
    date.setHours(sp[0], sp[1]);
    return date;
  }

  function displayTime(value) {
    let timeFormat = !ctrl.showMeridian ?
      formatterConfig.MERIDIAN_OFF : formatterConfig.MERIDIAN_ON;

    parseTime(value);
    return ctrl.$filter('date')(value, timeFormat);
  }

  function setTimepickerValidState(state) {
    ngModel.$setValidity('time', state);
  }

  ctrl.$timeout(function() {
    if (!initialized) {
      initialized = true;
    }
  });
}

export default () => {
  return {
    restrict: 'A',
    require: '?ngModel',
    scope: {},
    bindToController: {
      showMeridian: '=',
      minuteStep: '=',
      hourStep: '='
    },
    controller: TimepickerFormatterController,
    controllerAs: 'timepickerFormatter',
    link: linkFn
  };
};
