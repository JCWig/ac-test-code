'use strict';

var angular = require('angular');
require('angular-translate');
require('angular-cookies');

/**
 * @ngdoc overview
 *
 * @name akamai.components.i18n
 * @requires angular-translate
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
 * | localePath | 'pulsar/akamai-components/locales/1.0.0/' | {@type string} | This path value is to component locale file. (subject to change) |
 * | defaultLocale | en_US | {@type string} | Default locale string value. |
 */
.constant("i18nConfig", {
    localeCookie: 'AKALOCALE',
    localePath: '../../../locales/', //'pulsar/akamai-components/locales/1.0.0/',
    defaultLocale: 'en_US'
})

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:translate
 *
 * @description translate is a service - basically a wrapper for $tranlate service.
 * This service contains 2 API methods, translate.sync(key, args) is for blocking method  same as $translate.instant(key, args),
 * and translate.async(keys) ior akamTranslate.async(key, args) for non-blocking fashion, same as $translate(key, args).then(function(results) {})
 * *NOTE* usage examples are detailed in translate-service.js
 */
.factory('translate', require('./translate-service'))

/**
 * @ngdoc directive
 *
 * @name akamai.components.i18n.directive:akamTranslate
 *
 * @description A directive used in the dom element where you want to translate the key
 * *NOTE* No filter usage for now. There will be no append functionalities. If there is need, resolve it in the javascript.
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
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:i18nToken
 *
 * @description This 'i18nToken' is a tiny service containing object that exposes 2 getter methods,
 * those getter methods return values set by i18nTokenProvider in config phase
 */
/* @ngInject */
.service('i18nToken')

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:i18nTokenProvider
 *
 * @description This 'i18nToken' provider provides methods allow to pass in the locale and path token info during config phase.
 * And it also invokes I18nToken object that consumes those locale and path values during run phase
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
 * @ngdoc object
 *
 * @name akamai.components.i18n.config
 *
 * @description This config block takes $translateProvider and sets up some methods for loading the locale resource file when in run phase.
 *
 * *NOTE* localeStorage is not used, the browser will not cache the language key
 * *NOTE* To prevent from page flicks due to async nature, we suggest any usages of translate in markup,
 * add "tranalate-cloak" on body tag, and add .translate-cloak {display: none !important; } in CSS.
 *
 */
/* @ngInject */
.config(function($translateProvider, i18nConfig) {
    $translateProvider
        .useLoader('i18nCustomLoader')
        .useSanitizeValueStrategy('escaped')
        .preferredLanguage(i18nConfig.defaultLocale)
        .fallbackLanguage(i18nConfig.defaultLocale)
        .determinePreferredLanguage();
})

/**
 * This run block tells angular $translate service to use per language key, so the current translation table will be based upon that.
 * *NOTE* Since run block is last flow, only this block completed, the $translation table is sure loaded.
 */
/* @ngInject */
.run(function($translate, i18nToken) {
    $translate.use(i18nToken.getCurrentLocale());
});
