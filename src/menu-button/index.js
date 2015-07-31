import angular from 'angular';
import bootstrap from 'angular-bootstrap-npm';

import i18n from '../i18n';
import menuButtonItem from './menu-button-item-directive';
import menuButton from './menu-button-directive';

/**
 * @ngdoc module
 * @name akamai.components.menu-button
 * @description
 * Menu button is similar to the action button. Like the action button,
 * the menu button is used to initiate actions. A menu button on click has a dropdown menu
 * with actions a user can take. Clicking a list item initiates an action.
 *
 * @guideline Like action buttons, the most important usage tip for a menu button is to initiate
 * or complete actions, rather than to use as a navigational element.
 * @guideline Use menu button for related actions—placing items in a menu implies
 * that the actions are similar in some way.
 * @guideline Do not confuse the menu button with the similar-looking combo box,
 * which is used to select an option rather than to perform an action.
 *
 * @example menu-button.html
 * <akam-menu-button>
 *   <akam-menu-button-item text="an.i18n.key" ng-click="..."></akam-menu-button-item>
 *   <akam-menu-button-item text="..." ng-click="..."></akam-menu-button-item>
 *   <akam-menu-button-item text="..." ng-click="..."></akam-menu-button-item>
 * </akam-menu-button>
 *
 *  <!-- and for a split button -->
 *  <akam-menu-button default-text="examples.appNames.tq" on-click="vm.process('tq')">
 *    <!-- same as above -->
 *    <akam-menu-button-item></akam-menu-button-item>
 *  </akam-menu-button>
 */
export default angular.module('akamai.components.menu-button', [
  bootstrap,
  i18n.name
])

/**
 * @ngdoc directive
 * @name akamMenuButton
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
 */
  .directive('akamMenuButton', menuButton)

/**e
 * @name akamMenuButtonItem
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
