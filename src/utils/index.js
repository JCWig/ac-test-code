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
 * @param {String} text The string that will be displayed to the user
 *
 * @param {boolean} shouldWatch should be present and set to true if it is neccessary
 * to watch the string for changes, tooltip will be rendered when needed. should
 * not be provided if watching is not needed.
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