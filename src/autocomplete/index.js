import angular from 'angular';
import dropdown from '../dropdown';
import autocompleteDirective from './autocomplete-directive';
import indeterminateProgress from '../indeterminate-progress';

/**
 * @ngdoc module
 * @name akamai.components.autocomplete
 * @image autocomplete
 *
 * @requires akamai.components.dropdown
 *
 * @description
 * Autocomplete is a feature that enables users to quickly find and select information from a
 * pre-populated list. As characters are entered, the control displays matching options in a
 * dropdown menu. The autocomplete control is customizable to show results after one or more
 * characters are entered. Users also have the ability to clear a selection. The dropdown menu has
 * the ability to display icons and images in addition to alphanumeric characters.
 *
 * @guideline Use when content can be pulled from a manageable data set.
 * @guideline Use when the total number of items would be too large to display in a standard
 * dropdown box.
 * @guideline Label the text box to match expectation of what field would be searched against.
 * @guideline Default number of items displayed at one time is seven.
 *
 * @example index.html
 * <akam-autocomplete ng-model="vm.selectedItem"
 *                    on-search="fn(searchTerm)
 *                    text-property="name"
 *                    key-property="itemId"
 *                    minimum-search="0"
 *                    placeholder="an.i18n.key"
 *                    is-disabled="vm.isDisabled"
 *                    is-readonly="vm.isReadonly"
 *                    appended-to-body
 *                    clearable
 *                    autofocus>
 * </akam-autocomplete>
 *
 */
export default angular.module('akamai.components.autocomplete', [
  dropdown.name,
  indeterminateProgress.name
])

/**
 * @ngdoc directive
 *
 * @name akamAutocomplete
 *
 * @description Creates an autocomplete control
 *
 * @restrict E
 *
 * @param {Object|String} ng-model The autocomplete's selected item.
 *
 * @param {Function} on-search A function that will be called when the input changes. The values
 * returned will be used to populate the dropdown menu. The function will be passed `searchTerm` as
 * an argument. The function can return a `Promise` or an `Array` of either objects or strings.
 *
 * @param {String} [text-property] This attribute is only applicable and required when search
 * results are objects. It defines the property used for rendering the selected item and search
 * results. The search result values must be unique. `text-property` can be nested and will be
 * parsed accordingly (e.g. `text-property="foo.bar.label"`).
 *
 * @param {String} [key-property] This attribute is only applicable when search results are
 * objects. If `key-property` is defined, the corresponding property for the selected object is
 * bound to `ng-model`. If `key-property` is not defined, the selected object itself is bound to
 * `ng-model`.
 *
 * @param {Integer} [minimum-search=0] The minimum number of characters required to search.
 * The default value is 0 which calls `on-search` when the search field is focused.
 *
 * @param {String} [placeholder=Select one] The placeholder text for the search field. The value
 * can either be text or an i18n key. When using custom markup, include
 * `{{autocomplete.placeholder}}` to display the default placeholder text.
 *
 * ```
 * <akam-autocomplete>
 *   <akam-autocomplete-selected>
 *     <span ng-if="!dropdown.selectedItem" class="dropdown-placeholder">
 *       {{autocomplete.placeholder}}
 *     </span>
 *    </akam-autocomplete-selected>
 * </akam-dropdown>
 * ```
 *
 * @param {boolean} [is-disabled=false] If disabled, no user interaction will be possible.
 *
 * @param {boolean} [is-readonly=false] If readonly, no user interaction will be possible but the
 * text will be easier to read.
 *
 * @param {*} [appended-to-body] If present, the dropdown menu will be appended to the body. Use
 * this when using autocomplete in a container with `overflow: hidden`.
 *
 * @param {*} [clearable] If present, the selected item will be clearable.
 *
 * @param {*} [autofocus] If present, the search field will be auto-focused.
 *
 */
.directive('akamAutocomplete', autocompleteDirective);
