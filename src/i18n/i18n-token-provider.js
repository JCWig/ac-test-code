'use strict';

/* @ngInject */
module.exports = function I18nTokenProvider(i18nConfig) {
    var locale = i18nConfig.defaultLocale,
        partName = i18nConfig.defaultLocale,
        urls = [];


    this.useLocale = function(loc) {
        locale = loc;
    }
    this.usePathAndPart = function(path, part) {
        urls.push(path + part);
    }

    this.$get =  function i18nTokenServiceFactory() {
        return new I18nToken(i18nConfig, locale, urls);
    }
};
