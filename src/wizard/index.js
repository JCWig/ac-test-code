'use strict';

var angular = require('angular');

module.exports = angular.module('akamai.components.wizard', [
  require('angular-bootstrap-npm'),
  'ngSanitize'
])
  .factory('wizard', require('./wizard-service'))

  .directive('akamWizardContent', require('./wizard-content-directive'));