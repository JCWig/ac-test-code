import angular from 'angular';
import bootstrap from 'angular-bootstrap-npm';

import i18n from '../i18n';
import uuid from '../uuid';

import dateRangeDirective from './date-range-directive';
import dateRangeService from './date-range-service';
import dateRangeDecorator from './date-range-decorator';

/**
 * @ngdoc overview
 *
 * @name akamai.components.date-range
 *
 * @description Provides a directive that provides user to choose date range
 *
 * @requires module:akamai.components.i18n
 * @requires module:akamai.components.uuid
 *
 * @example date-range.html
 * <akam-date-range
 *   ng-model="vm.dateRange"
 *   format="{vm.format}"
 *   is-disabled="vm.disabled"
 *   on-select="cb(range, start, end)">
 * </akam-date-range></akam-date-range>
 *
 */
export default angular.module('akamai.components.date-range', [
  bootstrap,
  i18n.name,
  uuid.name
])

.config(dateRangeDecorator)
/**
 * @ngdoc service
 *
 * @name akamai.components.date-range.service:dateRangeService
 *
 * @description Provides util functions for date range manipulations for directive and decorator
 */
.factory('dateRangeService', dateRangeService)
/**
 * @ngdoc directive
 *
 * @name akamai.components.date-range.directive:akamDateRange
 *
 * @description Creates a date range picker that wraps one angular bootstrap date picker,
 * expands 2 months view
 *
 * @param {Object} ng-model The dateRange hash contains startDate and endDate properties.
 *
 * @param {string} [format='EEE, MMM dd, yyyy'], format value can be passed in to
 * override the default value
 *
 * @param {Boolean} isDisabled a boolean value can be performed from parent
 * to turn on and off the date range component
 *
 * @param {String} [placeholder='Select Dates'] The placeholder text for the search input field,
 * default value is localized
 *
 * @param {Function} [onSelect] A callback function to parent scope once
 * any changes to start or end date, the value is appended selected date range text
 * and start and end date objects
 *
 */
.directive('akamDateRange', dateRangeDirective);