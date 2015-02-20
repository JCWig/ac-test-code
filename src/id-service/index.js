'use strict';

var angular = require('angular');

    /**
    * @ngdoc overview
    *
    * @name akamai.components.ids
    *
    * @description Provides a factory service that generates pseudo
    * random universally unique ids.
    * unobtrusive, transient feedback on their actions and emerging
    * system conditions, but without interrupting their workflow.
    *
    */
    module.exports = angular.module('akamai.components.ids', [])
    
    /**
     * @ngdoc object
     *
     * @name akamai.components.ids.idService
     *
     * @object
     *
     * @description Provides a factory service to generate
     * uuid and guid values.
     *
     */
.factory('idService', require('./id-service'));