import angular from 'angular';
import i18n from '../i18n';
import tagInputDirective from './tag-input-directive';

require('ui-select');

/**
 * @ngdoc module
 * @name akamai.components.tag-input
 * @image tag-input
 *
 * @description
 * Tag input allows users to select pre-existing options, or create free form tags by entering text
 * into input field and inserting space. The predefined input variant allows item selection from
 * a predefined list, and supports autocomplete with tag values as text is entered.
 * The free-form variant allows character entry in the text field and converts text to tags on
 * entry of delimiter characters. It does not use a predefined list.
 * In both variants the set of tags applied is shown in the input field.
 *
 * @guideline Use when content can be pulled from a manageable data set.
 * @guideline Use when the total number of items would be too large to display in a
 * standard drop-down box.
 * @guideline Label the text box to match expectation of what field would be searched against.
 * @guideline Default number of items displayed at one time is seven.
 *
 * @example index.html
 * <akam-tag-input
 *   ng-model="..."
 *   available-items="vm.items"
 *   placeholder="An already translated string"
 *   drag-dropable="true">
 * </akam-tag-input>
 *
 * @example index.js
 * function MyController() {
 *   this.items = ['a', 'b', 'c'];
 * }
 *
 */
module.exports = angular.module('akamai.components.tag-input', [
  'ui.select',
  i18n.name
])

/**
 * @ngdoc directive
 *
 * @name akamTagInput
 *
 * @description Creates a input designed for multiple tags
 *
 * @restrict E
 *
 * @param {String[]} ngModel The strings that have been selected
 *
 * @param {String[]} availableItems The list of strings that
 * will appear as selectable items in a dropdown
 *
 * @param {String} taggingLabel A string which will appear next to
 * a string that is being input
 *
 * @param {Function} sortFunction A function that if given will sort
 * the tags that have been chosen
 *
 * @param {Boolean} dragDroppable A value that represents if the tags
 * can be drag and dropped.
 *
 * @param {String} placeholder A value that will be displayed when no
 * tag have been chosen
 *
 * @param {Boolean} restricted A value that if true will not allow any
 * tags to be input that are not in the available items list.
 *
 * @param {Function} validateFunction A function that will be triggered
 * when a new value is input. It should return true if the input is allowed
 * false is the input is not a valid input, we do not allow blank, undefined or
 * null inputs
 */
  .directive('akamTagInput', tagInputDirective);
