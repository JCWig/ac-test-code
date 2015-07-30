var angular = require('angular');

require('angular-sanitize');

/**
 * @ngdoc module
 * @name akamai.components.list-box
 *
 * @description Provides a directive that creates a Luna- and
 * Pulsar-compatible list box.
 *
 * @example index.html
 * <akam-list-box
 *   data="vm.data"
 *   schema="vm.schema"
 *   filter-placeholder="An already translated string"
 *   no-data-message="Another already translated message">
 * </akam-list-box>
 *
 * @example index.js
 * // will be injected "as vm"
 * function MyController() {
 *   this.data = [
 *     {"id": 1, "firstName": "...", "lastName": "...", "email": "..."},
 *     {"id": 2, "firstName": "...", "lastName": "...", "email": "..."},
 *     {"id": 3, "firstName": "...", "lastName": "...", "email": "..."}
 *   ];
 *
 *   this.schema = [{
 *     header: 'Full Name',
 *     className: 'optional-class',
 *     title: true,   // whether or not to add a title attribute
 *     sort: true,    // whether or not this column is sortable
 *     content: function() {
 *        // the "this" value is a row from "this.data" above
 *        return this.firstName + ' ' + this.lastName;
 *     }, {
 *       header: "Email",
 *       content: "email"     // will just render the "email" attribute
 *     }
 *   }]
 * }
 */
module.exports = angular.module('akamai.components.list-box', [
  'ngSanitize',
  require('../uuid').name,
  require('../indeterminate-progress').name,
  require('../i18n').name,
  require('../utils').name
])

/**
 * @ngdoc directive
 * @name akamListBox
 * @restrict E
 *
 * @description Creates a list box control.
 *
 * @param {Object[]|Promise} data The array of data to show within
 * the listbox.  If `data` is a promise, an indeterminate progress
 * control displays in place of the contents until the promise is
 * resolved or rejected. Note that the data is bound to the table
 * cells with `ng-bind-html` and thus runs through ngSanitize.
 * Any unsafe content that needs to be trusted must run through
 * `$sce.trustAs` on the consumer's side.
 *
 * @param {Array} columns The array of columns that describes the
 * schema to the list box layout and formatting.
 *
 */
  .directive('akamListBox', require('./list-box-directive'))

  .directive('akamInfiniteScroll', require('./infinite-scroll-directive'));
