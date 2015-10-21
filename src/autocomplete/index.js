import angular from 'angular';
import dropdown from '../dropdown';
import autocompleteDirective from './autocomplete-directive';

/**
 * @ngdoc module
 * @name akamai.components.autocomplete
 * @image autocomplete
 *
 * @requires akamai.components.dropdown
 *
 * @description
 * Autocomplete is a feature that enables users to quickly find and select information from a
 * pre-populated list. As characters are entered,the system displays matching options in a
 * dropdown menu. The autocomplete component is customizable to show results after one or more
 * characters are entered. Users have the ability to clear a selection. Dropdown menu has the
 * ability to display icons and images in addition to alphanumeric characters.
 *
 * @guideline Use when content can be pulled from a manageable data set.
 * @guideline Use when the total number of items would be too large to display in a standard
 * dropdown box.
 * @guideline Label the text box to match expectation of what field would be searched against.
 * @guideline Default number of items displayed at one time is seven.
 *
 * @example index.html
 * <akam-autocomplete ng-model="..." text-property="name"
 *    placeholder="an already translated value"
 *    on-search="fn(term)">
 * </akam-autocomplete>
 *
 */
export default angular.module('akamai.components.autocomplete', [
  dropdown.name
])

/**
 * @ngdoc directive
 *
 * @name akamAutocomplete
 *
 * @description Creates an autocomplete search
 *
 * @restrict E
 *
 * @param {Boolean} ngModel The autocomplete's selected item.
 *
 * @param {Function} [onSearch] A function that will be called when the input changes.
 * It will be passed `searchTerm` as an argument.
 *
 * @param {String} [textProperty] If the options param is an array of Objects,
 * this is the property of those objects used in the dropdown menu
 *
 * @param {String} [keyProperty] If the options param is an array of Objects,
 * this is the property that is used to bind to ng-model.
 *
 * @param {Integer} [minimuim-search=1] The minimum character(s) required to search.
 * It can be set to 0, it should display results automatically on focus with restrained by
 * normal upbound limit.
 *
 * @param {String} [placeholder=Select one] The placeholder text for the autocomplete.
 * Placeholder attribute value can be text or translation key.
 * When using custom markup, include <pre>{{autocomplete.placeholder}}</pre>
 * to display default placeholder text.
 * If not included, placeholder text will be empty.
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
 **
 * @param {*} [appendToBody] if present will append dropdown portion to the body
 *
 * @param {*} [clearable] if present it will display an icon to clear the selected item
 *
 */
.directive('akamAutocomplete', autocompleteDirective);
