import i18nLocales from './i18n-locale-constant';
import { VERSION } from '../utils/index';

export const i18nConfig = {
  defaultLocale: 'en_US',
  componentI18nPath: `/libs/akamai-core/${VERSION}/locales/`,
  availableLangKeys: ['de_DE', 'en_US', 'en_US_ATT', 'es_ES', 'es_LA', 'fr_FR', 'it_IT',
    'ja_JP', 'ko_KR', 'pt_BR', 'zh_CN', 'zh_TW'
  ],
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
};

function config($provide, $translateProvider) {
  $translateProvider
    .registerAvailableLanguageKeys(i18nConfig.availableLangKeys, i18nConfig.langKeysMapper)
    .useLoader('$translatePartialLoader', {
      urlTemplate: '{part}{lang}.json'
    })
    .useLoaderCache(true)
    .useSanitizeValueStrategy('escaped')
    .preferredLanguage(i18nConfig.defaultLocale)
    .fallbackLanguage(i18nConfig.defaultLocale)
    .useMissingTranslationHandlerLog()
    .cloakClassName('util-hide');

  // intercept $locale service and add datetime and number values specific for current locale
  // this is used by bootstrap's date and time picker
  $provide.decorator('$locale', ['$delegate', 'portalLocale',
    ($delegate, portalLocale) => {
      let loc = i18nLocales[portalLocale];

      if (loc) {
        $delegate.DATETIME_FORMATS = loc.DATETIME_FORMATS;
        $delegate.NUMBER_FORMATS = loc.NUMBER_FORMATS;
      }
      return $delegate;
    }]);
}
config.$inject = ['$provide', '$translateProvider'];

export default config;