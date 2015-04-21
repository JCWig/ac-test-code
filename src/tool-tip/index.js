'use strict';

var angular = require('angular');

    /**
    * @ngdoc overview
    *
    * @name akamai.components.menu-button
    *
    * @description Provides a set of directives to use in order to create Pulsar compatible menu buttons.
    *
    */
    module.exports = angular.module('akamai.components.tooltip', [
        'ngSanitize',
        require('angular-bootstrap-npm')
    ])

    /**
     * @ngdoc directive
     *
     * @name akamai.components.tool-tip.directive:toolTip
     *
     * @description Creates a menu button control
     *
     * @restrict E
     *
     * @param {String} [label=""] The label to use for the menu button
     *
     * @example
     *
     */
.directive('akamTooltip', require('./tooltip-directive'));
