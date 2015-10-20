import angular from 'angular';
import uuid from '../uuid';

import spinnerDirective from './spinner-directive';

/**
 * @ngdoc module
 * @name akamai.components.spinner
 * @image spinner
 *
 * @description
 * Spinner box combines a numeric input field and arrow controls to increment or decrement the value
 * in the field. It also accepts keyboard input with filtering to ensure that input is valid and
 * within a defined range.
 *
 * @guideline Use spinner when you want user to be able to control a set of integers that can be
 * incremented or decremented by one.
 *
 * @example index.html
 * <akam-spinner
 *   min="0"
 *   max="99"
 *   custom-step="2"
 *   ng-model="..">
 * </akam-spinner>
 *
 */
export default angular.module('akamai.components.spinner', [
  uuid.name
])

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
 * @param {boolean} disabled a string value intends to disable the spinner if provided, optional.
 * Default is other than String of "disabled". This value is two way bound.
 *
 * @param {Number}[custom-step='1'] Optional a step number intends to increment and decrement
 * spinner.
 *
 */
  .directive('akamSpinner', spinnerDirective);
