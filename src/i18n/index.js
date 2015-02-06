'use strict';

var angular = require('angular');
require('angular-translate');

/**
 * @ngdoc overview
 *
 * @name akamai.components.i18n
 *
 * @description This module provides services and configuration for setting up i18n capabilities for any applications.
 *
 */
module.exports = angular.module('akamai.components.i18n', ['pascalprecht.translate'])

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
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:akamTranslate
 *
 * @description akamTranslate is a wrapper service to expose get method for angular $translate service instant method for javascript to use
 *
 */
.factory('akamTranslate', require('./i18n-translate-wrapper-service'))

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:i18nToken
 *
 * @description i18nToken is simple service for holding I18nToken object values set by i18nTokenProvider in config phase, and will be invoked in run phase
 */
/* @ngInject */
.service('i18nToken')

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
 * @ngdoc object
 *
 * @name akamai.components.i18n.config
 *
 * @description This config block takes $translateProvider and sets up some methods for loading the locale resource file when in run phase.
 *
 * *NOTE* localeStorage is not used, the browser will not cache the locale string
 *
 */
/* @ngInject */
.config(function($translateProvider, i18nConfig) {
    $translateProvider.useLoader('i18nCustomLoader', {});
    $translateProvider.preferredLanguage(i18nConfig.defaultLocale);
    $translateProvider.fallbackLanguage(i18nConfig.defaultLocale);
    //$translateProvider.useLocalStorage();
    $translateProvider.determinePreferredLanguage();
})

/**
 * This run block sets up the locale value and fires up "translateChangeEnd" event
 *
 * _*NOTE* Since run block is last flow, so only this block completely finished, the $translation table is loaded.
 */
/* @ngInject */
.run(function($rootScope, $translate, $timeout, i18nToken) {
    $translate.use(i18nToken.getLocale());
});
