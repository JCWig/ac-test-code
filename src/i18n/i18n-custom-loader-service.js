import angular from 'angular';

class I18nLoader {
  constructor($http, $log, i18nToken, i18nConfig) {
    this.$http = $http;
    this.$log = $log;
    this.locale = i18nToken.getCurrentLocale();
    this.endpoints = i18nToken.getUrls();
    this.config = i18nConfig;
  }

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
  loadTranslations(table = [], errors = [], promises = []) {
    let $log = this.$log,
      n = this.endpoints.length;

    /**
     * @name logErrors
     * @private
     * @description any error from get call will go through here, we log to console,
     * and we save error message to errorList array
     * @param {Object} err response object with error info
     */
    function logErrors(err) {
      $log.error({
        message: err.data,
        status: err.status
      });
      errors.push(err.data);
    }

    /**
     * @name save
     * @private
     * @description any success response from get call will go through here,
     * we save data to translationTable; array
     * @param {Object} rep response object with data info
     */
    function save(rep) {
      let src = rep.data,
        clone = src ? angular.copy(src) : {};

      angular.merge(table, clone);
    }

    while (n > 0) {
      let url = `${this.endpoints[n - 1]}${this.locale}.json`;

      promises.push(this.$http.get(url).then(save).catch(logErrors));
      n--;
    }

    return new Promise((resolve, reject) => {
      Promise.all(promises)
        .then(() => {
          if (errors.length) {
            if (this.locale !== this.config.DEFAULT_LOCALE) {
              this.locale = this.config.DEFAULT_LOCALE;
              resolve(this.loadTranslations());
            } else {
              reject(errors);
            }
          } else {
            resolve([table]);
          }
        })
        .catch(reason => reject(reason));
    });
  }
}

function i18nLoaderFactory($http, $log, i18nToken, i18nConfig) {
  return () => {
    return (new I18nLoader($http, $log, i18nToken, i18nConfig)).loadTranslations();
  };
}

i18nLoaderFactory.$inject = ['$http', '$log', 'i18nToken', 'i18nConfig'];

export default i18nLoaderFactory;
