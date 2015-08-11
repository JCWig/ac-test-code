import angular from 'angular';
import angularBootstrapNpm from 'angular-bootstrap-npm';
import modalWindow from '../modal-window';
import i18n from '../i18n';
import messageBoxService from './message-box-service';

/**
 * @ngdoc module
 * @name akamai.components.message-box
 * @image message-box
 *
 * @description
 * Message box is a type of pop up overlaid on current page for feedback on user actions,
 * system events, or states. It contains a transparent background, content panel with
 * heading and close icon, message area, and action and secondary buttons.There are three
 * variations: generic information with an info icon in the header, a question with
 * a question icon, and an error or warning with a error or warning icon and red heading text.
 * The message box is intentionally limited to simple information presentation and
 * minimal interaction.
 *
 * @guideline Use information message box, when you want to communicate information about
 * application to user.
 * @guideline Use error/warning message box, only when you need to communicate a state of either
 * error or warning.
 * @guideline More complex interaction should be performed in the application window or
 * a modal window.
 *
 * @example index.js
 * function MyController(messageBox) {
 *   messageBox.showInfo({
 *    headline: 'This is limited to 25 characters',
 *    text: 'a sub heading -- limited to 250 characters',
 *    details: 'Appears as additional details, collapsed by default.'
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
export default angular.module('akamai.components.message-box', [
  angularBootstrapNpm,
  modalWindow.name,
  i18n.name
])

/**
 * @ngdoc service
 * @name messageBox
 *
 * @description
 * Provides methods to open specialized windows for questions, errors,
 * or to provide basic information. Each requires a `headline` along
 * with descriptive `text`.
 *
 */
  .factory('messageBox', messageBoxService);
