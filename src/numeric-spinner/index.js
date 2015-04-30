'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 *
 * @name akamai.components.numeric-spinner
 *
 * @description Presents a numeric input spinner and
 * provides user ability to input value, decrement and increment numeric values.
 *
 */
module.exports = angular.module('akamai.components.numeric-spinner', [])

/**
 * @ngdoc directive
 *
 * @name akamai.components.numeric-spinner.directive:akam-numeric-spinner
 *
 * @description Create HTML element that contains input and upper array and down arrow buttons
 *
 */
.directive('akamNumericSpinner', require('./spinner-directive'));
