var angular = require('angular');

/**
 * @ngdoc module
 * @name akamai.components.navigation
 *
 * @description Provides a directive that creates a Pulsar-compatible tabbed navigation component
 *
 * @example app.js
 * function configFunction($stateProvider) {
 *
 *   // ui-router $stateProvider
 *   $stateProvider.state('health', {
 *     url:         '/',
 *     controller: 'SomeController',
 *     controllerAs: 'some',
 *     templateUrl: 'some.html'
 *   });
 * }
 *
 * function SomeController() {
 *
 *   this.tabData = [{
 *     heading: 'A Heading',
 *     route:   'some.state'
 *   },{
 *     heading: 'Another Heading',
 *     route:   'some.otherState'
 *   }];
 * }
 *
 * @example some.html
 * <akam-navigation data="some.tabData"></akam-navigation>
 *
 */
module.exports = angular.module('akamai.components.navigation', [
  require('angular-bootstrap-npm'),
  require('angular-ui-router')
])
/**
 * @ngdoc directive
 * @name akamNavigation
 * @restrict E
 *
 * @description Creates a navigation control
 *
 * @param {Object[]} tabs An array of tab data objects
 *
 * @param {String} [type='tabs'] Navigation type. Possible values are 'tabs' and 'pills'.
 *
 * @param {Boolean} [justified=false] Whether tabs fill the container and have a consistent width.
 *
 */
  .directive('akamNavigation', require('./navigation-directive'));