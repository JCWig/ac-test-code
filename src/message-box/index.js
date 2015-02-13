'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 *
 * @name akamai.components.message-box
 *
 * @description
 * Presents a modal dialog displaying a message, optional details, and
 * a prompt for an action necessary to continue.
 *
 */
module.exports = angular.module('akamai.components.message-box', [
    require('angular-bootstrap-npm'),
    require('../modal-window').name
])


/**
 * @ngdoc service
 *
 * @name akamai.components.message-box.service:messageBox
 *
 * @description
 * Provides methods to open information, question, and error message
 * boxes.
 *
 */
.factory('messageBox', require('./message-box-service'));
