'use strict';

/* @ngInject */
module.exports = function i18nTokenProvider(i18nConfig) {
    this.currentLocale = i18nConfig.defaultLocale;
    this.urls = [i18nConfig.localePath];
    var self = this;

    /**
     * This function adds path and part value to urls array and it will be used in the i18nCustomLoader service.
     *
     * @param {array | string} path - an array of url path value or url path string value
     * @param {string=}  part - a value to append to the path
     */
    var usePathAndPart = function(path, part) {
        if (angular.isUndefined(path) || path === null) {
            return;
        }
        if (angular.isArray(path) && path.length) {
            self.urls.push.apply(self.urls, path);
        } else if (angular.isString(path) && path.trim().length) {
            self.urls.push(path + (part || ""));
        } else {
            return;
        }
    };

    this.useLocale = function(loc) {
        this.currentLocale = loc;
    };
    /**
     * @ngdoc method
     * @name akamai.components.i18n.I18nTokenProvider#addAppLocalePath
     * @methodOf akamai.components.i18n.I18nTokenProvider
     *
     * @description provider method to add app locale files path and part
     * @param {array | string} path value to the locale file used in the customLoader
     * if path is array type, path value should contain part value if any already, and implemented by caller.
     * If path is string type, then it will atrempt to append the part value if any
     *
     */
    this.addAppLocalePath = function(path, part) {
        return usePathAndPart(path, part);
    };

/**
 * i18nToken is a simple service to expose 2 methods and pass values set by the provider
 * @return {object} it returns object hash contains 2 getter methods for mainly customLoader to use
 */
    this.$get = function i18nTokenFactory() {
        var locale = this.currentLocale,
            localeUrls = this.urls;
        return {
            getUrls: function() {
                return localeUrls;
            },
            getCurrentLocale: function() {
                return locale;
            }
        };
    };
};
