'use strict';

var angular = require('angular');

module.exports = angular.module('akamai.components.tooltip', [
  'ngSanitize',
  require('angular-bootstrap-npm')
])

.directive('akamTooltip', require('./tooltip-directive'));
