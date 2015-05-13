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
 * @param {Number} ngModel input value, it is required to be able to use directive.
 * Two way bind
 *
 * @param {Number} max number value for upper bound of spinner can go, optional.
 * Default is unlimit. One way bind
 *
 * @param {Number} min number value for lower bound limit of spinner can go, optional.
 * Default is unlimit One way bind
 *
 * @param {boolean} disabled a string value intend to disable the spinner if provided, optional.
 * Default is other than String of "disabled". Two way bind
 *
 */
.directive('akamSpinner', require('./spinner-directive'));
