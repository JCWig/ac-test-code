'use strict';

var angular = require('angular');

module.exports = angular.module('akamai.components.wizard', [
  require('angular-bootstrap-npm'),
  'ngSanitize',
  require('../status-message').name,
  require('../i18n').name
])
  .factory('wizard', require('./wizard-service'))

  .directive('akamWizardContent', require('./wizard-content-directive'));