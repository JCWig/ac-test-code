'use strict';

var angular = require('angular');

/**
 * @description I18nToken is object that instantiated from i18nToken service, use during run phase
 *
 * @param {object} config default config defined in .constant
 * @param {string=} loc  a locale value to be used, if it empty, default locale "en_US" will be used
 * @param {array | string=} urls   array or string type of path and part if any to be added to component default path
 */
var I18nToken = function(config, loc, urls) {
    var locale = loc || config.defaultLocale,
        localeUrls = [config.localePath],
        localeCookie = config.localeCookie;

    if (angular.isDefined(urls)) {
        if (angular.isArray(urls) && urls.length) {
            localeUrls.push.apply(localeUrls, urls);
        } else if (angular.isString(urls) && urls.trim().length) {
            localeUrls.push(urls);
        }
    }
    this.getUrls = function() {
        return localeUrls;
    };
    this.getLocale = function() {
        return locale;
    };
};


/**
 * @ngdoc overview
 *
 * @name akamai.components.i18n
 *
 * @description This module provides services and configuration for setting up i18n capabilities for any applications.
 *
 */
module.exports = angular.module('akamai.components.i18n', require('angular-translate'))

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:i18nConfig
 *
 * @description This 'i18nConfig' constant service provides default config constant values
 *
 * | key | value | type | description
 * |-----------|-----------------|-----------------------------------------------------------------------------|
 * | localeCookie | AKALOCALE | {@type string} | This cookie name is widely used from some of Luna apps |
 * | localePath | '../../../locales/component-locales/' | {@type string} | This path value is to component locale file. (subject to change) |
 * | defaultLocale | en_US | {@type string} | Default locale string value. |
 */
.constant("i18nConfig", {
    localeCookie: 'AKALOCALE',
    localePath: '../../../locales/component-locales/',
    defaultLocale: 'en_US'
})

/**
 * @ngdoc object
 *
 * @name akamai.components.i18n.config
 *
 * @description This config block takes $translateProvider and sets up some methods for loading the locale resource file when in run phase.
 *
 * __NOTE__ localeStorage is not used, the browser will not cache the locale string
 *
 */
.config(['$translateProvider', 'i18nConfig', function($translateProvider, config) {
    $translateProvider.useLoader('i18nLoader', {});
    $translateProvider.preferredLanguage(config.defaultLocale);
    $translateProvider.fallbackLanguage(config.defaultLocale);
$translateProvider.useLocalStorage();
    $translateProvider.determinePreferredLanguage();
}])

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:i18nTokenProvider
 *
 * @description This 'i18nToken' provider service provides methods for pass in the locale and path token info during config phase.
 * and it also invokes I18nToken object that consumes those locale and path values during run phase
 */
.provider('i18nToken', require('./i18n-token-provider'))

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:i18nCustomLoader
 *
 * @description This 'i18nCustomLoader' factory service provides loader functionalities set for $translationProvider during config phase,
 * then during run phase it will call back to make rest calls to obtain locale files.
 * The loader performs loading multiple locale resource files and combining into one translation table for $translate service, directive and filter.
 */
.factory('i18nCustomLoader', require('./i18n-custom-loader-service'))

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:i18nTranslationResolver
 *
 * @description This 'i18nTranslationResolver' factory service provides translation service for translation table looking up in async manner.
 * It provides "getTranslation" method pass in locale keys as array or object hash that includes variable replacement as props param and resolve with array of values
 * This service is intended mostly for use in controllers when uncertain of whether translation table loaded or not.
 */
.factory('i18nTranslationResolver', require('./i18n-translation-resolver-service'))

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:i18nToken
 *
 * @description i18nToken is simple service for holding I18nToken object values set by i18nTokenProvider in config phase, and will be invoked in run phase
 */
.service('i18nToken', ["i18nConfig", I18nToken])

/**
 * This run block sets up the locale value and fires up "translateChangeSuccess" event
 *
 * __NOTE__ Since run block is last flow, so only this block complete finished, the $translation table is loaded.
 */
.run(['$translate', '$timeout', 'i18nToken', function($translate, $timeout, i18nToken) {
    $timeout(function() {
        $translate.use(i18nToken.getLocale());
    });
}]);
