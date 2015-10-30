import angular from 'angular';
import template from './templates/time-picker-popup.tpl.html';

function timepickerDecorator($provide) {

  function timepickerDirective($delegate, $interval) {
    let directive = $delegate[0],
      link,
      minuteUpPromise, minuteDownPromise, hourUpPromise, hourDownPromise,
      DELAY = 200;

    // override the default template for timepicker
    directive.template = template;
    directive.templateUrl = undefined;

    link = directive.link;

    directive.compile = () => {
      return function(scope) {
        link.apply(this, arguments);

        function stop(e, intervalPromise) {
          e.stopPropagation();
          if (angular.isDefined(intervalPromise)) {
            $interval.cancel(intervalPromise);
          }
        }

        scope.hoveringOn = '';

        scope.isMinuteDisabled = () => {
          return scope.$parent.timepicker.isMinuteDisabled();
        };

        //minute up arrow handlers
        scope.minuteUpMouseUp = (e) => {
          stop(e, minuteUpPromise);
          minuteUpPromise = undefined;
        };

        scope.minuteUpMouseDown = (e) => {
          e.stopPropagation();
          if (angular.isDefined(minuteUpPromise)) {
            return;
          }
          minuteUpPromise = $interval(() => {
            scope.incrementMinutes();
          }, DELAY);
        };

        //minute down arrow handlers
        scope.minuteDownMouseUp = (e) => {
          stop(e, minuteDownPromise);
          minuteDownPromise = undefined;
        };

        scope.minuteDownMouseDown = (e) => {
          e.stopPropagation();
          if (angular.isDefined(minuteDownPromise)) {
            return;
          }
          minuteDownPromise = $interval(() => {
            scope.decrementMinutes();
          }, DELAY);
        };

        //hour up arrow handlers
        scope.hourUpMouseUp = (e) => {
          stop(e, hourUpPromise);
          hourUpPromise = undefined;
        };

        scope.hourUpMouseDown = (e) => {
          e.stopPropagation();
          if (angular.isDefined(hourUpPromise)) {
            return;
          }
          hourUpPromise = $interval(() => {
            scope.incrementHours();
          }, DELAY);
        };

        //hour down arrow handlers
        scope.hourDownMouseUp = (e) => {
          stop(e, hourDownPromise);
          hourDownPromise = undefined;
        };

        scope.hourDownMouseDown = (e) => {
          e.stopPropagation();
          if (angular.isDefined(hourDownPromise)) {
            return;
          }
          hourDownPromise = $interval(() => {
            scope.decrementHours();
          }, DELAY);
        };
      };
    };

    return $delegate;
  }

  timepickerDirective.$inject = ['$delegate', '$interval'];

  $provide.decorator('timepickerDirective', timepickerDirective);
}

timepickerDecorator.$inject = ['$provide'];
export default timepickerDecorator;