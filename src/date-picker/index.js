import angular from 'angular';
import angularBootstrap from 'angular-bootstrap-npm';
import i18n from '../i18n';
import datepickDayDecorator from './daypicker-decorator';
import datepickMonthDecorator from './monthpicker-decorator';
import detepickerDirective from './date-picker-directive';
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
 * @ngdoc module
 * @name akamai.components.date-picker
 * @image date-picker
 *
 * @description
 * Date selector is an interactive calendar component that allows user to select a date
 * from a month view. User has the ability to clear a selected date.
 *
 * @guideline When you want to include a date input that requires specific formatting.
 *
 * @example day-picker.html
 * <akam-date-picker
 *   mode="day"
 *   ng-model="..."
 *   min="..."
 *   max="..."
 *   ng-change="..."
 *   format="..."
 *   is-disabled="...">
 * </akam-date-picker>
 *
 * @example month-picker.html
 * <akam-date-picker
 *  mode="month"
 *  ng-model="..."
 *  min="..."
 *  max="..."
 *  ng-change="..."
 *  format="..."
 *  no-clear>
 * </akam-date-picker>
 */
export default angular.module('akamai.components.date-picker', [
  angularBootstrap,
  i18n.name
])

  .run(run)

  // decorators for the day pickers to add on scope variables for disabling nav
  .config(datepickDayDecorator)

  // decorators for the month pickers to add on scope variables for disabling nav
  .config(datepickMonthDecorator)

/**
 * @ngdoc directive
 *
 * @name akamDatePicker
 *
 * @description Creates a date picker control.
 *
 * @restrict E
 *
 * @param {Date} value The date value. Must be a valid JavaScript
 * `Date` object.
 *
 * @param {String} placeholder Text that displays as the `input`
 * element's placeholder hint.
 *
 * @param {String} [mode="day"] Determines the display mode, either
 * `day` or `month`.
 *
 * @param {Function} onchange The function to call when the value
 * changes.
 *
 * @param {Date} min The earliest date users can select. Any date
 * before this point is disabled.
 *
 * @param {Date} max The latest date users can select. Any date after
 * this point is disabled.
 *
 * @param {String} [disable-clear="false"] A flag to disable clearing
 * of a selected/set date.
 *
 * @param {String} [format="EEE, MMM dd, yyyy" for mode="day" |
 * format="MMM yyyy" for mode="month"] An angular-compatible date
 * format.
 *
 */
  .directive('akamDatePicker', detepickerDirective);
