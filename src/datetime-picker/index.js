import angular from 'angular';
import datePicker from '../date-picker';
import timePicker from '../time-picker';
import datetimePickerDirective from './datetime-picker-directive';

/**
 * @ngdoc module
 * @name akamai.components.datetime-picker
 * @image datetime-picker
 *
 * @requires module:akamai.components.date-picker
 * @requires module:akamai.components.time-picker
 *
 * @description
 * This component is a datetime picker directive that provides functionalities of
 * both date picker and time picker, and provides combined value to the user.
 * It inherits all the APIs and attributes from Date picker and Time picker.
 *
 * @example datetime-picker.html
 * <akam-datetime-picker
 *     ng-model="vm.datetime"
 *     ng-change="vm.onChange()"
 *     format="vm.format"
 *     mode="day"
 *     min="vm.min"
 *     max="vm.max"
 *     minute-step="vm.minuteStep"
 *     hour-step="vm.hourStep"
 *     show-meridian="vm.showMeridian"
 *     placeholder=""
 *     is-disabled="vm.disabled">
 *   </akam-datetime-picker>
 *
 * @example index.js
 * function MyController() {
 *   var vm = this;
 *   vm.disabled = false;
 *   vm.showMeridian = false;
 *   vm.minuteStep = 15;
 *   vm.hourStep = 1;
 *   vm.datetime = new Date();
 *   vm.onChange = function() {
 *     $log.log(vm.datetime);
 *   }
 * }
 */
export default angular.module('akamai.components.datetime-picker', [
  datePicker.name,
  timePicker.name
])

/**
 * @ngdoc directive
 * @name akamDatetimePicker
 * @restrict E
 * @description Creates a datetime picker control.
 *
 * @param {Date} ngModel The javascript date object with date and/or time value if assigned.
 * If ngModel has date value, it will pre-populate corresponding fields.
 * If not ngModel has no date value, it will be undefined, and fields will be empty.
 *
 * @param {Date} min The earliest date users can select. Any date
 * before this point is disabled.
 *
 * @param {Date} max The latest date users can select. Any date after
 * this point is disabled.
 *
 * @param {String} [is-disabled="false"] A flag to disable the control
 *
 * @param {String} [format="EEE, MMM dd, yyyy" An angular-compatible date format.
 *
 *  @param {boolean} [showMeridian=true] - Whether to display 12H or 24H mode.
 *
 * @param {Number} [hourStep=1] - increment or decrement the hour value.
 *
 * @param {Number} [minuteStep=15] - increment or decrement the minute value.
 *
 */
.directive('akamDatetimePicker', datetimePickerDirective);