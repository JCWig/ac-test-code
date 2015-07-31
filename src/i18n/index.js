var angular = require('angular');

require('angular-translate');
require('angular-cookies');

function config($provide, $translateProvider, i18nConfig) {
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
}
config.$inject = ['$provide', '$translateProvider', 'i18nConfig'];

function missingTranslation($log, i18nToken) {
  return function(translationID) {
    $log.warn('Missing ' + translationID + ' key in ' + i18nToken.getCurrentLocale() + ' table.');
  };
}
missingTranslation.$inject = ['$log', 'i18nToken'];

function run($translate, i18nToken, i18nConfig) {
  //it loads twice using 'use' function if current locale is different from default locale
  if (i18nToken.getCurrentLocale() === i18nConfig.defaultLocale) {
    $translate.use(i18nToken.getCurrentLocale());
  }
}
run.$inject = ['$translate', 'i18nToken', 'i18nConfig'];

/**
 * @ngdoc module
 * @name akamai.components.i18n
 *
 * @description Provides services to configure internationalization
 * capabilities for any application. The methods described in this module extend
 * `angular-translate`, so applications should use the methods described here instead of the ones
 * made available in `angular-translate`. We provide auto reading of the AKALOCALE cooke to
 * determine the locale that should be set and we also will auto load your translations,
 * represented as JSON files, from a known location, and merge the results with the translation
 * files for akamai-core.
 *
 * Since application i18n keys are merged with keys for akamai-core it is **HIGHLY** recommended
 * that applications surround all of their i18n keys with a root namespace, prefably one that is
 * related to the name of their application. For example, in the Property Manager application we
 * would have the following in their JSON files:
 *
 * <pre>
 * {
 *   "property-manager": {
 *     ...
 *   }
 * }
 * </pre>
 *
 * This will almost guarantee that there will be no conflicts between application translations and
 * ones specific to the akamai-core component library.
 *
 * By default, i18n bundles for applications will be loaded from the URL
 * `/apps/{appName}/locales/`. This is configurable via the `i18nTokenProvider#setAppLocalePath`
 * method.
 *
 * Also note that locales will be read as `locale`.json where locale is something like "en_US".
 * The filename is currently not configurable. Applications must name their locale files to match
 * the list of supported locales in Luna. Currently the supported list of locales is:
 *
 * ```
 * [de_DE, en_US, en_US_ATT, es_ES, es_LA, fr_FR, it_IT, ja_JP, ko_KR, pt_BR, zh_CN, zh_TW]
 * ```
 *
 * @example index.html
 *
 * <!-- preferred usage -->
 * <span akam-translate="a.i18n.key"></span>
 *
 * <!-- acceptable, but may cause performance issues, like all filters do -->
 * <span>{{ 'another.i18n.key' | akamTranslate }}</span>
 *
 * <span>{{ vm.someLabel }}</span>
 *
 * @example app.js
 * function MyController(translate) {
 *   translate.async('some.i18n.key')
 *     .then((value) => {
 *       this.someLabel = value;
 *     }
 * }
 */
module.exports = angular.module('akamai.components.i18n',
  ['pascalprecht.translate', 'ngCookies', require('../utils').name])

/**
 *
 * @name i18nConfig
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
 * @name LOCALE
 * @description A service that provides datetime and number locale constant values,
 * that includes 12 supported locales and sections based on locale names,
 * such as: 'en_US', 'de_DE'
 *
 */
  .constant('LOCALES', require('./i18n-locale-constant'))

/**
 * @ngdoc service
 * @name translate
 * @requires pascalprecht.translate.$translate
 *
 * @description A wrapper for the angular `$translate` service,
 * providing both asynchronous and synchronous methods to translate string keys. For the
 * most part, we extend the methods provided in
 * <a href="https://angular-translate.github.io/docs/#/api/pascalprecht.translate.$translate">
 *   angular-translate</a>.
 */
  .factory('translate', require('./translate-service'))

/**
 * @ngdoc directive
 * @name akamTranslate
 *
 * @description Inserts a translated key into the current DOM element.
 * For example:
 *
 * ```
 * <any akam-translate='any.optionally.nested.key'></any>
 * ```
 *
 * @restrict A
 *
 */
  .directive('akamTranslate', require('./translate-directive'))

/**
 * @ngdoc filter
 * @name akamTranslate
 *
 * @description A filter used to translate an i18n key. Note that this uses translate.sync so
 * if the results is one-time bound then it is possible that the result will never be translated,
 * as there will be a race condition between when the i18n keys load and the filter is run for the
 * first time. For more info, see the translate service sync method.
 *
 * ```
 * {% raw %}
 * <any>{{'translationId' | akamTranslate}}</any>
 * {% endraw %}
 * ```
 *
 * ```
 * {% raw %}
 * <any abc='{number: myNumber}''>{{'translationId' | akamTranslate : abc}}</any>
 * {% endraw %}
 * ```
 *
 * @param {string} translationId The key to translate
 */
  .filter('akamTranslate', require('./translate-filter'))

/**
 * @name i18nToken
 *
 * @description Provides two getter methods that return values set by
 * `i18nTokenProvider` in an application's configuration phase.
 *
 */
  .service('i18nToken')

/**
 * @ngdoc provider
 * @name i18nTokenProvider
 *
 * @description Provides methods allow you to pass in application
 * locale path values during a configuration phase. It invokes the
 * `I18nToken` service object that consumes those locale and path
 * values during run phase.
 *
 */
  .provider('i18nToken', require('./i18n-token-provider'))

/**
 * @name i18nCustomLoader
 *
 * @requires $http
 * @requires $q
 * @requires i18nToken
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
 * Adds methods to `$translateProvider` that load any
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
 */
  .config(config)

/**
 * @name missingTranslationFactory
 *
 * @requires $log
 * @requires i18nToken
 *
 * @description This service factory's sole purpose is to Intercept missing
 * translation key errors, and log the error in the console (non blocking operation). By default,
 * it will log all missing keys to the console. To turn that off, run the following in a config
 * block:
 *
 * <pre>
 * function config($translateProvider) {
 *   $translateProvider.useMissingTranslationHandler('noop');
 * };
 *
 * angular.module('...', [])
 *   .factory('noop', angular.noop);
 * </pre>
 */
  .factory('missingTranslationFactory', missingTranslation)

/**
 * This run block tells angular $translate service to use per language key,
 * so the current translation table will be based upon that.
 * __NOTE__: Since run block is last flow, only this block completed,
 * the $translation table is sure loaded.
 */
  .run(run);
