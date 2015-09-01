import angular from 'angular';
import datePicker from '../date-picker';
import timePicker from '../time-picker';
import datetimePickerDirective from './datetime-picker-directive';

export default angular.module('akamai.components.datetime-picker', [
  datePicker.name,
  timePicker.name
])

.directive('akamDatetimePicker', datetimePickerDirective);