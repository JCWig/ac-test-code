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
    ($delegate, i18nToken, LOCALES) => {
      let loc = LOCALES[i18nToken.getCurrentLocale()];

      if (loc) {
        $delegate.DATETIME_FORMATS = loc.DATETIME_FORMATS;
        $delegate.NUMBER_FORMATS = loc.NUMBER_FORMATS;
      }
      return $delegate;
    }]);
}
config.$inject = ['$provide', '$translateProvider', 'i18nConfig'];
export default config;