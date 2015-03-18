'use strict';

/* @ngInject */
module.exports = function i18nTokenProvider(i18nConfig) {
    this.rawUrls = [];
    var self = this;

    /**
     *
     * @description This function adds path and part value to URLs
     * array and it will be used in the i18nCustomLoader service.  If
     * `path` is an array, path value should contain part value if any
     * already, and implemented by caller.  If `path` is a string, it
     * attempts to append the part value if any.
     *
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
        };
    /**
     * @ngdoc method
     *
     * @name i18nTokenProvider#addAppLocalePath
     *
     * @methodOf akamai.components.i18n.service:i18nTokenProvider
     *
     * @description provider method to add app locale files path and
     * part
     *
     * @param {array | string} path - an array of URL path value or
     * URL path string value
     *
     * @param {string=} part - a value to append to the path,
     * e.g. "message" prefix: "message_en_US"
     *
     */
    this.addAppLocalePath = function(path, part) {
        return usePathAndPart(path, part);
    };

    //instantiate a default one for component locale
    var cPath = new Path();
    cPath.resolve();

    /**
     *
     * A service used by the `i18nTokenProvider` to pass values set
     * during the application's configuration phase. The `locale`
     * value is determined by the `AKALOCALE` cookie set by Luna
     * portal, otherwise the fallback value is `en_US`.
     *
     * @return {object} A hash containing two getter
     * methods, mainly for use by
     * {@link akamai.components.i18n.service:i18nCustomLoader `i18nCustomLoader`}.
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
                normalizedPath = raw.path.replace(/\{version\}/g, i18nConfig.baseVersion);
            }
            localeUrls.push(normalizedPath);
        });
        return {
            /**
             * @ngdoc method
             *
             * @name i18nToken#getUrls
             *
             * @methodOf akamai.components.i18n.service:i18nToken
             *
             * @description get a list of URLs that reference locale
             * files.
             *
             */
            getUrls: function() {
                return localeUrls;
            },
            /**
             * @ngdoc method
             *
             * @name i18nToken#getCurrentLocale
             *
             * @methodOf akamai.components.i18n.service:i18nToken
             *
             * @description Get the current locale value.
             *
             */
            getCurrentLocale: function() {
                return locale;
            }
        };
    };
};
