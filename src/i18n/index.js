'use strict';

var angular = require('angular');
require('angular-translate');
require('angular-cookies');

/**
 * @ngdoc overview
 *
 * @name akamai.components.i18n
 * @requires angular-translate
 * @requires ngCookies
 *
 * @description This module provides configuration for setting up i18n capabilities for any applications and conponents.
 * It also provides injectable service, directive, filter to be used in html and javascript.
 *
 * *NOTE:* if selecting link for i18nTokenProvider do not display anything, go to
 * {@link: http://{server}/#/api/akamai.components.i18n.service:i18nTokenProvider}
 *
 */
module.exports = angular.module('akamai.components.i18n', ['pascalprecht.translate', 'ngCookies'])

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:i18nConfig
 *
 * @description This i18nConfig constant service provides default config constant values
 *
 * | key | value | type | description
 * |-----------|-----------------|-----------------------------------------------------------------------------|
 * | localeCookie | AKALOCALE | {@type string} | This cookie name is widely used from Luna portal apps |
 * | localeComponentPath | '/libs/akamai-components/{version}/locales/' | {@type string} | This path value is to component locale file. |
 * | localeAppPath | 'apps/{appName}/locales/' | {@type string} | This path value is to app locale file. |
 * | defaultLocale | en_US | {@type string} | Default locale string value. |
 * | baseVersion | '0.0.1' | {@type string} | This path value is to component locale file. (subject to change) |
 * | localePrefix | '' | {@type string} | locale file prefix "message_" to "message_en_US" (subject to change) |
 * | availableLangKeys | [key names] | {@type array} | list of available language key names, purpose is to validate if name is not in the list, it won't load locale file (subject to change) |
 * | langKeysMapper | {mapping} | {@type object} | This object contains constant mapping of language names with tranlsation table names (subject to change) |
 *
 */
.constant("i18nConfig", {
    localeCookie: 'AKALOCALE',
    localeComponentPath: '/libs/akamai-components/{version}/locales/',
    localeAppPath: '/apps/{appname}/locales/',
    defaultLocale: 'en_US',
    baseVersion: "0.0.1",
    localePrefix: "",
    availableLangKeys: ['de_DE', 'en_US', 'en_US_ATT', 'es_ES', 'es_LA', 'fr_FR', 'it_IT', 'ja_JP', 'ko_KR', 'pt_BR', 'zh_CN', 'zh_TW'],
    langKeysMapper: {
        'de_DE': 'de_DE',
        'en_US': 'en_US',
        'en_US_ATT': 'en_US_ATT',
        'es_ES': 'es_ES',
        'es_LA': 'es_LA',
        'fr_FR': 'fr_FR',
        'it_IT': 'it_IT',
        'ja_JP': 'ja_JP',
        'ko_KR': 'ko_KR',
        'pt_BR': 'pt_BR',
        'zh_CN': 'zh_CN',
        'zh_TW': 'zh_TW',
        '*': 'en_US'
    }
})

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:translate
 *
 * @requires pascalprecht.translate.$translate
 *
 * @description translate is a service - a wrapper for angular $tranlate service.
 * This service contains 2 API methods, translate.sync(key, args) is a blocking method - a warpper of $translate.instant(key, args),
 * and translate.async(keys).then(function(results) {}) is a non-blocking method - awrapper of $translate(key, args)...
 * *NOTE* Method usage examples are detailed in translate-service.js
 */
.factory('translate', require('./translate-service'))

/**
 * @ngdoc directive
 *
 * @name akamai.components.i18n.directive:akamTranslate
 * @requires translate
 * @description A directive used in the dom element where you want to translate the key, and it only can be used via attribute.
 * it is a wrapper of async translate service method
 *
 * An example of usage:
 *
 * <pre>
 * <any akam-translate="anykey.anykey"></any>
 * </pre>
 *
 * @restrict A
 *
 */
.directive('akamTranslate', require('./translate-directive'))

/**
 * @ngdoc filter
 *
 * @name akamai.components.i18n.filter:akamTranslate
 * @requires translate
 * @description A filter used in the dom element and javascript where you want to translate the key
 * It is a sync tranlsate service method
 *
 * An example of usage:
 *
 * <pre>
 * <any>{{"translationId" | akamTranslate}}</any>
 * </pre>
 *
 * <pre>
 * <any abc="{number: myNumber}">{{"translationId" | akamTranslate : abc}}</any>
 * </pre>
 *
 * <pre>
 * var translatedValue = $filter("akamTranslate")("translationId");
 * </pre>
 *
 */
.filter('akamTranslate', require('./translate-filter'))

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:i18nToken
 *
 * @requires $cookies
 * @requires $location
 * @requires i18nConfig
 *
 * @description The i18nToken is a service constructed by i18nTokenProvider that exposes 2 getter methods(getCurrentLocale(), and getUrls(),
 * those getter methods return values set by i18nTokenProvider in config phase
 */
/* @ngInject */
.service('i18nToken')

/**
 * @ngdoc service
 *
 * @name  akamai.components.i18n.service:i18nTokenProvider
 * @requires i18nConfig
 *
 * @description This i18nTokenProvider adds two locale file path endpoints and locale value for later use
 * And it also invokes i18nToken service object that consumes those locale and path values during run phase
 */
.provider('i18nToken', require('./i18n-token-provider'))

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:i18nCustomLoader
 *
 * @reuires $http
 * @reuires $q
 * @reuires i18nToken
 * @reuires i18nConfig
 *
 * @description The i18nCustomLoader factory service provides loader functionalities set for $translationProvider during config phase,
 * then during run phase, it will call back to use path endpoints make restful calls to obtain locale files and set to translation table.
 * The loader can performs loading multiple locale resource files and combining into one translation table for translate service, directive and filter to use.
 *
 */
.factory('i18nCustomLoader', require('./i18n-custom-loader-service'))

/**
 * @ngdoc function
 *
 * @name akamai.components.i18n.config
 *
 * @requires pascalprecht.translate.$translateProvider
 * @requires i18nConfig
 *
 * @description This config block takes $translateProvider and i18nConfig to set up methods for
 * fallback, call into customLoader, intercept missing key messages, register avalable keys.
 *
 * *NOTE* localeStorage is not used, the browser will not cache the language key
 *
 * <pre>
 *     $translateProvider
        .registerAvailableLanguageKeys(i18nConfig.availableLangKeys, i18nConfig.langKeysMapper)
        .useLoader('i18nCustomLoader')
        .useSanitizeValueStrategy('escaped')
        .preferredLanguage(i18nConfig.defaultLocale)
        .fallbackLanguage(i18nConfig.defaultLocale)
        .determinePreferredLanguage()
        .useMissingTranslationHandler('missingTranslationFactory');
 * </pre>
 *
 */
/* @ngInject */
.config(function($translateProvider, i18nConfig) {
    $translateProvider
        .registerAvailableLanguageKeys(i18nConfig.availableLangKeys, i18nConfig.langKeysMapper)
        .useLoader('i18nCustomLoader')
        .useSanitizeValueStrategy('escaped')
        .preferredLanguage(i18nConfig.defaultLocale)
        .fallbackLanguage(i18nConfig.defaultLocale)
        .determinePreferredLanguage()
        .useMissingTranslationHandler('missingTranslationFactory');
})

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:missingTranslationFactory
 *
 * @reuires $log
 * @reuires i18nToken
 *
 * @description This service factory sole purpose is to Intercept missing translation key error, log error in the console (not blocking)
 *
 */
.factory('missingTranslationFactory', function($log, i18nToken) {
    return function(translationID) {
        $log.error("Missing " + translationID + " key in " + i18nToken.getCurrentLocale() + " table.");
    };
})

/**
 * This run block tells angular $translate service to use per language key, so the current translation table will be based upon that.
 * *NOTE* Since run block is last flow, only this block completed, the $translation table is sure loaded.
 */
/* @ngInject */
.run(function($translate, i18nToken, i18nConfig) {
    //it loads twice using "use" function if current locale is different from default locale
    if (i18nToken.getCurrentLocale() === i18nConfig.defaultLocale) {
        $translate.use(i18nToken.getCurrentLocale());
    }
});
