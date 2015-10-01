import angular from 'angular';
import bootstrap from 'angular-bootstrap-npm';

import i18n from '../i18n';
import uuid from '../uuid';

import dateRangeDirective from './date-range-directive';
import dateRangeService from './date-range-service';
import dateRangeDecorator from './date-range-decorator';
import datepickerPopupTemplate from './templates/popup.tpl.html';

function run($templateCache) {
  /*
  Overide angular-ui bootstrap's datepicker popup template
  0.13.3 changed popup template to include ng-if which as a result broke binding in date-range
  Using popup template from 0.13.0 since it uses ng-show instead of ng-if
  */
  $templateCache.put('template/datepicker/popup.html', datepickerPopupTemplate);
}
run.$inject = ['$templateCache'];

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
 *   min-date="vm.min"
 *   max-date="vm.max"
 *   on-select="cb(range, start, end)">
 * </akam-date-range>
 *
 */
export default angular.module('akamai.components.date-range', [
  bootstrap,
  i18n.name,
  uuid.name
])

.run(run)

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
 * @param {String} The min date is iso format date string (2015-8-1),
 * it can dynamically change min date calendar setting.
 *
 * @param {String} The min date is iso format date string (2017-7-31),
 * it can dynamically change max date calendar setting.
 *
 * @param {Function} [onSelect] A callback function to parent scope once
 * any changes to start or end date, the value is appended selected date range text
 * and start and end date objects
 *
 */
.directive('akamDateRange', dateRangeDirective);