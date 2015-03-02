'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 *
 * @name akamai.components.date-picker
 *
 * @description Provides a directive to use in order to create Luna and Pulsar compatible date picker elements.
 *
 */
module.exports = angular.module('akamai.components.date-picker', [
        require('angular-bootstrap-npm')
])

/**
 * @ngdoc directive
 *
 * @name akamai.components.date-picker.directive:akamDatePicker
 *
 * @description Creates an date picker control
 *
 * @restrict E
 *
 * @param {Date} value The date value.  Must be a javascript valid Date object.
 * @param {String} placeholder the text to show in the input placeholder
 * @param {String} [mode="day"] Determines the mode to use (day or month are the only valid values).
 * @param {Function} onchange The function to call when the value has been changed
 * @param {Date} min The minimum date (inclusive) that a user can select.  If set, any date before this is disabled.
 * @param {Date} max The maximum date (inclusive) that a user can select.  If set, any date after this is disabled.
 * @param {String} [format="EEE, MMM dd, yyyy" for mode="day" | format="MMM yyyy" for mode="month"] An angular compatible date format
 */
.directive("akamDatePicker", require('./date-picker-directive'));
