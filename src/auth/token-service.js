'use strict';

/* @ngInject */
module.exports = function(akamHttpBuffer, $injector) {
  var pendingRequest = false;
  var $http;

  return {
    /**
     * Call this function to attempt to create a new token. When this is called, only one
     *  request will be made.
     *  If successful: trigger a retry of all deferred requests.
     *  Otherwise reject all pending requests.
     */
    create: function() {
      if ( pendingRequest ) {
        return;
      }
      pendingRequest = true;
      $http = $http || $injector.get('$http');

      $http.get('/request_auth.jsp').success(
        function() {
          pendingRequest = false;
          akamHttpBuffer.retryAll();
        }
      ).error(
        function() {
          pendingRequest = false;
          akamHttpBuffer.rejectAll('rejection reason');
        }
      );
    }
  };
};
