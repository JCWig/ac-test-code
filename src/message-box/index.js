'use strict';

var angular = require('angular');

module.exports = angular.module('akamai.components.message-box', [
    require('angular-bootstrap-npm'),
    require('../modal-window').name
])

.factory('messageBox', require('./message-box-service'));
