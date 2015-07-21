var angular = require('angular');

module.exports = function($injector, $q, $window, httpBuffer, token, authConfig, auth, context) {
  // dynamically injected message box and translate to get around circular dependency issue
  var messageBox, translate;

  // used to enforce that only one message box is shown at a time.
  var accountSwitchPromise;

  // patterns that should neither get API tokens nor luna "gid" and "aid" params
  var noAuthNoLunaQueryStringPatterns = [
    /^\/ui\/services\/nav\/megamenu\/.*\/context.json.*$/i,
    /^\/core\/services\/session\/.*$/i,
    /^\/svcs\/messagecenter\/.*$/i,
    /^\/search\/api\/v1\/query.*$/i,
    /^\/totem\/.*$/i,
    /^\/portal\/pages\/messagecenter\/.*/i,
    /^\/libs\/akamai-core\/.*/i,
    /^\/ui\/home\/manage\/.*/i,
    /^.*\.html/i
  ];

  // patterns that should not get auth API tokens but should get "gid" and "aid" params
  var noAuthPatterns = [
    /^\/ui\/services\/nav\/megamenu\/.*\/grp.json.*$/i,
    /^\/ui\/services\/nav\/megamenu\/.*\/asset.json.*$/i
  ];

  // patterns that should get the auth API token but not "gid" and "aid"
  var authUrls = [
    authConfig.introspectionUrl,
    authConfig.tokenUrl
  ];

  var authPatterns = [].concat(authUrls, noAuthNoLunaQueryStringPatterns),
    blacklistPatterns = [].concat(authUrls,
      noAuthNoLunaQueryStringPatterns,
      noAuthPatterns);

  // returns true if we should not send an auth token for this URI
  function isUriBlacklisted(uri) {
    var searchFn = angular.bind(this, foundPatternInArray, uri);

    return blacklistPatterns.some(searchFn) ||
      auth.getBlacklistedUris().some(searchFn);
  }

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

  // shows the message box asking the user if they wish to switch accounts. We try to ensure that
  // we only ever show 1 message box as there may be multiple ajax requests that are made when
  // we detect an account switch.
  function showMessageBox(requestConfig) {
    if (accountSwitchPromise) {
      return accountSwitchPromise;
    }

    accountSwitchPromise = $q.all([
      translate.async('components.context.accountChanged', {
        name: context.getAccountFromCookie().name,
        oldName: context.account.name
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
        .catch(function() {
          $window.location.replace('/');
        })
        .finally(function() {
          // set the promise to null so we can show a new dialog again
          accountSwitchPromise = null;
        });
    });

    return accountSwitchPromise;
  }

  return {
    request: function(requestConfig) {
      translate = translate || $injector.get('translate');
      messageBox = messageBox || $injector.get('messageBox');

      // if the new token request pending flag is set,
      // and that request is not the token request itself,
      // then add it to the queue
      if (token.isPending() && !isUriBlacklisted(requestConfig.url)) {
        return httpBuffer.appendRequest(requestConfig);
      }

      // This is used to not modify requests that are used to fetch group and property information
      // from a luna context. This is because that we cannot add the "gid" and "aid" parameters
      // before bootstrapping the initial data. This is used for most of the mega menu calls. If
      // we didn't do this, there would be a deadlock of promises. Items that are passed as
      // blacklisted during the config phase still get aid and gid added to all API requests. NOTE,
      // we also take this branch for "extend.json" because otherwise, we would have 2 message
      // boxes popping up if we detect that the account has changed (one for the call to fetch
      // the mega menu tabs and one for calling the extend session endpoint).
      if (authPatterns.some(angular.bind(this, foundPatternInArray, requestConfig.url))) {
        return requestConfig;
      }

      if (context.accountChanged()) {

        // shows a message box that asks the user if they want to switch the account back to the
        // initial account. Will redirect to the home page if they don't choose to switch account.
        return showMessageBox(requestConfig);
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
        return httpBuffer.appendResponse(response);
      }

      return $q.reject(response);
    }
  };
};

module.exports.$inject = ['$injector', '$q', '$window', 'httpBuffer', 'token', 'authConfig',
  'auth', 'context'];
