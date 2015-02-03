'use strict';

var angular = require('angular');

    /**
    * @ngdoc overview
    *
    * @name akamai.components.indeterminate-progress
    *
    * @description Provides a directive to use in order to create Luna and Pulsar compatible indeterminate progress elements.
    *
    */
    module.exports = angular.module('akamai.components.indeterminate-progress', [])

    /**
     * @ngdoc directive
     *
     * @name akamai.components.indeterminate-progress.directive:akamIndeterminateProgress
     *
     * @description Creates an indeterminate progress control
     *
     * @restrict AE
     *
     * @param {String} [label=''] The label to display underneath the
     * spinner.  If omitted, the label does not display.
     *
     * @param {Boolean} [failed=false] Indicates if the indeterminate
     * progress encountered a `failed` state.
     *
     * @param {Boolean} [completed=false] Indicates if the
     * indeterminate progress encountered a `completed` state.
     *
     */
.directive("akamIndeterminateProgress", require('./indeterminate-progress'));