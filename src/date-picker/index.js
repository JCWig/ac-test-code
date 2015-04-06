'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 *
 * @name akamai.components.date-picker
 *
 * @description Provides a directive that creates Luna-
 * and Pulsar-compatible date picker elements.
 *
 */
module.exports = angular.module('akamai.components.date-picker', [
    require('angular-bootstrap-npm'),
    require('../i18n').name
])

.config(function($provide) {
  $provide.decorator('daypickerDirective', function($delegate) {
    var directive = $delegate[0];
    
    directive.template = require('./templates/date-picker-day-popup.tpl.html');
    directive.templateUrl = undefined;
    
    var link = directive.link;

    directive.compile = function() {
      return function(scope, element, attrs, ctrl) {
        link.apply(this, arguments);
        
        //disable navigation according to the range
        scope.daypickerNavPrevDisabled = function(){
            var year = ctrl.activeDate.getFullYear(),
                month = ctrl.activeDate.getMonth(),
                firstDayOfMonth = new Date(year, month, 1);
              
            return ctrl.minDate && (firstDayOfMonth <= ctrl.minDate);
        };
        scope.daypickerNavNextDisabled = function() {
            var year = ctrl.activeDate.getFullYear(),
              month = ctrl.activeDate.getMonth(),
              lastDayOfMonth = new Date(year, month+1, 0);
          
            return ctrl.maxDate && (lastDayOfMonth > ctrl.maxDate); };
      };
    };

    return $delegate;
  });
})

.config(function($provide) {
  $provide.decorator('monthpickerDirective', function($delegate) {
    var directive = $delegate[0];
    
    directive.template = require('./templates/date-picker-month-popup.tpl.html');
    directive.templateUrl = undefined;
    
    var link = directive.link;

    directive.compile = function() {
      return function(scope, element, attrs, ctrl) {
        link.apply(this, arguments);
        
        //disable navigation according to the range
        scope.monthpickerNavPrevDisabled = function(){
            var firstMonth = new Date(ctrl.activeDate.getFullYear(), 0, 1);
            return ctrl.minDate && (firstMonth < ctrl.minDate);
        };
        scope.monthpickerNavNextDisabled =  function() {
            var lastMonth = new Date(ctrl.activeDate.getFullYear(), 11, 1);
            return ctrl.maxDate && (lastMonth > ctrl.maxDate);
        };
      };
    };

    return $delegate;
  });
})

/**
 * @ngdoc directive
 *
 * @name akamai.components.date-picker.directive:akamDatePicker
 *
 * @description Creates a date picker control.
 *
 * @restrict E
 *
 * @param {Date} value The date value. Must be a valid JavaScript
 * `Date` object.
 *
 * @param {String} placeholder Text that displays as the `input`
 * element's placeholder hint.
 *
 * @param {String} [mode="day"] Determines the display mode, either
 * `day` or `month`.
 *
 * @param {Function} onchange The function to call when the value
 * changes.
 *
 * @param {Date} min The earliest date users can select. Any date
 * before this point is disabled.
 *
 * @param {Date} max The latest date users can select. Any date after
 * this point is disabled.
 *
 * @param {String} [format="EEE, MMM dd, yyyy" for mode="day" |
 * format="MMM yyyy" for mode="month"] An angular-compatible date
 * format.
 *
 */
.directive("akamDatePicker", require('./date-picker-directive'));
