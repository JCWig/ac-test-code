import angular from 'angular';

function I18nTokenProvider(i18nConfig, VERSION) {
  let cPath, self = this;

  this.i18nConfig = i18nConfig;
  this.VERSION = VERSION;
  this.rawUrls = [];

  /**
   * Constructs a URLs array in the Path class for use
   * in the `i18nCustomLoader` service. Paths include
   * `/libs/akamai-core/{version}/locales/` for components and
   * `/apps/{appname}/locales/` for apps, where `{version}` and
   * `{appname}` are replaced by their proper values in the `$get`
   * constructor.
   *
   */
  function Path() {
    /**
     * resolve function adds 2 default endpoints path of locale
     * files to rawUrls array one for the component and one for the app
     * @private
     */
    this.resolve = () => {
      self.rawUrls.push({
        path: self.i18nConfig.localeComponentPath,
        app: false,
        overridden: false
      });
      self.rawUrls.push({
        path: self.i18nConfig.localeAppPath,
        app: true,
        overridden: false
      });
    };
  }

  /**
   * @ngdoc method
   * @name i18nTokenProvider#setComponentLocalePath
   *
   * @param {String} url the path to replace default component locale file path
   *
   * @example of usage
   * <pre>
   * app.config(function(i18nTokenProvider) {
   *   i18nTokenProvider.setComponentLocalePath('/libs/akamai-core/0.6.1/locales/'');
   *   i18nTokenProvider.setAppLocalePath('/apps/appname/locales/'');
   * });
   * </pre>
   */
  this.setComponentLocalePath = (url) => {
    //no validate the param url, assuming it is valid
    angular.forEach(self.rawUrls, (item) => {
      if (item.path === self.i18nConfig.localeComponentPath) {
        item.path = url;
        item.overridden = true;
      }
    });
  };

  /**
   * @ngdoc method
   * @name i18nTokenProvider#setAppLocalePath
   *
   * @param {String} url the path to replace default application locale file path
   *
   * __NOTE__: param url only a string value for the app, no multiple files allowed
   *
   * @example of usage
   * <pre>
   *     app.config(function(i18nTokenProvider) {
   *        i18nTokenProvider.setComponentLocalePath("/libs/akamai-core/0.6.1/locales/");
   *        i18nTokenProvider.setAppLocalePath("/apps/appname/locales/");
   *     });
   * </pre>
   */
  this.setAppLocalePath = (url) => {
    //no validate the param url, assuming it is valid
    angular.forEach(self.rawUrls, (item) => {
      if (item.path === self.i18nConfig.localeAppPath) {
        item.path = url;
        item.overridden = true;
      }
    });
  };

  cPath = new Path();
  cPath.resolve();

  this.$get = i18nTokenFactory;

  function i18nTokenFactory($cookies, $location, $log) {
    let cookieLocale = $cookies.get(this.i18nConfig.localeCookie),
      locale = this.i18nConfig.defaultLocale,
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
        $log.warn(`Decode cookie failed: ${cookieLocale}`);
      }
    }

    angular.forEach(this.rawUrls, (raw) => {
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
          normalizedPath = raw.path.replace(/\{version\}/g, this.VERSION);
        }
        localeUrls.push(normalizedPath);
      }
    });
    return {
      /**
       * @name i18nToken#getUrls
       *
       * @description get a list of URLs that reference locale files.
       */
      getUrls: () => localeUrls,

      /**
       * @name i18nToken#getCurrentLocale
       *
       * @description Get the current locale value.
       */
      getCurrentLocale: () => locale
    };
  }
  i18nTokenFactory.$inject = ['$cookies', '$location', '$log'];
}

I18nTokenProvider.$inject = ['i18nConfig', 'VERSION'];
export default I18nTokenProvider;
