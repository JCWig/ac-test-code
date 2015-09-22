import angular from 'angular';
import sanitize from 'angular-sanitize';
import uuid from '../uuid';
import indeterminateProgress from '../indeterminate-progress';
import i18n from '../i18n';
import utils from '../utils';
import listBoxDirective from './list-box-directive';
import infiniteScrollDirective from './infinite-scroll-directive';

/**
 * @ngdoc module
 * @name akamai.components.list-box
 * @image list-box
 *
 * @description
 * List box allows the user to select one or more items from a list contained within a static,
 * multiple line text box. A list box can uses multiple columns and can present a large data set.
 * It differs from the data grid in using infinite scroll for content rather than pagination.
 * The user can filter the list with the built-in filter box and limit display to
 * only selected items.
 *
 * @guideline Users have several items to manage and need to perform actions on them.
 * @guideline The full list is long and space to display it is limited.
 * @guideline Users need to perform operations on selected items and see the results.
 * @guideline Certain operations can be done on many items at the same time while other operations
 * can only be done on one item at a time.
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
  sanitize,
  uuid.name,
  indeterminateProgress.name,
  i18n.name,
  utils.name
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
 * __NOTE__: There are three types of text messages {string|TranslateKey}
 * user can pass in as APIs: noFilterResultsMessage, noDataMessage,  noneSelectedMessage
 * The component also provides "*-values" attributes for each of above API if any one
 * needs variable replacement. An example:
 * <akam-list-box
 *   data="vm.data"
 *   schema="vm.schema"
 *   filter-placeholder="An already translated string"
 *   no-data-message="no.data.key" no-data-message-values="{'name': 'service'}">
 * </akam-list-box>
 * locale item: {"no.data.key": "No {{}} date provided."}
 * will render: "No service date provided.""
 *
 */
  .directive('akamListBox', listBoxDirective)

  .directive('akamInfiniteScroll', infiniteScrollDirective);
