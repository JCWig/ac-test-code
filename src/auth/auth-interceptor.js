'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($q, httpBuffer, token, authConfig, auth, context) {
  var megaMenuUriPatterns = [
    /^\/ui\/services\/nav\/megamenu\/.*$/i,
    /^\/core\/services\/session\/.*$/i,
    /^\/svcs\/messagecenter\/.*$/i,
    /^\/search\/api\/v1\/query.*$/i,
    /^\/totem\/.*$/i,
    /^\/portal\/pages\/messagecenter\/.*/i,
    /^\/libs\/akamai-core\/.*/i
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
      auth.getBlacklistedUris().some(foundPatternInArray);
  };

  return {
    request: function(requestConfig) {
      // if the new token request pending flag is set,
      // and that request is not the token request itself,
      // then add it to the queue
      if (token.isPending() && !isUriBlacklisted(requestConfig.url) ) {
        return httpBuffer.appendRequest(requestConfig);
      }

      // this implies that the extend.json call, which is being used to set the gid and aid in
      // a luna context, must have its query params set manually. This happens in the context
      // provider. We don't modify the blacklist config because the current group and property
      // typically require some ajax calls to be made, and this causes a deadlock of promises that
      // cannot be resolved because we need to know the current gid and aid
      if (isUriBlacklisted(requestConfig.url)) {
        return requestConfig;
      }

      // get current group and property and then set query string params
      return $q.all([context.group, context.property]).then(function(items) {
        var group = items[0], property = items[1];

        requestConfig.params = requestConfig.params || {};

        if (angular.isDefined(group)) {
          requestConfig.params.gid = group.id || undefined;
        }

        if (angular.isDefined(property)) {
          requestConfig.params.aid = property.id || undefined;
        }

        return requestConfig;
      });

    },
    responseError: function(response) {
      if (response.status === 401 && !isUriBlacklisted(response.config.url)) {
        if (token.isLogoutCondition(response)) {
          token.logout();
          return $q.reject(response);
        }

        // if we're requesting a new token, append the 401'd response to the retry queue, to be run
        if (token.isPending()) {
          return httpBuffer.appendResponse(response);
        }
      }

      return $q.reject(response);
    }
  };
};