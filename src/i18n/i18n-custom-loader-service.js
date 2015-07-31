var angular = require('angular');

module.exports = function($http, $q, $log, i18nToken, i18nConfig) {
  var errorList = [],
    translationTable = [],
    urls,
    locale;

  /**
   * @name loadTranslations
   * @private
   * @description this custom loader implementation function perform the following:
   * Loop through the list of url, store promise get to the array of deferred objects,
   * when it completes, it will resolve the translation table
   * If error occurs, and the current locale is not the 'en_US' default one,
   * then it will attempt to load with 'en_US' locale - fallback translation loading
   * If that fails, it will reject (basically we screw).
   * $http.get function
   * @return {Promise} A promise to load the translations
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

  urls = i18nToken.getUrls();
  locale = i18nToken.getCurrentLocale();

  return function() {
    return loadTranslations();
  };

  /**
   * @name invalid
   * @private
   * @description any error from get call will go through here, we log to console,
   * and we save error message to errorList array
   * @param {Object} r response object with error info
   * @return {Object[]} a list of error objects
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
   * @param {Object} r response object with data info
   * @return {Object[]};
   */
  function valid(r) {
    var src = r.data,
      clone = src ? angular.copy(src) : {};

    angular.merge(translationTable, clone);
    return translationTable;
  }
};

module.exports.$inject = ['$http', '$q', '$log', 'i18nToken', 'i18nConfig'];