'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 * @name akamai.components.utils
 * @description Utility methods for the akamai components
 */
module.exports = angular.module('akamai.components.utils', [])
  //TODO: Remember to update this if the version in package.json ever changes
  .constant('VERSION', '0.6.0');