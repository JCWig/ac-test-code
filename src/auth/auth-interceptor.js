'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($injector, $q, httpBuffer, token, authConfig, auth, context) {
  // dynamically injected message box and translate to get around circular dependency issue
  var messageBox, translate;

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
    var searchFn = angular.bind(this, foundPatternInArray, uri);

    return knownUriPatterns.some(searchFn) ||
      auth.getBlacklistedUris().some(searchFn);
  };

  function foundPatternInArray(uri, pattern) {
    return uri.search(pattern) !== -1;
  }

  // get current group and property and then set query string params
  function addGroupAndPropertyConfig(requestConfig) {
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
  }

  return {
    request: function(requestConfig) {
      translate = translate || $injector.get('translate');
      messageBox = messageBox || $injector.get('messageBox');

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
      // cannot be resolved because we need to know the current gid and aid. We only check the auth
      // urls and the mega menu urls. Items that are passed as blacklisted during the config phase
      // still get aid and gid added to all API requests
      if (knownUriPatterns.some(angular.bind(this, foundPatternInArray, requestConfig.url))) {
        return requestConfig;
      }

      if (context.accountChanged()) {

        // shows a message box that asks the user if they want to switch the account back to the
        // initial account. Will log out the user if they don't choose to switch account.
        return $q.all([
            translate.async('components.context.accountChanged', {
              name: context.getAccountFromCookie().name
            }),
            translate.async('components.context.accountChangedTitle')
          ]).then(function(values) {
            return messageBox.showQuestion({
              title: values[1],
              headline: '',
              text: values[0]
            }).result

            // change the account back and continue with the API request
            .then(context.resetAccount)
            .then(angular.bind(this, addGroupAndPropertyConfig, requestConfig))

            // go to login page
            .catch(token.logout);
          });
      }

      return addGroupAndPropertyConfig(requestConfig);

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