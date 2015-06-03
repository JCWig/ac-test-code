'use strict';
var angular = require('angular');

module.exports = angular.module('akamai.components.dropdown', [
  require('angular-bootstrap-npm')
])
  .service('dropdownTransformer', require('./dropdown-transformer'))

  .directive('akamDropdown', require('./dropdown-directive'));
