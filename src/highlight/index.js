'use strict';

var angular = require('angular');

    /**
    * @ngdoc overview
    *
    * @name akamai.components.highlight
    *
    * @description Provides a filter which takes in a string input and returns the HTML represented template
    * which contains the String intersparsed with <span class="highlight">matched value</span>.
    *
    */
    module.exports = angular.module('akamai.components.highlight', [])
    .filter('highlight', require('./highlight'));