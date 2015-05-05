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
module.exports = angular.module('akamai.components.i18n',
  ['pascalprecht.translate', 'ngCookies', require('../utils').name])

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:i18nConfig
 *
 * @description A service that provides default configuration constant
 * values.
 *
 * @param {Array} availableLangKeys A list of available language key
 * names, useful in validating before loading the corresponding locale
 * file.
 *
 * @param {String} [baseVersion=0.0.1] The version of the locale
 * component data.
 *
 * @param {String} [defaultLocale=en_US] The default locale string
 * value.
 *
 * @param {Object} langKeysMapper Maps language names to the names of
 * translation tables.
 *
 * @param {String} [localeAppPath=apps/{appName}/locales/]
 * A path that references application locale files.
 *
 * @param {String} [localeComponentPath=assets/akamai-core/{version}/locales/]
 * A path that references component locale files.
 *
 * @param {String} [localeCookie=AKALOCALE] A cookie name widely used
 * in Luna portal applications.
 *
 * @param {String} localePrefix A custom prefix to add before a
 * language key name. For example, `message_` produces
 * `message_en_US`.
 *
 */
  .constant('i18nConfig', {
    localeCookie: 'AKALOCALE',
    localeComponentPath: '/libs/akamai-core/{version}/locales/',
    localeAppPath: '/apps/{appname}/locales/',
    defaultLocale: 'en_US',
    localePrefix: '',
    availableLangKeys: ['de_DE', 'en_US', 'en_US_ATT', 'es_ES', 'es_LA', 'fr_FR', 'it_IT',
    'ja_JP', 'ko_KR', 'pt_BR', 'zh_CN', 'zh_TW'],
      /*eslint-disable camelcase */
    langKeysMapper: {
      de_DE: 'de_DE',
      en_US: 'en_US',
      en_US_ATT: 'en_US_ATT',
      es_ES: 'es_ES',
      es_LA: 'es_LA',
      fr_FR: 'fr_FR',
      it_IT: 'it_IT',
      ja_JP: 'ja_JP',
      ko_KR: 'ko_KR',
      pt_BR: 'pt_BR',
      zh_CN: 'zh_CN',
      zh_TW: 'zh_TW',
      '*': 'en_US'
    }
    /*eslint-enable camelcase */
  })

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:LOCALE
 *
 * @description A service that provides datetime and number locale constant values,
 * that includes 12 supported locales and sections based on locale names,
 * such as: 'en_US', 'de_DE'
 *
 */
  .constant('LOCALES', require('./i18n-locale-constant'))

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
 * <any akam-translate='any.optionally.nested.key'></any>
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
 * <any>{{'translationId' | akamTranslate}}</any>
 * </pre>
 *
 * <pre>
 * <any abc='{number: myNumber}''>{{'translationId' | akamTranslate : abc}}</any>
 * </pre>
 *
 * <pre>
 * var translatedValue = $filter('akamTranslate')('translationId');
 * </pre>
 *
 */
  .filter('akamTranslate', require('./translate-filter'))

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:i18nToken
 *
 * @requires $location
 *
 * @requires $cookies
 *
 * @requires i18nConfig
 *
 * @description Provides two getter methods that return values set by
 * {@link akamai.components.i18n.service:i18nTokenProvider i18nTokenProvider}
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
 * `I18nToken` service object that consumes those locale and path
 * values during run phase.
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
 * files and builds a translation table for use by the `translate`
 * service, directive, and filter.
 *
 */
  .factory('i18nCustomLoader', require('./i18n-custom-loader-service'))

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.config
 *
 * @requires pascalprecht.translate.$translateProvider
 *
 * @requires i18nConfig
 *
 * @description Adds methods to `$translateProvider` that load any
 * locale resource files for an application's run phase.
 * Also a decorator for service of $locale to inject DATETIME_FORMATS and NUMBER_FORMATS
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
  .config(function($provide, $translateProvider, i18nConfig) {
    $translateProvider
      .registerAvailableLanguageKeys(i18nConfig.availableLangKeys, i18nConfig.langKeysMapper)
      .useLoader('i18nCustomLoader')
      .useSanitizeValueStrategy('escaped')
      .preferredLanguage(i18nConfig.defaultLocale)
      .fallbackLanguage(i18nConfig.defaultLocale)
      .cloakClassName('util-hide')
      .determinePreferredLanguage()
      .useMissingTranslationHandler('missingTranslationFactory');

    /**
     * a decorator to intercept $locale service and add datetime abd number
     * values specific for current locale
     * @param  {object} $delegate original $locale service object
     * @param  {object} i18nToken a factory service holds value of current locale
     * @param  {object} LOCALES locale constant
     * @return {object} $delegate modified $locale service object
     */
    $provide.decorator('$locale', ['$delegate', 'i18nToken', 'LOCALES',
      function($delegate, i18nToken, LOCALES) {
      var loc = LOCALES[i18nToken.getCurrentLocale()];

      if (loc) {
        $delegate.DATETIME_FORMATS = loc.DATETIME_FORMATS;
        $delegate.NUMBER_FORMATS = loc.NUMBER_FORMATS;
      }
      return $delegate;
    }]);
  })

/**
 * @ngdoc service
 *
 * @name akamai.components.i18n.service:missingTranslationFactory
 *
 * @requires $log
 * @requires i18nToken
 *
 * @description This service factory sole purpose is to Intercept missing
 * translation key error, log error in the console (not blocking)
 *
 */
  /* @ngInject */
  .factory('missingTranslationFactory', function($log, i18nToken) {
    return function(translationID) {
      $log.warn('Missing ' + translationID + ' key in ' + i18nToken.getCurrentLocale() + ' table.');
    };
  })

/**
 * This run block tells angular $translate service to use per language key,
 * so the current translation table will be based upon that.
 * __NOTE__: Since run block is last flow, only this block completed,
 * the $translation table is sure loaded.
 */
  /* @ngInject */
  .run(function($translate, i18nToken, i18nConfig) {
    //it loads twice using 'use' function if current locale is different from default locale
    if (i18nToken.getCurrentLocale() === i18nConfig.defaultLocale) {
      $translate.use(i18nToken.getCurrentLocale());
    }
  });
