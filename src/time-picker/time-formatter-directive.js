var angular = require('angular');

var formatterConfig = {
  MERIDIAN_ON: 'hh:mm a',
  MERIDIAN_OFF: 'HH:mm',
  TIME_MERIDIAN_REGEX: /^(0?[0-9]|1[0-2]):[0-5][0-9] ?[a|p]m$/i,
  TIME_REGEX: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  APM_REGEX: /[a|p]m/i
};

module.exports = function($filter, $timeout) {

  var directive = {
    restrict: 'A',
    require: '?ngModel',
    scope: {
      showMeridian: '=',
      minuteStep: '=',
      hourStep: '='
    },
    link: link
  };

  return directive;

  function link(scope, element, attrs, ngModel) {
    var initialized = false;

    ngModel = ngModel ? ngModel : {
      $setViewValue: angular.noop
    };

    ngModel.$parsers.push(parseTime);
    ngModel.$formatters.push(displayTime);

    scope.$watch('showMeridian', function() {
      var value = ngModel.$modelValue,
        timeFormat = scope.showMeridian ?
          formatterConfig.MERIDIAN_ON : formatterConfig.MERIDIAN_OFF.toLowerCase();

      if (value) {
        element.val(displayTime(value, true));
      }
      element.attr('placeholder', timeFormat);
    });

    scope.$watch('minuteStep', function(newValue) {
      if (!newValue || isNaN(newValue)) {
        scope.minuteStep = 15;
      }
    });

    scope.$watch('hourStep', function(newValue) {
      if (!newValue || isNaN(newValue)) {
        scope.hourStep = 1;
      }
    });

    function parseTime(value) {

      var timeRegex = formatterConfig.TIME_MERIDIAN_REGEX,
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
      sp = parse(value);
      date.setHours(sp[0], sp[1]);
      return date;
    }

    function displayTime(value) {
      var timeFormat = !scope.showMeridian ?
        formatterConfig.MERIDIAN_OFF : formatterConfig.MERIDIAN_ON;

      parseTime(value);
      return $filter('date')(value, timeFormat);
    }

    function setTimepickerValidState(state) {
      ngModel.$setValidity('time', state);
    }

    function parse(value) {
      var sp = value.split(':'),
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

    $timeout(function() {
      if (!initialized) {
        initialized = true;
      }
    });
  }
};
module.exports.$inject = ['$filter', '$timeout'];