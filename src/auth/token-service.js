import angular from 'angular';

function tokenService(httpBuffer, $injector, $window, $location, authConfig, $log) {
  let pendingRequest = false;
  let $http;
  let service = {
    /**
     * @name create
     * @description attempt to create a new token if no token request is pending.
     *  If successful: trigger a retry of all deferred requests.
     *  Otherwise clear all pending requests and redirect to login page.
     */
    create: function() {
      if (this.isPending()) {
        return;
      }

      pendingRequest = true;
      $http = $http || $injector.get('$http');

      $http({
        url: authConfig.tokenUrl,
        data: `client_id=${authConfig.clientId}&grant_type=password_assertion`,
        method: 'POST',
        headers: {
          'Akamai-Accept': 'akamai/cookie',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).success(
        function() {
          pendingRequest = false;
          httpBuffer.resolveAll();
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
      const currentUrl = $location.absUrl(),

        currentHost = $location.host(),
        hostPosition = currentUrl.indexOf(currentHost),
        redirectPath = currentUrl.substring(hostPosition + currentHost.length),
        encodedUrl = $window.btoa(redirectPath);

      $window.location.replace(authConfig.lunaLogoutUrl + encodedUrl);
    },
    isLogoutCondition: function(response) {
      let responseErrorCode;

      if (response.status !== 401 && response.status !== 502) {
        return false;
      }

      if (response.config.retriedRequest === true) {
        return true;
      }

      if (!angular.isObject(response.data)) {
        // TODO: Explicitly recognize (back to server), that error code structure is missing
        $log.warn(response.status, 'response returned without proper error code structure:',
          response.data, response.config.url);
      } else {
        responseErrorCode = response.data.code;

        // account for known cases where new token needs to be requested
        if (authConfig.newTokenRequestCodes.indexOf(responseErrorCode) > -1) {
          this.create();
          return false;
        }

        // account for known cases to log out
        if (authConfig.logoutCodes.indexOf(responseErrorCode) > -1) {
          return true;
        }

         // TODO: Explicitly recognize (back to server), that unknown code has been passed
        $log.warn(response.status, 'response returned with unrecognized code:', response.data.code,
          response.config.url);
      }

      // for unknown 401's log out, for unknown 502's reject
      return response.status === 401;
    }
  };

  return service;
}

tokenService.$inject = ['httpBuffer', '$injector', '$window', '$location', 'authConfig', '$log'];

export default tokenService;