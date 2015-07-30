var angular = require('angular');

/**
 * @ngdoc module
 * @name akamai.components.message-box
 *
 * @description Presents a modal dialog displaying a message, optional
 * details, and a prompt for an action necessary to continue. It is a
 * type of `modalWindow`.
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
module.exports = angular.module('akamai.components.message-box', [
  require('angular-bootstrap-npm'),
  require('../modal-window').name,
  require('../i18n').name
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
  .factory('messageBox', require('./message-box-service'));
