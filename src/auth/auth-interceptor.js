'use strict';

/* @ngInject */
module.exports = function($q, httpBuffer, token) {
  return {
    /*
    request: function(request) {
      if (token.isPending()) {
        return httpBuffer.appendResponse(request);
      }

      return request;
    },
    */
    responseError: function(response) {
      if (response.status === 401) {
        // send a request to create a token (if one needs to be created)
        token.create();

        // append the 401'd response to the retry queue to be run after the token is created
        return httpBuffer.appendResponse(response);
      }

      return $q.reject(response);
    }
  };
};