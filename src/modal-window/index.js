'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 *
 * @name akamai.components.modal-window
 *
 * @description
 * Present a dialog to the user requiring an action to continue the
 * application workflow.
 */
module.exports = angular.module('akamai.components.modal-window', [
    require('angular-bootstrap-npm'),
    require('../i18n').name
])

/**
 * @ngdoc service
 * @name akamai.components.modal-window.service:modalWindow
 *
 * @description
 * Provide a method to open new modal window instances.
 *
 */
.factory('modalWindow', require('./modal-window-service'))

.directive('akamModalWindowBody', require('./modal-window-body-directive'));
