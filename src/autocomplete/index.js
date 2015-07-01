'use strict';
var angular = require('angular');

require('../../node_modules/angular-ui-utils/modules/highlight/highlight.js');

/**
 * @ngdoc overview
 *
 * @name akamai.components.autocomplete
 *
 * @requires module:ngSanitize
 * @requires module:akamai.components.i18n
 * @requires module:akamai.components.uuid
 * @requires module:ui.highlight
 *
 * @description Provides a directive that displays typeahead serch result from input control
 */
module.exports = angular.module('akamai.components.autocomplete', [
    require('angular-bootstrap-npm'),
    'ngSanitize',
    'ui.highlight',
    require('../i18n').name,
    require('../uuid').name
  ])
  /**
   * @ngdoc directive
   *
   * @name akamai.components.autocomplete.directive:akamAutocomplete
   *
   * @description Creates a autocomplete search that wraps around Angular Bootstrap Typeahead
   *
   * @restrict E
   *
   * @param {String} ng-model The selected text
   *
   * @param {Array} items string or object array set from backend calls
   *
   * @param {String} [text-property] The property name of item to be displayed
   *
   * @param {String} [content-property] The content file name partial,
   * so it is unique for per directive
   *
   * @param {Number} [minimum-search=1] Minimum character(s) required to search
   *
   * @param {String} [search-tip="Type in text ({n} character) to display matching items"],
   * localizable
   *
   * @param {String} [placeholder=""] The placeholder text for the search input field
   *
   * @param {Function} [onSelect] A callback function to parent scope once
   * search result item selected,the call back param will be string or object of the item selected
   *
   * @param {Function} onSearch A async call function everytime input changes:
   * keydown, paste and etc
   *
   * @param {Boolean} isDisabled a boolean value can be performed from parent
   * to turn on and off the autocomplete component
   *
   */
  .directive('akamAutocomplete', require('./autocomplete-directive'));
