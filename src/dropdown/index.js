var angular = require('angular');

require('../../node_modules/angular-ui-utils/modules/highlight/highlight.js');

/**
 * @ngdoc overview
 * @name akamai.components.dropdown
 *
 * @description Provides a directive that creates a Luna and Pulsar-compatible dropdown control.
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
