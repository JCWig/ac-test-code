import { i18nConfig } from './translate-config';

const cookieName = 'AKALOCALE';

// service that knows how to fetch the locale for a luna application. reads the AKALOCALE cookie
function portalLocale($window, $cookies, $log) {
  let cookieLocale = $cookies.get(cookieName),
    locale = i18nConfig.defaultLocale;

  //just to prevent from improperly encoded cookies
  if (cookieLocale) {
    try {
      //try decode cookieLocale, then get first array value from split of non alpha,
      //non digits and non underscore
      locale = $window.atob(cookieLocale).split(/(?![A-Za-z0-9-_])/)[0];
    } catch (e) {
      $log.warn(`Decode cookie failed: ${cookieLocale}`);
    }
  }

  return locale;
}
portalLocale.$inject = ['$window', '$cookies', '$log'];

export default portalLocale;