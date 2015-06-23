'use strict';

var angular = require('angular'),
  context = require('../context'),
  dataService = require('./mega-menu-data-service'),
  header = require('./mega-menu-header-directive'),
  footer = require('./mega-menu-footer-directive');

// infamous GA include
require('./utils/ga');

/**
 * @ngdoc overview
 * @name akamai.components.mega-menu
 * @description a module for the old mega menu.
 */
/* @ngInject */
module.exports = angular.module('akamai.components.mega-menu', [
  context.name
])
  .service('megaMenuData', dataService)
  .directive('akamMenuHeader', header)
  .directive('akamMenuFooter', footer);
