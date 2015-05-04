'use strict';
var angular = require('angular');

module.exports = angular.module('akamai.components.switch-button', [])

  .directive('akamSwtichButton', require('./switch-button-directive'));

