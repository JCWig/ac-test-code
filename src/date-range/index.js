var angular = require('angular');

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
 */
module.exports = angular.module('akamai.components.date-range', [
    require('angular-bootstrap-npm'),
    require('../i18n').name,
    require('../uuid').name
  ])
  .config(require('./daterange-decorator'))
  /**
   * @ngdoc service
   *
   * @name akamai.components.date-range.service:dateRangeService
   *
   * @description Provides util functions for dates range manipulations for directive
   */
  .factory('dateRangeService', require('./date-range-service'))
  /**
   * @ngdoc directive
   *
   * @name akamai.components.date-range.directive:akamDateRange
   *
   * @description Creates a date range picker that wraps 2 angular bootstrap date picker
   *
   * @param {String} ng-model The selected date ranger
   *
   * @param {String} [start-date=''] value can be empty or pre populate the start date range value
   *
   * @param {String} [end-date=''] value can be empty or pre populate the end date range value
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
   *
   * @param {Function} onSearch A async call function everytime input changes:
   * keydown, paste and etc
   *
   */
  .directive('akamDateRange', require('./date-range-directive'));
