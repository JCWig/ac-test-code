var angular = require('angular');

module.exports = function($provide) {

  function timepickerDirective($delegate, $interval) {
    var directive = $delegate[0],
      link,
      minuteUpPromise, minuteDownPromise, hourUpPromise, hourDownPromise,
      DELAY = 200;

    // override the default template for timepicker
    directive.template = require('./templates/time-picker-popup.tpl.html');
    directive.templateUrl = undefined;

    link = directive.link;

    directive.compile = function() {
      return function(scope) {
        link.apply(this, arguments);

        function stop(e, intervalPromise) {
          e.stopPropagation();
          if (angular.isDefined(intervalPromise)) {
            $interval.cancel(intervalPromise);
          }
        }

        //minute up arrow handlers
        scope.minuteUpMouseUp = function(e) {
          stop(e, minuteUpPromise);
          minuteUpPromise = undefined;
        };

        scope.minuteUpMouseDown = function(e) {
          e.stopPropagation();
          if (angular.isDefined(minuteUpPromise)) {
            return;
          }
          minuteUpPromise = $interval(function() {
            scope.incrementMinutes();
          }, DELAY);
        };

        //minute down arrow handlers
        scope.minuteDownMouseUp = function(e) {
          stop(e, minuteDownPromise);
          minuteDownPromise = undefined;
        };

        scope.minuteDownMouseDown = function(e) {
          e.stopPropagation();
          if (angular.isDefined(minuteDownPromise)) {
            return;
          }
          minuteDownPromise = $interval(function() {
            scope.decrementMinutes();
          }, DELAY);
        };

        //hour up arrow handlers
        scope.hourUpMouseUp = function(e) {
          stop(e, hourUpPromise);
          hourUpPromise = undefined;
        };

        scope.hourUpMouseDown = function(e) {
          e.stopPropagation();
          if (angular.isDefined(hourUpPromise)) {
            return;
          }
          hourUpPromise = $interval(function() {
            scope.incrementHours();
          }, DELAY);
        };

        //hour down arrow handlers
        scope.hourDownMouseUp = function(e) {
          stop(e, hourDownPromise);
          hourDownPromise = undefined;
        };

        scope.hourDownMouseDown = function(e) {
          e.stopPropagation();
          if (angular.isDefined(hourDownPromise)) {
            return;
          }
          hourDownPromise = $interval(function() {
            scope.decrementHours();
          }, DELAY);
        };
      };
    };

    return $delegate;
  }

  timepickerDirective.$inject = ['$delegate', '$interval'];

  $provide.decorator('timepickerDirective', timepickerDirective);
};
module.exports.$inject = ['$provide'];