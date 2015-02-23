'use strict';

var angular = require('angular');

    /**
    * @ngdoc overview
    *
    * @name akamai.components.uuid
    *
    * @description Provides a factory service that generates pseudo
    * random universally unique ids.
    *
    */
    module.exports = angular.module('akamai.components.uuid', [])
    
    /**
     * @ngdoc object
     *
     * @name akamai.components.uuid.uuid
     *
     * @object
     *
     * @description Provides a factory service to generate
     * uuid and guid values.
     *
     */
.factory('uuid', require('./uuid-service'));