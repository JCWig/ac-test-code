import angular from 'angular';

class I18nTokenProvider {

  constructor(i18nConfig, VERSION) {
    this.config = i18nConfig;
    this.VERSION = VERSION;
    this.rawUrls = [];

  }

  get rawUrls() {
    return this.rawUrls;
  }

  set rawUrls(arrUrl) {
    if (arrUrl && arrUrl.length) {
      this.rawUrls = arrUrl;
    } else {
      this.rawUrls[{
        path: this.config.LOCALE_COMPONENT_PATH,
        app: false,
        overridden: false
      }, {
        path: this.config.LOCALE_APP_PATH,
        app: true,
        overridden: false
      }];
    }
    this.rawUrls = arrUrl;
  }

  setComponentLocalePath(url) {
    angular.forEach(this.rawUrls, (item) => {
      if (item.path === i18nConfig.localeComponentPath) {
        item.path = url;
        item.overridden = true;
      }
    });
  }

  setAppLocalePath(url) {
    angular.forEach(this.rawUrls, (item) => {
      if (item.path === i18nConfig.localeAppPath) {
        item.path = url;
        item.overridden = true;
      }
    });
  }

  /*@ngInject*/
  $get($cookies, $location, $log) {
    let cookieLocale = $cookies.get(i18nConfig.localeCookie),
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
        $log.warn(`Decode cookie failed: ${cookieLocale}`);
      }
    }

    angular.forEach(this.rawUrls(), function(raw) {
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
       * @name i18nToken#getUrls
       *
       * @description get a list of URLs that reference locale files.
       * @return {String[]} List of locale urls.
       */
      getUrls: () => localeUrls,

      /**
       * @name i18nToken#getCurrentLocale
       *
       * @description Get the current locale value.
       * @return {String} The current locale, in a Java readable format (i.e. "en_US")
       */
      getCurrentLocale: () => locale
    };
  }

}

function i18nTokenFactory($cookies, $location, $log) {
  let cookieLocale = $cookies.get(i18nConfig.localeCookie),
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
      $log.warn(`Decode cookie failed: ${cookieLocale}`);
    }
  }

  angular.forEach(this.rawUrls(), function(raw) {
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
     * @name i18nToken#getUrls
     *
     * @description get a list of URLs that reference locale files.
     * @return {String[]} List of locale urls.
     */
    getUrls: () => localeUrls,

    /**
     * @name i18nToken#getCurrentLocale
     *
     * @description Get the current locale value.
     * @return {String} The current locale, in a Java readable format (i.e. "en_US")
     */
    getCurrentLocale: () => locale
  };
}


i18nTokenFactory.$inject = ['$cookies', '$location', '$log'];
/*@ngInject*/
/*  $get($cookies, $location, appName = "appname") {
    const URL_REG = /[^/]\/apps\/([a-z0-9-]+)?[/?]?/;
    let localeUrls = [],
      locale = this.config.DEFAULT_LOCALE;

    let cookieValue = $cookies.get(this.config.LOCALE_COOKIE);
    if (cookieValue) {
      //try to fall back to default locale in case of improperly encoded cookies
      try {
        //try decode cookieLocale, then get first array value from split of non alpha, non digits and non underscore
        locale = atob(cookieValue).split(/(?![A-Za-z0-9-_])/)[0];
      } catch (e) {} //let it go
    }

    angular.forEach(this.rawUrls, (raw, normalizedPath = "") => {
      if (raw.app) {
        // browser url lookups for app locale path to get app name. e.g. https://control.akamai.com/apps/billing-center/somethingelse
        // Capture string in pattern from path  apps/{}/
        let matchResults = URL_REG.exec(decodeURIComponent($location.absUrl()));
        if (matchResults) {
          appName = matchResults[1] || appName;
        }
        normalizedPath = raw.path.replace(/\{appname\}/g, appName);
      } else {
        normalizedPath = raw.path.replace(/\{version\}/g, this.config.BASE_VERSION);
      }
      localeUrls.push(normalizedPath);
    });

    return {
      getUrls: () => localeUrls,
      getCurrentLocale: () => locale
    };
  }
}

I18nTokenProvider.$inject = ['i18nConfig', 'VERSION'];



module.exports = function i18nTokenProvider(i18nConfig, VERSION) {
  var self = this,
    cPath;

  /**
   * Constructs a URLs array in the Path class for use
   * in the `i18nCustomLoader` service. Paths include
   * `/libs/akamai-core/{version}/locales/` for components and
   * `/apps/{appname}/locales/` for apps, where `{version}` and
   * `{appname}` are replaced by their proper values in the `$get`
   * constructor.
   *
   */
//  var Path = function() {
/**
 * resolve function adds 2 default endpoints path of locale
 * files to rawUrls array one for the component and one for the app
 * @private
 */
/*  this.resolve = function() {
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
*/
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
/*  this.setComponentLocalePath = function(url) {
    //no validate the param url, assuming it is valid
    angular.forEach(this.rawUrls, function(item) {
      if (item.path === i18nConfig.localeComponentPath) {
        item.path = url;
        item.overridden = true;
      }
    });
  };
*/
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
/*this.setAppLocalePath = function(url) {
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

  this.$get = i18nTokenFactory;

  function i18nTokenFactory($cookies, $location, $log) {
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
*/
/**
 * @name i18nToken#getUrls
 *
 * @description get a list of URLs that reference locale files.
 * @return {String[]} List of locale urls.
 */
// getUrls: function() {
//   return localeUrls;
// },

/**
 * @name i18nToken#getCurrentLocale
 *
 * @description Get the current locale value.
 * @return {String} The current locale, in a Java readable format (i.e. "en_US")
 */
//getCurrentLocale: function() {
//   return locale;
// }
//};
//}

//i18nTokenFactory.$inject = ['$cookies', '$location', '$log'];
//};

I18nTokenProvider.$inject = ['i18nConfig', 'VERSION'];
export default I18nTokenProvider;
