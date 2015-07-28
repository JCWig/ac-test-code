var angular = require('angular');

/**
 * @ngdoc module
 * @display Date Picker
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

  // decorators for the day and month pickers to add on scope variables for disabling nav
  .config(require('./daypicker-decorator'))

  .config(require('./monthpicker-decorator'))

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
 * @param {String} [disable-clear="false"] A flag to disable clearing
 * of a selected/set date.
 *
 * @param {String} [format="EEE, MMM dd, yyyy" for mode="day" |
 * format="MMM yyyy" for mode="month"] An angular-compatible date
 * format.
 *
 */
  .directive('akamDatePicker', require('./date-picker-directive'));
