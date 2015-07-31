var angular = require('angular');

/**
 * @ngdoc module
 * @name akamai.components.modal-window
 *
 * @description
 * Modal window is a type of pop up dialog box overlaid on the current page.
 * It contains a transparent background and a content panel with interactive elements.
 * Modal windows are triggered by user action on the parent page and require user interaction
 * before returning to previous workflow. Content to be presented in modal window is limited to
 * one content panel. Typical usages of modal windows include collecting user input
 * or deliberately interrupting a task flow to provide or collect information.
 *
 * @guideline Use modal windows for required input or a specific task that benefits from
 * being viewed or worked with in isolation.
 * @guideline Use wizard comonent for multi step tasks in workflow.
 *
 * @example index.js
 * function MyController(modalWindow) {
 *   modalWindow.open({
 *    template: '...'
 *   }).result
 *    .then(() => {
 *      // user clicked "ok"
 *    });
 *    .catch(() => {
 *      // user clicked "cancel"
 *    });
 * }
 *
 */
module.exports = angular.module('akamai.components.modal-window', [
  require('angular-bootstrap-npm'),
  require('../status-message').name,
  require('../i18n').name
])

/**
 * @ngdoc service
 * @name modalWindow
 * @description Provides a method to open new modal window instances.
 *
 */
  .factory('modalWindow', require('./modal-window-service'))

/**
 * @name akamModalWindowBody
 * @description Provides directive to display content body section in html.
 */
  .directive('akamModalWindowBody', require('./modal-window-body-directive'));
