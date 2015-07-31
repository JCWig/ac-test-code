var angular = require('angular');

require('../../node_modules/angular-ui-utils/modules/highlight/highlight.js');

/**
 * @ngdoc module
 * @name akamai.components.dropdown
 *
 * @description
 * Dropdown is a button type that on-click, reveals additional content. There are multiple
 * configurations for dropdown that allow for customization based on use case.
 * The default dropdown contains a menu with seven or less items to select from.
 * For larger data sets, there is an dropdown with filter box embedded so users
 * can filter the data set and make a selection. With this option,
 * user also has ability to clear selection.
 *
 * @guideline Use basic dropdown when you have seven or less items to display to user.
 * @guideline Use dropdown with filter and clearing functionality for larger datasets
 * up to 100 items.
 * @guideline When adding icons to dropdowns menu items, make sure icons are of same size.
 *
 * @example index.html
 * <akam-dropdown
 *   ng-model="..."
 *   items="vm.keys"
 *   text-property="vm.state.name"
 *   key-property="vm.state.key"
 *   filterable="name"
 *   clearable>
 * </akam-dropdown>
 *
 * @example index.js
 * // will be injected "as vm"
 * function MyController() {
 *   this.keys = [
 *     {state: {key: 'key1', name: 'Colorado'}},
 *     {state: {key: 'key2', name: 'Connecticut'}},
 *     {state: {key: 'key3', name: 'Maryland'}}
 *   ];
 * }
 *
 */
module.exports = angular.module('akamai.components.dropdown', [
  require('angular-bootstrap-npm'),
  'ngSanitize',
  'ui.highlight',
  require('../i18n').name
])
  .service('dropdownTransformer', require('./dropdown-transformer'))

/**
 * @ngdoc directive
 * @name akamDropdown
 * @description Creates a dropdown control
 * @restrict E
 *
 * @param {Boolean} ngModel The dropdown's selected item.
 *
 * @param {Object[]|String[]} items Option objects for the options displayed
 * in the dropdown's menu box
 *
 * @param {String} [textProperty] If the options param is an array of Objects,
 * this is the property of those objects used in the dropdown menu
 *
 * @param {String} [placeholder=Select one] The placeholder text for the dropdown
 *
 * @param {String} [filterPlaceholder=Filter] The placeholder text for the filter field
 *
 * @param {*} [appendToBody] if present will append dropdown portion to the body
 *
 * @param {Function} [onChange] A callback function that is executed when the
 * state of the dropdown changes
 */
  .directive('akamDropdown', require('./dropdown-directive'));
