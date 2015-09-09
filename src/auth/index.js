import angular from 'angular';
import i18n from '../i18n';
import messageBox from '../message-box';
import context from '../context';
import authProvider from './auth-provider';
import authInterceptor from './auth-interceptor';
import httpBufferService from './http-buffer-service';
import tokenService from './token-service';

/**
 * @ngdoc module
 * @name akamai.components.auth
 * @description Provides an interceptor for failed requests for auth purposes. Most applications
 * shouldn't have to worry about this module too much, as it is responsible for handing auth
 * tokens and automatically adding `gid` and `aid ` query parameters for most API requests. This
 * allows applications to not worry about details that are Luna specific. However, some APIs don't
 * still have to exist in Luna, so it is necessary to add them to the auth blacklist. This will
 * prevent the application from sending requesting JSON Web Tokens.
 *
 * **Basic Workflow**
 *
 * Any API requests that are not ignored by the auth module will check for a valid JSON Web Token.
 * If one is not present, the application with automatically make a request for a new token,
 * sending along the AKASESSION state. If a valid response comes back, the original API request
 * will be retried. If not, then the application will redirect to the login page and the user will
 * be signed out.
 *
 * @example app.js
 * function config(authProvider) {
 *   // tell auth module not to send pulsar token requests for any URL that matches
 *   // /platformtoolkit/, as it's a Luna based set of resources.
 *   authProvider.setBlacklistedUris('/platformtoolkit/');
 * }
 */
export default angular.module('akamai.components.auth', [
  context.name,
  messageBox.name,
  i18n.name
])
  /**
   * @ngdoc provider
   * @name authProvider
   * @description Main provider meant to be consumed by applications. See the `setBlacklistedUris`
   * method.
   */
  .provider('auth', authProvider)
  // XXX: it's a bad idea to keep this as a singular object. Any application can inject this
  // value in their application and overwrite the values, because that's just how JS objects work
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
      'incorrect_contract_type',
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
  .factory('httpBuffer', httpBufferService)
  .factory('token', tokenService)
  .factory('authInterceptor', authInterceptor)
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }]);
