'use strict';
var angular = require('angular');
require('../../node_modules/angular-ui-utils/modules/highlight/highlight.js');

module.exports = angular.module('akamai.components.dropdown', [
  require('angular-bootstrap-npm'),
  'ngSanitize',
  'ui.highlight'
])
  .service('dropdownTransformer', require('./dropdown-transformer'))

  .directive('akamDropdown', require('./dropdown-directive'));
