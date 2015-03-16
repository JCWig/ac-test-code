'use strict';

var angular = require('angular');
require('angular-translate');
require('angular-cookies');

/**
 * @ngdoc overview
 *
 * @name akamai.components.i18n
 *
 * @requires angular-translate
 *
 * @requires ngCookies
 *
 * @description Provides services to configure internationalization
 * capabilities for any application.
 *
 */
module.exports = angular.module('akamai.components.i18n', ['pascalprecht.translate', 'ngCookies'])

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:i18nConfig
 *
 * @description A service that provides default configuration constant
 * values.
 *
 * | key | value | type | description
 * |-----------|-----------------|-----------------------------------------------------------------------------|
 * | localeCookie | `AKALOCALE` | {@type string} | A cookie name widely used in Luna portal applications |
 * | localePath | `assets/akamai-components/{version}/locales/` | {@type string} | A path that references component locale files. |
 * | defaultLocale | `en_US` | {@type string} | The default locale string value. |
 */
.constant("i18nConfig", {
    localeCookie: 'AKALOCALE',
    localePath: '/assets/akamai-components/{version}/locales/',
    defaultLocale: 'en_US',
    baseVersion: "0.0.1"
})

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:translate
 *
 * @requires pascalprecht.translate.$translate
 *
 * @description A wrapper for the angular `$translate` service,
 * providing both blocking and asynchronous methods to translate
 * string keys.
 *
 */
.factory('translate', require('./translate-service'))

/**
 * @ngdoc directive
 *
 * @name akamai.components.i18n.directive:akamTranslate
 *
 * @requires translate
 *
 * @description A directive used in the DOM element where you want to
 * translate the key.
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
 *
 * @requires translate
 *
 * @description A filter used in the DOM element and JavaScript where
 * you want to translate the key.
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
 * @requires  $cookies
 *
 * @requires i18nConfig
 *
 * @description This service contains an object that exposes two
 * getter methods that return values set by
 * {@link akamai.components.i18n.service:i18nTokenProvider `i18nTokenProvider`}
 * in an application's configuration phase.
 *
 */
/* @ngInject */
.service('i18nToken')

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:i18nTokenProvider
 *
 * @requires i18nConfig
 *
 * @description Provides methods allow you to pass in application
 * locale path values during a configuration phase. It invokes the
 * I18nToken service object that consumes those locale and path values
 * during run phase.
 *
 */
.provider('i18nToken', require('./i18n-token-provider'))

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:i18nCustomLoader
 *
 * @requires $http
 *
 * @requires $q
 *
 * @requires i18nToken
 *
 * @requires i18nConfig
 *
 * @description A factory service provides loader functionalities set
 * for `$translationProvider` during an application's configuration
 * phase. During its run phase, it makes REST calls back to obtain
 * locale files and set to translation table. It loads locale resource
 * files and builds a translation table for use by the `$translate`
 * service, directive, and filter.
 *
 */
.factory('i18nCustomLoader', require('./i18n-custom-loader-service'))

/**
 * @ngdoc object
 *
 * @name akamai.components.i18n.config
 *
 * @requires pascalprecht.translate.$translateProvider
 *
 * @requires i18nConfig
 *
 * @description This config block takes $translateProvider and sets up
 * some methods for loading the locale resource file when in run
 * phase.
 *
 * __NOTE__: localeStorage is not used, the browser will not cache the
 * language key.
 *
 * __NOTE__: To prevent from page flicks due to async nature, we suggest
 * any usages of translate in markup, add "translate-cloak" on body
 * tag, and add `.translate-cloak {display: none !important; }` in CSS.
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
 * __NOTE__: Since run block is last flow, only this block completed, the $translation table is sure loaded.
 */
/* @ngInject */
.run(function($translate, i18nToken) {
    $translate.use(i18nToken.getCurrentLocale());
});
