'use strict';

/* @ngInject */
module.exports = function I18nTokenProvider(i18nConfig) {
    this.locale = i18nConfig.defaultLocale;
    this.urls = [i18nConfig.localePath];

    this.useLocale = function(loc) {
        locale = loc;
    };
    /**
     * @ngdoc method
     * @name akamai.components.i18n.I18nTokenProvider#usePathAndPart
     * @methodOf akamai.components.i18n.I18nTokenProvider
     *
     * @description add locale files path and part to the urls array, so when in service gets invoked,
     * it will carry those values and to be used in customLoader
     * @param {array | string} path The array type contains path info to the file (part should be appended from caller, in this case).
     * If path is string type, then path just the path to locale file, there will be no part info
     * @param {string=} part The string value to be appended to the path, e.g. message_xxx
     *
     */
    this.usePathAndPart = function(path, part) {
        if (angular.isDefined(path)) {
            if (angular.isArray(path) && path.length) {
                this.urls.push.apply(this.urls, path);
            } else if (angular.isString(path) && path.trim().length) {
                this.urls.push(path + part);
            }
        }
    };

    this.$get = function i18nTokenFactory() {
        var locale = this.locale,
            localeUrls = this.urls;
        return {
            getUrls: function() {
                return localeUrls;
            },
            getLocale: function() {
                return locale;
            }
        }
    };
};
