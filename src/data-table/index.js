'use strict';

var angular = require('angular');

    /**
    * @ngdoc overview
    *
    * @name akamai.components.data-table
    *
    * @description Provides a directive that creates Luna- and
    * Pulsar-compatible data tables.
    *
    */
    module.exports = angular.module('akamai.components.data-table', [])

    /**
     * @ngdoc directive
     *
     * @name akamai.components.status-message.directive:akamStatusMessage
     *
     * @description Creates a status message control.
     *
     * @restrict E
     *
     * @param {String} text The required text to display.
     *
     */
.directive("akamDataTable", require('./data-table-directive'));