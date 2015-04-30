'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 *
 * @name akamai.components.message-box
 *
 * @description Presents a modal dialog displaying a message, optional
 * details, and a prompt for an action necessary to continue. It is a
 * type of {@link akamai.components.modal-window modal window}.
 *
 */
module.exports = angular.module('akamai.components.message-box', [
  require('angular-bootstrap-npm'),
  require('../modal-window').name,
  require('../i18n').name
])

/**
 * @ngdoc service
 *
 * @name akamai.components.message-box.service:messageBox
 *
 * @description
 *
 * Provides methods to open specialized windows for questions, errors,
 * or to provide basic information. Each requires a `headline` along
 * with descriptive `text`.
 *
 */
  .factory('messageBox', require('./message-box-service'));
