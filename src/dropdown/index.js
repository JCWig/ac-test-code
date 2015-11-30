import angular from 'angular';
import sanitize from 'angular-sanitize';
import angularBootstrap from 'angular-bootstrap-npm';
import i18n from '../i18n';
import dropdownDirective from './dropdown-directive';
import dropdownTemplateService from './dropdown-template-service';
import appendToBodyService from './append-to-body-service';
import indeterminateProgress from '../indeterminate-progress';
import '../../node_modules/angular-ui-utils/modules/highlight/highlight.js';

/**
 * @ngdoc module
 * @name akamai.components.dropdown
 * @image dropdown
 *
 * @description
 * Dropdown is a button type that on-click, reveals additional content. There are multiple
 * configurations for dropdown that allow for customization based on use case.
 *
 * @guideline Use dropdown when you have seven or less items to display to user.
 * @guideline Use dropdown with clearing functionality for larger datasets
 * up to 100 items.
 * @guideline When adding icons to dropdowns menu items, make sure icons are of same size.
 *
 * @example index.html
 * <akam-dropdown
 *   ng-model="..."
 *   items="vm.keys"
 *   text-property="vm.state.name"
 *   key-property="vm.state.key"
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

export default angular.module('akamai.components.dropdown', [
  angularBootstrap,
  sanitize,
  'ui.highlight',
  i18n.name,
  indeterminateProgress.name
])

  .service('dropdownTemplateService', dropdownTemplateService)

  .service('appendToBodyService', appendToBodyService)

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
 * @param {String} [keyProperty] If the options param is an array of Objects,
 * this is the property that is used to bind to ng-model
 *
 * @param {String} [placeholder=Select one] The placeholder text for the dropdown.
 * Placeholder attribute value can be text or translation key.
 * When using custom markup, include <pre>{{dropdown.placeholder}}</pre>
 * to display default placeholder text.
 * If not included, placeholder text will be empty.
 *
 * ```
 * <akam-dropdown>
 *   <akam-dropdown-selected>
 *     <span ng-if="!dropdown.selectedItem" class="dropdown-placeholder">
 *       {{dropdown.placeholder}}
 *     </span>
 *    </akam-dropdown-selected>
 * </akam-dropdown>
 * ```
 *
 * @param {boolean} [is-disabled=false] If disabled, no user interaction will be possible.
 *
 * @param {boolean} [is-readonly=false] If readonly, no user interaction will be possible but the
 * text will be easier to read.
 *
 * @param {String} [filterPlaceholder=Filter] The placeholder text for the filter field
 *
 * @param {*} [appendToBody] if present will append dropdown portion to the body
 *
 * @param {*} [clearable] if present it will display an icon to clear the selected item
 *
 */
  .directive('akamDropdown', dropdownDirective);
