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
 * @description This module provides services and configuration for setting up i18n capabilities for any applications.
 *
 */
module.exports = angular.module('akamai.components.i18n', ['pascalprecht.translate', 'ngCookies'])

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:i18nConfig
 *
 * @description This 'i18nConfig' constant service provides default config constant values
 *
 * | key | value | type | description
 * |-----------|-----------------|-----------------------------------------------------------------------------|
 * | localeCookie | AKALOCALE | {@type string} | This cookie name is widely used from Luna portal apps |
 * | localeComponentPath | 'libs/akamai-components/{version}/locales/' | {@type string} | This path value is to component locale file. |
 * | localeAppPath | 'apps/{appName}/locales/' | {@type string} | This path value is to app locale file. |
 * | defaultLocale | en_US | {@type string} | Default locale string value. |
 * | baseVersion | '0.0.1' | {@type string} | This path value is to component locale file. (subject to change) |
 */
.constant("i18nConfig", {
    localeCookie: 'AKALOCALE',
    localeComponentPath: 'libs/akamai-components/{version}/locales/',
    localeAppPath: '/apps/{appName}/locales/',
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
 * This service contains 2 API methods, translate.sync(key, args) is for blocking method  same as $translate.instant(key, args),
 * and translate.async(keys).then(function(results) {}) for non-blocking fashion, same as $translate(key, args)...
 * *NOTE* usage examples are detailed in translate-service.js
 */
.factory('translate', require('./translate-service'))

/**
 * @ngdoc directive
 *
 * @name akamai.components.i18n.directive:akamTranslate
 * @requires translate
 * @description A directive used in the dom element where you want to translate the key
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
 * @description This 'i18nToken' is a tiny service containing object that exposes 2 getter methods(getCurrentLocale(), and getUrls(),
 * those getter methods return values set by i18nTokenProvider in config phase
 */
/* @ngInject */
.service('i18nToken')

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:i18nTokenProvider
 * @requires i18nConfig
 * @requires $locationProvider
 *
 * @description This 'i18nToken' provider provides methods allow to pass in the application locale path value(s) during config phase.
 * And it also invokes I18nToken service object that consumes those locale and path values during run phase
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
 * @description This 'i18nCustomLoader' factory service provides loader functionalities set for $translationProvider during config phase,
 * then during run phase, it will call back to make rest calls to obtain locale files and set to translation table.
 * The loader can performs loading multiple locale resource files and combining into one translation table for $translate service, directive and filter to use.
 *
 */
.factory('i18nCustomLoader', require('./i18n-custom-loader-service'))

/**
 * @ngdoc object
 *
 * @name akamai.components.i18n.config
 *
 * @requires pascalprecht.translate.$translateProvider
 * @requires i18nConfig
 *
 * @description This config block takes $translateProvider and sets up methods for
 * fallback, call into customLoader, intercept missing key messages, register avalable keys.
 *
 * *NOTE* localeStorage is not used, the browser will not cache the language key
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
 * @description intercepting missing translation key error, so log for our info purpose
 *
 */
.factory('missingTranslationFactory', function($log, i18nToken) {
    // has to return a function which gets a tranlation id
    return function(translationID) {
        $log.error("Missing " + translationID + " key in " + i18nToken.getCurrentLocale() + " table.");
    };
})

/**
 * This run block tells angular $translate service to use per language key, so the current translation table will be based upon that.
 * *NOTE* Since run block is last flow, only this block completed, the $translation table is sure loaded.
 */
/* @ngInject */
.run(function($translate, i18nToken) {
    //it loads twice using "use" function if current locale is different from default locale
    //$translate.use(i18nToken.getCurrentLocale());
});
