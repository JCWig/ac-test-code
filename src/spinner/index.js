var angular = require('angular');

/**
 * @ngdoc module
 * @name akamai.components.spinner
 *
 * @description Presents a input spinner and
 * provides user ability to enter, edit, decrement and increment numeric values.
 *
 * @example index.html
 * <akam-spinner
 *   min="0"
 *   max="99"
 *   ng-model="..">
 * </akam-spinner>
 *
 */
module.exports = angular.module('akamai.components.spinner', [require('../uuid').name])

/**
 * @ngdoc directive
 * @name akam-spinner
 *
 * @description Create HTML element that contains input and upper array and down arrow buttons
 *
 * @param {Number} ngModel input value, it is required to be able to use directive.
 * This value is two way bound.
 *
 * @param {Number} max number value for upper bound of spinner can go, optional.
 * Default is unlimited. This value is one way bound.
 *
 * @param {Number} min number value for lower bound limit of spinner can go, optional.
 * Default is unlimited. This value is one way bound.
 *
 * @param {boolean} disabled a string value intend to disable the spinner if provided, optional.
 * Default is other than String of "disabled". This value is two way bound.
 *
 */
  .directive('akamSpinner', require('./spinner-directive'))

/**
 * @name spinnerService
 * @description a factory service implements the logic of validation of inputs
 * and max | min checking for akamSpinner directive
 */
  .factory('spinnerService', require('./spinner-service'));
