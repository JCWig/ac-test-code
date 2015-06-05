'use strict';

var angular = require('angular');

var formatterConfig = {
  MERIDIAN_ON: 'hh:mm a',
  MERIDIAN_OFF: 'HH:mm',
  TIME_MERIDIAN_REGEX: /^(0?[0-9]|1[0-2]):[0-5][0-9] ?[a|p]m$/i,
  TIME_REGEX: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  APM_REGEX: /[a|p]m/i
};

/* @ngInject */
module.exports = function($filter) {

  var directive = {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      showMeridian: '='
    },
    link: link
  };

  return directive;

  function link(scope, element, attrs, ngModel) {

    ngModel = ngModel ? ngModel : { $setViewValue: angular.noop };

    ngModel.$parsers.push(parseTime);
    ngModel.$formatters.push(displayTime);

    scope.$watch('showMeridian', function() {
      var value = ngModel.$modelValue;

      if (value) {
        element.val(displayTime(value, true));
      }
    });

    function parseTime(value) {

      var timeRegex = formatterConfig.TIME_MERIDIAN_REGEX,
        date = new Date(),
        sp;

      if (angular.isUndefined(value)) {
        setTimepickerValidState(false);
        return undefined;
      }

      //empty or null value is valid
      if (!value) {
        setTimepickerValidState(true);
        return null;
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
        apm = sp[1].match(formatterConfig.APM_REGEX);

      if (apm) {
        sp[1] = sp[1].replace(formatterConfig.APM_REGEX, '');
        if (apm[0].toLowerCase() === 'pm') {
          sp[0] = sp[0] + 12;
        }
      }
      return sp;
    }
  }
};
