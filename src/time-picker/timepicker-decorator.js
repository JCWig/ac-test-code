'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($provide) {
  $provide.decorator('timepickerDirective', function($delegate, $interval) {
    var directive = $delegate[0],
      link,
      minuteUpPromise, minuteDownPromise, hourUpPromise, hourDownPromise;

    // override the default template for timepicker
    directive.template = require('./templates/time-picker-popup.tpl.html');
    directive.templateUrl = undefined;

    link = directive.link;

    directive.compile = function() {
      return function(scope) {
        link.apply(this, arguments);

        //minute up arrow handlers
        scope.minuteUpMouseUp = function(e) {
          e.stopPropagation();
          if (angular.isDefined(minuteUpPromise)) {
            $interval.cancel(minuteUpPromise);
            minuteUpPromise = undefined;
          }
        };

        scope.minuteUpMouseDown = function(e) {
          e.stopPropagation();
          if (angular.isDefined(minuteUpPromise)) {
            return;
          }
          minuteUpPromise = $interval(function() {
            scope.incrementMinutes();
          }, 200);
        };

        //minute down arrow handlers
        scope.minuteDownMouseUp = function(e) {
          e.stopPropagation();
          if (angular.isDefined(minuteDownPromise)) {
            $interval.cancel(minuteDownPromise);
            minuteDownPromise = undefined;
          }
        };

        scope.minuteDownMouseDown = function(e) {
          e.stopPropagation();
          if (angular.isDefined(minuteDownPromise)) {
            return;
          }
          minuteDownPromise = $interval(function() {
            scope.decrementMinutes();
          }, 200);
        };

        //hour up arrow handlers
        scope.hourUpMouseUp = function(e) {
          e.stopPropagation();
          if (angular.isDefined(hourUpPromise)) {
            $interval.cancel(hourUpPromise);
            hourUpPromise = undefined;
          }
        };

        scope.hourUpMouseDown = function(e) {
          e.stopPropagation();
          if (angular.isDefined(hourUpPromise)) {
            return;
          }
          hourUpPromise = $interval(function() {
            scope.incrementHours();
          }, 200);
        };

        //hour down arrow handlers
        scope.hourDownMouseUp = function(e) {
          e.stopPropagation();
          if (angular.isDefined(hourDownPromise)) {
            $interval.cancel(hourDownPromise);
            hourDownPromise = undefined;
          }
        };

        scope.hourDownMouseDown = function(e) {
          e.stopPropagation();
          if (angular.isDefined(hourDownPromise)) {
            return;
          }
          hourDownPromise = $interval(function() {
            scope.incrementHours();
          }, 200);
        };
      };
    };

    return $delegate;
  });
};
