'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 *
 * @name akamai.components.spinner
 *
 * @description Presents a input spinner and
 * provides user ability to enter, edit, decrement and increment numeric values.
 *
 */
module.exports = angular.module('akamai.components.spinner', [require('../uuid').name])

/**
 * @ngdoc directive
 *
 * @name akamai.components.spinner.directive:akam-spinner
 *
 * @description Create HTML element that contains input and upper array and down arrow buttons
 *
 */
.directive('akamSpinner', require('./spinner-directive'));
