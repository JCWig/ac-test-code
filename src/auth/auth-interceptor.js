'use strict';

/* @ngInject */
module.exports = function($q, httpBuffer, token, authConfig, auth) {
  var megaMenuUriPatterns = [
    /^\/ui\/services\/nav\/megamenu\/.*$/i,
    /^\/core\/services\/session\/.*$/i,
    /^\/svcs\/messagecenter\/.*$/i,
    /^\/search\/api\/v1\/query.*$/i,
    /^\/totem\/.*$/i,
    /^\/portal\/pages\/messagecenter\/.*/i,
    /^\/libs\/akamai-core\/.*/i,
    /^\/ui\/home\/manage\/.*/i,
    /^.*\.html/i
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
      if (response.status === 401 || response.status === 502) {
        //catch any blacklisted items and reject them
        if (isUriBlacklisted(response.config.url)) {
          return $q.reject(response);
        }

        if (token.isLogoutCondition(response)) {
          token.logout();
          return $q.reject(response);
        }

        // if we're requesting a new token, append the response to the retry queue, to be run
        if (token.isPending()) {
          return httpBuffer.appendResponse(response);
        }
      }

      return $q.reject(response);
    }
  };
};