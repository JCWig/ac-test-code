import angular from 'angular';
import bootstrap from 'angular-bootstrap-npm';

import i18n from '../i18n';
import menuButtonItem from './menu-button-item-directive';
import menuButton from './menu-button-directive';

/**
 * @ngdoc overview
 * @name akamai.components.menu-button
 * @description Provides a set of directives to use in order to create Pulsar-compatible menu
 * buttons.
 */
export default angular.module('akamai.components.menu-button', [
  bootstrap,
  i18n.name
])

/**
 * @ngdoc directive
 * @name akamai.components.menu-button.directive:akamMenuButton
 * @description Creates a menu button control.
 * @restrict E
 *
 * @param {String} [position="left"] Where the dropdown menu should be positioned. Should be either
 * "left" or "right".
 * @param {String} [size="medium"] The size of the button. Can be "small", "medium" or "large".
 *
 * @example
 * <pre>
 *   <akam-menu-button>
 *     <akam-menu-button-item text="examples.appNames.tq" ng-click="vm.process('tq')">
 *       </akam-menu-button-item>
 *     <akam-menu-button-item text="examples.appNames.bc" ng-click="vm.process('bc')">
 *       </akam-menu-button-item>
 *     <akam-menu-button-item text="examples.appNames.pm" ng-click="vm.process('pm')">
 *       </akam-menu-button-item>
 *   </akam-menu-button>
 * </pre>
 *
 * And below is an example of a split button (note the presence of `default-action`).
 * <pre>
 *   <akam-menu-button>
 *     <akam-menu-button-item default-action text="examples.appNames.tq"
 *      ng-click="vm.process('tq')">
 *       </akam-menu-button-item>
 *     <akam-menu-button-item text="examples.appNames.bc" ng-click="vm.process('bc')">
 *       </akam-menu-button-item>
 *     <akam-menu-button-item text="examples.appNames.pm" ng-click="vm.process('pm')">
 *       </akam-menu-button-item>
 *   </akam-menu-button>
 * </pre>
 *
 */
  .directive('akamMenuButton', menuButton)

/**
 * @ngdoc directive
 * @name akamai.components.menu-button.directive:akamMenuButtonItem
 * @restrict E
 *
 * @param {String} [text=""] The text to show for this menu item. It will be passed through the
 * translate function so if it is an i18n key, it will be automatically translated for you.
 *
 * @param {*} [default-action] Determines a default action for this item. If so, a button will be
 * placed next to the dropdown target. When using multiple `akam-menu-button-item`s in an
 * `akam-menu-button`, at most one should be given this attribute. The presence of this attribute
 * turns the regular menu dropdown into a split button dropdown.
 *
 * @example see {@link akamai.components.menu-button.directive:akamMenuButton}
 * @description Creates a menu button item within the menu button
 * control.
 **/
  .directive('akamMenuButtonItem', menuButtonItem);
