var angular = require('angular'),
  sanitize = require('angular-sanitize');

require('../../node_modules/angular-ui-utils/modules/highlight/highlight.js');

/**
 * @ngdoc module
 * @name akamai.components.autocomplete
 *
 * @requires ngSanitize
 * @requires akamai.components.i18n
 * @requires akamai.components.uuid
 * @requires ui.highlight
 *
 * @description
 * Autocomplete is a feature that enables users to quickly find and select information from a
 * pre-populated list. As characters are entered,the system displays matching options in a
 * dropdown menu. The autocomplete component is customizable to show results after one or more
 * haracters are entered. Users have the ability to clear a selection. Dropdown menu has the
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
 *    on-select="fn(item, displayText)"
 *    on-search="fn(term)">
 * </akam-autocomplete>
 *
 */
module.exports = angular.module('akamai.components.autocomplete', [
    require('angular-bootstrap-npm'),
    sanitize,
    'ui.highlight',
    require('../i18n').name,
    require('../uuid').name
  ])
  .constant('autocompleteConfig', {
    ITEMS_TEMPLATE_NAME: 'AKAM-AUTOCOMPLETE-ITEMS',
    SELECTED_ITEM_TEMPLATE_NAME: 'AKAM-AUTOCOMPLETE-SELECTED-ITEM',
    ITEM_TEMPLATE_URL_PARTIAL: '/templates/',
    DEFAULT_TEMPLATE_NAME: 'autocomplete-item.tpl.html',
    CUSTOM_CONTENT: 'akam-autocomplete-item',
    SEARCH_MINIMUM: 1
  })
  /**
   * @ngdoc directive
   *
   * @name akamAutocomplete
   *
   * @description Creates a autocomplete search that wraps around Angular Bootstrap Typeahead
   *
   * @restrict E
   *
   * @param {String} ng-model The selected text
   *
   * @param {String} [text-property] The property name(s) of item to be displayed
   *
   * @param {Number} [minimum-search=1] Minimum character(s) required to search
   *
   * @param {Boolean} [show-search-tip=true] a boolean value can be performed from parent
   * to shoe or hide the search tip (for reason as space issue)
   *
   * @param {Boolean} isDisabled a boolean value can be performed from parent
   * to turn on and off the autocomplete component
   *
   * @param {String} [placeholder=""] The placeholder text for the search input field. This is not
   * run through akamTranslate so the user has to translate this value manually.
   *
   * @param {Function} [onSelect] A callback function to parent scope once
   * search result item selected,the call back param will be
   * item object or string, model and selected text Will be passed `item` and `displayText`.
   *
   * @param {Function} onSearch A async call function every time input changes:
   * keydown, paste and etc. Will be passed `term`.
   *
   */
  .directive('akamAutocomplete', require('./autocomplete-directive'))

  // TODO: write JSDoc for these private items
  .directive('akamAutocompleteItems', require('./autocomplete-items-directive'))
  .directive('akamAutocompleteSelectedItem', require('./autocomplete-selected-item-directive'))
  .factory('autocompleteService', require('./autocomplete-directive-service'));
