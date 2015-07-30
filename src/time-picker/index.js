var angular = require('angular');

/**
 * @ngdoc module
 * @name akamai.components.time-picker
 *
 * @description Provides a directive that creates Luna-
 * and Pulsar-compatible time picker elements.
 *
 * @example index.html
 * <akam-time-picker
 *   ng-model="..."
 *   minute-step="..."
 *   hour-step="..."
 *   is-disabled="..."
 *   show-meridian="...">
 </akam-time-picker>
 *
 */
module.exports = angular.module('akamai.components.time-picker', [
  require('angular-bootstrap-npm')
])

  // decorator for incepting Angular UI time picker to use our custom template
  .config(require('./timepicker-decorator'))

/**
 * @ngdoc directive
 * @name akamTimePicker
 * @restrict E
 *
 * @description Creates a time picker control.
 *
 * @param {String} ngModel - the time value.
 *
 * @param {boolean} [showMeridian=true] - Whether to display 12H or 24H mode.
 *
 * @param {String} [isDisabled=false] - whether to disable the picker input and button or not.
 *
 * @param {Number} [hourStep=1] - increment or decrement the hour value.
 *
 * @param {Number} [minuteStep=15] - increment or decrement the minute value.
 *
 */
  .directive('akamTimePicker', require('./time-picker-directive'))

/**
 * @name timeFormatter
 * @description validate and format the correct display value in input field.
 * @restrict A
 * @param {boolean} showMeridian - bind this value and update view accordingly
 */
  .directive('timeFormatter', require('./time-formatter-directive'));