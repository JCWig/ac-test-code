import angular from 'angular';
import i18n from '../i18n';
import spinnerButtonDirective from './spinner-button-directive';

/**
 * @ngdoc module
 * @name akamai.components.spinner-button
 * @image spinner-button
 *
 * @description
 * Spinner button is essentially a submit button that, when submitting a form, shows an
 * indeterminate progress spinner per UXD specifications
 *
 * @guideline Use spinner button when you have a form that takes an indeterminate amount of time
 * to process
 *
 * @example index.html
 * <akam-spinner-button processing="true"></akam-spinner-button>
 *
 */
export default angular.module('akamai.components.spinner-button', [
  i18n.name
])

/**
 * @ngdoc directive
 * @name akam-spinner-button
 *
 * @description Create HTML element that contains submit button
 *
 * @param {string} textContent it is text or translationID, so the translated text
 * to show on the button.
 * __NOTE__: Since it can be translationID, we provive option to pass in textContentValues as object
 * for variable replacement if needed.
 *
 * Example of usage if need to have variable replacement from locale file.
 * like: {somekey: "{{firstName}} {{lastName}} just logged in."}
 * <akam-spinner-button text-content="somekey"
 * text-content-values="{firstName: 'Sean', lastName: 'Wang'}"></akam-spinner-button>
 *
 * @param {boolean} disabled if true, sets the button to disabled state.
 * Default is false.
 *
 * @param {boolean} processing if true, disables the button and shows the spinner.
 * Default is false
 *
 */
  .directive('akamSpinnerButton', spinnerButtonDirective);