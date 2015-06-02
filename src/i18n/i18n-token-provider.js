'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function i18nTokenProvider(i18nConfig, VERSION) {
  var self = this,
      cPath;

  /**
   * @ngdoc service
   *
   * @name Path
   *
   * @description Constructs a URLs array in the Path class for use
   * in the `i18nCustomLoader` service. Paths include
   * `/libs/akamai-core/{version}/locales/` for components and
   * `/apps/{appname}/locales/` for apps, where `{version}` and
   * `{appname}` are replaced by their proper values in the `$get`
   * constructor.
   *
   */
  var Path = function() {
    /**
     * resolve function adds 2 default endpoints path of locale
     * files to rawUrls array one for the component and one for the app
     * @private
     */
    this.resolve = function() {
      self.rawUrls.push({
        path: i18nConfig.localeComponentPath,
        app: false,
        overridden: false
      });
      self.rawUrls.push({
        path: i18nConfig.localeAppPath,
        app: true,
        overridden: false
      });
    };
  };

  /**
   * @ngdoc method
   *
   * @name i18nTokenProvider#setComponentLocalePath
   *
   * @methodOf akamai.components.i18n.service:i18nTokenProvider
   *
   * @param {String} url the path to replace default component locale file path
   *
   * @example of usage
   * <pre>
   *     app.config(function(i18nTokenProvider) {
     *        i18nTokenProvider.setComponentLocalePath('/libs/akamai-core/0.6.1/locales/'');
     *        i18nTokenProvider.setAppLocalePath('/apps/appname/locales/'');
     *     });
   * </pre>
   */
  this.setComponentLocalePath = function(url) {
    //no validate the param url, assuming it is valid
    angular.forEach(this.rawUrls, function(item) {
      if (item.path === i18nConfig.localeComponentPath) {
        item.path = url;
        item.overridden = true;
      }
    });
  };

  /**
   * @ngdoc method
   *
   * @name i18nTokenProvider#setAppLocalePath
   *
   * @methodOf akamai.components.i18n.service:i18nTokenProvider
   *
   * @param {String} url the path to replace default application locale file path
   *
   * __NOTE__: param url only a string value for the app, no multiple files allowed
   *
   *@example of usage
   * <pre>
   *     app.config(function(i18nTokenProvider) {
     *        i18nTokenProvider.setComponentLocalePath("/libs/akamai-core/0.6.1/locales/");
     *        i18nTokenProvider.setAppLocalePath("/apps/appname/locales/");
     *     });
   * </pre>
   */
  this.setAppLocalePath = function(url) {
    //no validate the param url, assuming it is valid
    angular.forEach(this.rawUrls, function(item) {
      if (item.path === i18nConfig.localeAppPath) {
        item.path = url;
        item.overridden = true;
      }
    });
  };

  this.rawUrls = [];
  cPath = new Path();
  cPath.resolve();

  /**
   *
   * @ngdoc method
   *
   * @name i18nTokenProvider#$get
   *
   * @methodOf akamai.components.i18n.service:i18nTokenProvider
   *
   * @description A service used by the `i18nTokenProvider` to pass
   * values set during the application's configuration phase. The
   * `locale` value is determined by the `AKALOCALE` cookie set by
   * Luna portal, otherwise the fallback value is `en_US`.
   *
   * @return {object} A hash containing two getter methods, mainly
   * for use by i18nCustomLoader.
   *
   */

  /* @ngInject */
  this.$get = function i18nTokenFactory($cookies, $location, $log) {
    var cookieLocale = $cookies.get(i18nConfig.localeCookie),
      locale = i18nConfig.defaultLocale,
      localeUrls = [],
      appName, matchResults,
      normalizedPath,
    // valid chars: lower case alpha, digits, and hyphen for possible appName from url
      appUrlRx = /[^/]\/apps\/([a-z0-9-]+)?[/?]?/;
    //just to prevent from improperly encoded cookies
    if (cookieLocale) {
      try {
        //try decode cookieLocale, then get first array value from split of non alpha,
        //non digits and non underscore
        locale = atob(cookieLocale).split(/(?![A-Za-z0-9-_])/)[0];
      } catch (e) {
        $log.warn('Decode cookie failed: ' + cookieLocale);
      }
    }

    angular.forEach(this.rawUrls, function(raw) {
      if (raw.overridden) {
        localeUrls.push(raw.path);
      } else {
        if (raw.app) {
          appName = 'appname';
          matchResults = [];
          // browser url lookups for app locale path to get app name.
          // e.g. https://control.akamai.com/apps/billing-center/somethingelse
          // Capture string in pattern from path  apps/{}/
          matchResults = appUrlRx.exec(decodeURIComponent($location.absUrl()));
          if (matchResults) {
            appName = matchResults[1] || appName;
          }
          normalizedPath = raw.path.replace(/\{appname\}/g, appName);
        } else {
          normalizedPath = raw.path.replace(/\{version\}/g, VERSION);
        }
        localeUrls.push(normalizedPath);
      }
    });

    return {

      /**
       * @ngdoc method
       *
       * @name i18nTokenProvider#getUrls
       *
       * @methodOf akamai.components.i18n.service:i18nTokenProvider
       *
       * @description get a list of URLs that reference locale
       * files.
       * @return {array} localeUrls
       *
       */

      getUrls: function() {
        return localeUrls;
      },

      /**
       * @ngdoc method
       *
       * @name i18nTokenProvider#getCurrentLocale
       *
       * @methodOf akamai.components.i18n.service:i18nTokenProvider
       *
       * @description Get the current locale value.
       * @return {string} locale
       *
       */

      getCurrentLocale: function() {
        return locale;
      }
    };
  };
};
