'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($http, $q, $log, i18nToken, i18nConfig) {
  var locale = i18nToken.getCurrentLocale(),
    urls = i18nToken.getUrls(),
    errorList = [],
    translationTable = [];

  /**
   * @name loadTranslations
   * @private
   * @description this custom loader implementaion function perform the following:
   * Loop through the list of url, store promise get to the array of deferreds,
   * when it completes, it will resolve the translation table
   * If error occues, and the current locale is not the 'en_US' default one,
   * then it will attempt to load with 'en_US' locale - fallback translation loading
   * If that fails, it will reject (basically we screw).
   * @param {string} locale current locale
   * @param {array} urls tht contains list of locale file url paths to be used in
   * $http.get function
   * @return function loadTranslations()
   */

  var loadTranslations = function() {

    var deferreds = [],
      n = urls.length,
      url,
      deferred = $q.defer();

    while (n > 0) {
      url = urls[n - 1] + locale + '.json';
      deferreds.push($http.get(url).then(valid).catch(invalid));
      n--;
    }
    $q.all(deferreds).then(function() {
      if (errorList.length) {
        if (locale !== i18nConfig.defaultLocale) {
          errorList = [];
          translationTable = [];
          locale = i18nConfig.defaultLocale;
          deferred.resolve(loadTranslations());
        } else {
          deferred.reject(errorList);
        }
      } else {
        deferred.resolve([translationTable]);
      }
    });
    return deferred.promise;
  };
  return function() {
    return loadTranslations();
  };

  /**
   * @name invalid
   * @private
   * @description any error from get call will go through here, we log to console,
   * and we save error message to errorList array
   * @param {object} r response object with error info
   * @return errorList
   */

  function invalid(r) {
    $log.error({
      message: r.data,
      status: r.status
    });
    errorList.push(r.data);
    return errorList;
  }

  /**
   * @name valid
   * @private
   * @description any success response from get call will go through here,
   * we save data to translationTable; array
   * @param {object} r response object with data info
   * @return translationTable;
   */

  function valid(r) {
    var src = r.data,
        clone = src ? angular.copy(src) : {};

    angular.extend(translationTable, clone);
    return translationTable;
  }
};
