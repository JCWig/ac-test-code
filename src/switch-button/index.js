import angular from 'angular';
import i18n from '../i18n';
import switchButtonDirective from './switch-button-directive';

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
export default angular.module('akamai.components.switch-button', [
  i18n.name
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
 * @param {String|TranslateKey} [onLabel=On] The label text for when the
 * switch-button is turned on
 *
 * @param {String|TranslateKey} [offLabel=Off] The label text for when the
 * switch-button is turned off
 *
 * @param {boolean} [is-disabled=false] If disabled, no user interaction will be possible.
 *
 * @param {boolean} [is-readonly=false] If readonly, no user interaction will be possible but the
 * text will be easier to read.
 *
 * @param {String} [theme=color] The theme of the switch-button. Can
 * be either 'color' or 'grayscale'.
 *
 * @param {String} [size=small] The size of the switch-button. Can be
 * either 'small' or 'medium'
 *
 * __NOTE__: We also provide on-label-values and off-label-values attributes for user to
 * pass in object in the need of variable replacement for translation.
 * Example of usage:
 * <akam-switch-button ng-model="vm.ex8.on"
 *     on-label="examples.switchbutton.custom.label-variable"
 *     on-label-values="{name: 'Allow'}"
 *     off-label="examples.switchbutton.custom.label-variable"
 *     off-label-values = "{name: 'Deny'}">
 * </akam-switch-button>
 * locale table: 'components.switch-button.label.value: {{name}}'
 */
  .directive('akamSwitchButton', switchButtonDirective);
