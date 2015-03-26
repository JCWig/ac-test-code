'use strict';

/* @ngInject */
module.exports = function i18nTokenProvider(i18nConfig, VERSION) {
    this.rawUrls = [];
    var self = this;

    /**
     * @description  Path object that constructs a path value from app and component.
     */
    var Path = function() {
        /**
         * resolve function adds 2 default endpoints path of locale files to rawUrls array
         * one for the component and one for the app
         * @private
         */
        this.resolve = function() {
            self.rawUrls.push({
                path: i18nConfig.localeComponentPath,
                app: false
            });

            self.rawUrls.push({
                path: i18nConfig.localeAppPath,
                app: true
            });
        };
    };

    //instantiate a default one for component locale
    var cPath = new Path();
    cPath.resolve();

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
                //try decode cookieLocale, then get first array value from split of non alpha, non digits and non underscore
                locale = atob(cookieLocale).split(/(?![A-Za-z0-9-_])/)[0];
            } catch (e) {} //let it go
        }

        angular.forEach(this.rawUrls, function(raw) {
            if (raw.app) {
                appName = "appname";
                matchResults = [];
                // browser url lookups for app locale path to get app name. e.g. https://control.akamai.com/apps/billing-center/somethingelse
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
