'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 *
 * @name akamai.components.modal-window
 *
 * @description Presents a dialog requiring an action to continue the
 * application's workflow.
 *
 */
module.exports = angular.module('akamai.components.modal-window', [
    require('angular-bootstrap-npm')
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

.directive('akamModalWindowBody', require('./modal-window-body-directive'));
