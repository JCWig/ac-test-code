var angular = require('angular'),
  i18n = require('../i18n'),
  messageBox = require('../message-box'),
  context = require('../context');

/**
 * @ngdoc module
 * @name akamai.components.auth
 * @description Provides an interceptor for failed requests for auth purposes
 *
 */
module.exports = angular.module('akamai.components.auth', [
  context.name,
  messageBox.name,
  i18n.name
])
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
      'akasession_username_invalid',
      'incorrect_current_account',
      'invalid_xsrf',
      'invalid_token_type',
      'invalid_token_id',
      'token_is_revoked',
      'token_is_expired',
      'invalid_token_subject',
      'token_and_akasession_mismatch',
      'missing_token',
      'missing_xsrf_token'
    ],
    logoutCodes: [
      //401 response error codes which should perform logout
      'expired_akasession',
      'malformed_akasession',
      'malformed_akalastmanaged_account', //logout instead of login redirect
      'akasession_decryption_problem',
      'missing_akasession',
      //502 response error codes which should perform logout
      'internal.server.error', //why does this code use . instead of _?
      'invalid_status_code',
      'invalid_response_format'
    ]
  })
  .factory('httpBuffer', require('./http-buffer-service'))
  .factory('token', require('./token-service'))
  .factory('authInterceptor', require('./auth-interceptor'))
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }]);