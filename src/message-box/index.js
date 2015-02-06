'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 *
 * @name akamai.components.messsage-box
 *
 * @description
 * Present a dialog containing a message and optional details to the user
 * and request action before continuing.
 */
module.exports = angular.module('akamai.components.message-box', [
    require('angular-bootstrap-npm'),
    require('../modal-window').name
])


/**
 * @ngdoc service
 * @name akamai.components.message-box.service:messageBox
 *
 * @description
 * Provide methods to open information, question, and error message boxes.
 */
.factory('messageBox', require('./message-box-service'));
