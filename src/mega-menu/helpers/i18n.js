'use strict';

/**
 * @ngdoc object
 * @name helpers.i18n
 * @description Translates keys. Assumes data has been loaded. Handlebars doesn't have async
 * partials so calling this method before the data is loaded will result in untranslated keys.
 */

var translate = require('../utils/translate');

var translateFn = null,
  data = [];

/**
 * @ngdoc object
 * @name helpers.i18n.setData
 * @methodOf helpers.i18n
 * @description Sets data used to translate keys
 * @param {Object} newData data
 */
function setData(newData) {
  data = newData;
  translateFn = null;
}

/**
 * @ngdoc function
 * @name helpers.i18n.i18n
 * @methodOf helpers.i18n
 * @description Method to translate keys
 * @param {String} key lookup key
 * @param {Object} [options] Options to send to i18n
 * @returns {Function} A function that can be used to look up i18n keys
 */
function i18n(key, options) {
  if (!translateFn) {
    translateFn = translate.getTranslationFunction(data, {
      debug: false,
      namespaceSplitter: '.'
    });
  }
  return translateFn(key, options);
}

module.exports = {
  setData: setData,
  i18n: i18n
};
