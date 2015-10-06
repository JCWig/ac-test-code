export default function i18nLocaleProvider() {
  let locale;

  this.setLocale = function(newLocale) {
    locale = newLocale;
  };

  this.$get = function() {
    return locale;
  };
}
