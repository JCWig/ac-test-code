import angular from 'angular';
import angularUI from 'angular-bootstrap-npm';
import statusMessage from '../status-message';
import i18n from '../i18n';
import spinnerButton from '../spinner-button';

import modalWindowService from './modal-window-service';
import modalWindowBodyDirective from './modal-window-body-directive';

/**
 * @ngdoc module
 * @name akamai.components.modal-window
 * @image modal-window
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
 * @guideline Use wizard component for multi step tasks in workflow.
 *
 * @example index.js
 * function MyController(modalWindow) {
 *   modalWindow.open({
 *    template: '...'
 *   }).result
 *    .then(() => {
 *      // user clicked "ok"
 *    })
 *    .catch(() => {
 *      // user clicked "cancel"
 *    });
 * }
 *
 */
module.exports = angular.module('akamai.components.modal-window', [
  angularUI,
  statusMessage.name,
  i18n.name,
  spinnerButton.name
])

/**
 * @ngdoc service
 * @name modalWindow
 * @description Provides a method to open new modal window instances.
 *
 */
  .service('modalWindow', modalWindowService)

/**
 * @name akamModalWindowBody
 * @description Provides directive to display content body section in html.
 */
  .directive('akamModalWindowBody', modalWindowBodyDirective);
