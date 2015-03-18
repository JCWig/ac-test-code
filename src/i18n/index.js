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
 * @param {String} [localeCookie=AKALOCALE] A cookie name widely used
 * in Luna portal applications.
 *
 * @param {String} [localePath=assets/akamai-components/{version}/locales/]
 * A path that references component locale files.
 *
 * @param {String} [defaultLocale=en_US] The default locale string
 * value.
 *
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
 * providing both
 * {@link akamai.components.i18n.service:translate#methods_async asynchronous}
 * and
 * {@link akamai.components.i18n.service:translate#methods_sync blocking}
 * methods to translate string keys.
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
 * @description Inserts a translated key into the current DOM element.
 * For example:
 *
 * <pre>
 * <any akam-translate="any.key"></any>
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
 * you want to translate the key.  For example:
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
 * @description Provides two getter methods that return values set by
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
 * @description A factory service that adds loader methods to
 * `$translationProvider` during an application's configuration
 * phase. During run phase, it makes REST calls back to obtain locale
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
 * @description Adds methods to `$translateProvider` that load any
 * locale resource files for an application's run phase.
 *
 * __NOTE__: localStorage is not used, the browser will not cache the
 * language key.
 *
 * __NOTE__: To prevent asynchronous translation calls from causing
 * rendering problems, add a `translate-cloak` class on the `<body>`
 * tag, and pair it in CSS with `.translate-cloak {display:none
 * !important;}.`
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
