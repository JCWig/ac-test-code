'use strict';

/* @ngInject */
module.exports = function($q, httpBuffer, token, authConfig) {
  var whiteListUrls = [authConfig.introspectionUrl, authConfig.tokenUrl];

  return {
    request: function(requestConfig) {
      // if the new token request pending flag is set,
      // and that request is not the token request itself,
      // then add it to the queue
      if (token.isPending() && whiteListUrls.indexOf( requestConfig.url ) === -1) {
        return httpBuffer.appendRequest(requestConfig);
      }

      return requestConfig;
    },
    responseError: function(response) {
      if (response.status === 401) {

        // send a request to create a token (if one needs to be created)
        if (!token.isPending()) {
          token.create();
        }

        // append the 401'd response to the retry queue to be run after the token is created
        return httpBuffer.appendResponse(response);
      }

      return $q.reject(response);
    }
  };
};