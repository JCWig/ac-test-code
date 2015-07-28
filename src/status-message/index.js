var angular = require('angular');

/**
 * @ngdoc module
 * @display Status Message
 * @name akamai.components.status-message
 *
 * @description Provides a directive that creates Luna- and
 * Pulsar-compatible status messages. These offer users
 * unobtrusive, transient feedback on their actions and emerging
 * system conditions, but without interrupting their workflow.
 *
 */
module.exports = angular.module('akamai.components.status-message', [])

/**
 * @ngdoc directive
 *
 * @name akamai.components.status-message.directive:akamStatusMessage
 *
 * @description Creates a status message control.
 *
 * @restrict E
 *
 * @param {String} text The required text to display.
 *
 */
  .directive('akamStatusMessage', require('./status-message-directive'))

/**
 * @ngdoc directive
 *
 * @name akamai.components.status-message.directive:akamStatusMessageGroup
 *
 * @description Creates a status message group control.
 *
 * @restrict E
 *
 * @param {Array} [items=empty array] Status message object items
 * to display.
 *
 */
  .directive('akamStatusMessageGroup', require('./status-message-group-directive'))

/**
 * @ngdoc object
 *
 * @name akamai.components.status-message.statusMessage
 *
 * @object
 *
 * @description Displays an action's status.
 *
 */
  .factory('statusMessage', require('./status-message-service'));
