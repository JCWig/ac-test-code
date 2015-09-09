import angular from 'angular';

import statusMessageDirective from './status-message-directive';
import statusMessageGroupDirective from './status-message-group-directive';
import statusMessageService from './status-message-service';

/**
 * @ngdoc module
 * @name akamai.components.status-message
 * @image status-message
 *
 * @description
 * Status messages communicate general application information, success, errors or warnings.
 * They can appear the top of the page, below the browser chrome spanning width of page.
 *
 * @guideline Limit status message text to 1 or 2 lines. Text should be brief and to the point.
 * @guideline Allow the user to dismiss a status message immediately.
 * @guideline Show the status message in the user's field of view,
 * but in a way that does not obstruct crucial parts of the workflow.
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
export default angular.module('akamai.components.status-message', [])

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
  .directive('akamStatusMessage', statusMessageDirective)

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
  .directive('akamStatusMessageGroup', statusMessageGroupDirective)

/**
 * @ngdoc service
 *
 * @name statusMessage
 *
 * @description Displays an action's status.
 *
 */
  .factory('statusMessage', statusMessageService);
