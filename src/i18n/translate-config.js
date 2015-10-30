import LOCALES from './i18n-locale-constant';

export const i18nConfig = {
  defaultLocale: 'en_US',
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
    .cloakClassName('util-hide');

  /**
   * a decorator to intercept $locale service and add datetime and number
   * values specific for current locale
   * @param  {object} $delegate original $locale service object
   * @param  {object} i18nToken a factory service holds value of current locale
   * @param  {object} LOCALES locale constant
   * @return {object} $delegate modified $locale service object
   */
  $provide.decorator('$locale', ['$delegate', 'i18nLocale',
    ($delegate, i18nLocale) => {

      Object.defineProperty($delegate, 'DATETIME_FORMATS', {
        get: () => {
          let loc = i18nLocale ?
            LOCALES[i18nLocale] : LOCALES[i18nConfig.defaultLocale];

          if (loc) {
            return loc.DATETIME_FORMATS;
          }
        }
      });

      Object.defineProperty($delegate, 'NUMBER_FORMATS', {
        get: () => {
          let loc = i18nLocale ?
            LOCALES[i18nLocale] : LOCALES[i18nConfig.defaultLocale];

          if (loc) {
            return loc.NUMBER_FORMATS;
          }
        }
      });

      return $delegate;
    }]);
}
config.$inject = ['$provide', '$translateProvider'];

export default config;