'use strict';
var angular = require('angular');


module.exports = angular.module('akamai.components.navigation', [
  require('angular-bootstrap-npm')
])
  .directive('akamNavigation', require('./navigation-directive'));
