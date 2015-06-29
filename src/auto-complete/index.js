'use strict';
var angular = require('angular');

/**
 * @ngdoc overview
 *
 * @name akamai.components.auto-complete
 *
 * @requires module:ngSanitize
 * @requires module:akamai.components.i18n
 * @requires module:akamai.components.uuid
 * @requires module:ui.highlight
 *
 * @description Provides a directive that displays typeahead serch result from input control
 */
module.exports = angular.module('akamai.components.auto-complete', [
  require('angular-bootstrap-npm'),

  'ngSanitize',
  require('../i18n').name,
  require('../uuid').name
])
/**
 * @ngdoc directive
 *
 * @name akamai.components.auto-complete.directive:akamAutoComplete
 *
 * @description Creates a typeahead search result control
 *
 * @restrict E
 *
 * @param {String} ng-model The selected text
 *
 * @param {Array} items string or object array set from backend calls
 *
 * @param {String} [text-property] The name of item to be displayed
 *
 * @param {String} [search-property] The name of item to be searched by
 *
 * @param {String} [filter-property] The name to be filtered by
 *
 * @param {Number} [minimum-search=1] Minimum character(s) required to search
 *
 * @param {String} [search-tip="Type in text ({n} character) to display matching items"],
 * localizable
 *
 * @param {String} [placeholder=""] The placeholder text for the search input field
 *
 * @param {Function} onSelect A callback function to parent controller once
 * search result item selected,
 * the call back param will be string or object of the item selected
 *
 * @param {Function} [varname] [description]
 */
  .directive('akamAutoComplete', require('./auto-complete-directive'));

