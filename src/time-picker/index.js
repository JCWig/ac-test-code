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
 * @param {string} inputTime - the time value.
 *
 * @param {boolean} show-meridian - Whether to display 12H or 24H mode. default is 12H, param optional.
 *
 * @param {string} disabled - whether to disable the picker input and button or not. Default is enabled. param optional.
 *
 */
.directive('akamTimePicker', require('./time-picker-directive'))

/**
 * @ngdoc directive
 *
 * @name akamai.components.time-picker.directive:timeFormatter
 *
 * @description format the correct disaply value in input field. it is using:
 *
 * ngModel.$parsers.push(func);
 * ngModel.$formatters.push(func);.
 *
 * @restrict A
 *
 * @param {boolean} show-meridian - bind this value and listen to its change, reformat display value once it is changed.
 *
 */
.directive('timeFormatter', require('./time-formatter-directive'));