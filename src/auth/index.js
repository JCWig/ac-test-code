'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 *
 * @name akamai.components.auth
 *
 * @description Provides an interceptor for failed requests for auth purposes
 *
 */
module.exports = angular.module('akamai.components.auth', [])
  .constant('authConfig', {
    //client id we are using in authN
    clientId: '0ad3c5bc-fb66-4fa0-b94a-1bf712eae628',
    //token endpoint
    tokenUrl: '/ids-authn/v1/oauth2/token',
    //token introspection endpoint
    introspectionUrl: '/ids-authn/v1/introspect',
    //url pointing to luna logout
    lunaLogoutUrl: '/portal/logout.jsp'
  })
  .factory('httpBuffer', require('./http-buffer-service'))
  .factory('token', require('./token-service'))
  .factory('authInterceptor', require('./auth-interceptor'))
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }]);