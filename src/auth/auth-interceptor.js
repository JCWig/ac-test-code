import angular from 'angular';

function authInterceptor($injector, $q, $window, httpBuffer, token, authConfig, auth) {
  // dynamically injected message box and translate to get around circular dependency issue
  let $translate;

  // patterns that should get the auth API token but not "gid" and "aid"
  let authUrls = [
    authConfig.introspectionUrl,
    authConfig.tokenUrl
  ];

  let blacklistPatterns = [].concat(authUrls);

  // returns true if we should not send an auth token for this URI
  function isUriBlacklisted(uri) {
    let searchFn = angular.bind(this, foundPatternInArray, uri);

    return blacklistPatterns.some(searchFn) ||
      auth.getBlacklistedUris().some(searchFn);
  }

  function foundPatternInArray(uri, pattern) {
    return uri.search(pattern) !== -1;
  }

  return {
    request: function(requestConfig) {
      $translate = $translate || $injector.get('$translate');

      // if the new token request pending flag is set,
      // and that request is not the token request itself,
      // then add it to the queue
      if (token.isPending() && !isUriBlacklisted(requestConfig.url)) {
        return httpBuffer.appendRequest(requestConfig);
      }

      return requestConfig;
    },
    responseError: function(response) {
      if (response.status !== 401 && response.status !== 502) {
        return $q.reject(response);
      }

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

      return $q.reject(response);
    }
  };
}

authInterceptor.$inject = ['$injector', '$q', '$window', 'httpBuffer', 'token', 'authConfig',
  'auth'];

export default authInterceptor;