'use strict';

var angular = require('angular');

    /**
    * @ngdoc overview
    *
    * @name akamai.components.date-picker
    *
    * @description Provides a directive to use in order to create Luna and Pulsar compatible date picker elements.
    *
    */
    module.exports = angular.module('akamai.components.date-picker', [
        require('angular-bootstrap-npm')
    ])

    /**
     * @ngdoc directive
     *
     * @name akamai.components.date-picker.directive:akamDatePicker
     *
     * @description Creates an date picker control
     *
     * @restrict E
     *
     * @param {String} [value=''] The date value.  Must be formatted in yyyy-MM-dd format
     *
     * @param {Boolean} [failed=false] Indicates if the indeterminate
     * progress encountered a `failed` state.
     *
     * @param {Boolean} [completed=false] Indicates if the
     * indeterminate progress encountered a `completed` state.
     *
     */
.directive("akamDatePicker", require('./date-picker-directive'));