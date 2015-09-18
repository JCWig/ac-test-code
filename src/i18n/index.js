import angular from 'angular';
import 'angular-translate';
import 'angular-translate-loader-partial';
import 'angular-translate-handler-log';
import cookies from 'angular-cookies';

import utils from '../utils';

import translateConfig from './translate-config';
import portalLocaleResolver from './portal-locale-service';
import noopLoader from './translate-noop-loader-service';

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
 * `/apps/{appName}/locales/`.
 *
 * Also note that locales will be read as `locale`.json where locale is something like "en_US".
 * The filename is currently not configurable. Applications must name their locale files to match
 * the list of supported locales in Luna. Currently the supported list of locales is:
 *
 * ```
 * [de_DE, en_US, en_US_ATT, es_ES, es_LA, fr_FR, it_IT, ja_JP, ko_KR, pt_BR, zh_CN, zh_TW]
 * ```
 *
 * Missing translations are not logged by default. However, we include
 * angular-translate-handler-log with the akamai-core bundle. Therefore, if an app owner wishes to
 * enable logging of missing translations, then they should add the following to a config block:
 *
 * ```
 *  // module stuff up here
 *  .config(function($translateProvider) {
 *    $translateProvider.useMissingTranslationHandlerLog();
 *  }
 * ```
 *
 * See http://angular-translate.github.io/ for more info.
 *
 * * __NOTE__: localStorage is not used, the browser will not cache the language key.
 *
 * __NOTE__: To prevent asynchronous translation calls from causing rendering problems, add a
 * `translate-cloak` class on the `<body>` tag
 *
 * @example index.html
 *
 * <!-- preferred usage -->
 * <span translate="a.i18n.key"></span>
 *
 * <!-- acceptable, but may cause performance issues, like all filters do -->
 * <span>{{ 'another.i18n.key' | translate }}</span>
 *
 * <span>{{ vm.someLabel }}</span>
 *
 * @example app.js
 * function MyController($translate) {
 *   $translate('some.i18n.key')
 *     .then((value) => {
 *       this.someLabel = value;
 *     }
 * }
 */
export default angular.module('akamai.components.i18n', [
  'pascalprecht.translate',
  cookies,
  utils.name
])

/**
 * @ngdoc service
 * @name i18nNoopLoader
 * @requires $q
 * @description A simple i18n loader factory that resolves with no translations. Useful for
 * tests. For example, your test might look like the following
 *
 * ```
 * beforeEach(function() {
 *   angular.mock.inject.strictDi(true);
 *   angular.mock.module(function($translateProvider) {
 *     $translateProvider.useLoader('translateNoopLoader');
 *     $translateProvider.translations('en_US', translationData);
 *   });
 *   // rest of setup here
 * });
 * ```
 */
  .factory('translateNoopLoader', noopLoader)

/**
 * @ngdoc service
 * @name portalLocale
 * @description Returns the parsed luna locale, as read from the AKALOCALE cookie. Will be of
 * the form "en_US", "de_DE", etc.
 */
  .factory('portalLocale', portalLocaleResolver)

  .config(translateConfig)
  .run(runFn);

// resolve the locale and load the translations it will load twice if current locale is
// different from default locale (en_US)
function runFn($rootScope, $translate) {

  // any translations added after the config phase will be picked up automatically
  $rootScope.$on('$translatePartialLoaderStructureChanged', function() {
    $translate.refresh();
  });
}
runFn.$inject = ['$rootScope', '$translate'];
