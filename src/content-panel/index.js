var angular = require('angular');

/**
 * @ngdoc overview
 *
 * @name akamai.components.content-panel
 *
 * @description Provides a set of directives that create
 * Pulsar-compatible content panels.
 *
 */
module.exports = angular.module('akamai.components.content-panel', [
  require('angular-bootstrap-npm'),
  require('../utils').name
])

/**
 * @ngdoc directive
 *
 * @name akamai.components.content-panel.directive:akamContentPanel
 *
 * @description Creates a content panel control.
 *
 * @restrict E
 *
 * @param {Boolean} [collapsed=false] The panel's collapsed state.
 *
 */
  .directive('akamContentPanel', require('./content-panel-directive'));
