'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 *
 * @name akamai.components.modal-window
 *
 * @description Presents a window requiring an action to continue the
 * application's workflow.
 *
 */
module.exports = angular.module('akamai.components.modal-window', [
  require('angular-bootstrap-npm'),
  require('../status-message').name,
  require('../i18n').name
])

/**
 * @ngdoc service
 *
 * @name akamai.components.modal-window.service:modalWindow
 *
 * @description Provides a method to open new modal window instances.
 *
 */
  .factory('modalWindow', require('./modal-window-service'))

/**
 * @ngdoc directive
 *
 * @name akamai.components.modal-window.directive:akamModalWindowBody
 *
 * @description Provides directive to display content body section in html.
 *
 */
  .directive('akamModalWindowBody', require('./modal-window-body-directive'));
