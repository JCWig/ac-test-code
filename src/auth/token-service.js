'use strict';

var REQUEST_AUTH_URL = '/request_auth.jsp',
    LOGIN_PAGE_URL = '/EdgeAuth/login.jsp';

/* @ngInject */
module.exports = function(httpBuffer, $injector, $location) {
  var pendingRequest = false;
  var $http;

  return {
    /**
     * @name create
     * @description attempt to create a new token if no token request is pending.
     *  If successful: trigger a retry of all deferred requests.
     *  Otherwise clear all pending requests and redirect to login page.
     */
    create: function() {
      if ( this.isPending() ) {
        return;
      }

      pendingRequest = true;
      $http = $http || $injector.get('$http');

      $http.get(REQUEST_AUTH_URL).success(
        function() {
          pendingRequest = false;
          httpBuffer.retryAll();
        }
      ).error(
        function() {
          pendingRequest = false;
          httpBuffer.clear();
          $location.url(LOGIN_PAGE_URL);
        }
      );
    },
    /**
     * @name isPending
     * @description Determines if the token service is making a pending auth token request
     * @return {boolean} true if the token service is making a pending auth token request
     */
    isPending: function() {
      return pendingRequest;
    }
  };
};
