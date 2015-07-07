'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function(httpBuffer, $injector, $window, $location, authConfig) {
  var pendingRequest = false;
  var $http;
  var service = {
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

      $http({
        url: authConfig.tokenUrl,
        data: 'client_id=' + authConfig.clientId + '&grant_type=password_assertion',
        method: 'POST',
        headers: {
          'Akamai-Accept': 'akamai/cookie',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).success(
        function() {
          pendingRequest = false;
          httpBuffer.retryAll();
        }
      ).error(
        function() {
          pendingRequest = false;
          httpBuffer.clear();
          service.logout();
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
    },
    logout: function() {
      var currentUrl = $location.absUrl(),
          currentHost = $location.host(),
          hostPosition = currentUrl.indexOf(currentHost),
          redirectPath = currentUrl.substring(hostPosition + currentHost.length),
          encodedUrl = $window.btoa(redirectPath);

      $window.location.replace( authConfig.lunaLogoutUrl + encodedUrl );
    },
    isLogoutCondition: function(response) {
      var responseErrorCode;

      if ( response == null ) {
        return false;
      }

      if (response.config.retriedRequest === true) {
        return true;
      }

      if (response.data != null && angular.isObject(response.data) && response.status === 401) {
        responseErrorCode = response.data.code;
        switch (responseErrorCode) {
          case 'invalid_token':
            this.create();
            return false;
          case 'akasession_username_invalid':
          case 'expired_akasession':
          case 'malformed_akasession':
          case 'incorrect_current_account':
          case 'invalid_xsrf':
            return true;
          default:
            return false;
        }
      }
    }
  };

  return service;
};
