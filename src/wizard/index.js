var angular = require('angular');

/**
 * @ngdoc module
 * @display Wizard
 * @name akamai.components.wizard
 * @requires module:angular-bootstrap-npm
 * @requires module:ngSanitize
 * @requires module:akamai.components.status-message
 * @requires module:akamai.components.i18n
 * @description Provides a service that creates a wizard.
 */
module.exports = angular.module('akamai.components.wizard', [
  require('angular-bootstrap-npm'),
  require('../status-message').name,
  require('../i18n').name
])

/**
 * @ngdoc service
 * @name akamai.components.wizard.service:wizard
 *
 * @description
 * A service that opens a wizard
 */
  .factory('wizard', require('./wizard-service'))

/**
 * @private
 * @ngdoc directive
 * @name akamai.components.wizard.directive:akamWizardContent
 *
 * @description
 * A simple directive that injects step templates into the body of the wizard
 */
  .directive('akamWizardContent', require('./wizard-content-directive'));