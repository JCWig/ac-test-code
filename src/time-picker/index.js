import angular from 'angular';
import angularBootstrapNpm from 'angular-bootstrap-npm';
import timepickerDecorator from './timepicker-decorator';
import timepickerDirective from './time-picker-directive';
import timepickerFormatter from './time-formatter-directive';

/**
 * @ngdoc module
 * @name akamai.components.time-picker
 * @image time-picker
 *
 * @description
 * Time selector is an interactive component that allows user to select a time from
 * an interactive dropdown menu. User can select the hour, minute and time of day.
 * The hour and minute controls are configurable and can be displayed in set intervals.
 *
 * @guideline The time picker element is best used when choosing a start or end time for an event.
 *
 * @example index.html
 * <akam-time-picker
 *   ng-model="..."
 *   minute-step="..."
 *   hour-step="..."
 *   is-disabled="..."
 *   show-meridian="...">
 </akam-time-picker>
 *
 */
export default angular.module('akamai.components.time-picker', [
  angularBootstrapNpm
])

  // decorator for incepting Angular UI time picker to use our custom template
  .config(timepickerDecorator)

/**
 * @ngdoc directive
 * @name akamTimePicker
 * @restrict E
 *
 * @description Creates a time picker control.
 *
 * @param {String} ngModel - the time value.
 *
 * @param {boolean} [showMeridian=true] - Whether to display 12H or 24H mode.
 *
 * @param {String} [isDisabled=false] - whether to disable the picker input and button or not.
 *
 * @param {Number} [hourStep=1] - increment or decrement the hour value.
 *
 * @param {Number} [minuteStep=15] - increment or decrement the minute value.
 *
 */
  .directive('akamTimePicker', timepickerDirective)

/**
 * @name timeFormatter
 * @description validate and format the correct display value in input field.
 * @restrict A
 * @param {boolean} showMeridian - bind this value and update view accordingly
 */
  .directive('timeFormatter', timepickerFormatter);