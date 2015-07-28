var angular = require('angular');

/**
 * @ngdoc module
 * @display Navigation
 * @name akamai.components.navigation
 *
 * @description Provides a directive that creates a Pulsar-compatible tabbed navigation component
 */
module.exports = angular.module('akamai.components.navigation', [
  require('angular-bootstrap-npm'),
  require('angular-ui-router')
])
/**
 * @ngdoc directive
 *
 * @name akamai.components.navigation.directive:akamNavigation
 *
 * @description Creates a switch button control
 *
 * @restrict E
 *
 * @param {Object[]} tabs An array of tab data objects
 *
 * @param {String} [type='tabs'] Navigation type. Possible values are 'tabs' and 'pills'.
 *
 * @param {Boolean} [justified=false] Whether tabs fill the container and have a consistent width.
 *
 */
  .directive('akamNavigation', require('./navigation-directive'));