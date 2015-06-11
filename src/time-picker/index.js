'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 *
 * @name akamai.components.time-picker
 *
 * @description Provides a directive that creates Luna-
 * and Pulsar-compatible time picker elements.
 *
 */
module.exports = angular.module('akamai.components.time-picker', [
  require('angular-bootstrap-npm')
])

  // decorator for incepting Angular UI time picker to use our custom template
  .config(require('./timepicker-decorator'))

/**
 * @ngdoc directive
 *
 * @name akamai.components.time-picker.directive:akamTimePicker
 *
 * @description Creates a time picker control.
 *
 * @restrict E
 *
 * @param {String} inputTime - the time value.
 *
 * @param {boolean} [showMeridian=true] - Whether to display 12H or 24H mode.
 *
 * @param {String} [disabled=false] - whether to disable the picker input and button or not.
 *
 * @param {Number} [hourStep=1] - increment or decrement the hour value.
 *
 * @param {Number} disabled - [minuteStep=15] - increment or decrement the minute value.
 *
 */
.directive('akamTimePicker', require('./time-picker-directive'))

/**
 * @ngdoc directive
 *
 * @name akamai.components.time-picker.directive:timeFormatter
 *
 * @description validate and format the correct display value in input field.
 *
 * @restrict A
 *
 * @param {boolean} showMeridian - bind this value and update view accordingly
 *
 * @private
 *
 */
.directive('timeFormatter', require('./time-formatter-directive'));