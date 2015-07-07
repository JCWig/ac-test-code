'use strict';

var angular = require('angular'),
  constants = require('./utils/constants');

var CONFIG_KEY = 'akamai.components.mega-menu.config',
  CONFIG_URL = '/totem/api/pulsar/megamenu/config.json',
  FOOTER_URL = '/totem/api/pulsar/megamenu/footer.json',
  PARTNER_URL = '/totem/static/pulsar/megamenu/branding.json',
  LOCALE_DIR = '/libs/akamai-core/' + constants.VERSION + '/locales/mega-menu/',
  cache = true,
  locale;

/* @ngInject */
module.exports = function($http, $window, $cacheFactory) {

  return {
    fetch: fetch,
    clear: clear
  };

  function localeUrl() {
    return LOCALE_DIR + locale + '.json';
  }

  /**
   * Fetches all necessary data. Will save the config and i18n data to session storage in order
   * to facilitate usage in the non-angular parts of the mega menu.
   * @returns {Object} Mega menu data. Contains `config`, `i18n`, `internalFooter`
   * and `partner` keys.
   */
  function fetch() {

    // fetch the config API, the i18n data, the partner branding info and potentially the internal
    // footer info. Note that all of these are expected to succeed, except the footer, which may
    // return a 403 when logged in as a non-internal user. Will build up a large data structure
    // that can be passed around the mega menu component
    return $http.get(CONFIG_URL, {cache: cache})

      .then(function(data) {
        locale = data.data.locale;

        // testing shows that even though we expect a 302, we get a status code of 0 when
        // the config call bounces to the login page. No headers are sent for this XHR
        if (data.status === 0) {
          $window.location.url = constants.LOGIN_URL;
        }

        // yup, using session storage for mega menu to grab the data.
        $window.sessionStorage.setItem(CONFIG_KEY, angular.toJson(data.data));

        return data;
      })

      .then(function(configData) {

        return $http.get(localeUrl(), {cache: cache})
          .then(function(i18nData) {

            cache = true;

            return {
              config: configData.data,
              i18n: i18nData.data
            };
          });
      })

      .then(function(currentData) {
        return $http.get(PARTNER_URL, {cache: cache})
          .then(function(partnerData) {
            currentData.partner = partnerData.data;

            return currentData;
          });
      })

      .then(function(currentData) {
        return $http.get(FOOTER_URL, {cache: cache})
          .then(function(footerData) {
            currentData.internalFooter = footerData.data;
            return currentData;
          })
          .catch(function() {
            currentData.internalFooter = [];
            return currentData;
          });
      });
  }

  function clear() {
    var httpDefaultCache = $cacheFactory.get('$http');

    cache = false;

    httpDefaultCache.remove(CONFIG_URL);
    $window.sessionStorage.removeItem(CONFIG_KEY);

    httpDefaultCache.remove(localeUrl());
    httpDefaultCache.remove(PARTNER_URL);
    httpDefaultCache.remove(FOOTER_URL);
  }

};
