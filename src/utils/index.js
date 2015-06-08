'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 * @name akamai.components.utils
 * @description Utility methods for the akamai components
 */
module.exports = angular.module('akamai.components.utils', [])
  //TODO: Remember to update this if the version in package.json ever changes
  .constant('VERSION', '0.7.0')

/**
 * @ngdoc directive
 *
 * @name akamai.components.tooltip.directive:akamTextOverflow
 *
 * @description will add a html tooltip if needed to some text
 *
 * @restrict A
 *
 * @param {String} akamTextOverflow Should be set to the value that
 * should be presented in a tooltip if needed. It default watches
 * this value so that if it changes we will update it. To avoid this
 * we recommend one time binding any text that does not change to prevent
 * additional watches.
 *
 */
  .directive('akamTextOverflow', require('./text-overflow-directive.js'))
 /**
 * @ngdoc directive
 *
 * @name akamai.components.tooltip.directive:akamStandalone
 *
 * @description adds an css class (standalone) to the element
 *
 * @restrict A
 *
 */
  .directive('akamStandalone', require('./standalone-directive.js'));