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
}
config.$inject = ['$provide', '$translateProvider'];

export default config;