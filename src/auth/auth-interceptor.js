'use strict';

/* @ngInject */
module.exports = function($q, httpBuffer, token, authConfig, auth) {
  var megaMenuUriPatterns = [
    /^\/ui\/services\/nav\/megamenu\/.*$/i,
    /^\/core\/services\/session\/.*$/i,
    /^\/svcs\/messagecenter\/.*$/i,
    /^\/search\/api\/v1\/query.*$/i,
    /^\/totem\/.*$/i,
    /^\/portal\/pages\/messagecenter\/.*/i
  ];

  var authUrls = [
    authConfig.introspectionUrl,
    authConfig.tokenUrl
  ];

  var knownUriPatterns = [].concat(authUrls, megaMenuUriPatterns);

  var isUriBlacklisted = function(uri) {
    var foundPatternInArray = function(pattern) {
      return uri.search(pattern) !== -1;
    };

    return knownUriPatterns.some(foundPatternInArray) ||
      auth.getBlacklistedUris().some( foundPatternInArray );
  };

  return {
    request: function(requestConfig) {
      // if the new token request pending flag is set,
      // and that request is not the token request itself,
      // then add it to the queue
      if (token.isPending() && !isUriBlacklisted(requestConfig.url) ) {
        return httpBuffer.appendRequest(requestConfig);
      }

      return requestConfig;
    },
    responseError: function(response) {
      if (response.status === 401 && !isUriBlacklisted(response.config.url )) {

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