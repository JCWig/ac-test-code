'use strict';

/* @ngInject */
module.exports = function I18nTokenProvider(i18nConfig) {
    this.locale = i18nConfig.defaultLocale;
    this.urls = [i18nConfig.localePath];

    this.useLocale = function(loc) {
        this.locale = loc;
    };
    this.usePathAndPart = function(path, part) {
        if (angular.isDefined(path)) {
            if (angular.isArray(path) && path.length) {
                this.urls.push.apply(this.urls, path + part);
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
        };
    };
};
