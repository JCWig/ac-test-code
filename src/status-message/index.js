var angular = require('angular');

/**
 * @ngdoc module
 * @name akamai.components.status-message
 *
 * @description Provides a directive that creates Luna- and
 * Pulsar-compatible status messages. These offer users
 * unobtrusive, transient feedback on their actions and emerging
 * system conditions, but without interrupting their workflow.
 *
 * @example status-message.js
 *  var ctrlFunction = function($scope, statusMessage) {
 *    var messageText = "Basic Message Text";
 *    var messageTitle = "Message Title";
 *    $scope.showStatus = function(){
 *      statusMessage.showInformation({text : messageText, title : messageTitle });
 *    };
 *  };
 */
module.exports = angular.module('akamai.components.status-message', [])

/**
 * @name akamStatusMessage
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
 * @name akamStatusMessageGroup
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
 * @ngdoc service
 *
 * @name statusMessage
 *
 * @description Displays an action's status.
 *
 */
  .factory('statusMessage', require('./status-message-service'));
