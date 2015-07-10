var angular = require('angular');

module.exports = angular.module('akamai.components.navigation', [
  require('angular-bootstrap-npm'),
  'ngSanitize',
  require('angular-ui-router')
])
  .directive('akamNavigation', require('./navigation-directive'));