var angular = require('angular'),
  messages = require('angular-messages'),
  sanitize = require('angular-sanitize');

/**
 * @ngdoc module
 * @name akamai.components.table
 * @requires module:ngSanitize
 * @requires module:akamai.components.uuid
 * @requires module:akamai.components.indeterminate-progress
 * @requires module:akamai.components.pagination
 * @requires module:akamai.components.menu-button
 * @requires module:akamai.components.i18n
 * @requires module:akamai.components.utils
 *
 * @description
 * Data table uses labeled rows and columns used to display a collection of structured data.
 * Rows alternate color for readability; this allows the user to follow a row without confusing
 * it with another. Row content can include text, numbers, links, buttons, and images.The data
 * table component can be adapted to specific needs by enabling and disabling functionality.
 *
 * @guideline When the user needs to view, inspect, and access moderate numbers of similarly
 * structured items.
 * @guideline When the user needs to find, filter, or select items.
 * @guideline When you want the full representation of a simple item (e.g., a record with
 * a few attributes) or a summary view of a more complex item
 * (e.g., a grid of complex records identified by name and modification date).
 *
 * @example table.html
 * <akam-table items="rows"
 *   id-property="custom-id-field"
 *   on-change="myRowSelectionCallback(selectedItems)"
 *   selected-items="selectedItems">
 *   <akam-table-toolbar>
 *     <span>Custom toolbar markup here</span>
 *     <i class="my-awesome-icon"></i>
 *   </akam-table-toolbar>
 *   <akam-table-row>
 *     <akam-table-column row-property="id" header-name="my.id">
 *       <span>CUSTOM MARKUP</span>{{ row.id }}
 *     </akam-table-column>
 *   <akam-table-column row-property="name" not-filterable not-sortable header-name="my.name">
 *     {{ row.name }} is awesome
 *   </akam-table-column>
 *   <akam-table-column row-property="street" header-name="my.street"></akam-table-column>
 *   <akam-table-column class="column-action" header-name="my.actions">
 *    <akam-menu-button></akam-menu-button>
 *   </akam-table-column>
 *   </akam-table-row>
 * </akam-table>
 *
 */
module.exports = angular.module('akamai.components.table', [
  sanitize,
  messages,
  require('../uuid').name,
  require('../indeterminate-progress').name,
  require('../pagination').name,
  require('../menu-button').name,
  require('../i18n').name,
  require('../utils').name
])

/**
 * @ngdoc directive
 * @name akamTable
 * @description Creates a data table control. NOTE: If you are using an `<akam-menu-button>`
 * inside of a data table row, then you must put the class ".column-action" on the
 * `<akam-table-column>` in order to achieve UXD approved behavior. See the data table example
 * for a usage example.
 *
 * @restrict E
 *
 * @param {Object[]} items Required data model for the table.
 *
 * @param {String} [id-property='id'] Attribute to use as an ID for the row. This will be used
 * to keep track of selected items, as well as used as the `track by` clause in our ng-repeat.
 * The ID must be unique per row.
 *
 * @param {Function} [on-select] Optional callback that will be called whenever an item is selected.
 * Passes in the entire array of selected items.
 *
 * @param {Function} [on-change] Optional callback that will be called whenever the list of
 * visible rows changes. Passes in the array of rows. This is especially useful if a user needs
 * to make a second, more expensive, AJAX request in order to fetch some more data about the list
 * of visible rows.
 *
 * @param {Array} [selected-items] Optional array of pre-selected rows. Will be two-way data bound
 * so only this or the `on-change` callback is necessary in order to have selectable rows.
 *
 * @param {*} [not-pageable] The presence of this attribute will disable pagination. If it isn't set
 * then pagination is assumed to be on.
 *
 * @param {*} [not-sortable] The presence of this attribute will disable sorting for the entire
 * table. Can also be set on an individual `akam-table-column` to disable sorting for just that
 * column.
 *
 * @param {*} [not-filterable] The presence of this attribute will disable filtering for the entire
 * table. Can also be set on an individual `akam-table-column` to disable filtering for just that
 * column. If this is set on the entire table, it will have the effect of hiding the filter
 * input box.
 *
 * @param {String} [no-items-message] Optional string which is the message that will be displayed
 * when there is no data to display
 *
 * @param {String} [no-filter-results-message] Optional string which is the message that will be
 * displayed when there is no data displayed based upon some filter
 *
 */
  .directive('akamTable', require('./table-directive'))

/**
 * @name akamTableTemplate
 *
 * @description
 * Minimal service to get the inner template, representing the `<table>` element for
 * an akam-data-table.
 */
  .service('akamTableTemplate', require('./table-template-service'));
