var angular = require('angular');

/**
 * @ngdoc module
 * @name akamai.components.switch-button
 * @image switch-button
 *
 * @description
 * Switch button is similar to a radio button; it lets the user choose between two values.
 * Traditionally, these values are binary operations: On | Off or Allow | Deny.
 * The switch affordance lets users think of a real-world switch that can toggle between two states.
 *
 * @guideline Use the switch button when you want to provide the user with a simple binary choice.
 * The two choices should be mutually exclusive, for example, color vs. black and white.
 * @guideline Unlike radio buttons, switch buttons cannot operate in a group.
 * If you need more than one switch button, try using groups of radio buttons or checkboxes instead.
 *
 * @example switch-button.html
 * <akam-switch-button
 *   ng-model="..."
 *   size="medium">
 * </akam-switch-button>
 */
module.exports = angular.module('akamai.components.switch-button', [
  require('../i18n').name
])

/**
 * @ngdoc directive
 *
 * @name akamSwitchButton
 *
 * @description Creates a switch button control
 *
 * @restrict E
 *
 * @param {Boolean} ngModel The switch-button's state
 *
 * @param {String} [onLabel=On] The label text for when the
 * switch-button is turned on
 *
 * @param {String} [offLabel=Off] The label text for when the
 * switch-button is turned off
 *
 * @param {Boolean} [disabled=false] If the switch-button should
 * be disabled
 *
 * @param {String} [theme=color] The theme of the switch-button. Can
 * be either 'color' or 'grayscale'.
 *
 * @param {String} [size=small] The size of the switch-button. Can be
 * either 'small' or 'medium'
 */
  .directive('akamSwitchButton', require('./switch-button-directive'));
