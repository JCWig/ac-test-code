import angular from 'angular';
import bootstrap from 'angular-bootstrap-npm';

import i18n from '../i18n';
import menuButtonItem from './menu-button-item-directive';
import menuButton from './menu-button-directive';

/**
 * @ngdoc module
 * @name akamai.components.menu-button
 * @description Provides a set of directives to use in order to create Pulsar-compatible menu
 * buttons.
 *
 * @example menu-button.html
 <akam-menu-button>
   <akam-menu-button-item text="examples.appNames.tq" ng-click="..."></akam-menu-button-item>
   <akam-menu-button-item text="examples.appNames.bc" ng-click="..."></akam-menu-button-item>
   <akam-menu-button-item text="examples.appNames.pm" ng-click="..."></akam-menu-button-item>
 </akam-menu-button>
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
 * @param {String} [defaultText] The presence of this attribute will cause the menu button to be
 * rendered as a split button. Note that this means that the default item will not be rendered in
 * the dropdown. This item will be passed through the akam-translate directive so it will be
 * translated.
 *
 * @param {Function} [onClick] Callback for when the button is clicked.
 * @param {*} [isDisabled] Method or property that determines if this item should be disabled.
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
 *   <akam-menu-button default-text="examples.appNames.tq"on-click="vm.process('tq')">
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
 * @example see {@link akamai.components.menu-button.directive:akamMenuButton}
 * @description Creates a menu button item within the menu button
 * control.
 **/
  .directive('akamMenuButtonItem', menuButtonItem);
