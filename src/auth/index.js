'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 *
 * @name akamai.components.auth
 *
 * @description Provides a provider for intercepting requests for auth purposes
 *
 */
module.exports = angular.module('akamai.components.auth', [
  require('../utils').name
])
  .factory('akamAuthInterceptor', require('./auth-provider'))
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('akamAuthInterceptor');
  }]);