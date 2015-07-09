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
  .provider('auth', require('./auth-provider'))
  .constant('authConfig', {
    //client id we are using in authN
    clientId: '0ad3c5bc-fb66-4fa0-b94a-1bf712eae628',
    //token endpoint
    tokenUrl: '/ids-authn/v1/oauth2/token',
    //token introspection endpoint
    introspectionUrl: '/ids-authn/v1/introspect',
    //url pointing to luna logout
    lunaLogoutUrl: '/EdgeAuth/login.jsp?TARGET_URL=',
    //401 response error codes which should request a new token
    newTokenRequestCodes: [
      'invalid_token',
      'missing_token',
      'token_is_expired',
      'token_and_akasession_mismatch',
      'akasession_username_invalid'
    ],
    //401 response error codes which should perform logout
    logoutCodes: [
      'token_is_revoked',
      'expired_akasession',
      'malformed_akasession',
      'incorrect_current_account',
      'invalid_xsrf',
      'missing_akasession',
      'missing_xsrf_token'
    ]
  })
  .factory('httpBuffer', require('./http-buffer-service'))
  .factory('token', require('./token-service'))
  .factory('authInterceptor', require('./auth-interceptor'))
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }]);