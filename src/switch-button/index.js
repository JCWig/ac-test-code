'use strict';
var angular = require('angular');

module.exports = angular.module('akamai.components.switch-button', [])

  .directive('akamSwitchButton', require('./switch-button-directive'));
