import angular from 'angular';
import 'sortablejs';
import 'sortablejs/ng-sortable';
import dropdown from '../dropdown';

import tagInputDirective from './tag-input-directive';

/**
 * @ngdoc module
 * @name akamai.components.tag-input
 * @image tag-input
 *
 * @description
 * Tag input allows users to select pre-existing tags or create free form tags by entering text
 * into an input field. The predefined input variant allows tag selection from
 * a predefined list of tags and supports autocomplete with tag values as text is entered.
 * The free-form variant allows character entry into a text field and parses text to tags via
 * configurable delimiter characters. New tags do not need to exist in a pre-defined list.
 * In both variants the set of tags applied is shown in the tag-input control.
 *
 * @guideline Use when content can be pulled from a manageable data set.
 * @guideline Use when the total number of items would be too large to display in a
 * standard drop-down box.
 * @guideline Label the text box to match expectation of what field would be searched against.
 * @guideline Default number of items displayed at one time is seven.
 *
 * @example index.html
 * <akam-tag-input>
 *   ng-model="vm.selectedTags"
 *   items="vm.menuTags"
 *   is-draggable
 *   restricted
 *   stacked
 *   appended-to-body
 *   delimiters="[',', ':', 'TAB', 'ENTER']"
 *   text-property="name"
 *   placeholder="Enter tags"
 *   new-tag-label="(new)"
 *   is-disabled="vm.tagInputDisabled"
 *   is-read-only="vm.is-read-only"
 *   on-sort="vm.sortSelectedTags(tags)"
 *   on-validate="vm.validateTag(tag)">
 * </akam-tag-input>
 *
 */
export default angular.module('akamai.components.tag-input', [
  dropdown.name,
  'ng-sortable'
])

/**
 * @ngdoc directive
 * @name akamTagInput
 * @restrict E
 *
 * @description Creates a tag-input control
 *
 * @param {Object[]|String[]} ngModel A list of selected tags. Should be unique.
 *
 * @param {Object[]|String[]|Promise} items A list of menu tags. Must be unique.
 *
 * @param {*} [is-draggable=false] If the selected tags can be dragged and dropped. This attribute
 * should not be used in conjunction with the onSort attribute.
 *
 * @param {*} [restricted=false] If new tags are restricted to tags within the list of menu tags.
 *
 * @param {*} [appended-to-body=false] If the menu of tags is appended to the body. Use this
 * attribute when tag-input is encloded in an element with `overflow:hidden`.
 *
 * @param {*} [stacked=false] If the menu tags are stacked on top of each other instead of
 * inline next to each other.
 *
 * @param {String[]} [delimiters=[',', 'TAB', 'ENTER']] The delimiters used to parse user entered
 * values. String values for 'Tab' and 'Enter' are accepted. The delimiters can be mixed and each
 * delimiter will be considered the same for parsing purposes. Users can enter multiple tags at
 * once by pasting a value containing delimiters into the input field.
 *
 * @param {String} [text-property=''] If the selected and menu tags are objects, this property
 * must be supplied. It is the property used to retrieve the tag label. The property can be nested
 * e.g. `testProperty="user.name.lastName"`
 *
 * @param {String} [placeholder='Select items'] This text is displayed when no selected tags
 * have been selected. If a translation key is provided, it will be translated.
 *
 * @param {String} [new-tag-label="(new item)"] When tag-input is not in `restricted` mode and while
 * the user is entering a new tag, this value will be displayed at the top of the menu alongside
 * the user entered value. If a translation key is provided, it will be translated.
 *
 * @param {Boolean} [is-disabled=false] If tag-input is disabled. No user interaction will be
 * possible.
 *
 * @param {Boolean} [is-read-only=false] If tag-input is readOnly. No user interaction will be
 * possible.
 *
 * @param {Function} [on-sort] This expression attribute will be used to keep the list of selected
 * tags sorted. The function must have a `tags` argument `function sortSelectedTags(tags)`. Note:
 * this function shouldn't be supplied if the tag-input is draggable.
 *
 * @param {Function} [on-validate] This expression attribute will be used to validate each selected
 * tag. The function must have a `tag` argument. `function validateTag(tag)`. The validator key
 * is `validTags`.
 *
 */
  .directive('akamTagInput', tagInputDirective);