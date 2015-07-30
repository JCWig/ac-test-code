var angular = require('angular');

/**
 * @ngdoc module
 * @name akamai.components.switch-button
 *
 * @description Provides a directive that creates a Luna- and
 * Pulsar-compatible switch button.
 *
 * @example switch-button.html
  <akam-switch-button ng-model="vm.on" size="medium"></akam-switch-button>
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
