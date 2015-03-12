'use strict';

/* @ngInject */
module.exports = function i18nTokenProvider(i18nConfig) {
    this.rawUrls = [];
    var self = this;

    /**
     * @description  Path object that constructs a path value from app or component.
     */
    var Path = function() {
        /**
         * Path function that determine whether call frm app or component and resolves (adds) the correct path of locale file to urls array
         * @param {object} config that contains path values
         * var config = {
         *  path: "/src/json/messages/",
         *  prefix: "message_",
         *  appName: "billing-center"
         * }
         * @param {boolean} fromApp is a indicator to determine the call is from app or component
         */
        this.resolve = function(config, fromApp) {
            var isNotValidConfig = angular.isUndefined(config) || config === null,
                hasPath = isNotValidConfig ? false : !!(config.path && config.path.trim().length),
                rawPath = "";
            if (fromApp) {
                rawPath = i18nConfig.localeAppPath;
                if (hasPath) {
                    var isPathStartWithSlash = config.path.charAt(0) === "/",
                        name = config.appName ? ("/apps/" + config.appName) : "";
                    config.path = isPathStartWithSlash ? config.path : "/" + config.path;
                    rawPath = name + config.path + (config.prefix || i18nConfig.localePrefix);
                }
            } else {
                rawPath = i18nConfig.localeComponentPath;
            }
            self.rawUrls.push({
                path: rawPath.toLowerCase(),
                app: fromApp || false
            });
            return rawPath;
        };
    };

    //instantiate a default one for component locale
    var cPath = new Path();
    cPath.resolve();

    /**
     * @ngdoc method
     * @name i18nTokenProvider#addAppLocalePath
     * @methodOf akamai.components.i18n.service:i18nTokenProvider
     *
     * @description provider method takes path config values, pass to Path object to add values to path url endpoints.
     * If config is undefined or config.path is undefined or empty, it will use default app path instead
     * @param {object=} config - a hash object that contains  locale files path,  prefix values and appName
     */
    this.addAppLocalePath = function(config) {
        var path = new Path();
        return path.resolve(config, true);
    };

    /**
     * i18nToken is a service used by the i18nTokenProvider to pass values set during app config phase.
     * Use AKALOCALE cookie set by Luna portal to determine locale value, and fall back locale will be "en_US".
     * Normalized component locale path is constructed by baseVersion value set from default config to replace {version} placeholder
     * Normalized app locale path is constructed by looking up the browser url using $location service to determine {appName} placeholder in certain patterns
     * @return {object} it returns object hash contains 2 getter methods mainly for customLoader to consume
     */
    /* @ngInject */
    this.$get = function i18nTokenFactory($cookies, i18nConfig, $location) {
        var cookieLocale = $cookies[i18nConfig.localeCookie],
            locale = i18nConfig.defaultLocale,
            localeUrls = [],
            appName, matchResults,
            normalizedPath,
            // valid chars: lower case alpha, digits, and hyphen for possible appName from url
            appUrlRx = /[^/]\/apps\/([a-z0-9-]+)?[/?]?/;

        //just to prevent from improperly encoded cookies
        if (cookieLocale) {
            try {
                locale = atob(cookieLocale.split('+')[0]);
            } catch (e) {} //let it go
        }

        //check if app has called to pass locle file url path yet, if not, add default one here
        if (this.rawUrls.length === 1) {
            this.rawUrls.push({
                path: i18nConfig.localeAppPath,
                app: true
            });
        }

        angular.forEach(this.rawUrls, function(raw) {
            if (raw.app) {
                appName = "appname";
                matchResults = [];
                //only doing browser url lookups for app locale path to get app name. e.g. https://control.akamai.com/apps/billing-center/somethingelse
                // Capture section in path after apps/
                matchResults = appUrlRx.exec(decodeURIComponent($location.absUrl()));
                if (matchResults) {
                    appName = matchResults[1];
                }
                normalizedPath = raw.path.replace(/\{appname\}/g, appName);
            } else {
                normalizedPath = raw.path.replace(/\{version\}/g, i18nConfig.baseVersion);
            }
            localeUrls.push(normalizedPath);
        });
        return {
            /**
             * @ngdoc method
             * @name i18nToken#getUrls
             * @methodOf akamai.components.i18n.service:i18nToken
             *
             * @description get a list of urls endpoints for locale files
             *
             */
            getUrls: function() {
                return localeUrls;
            },
            /**
             * @ngdoc method
             * @name i18nToken#getCurrentLocale
             * @methodOf akamai.components.i18n.service:i18nToken
             *
             * @description get current locale value
             *
             */
            getCurrentLocale: function() {
                return locale;
            }
        };
    };
};
