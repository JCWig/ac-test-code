'use strict';

var config = require('./config'),
  version = require('./constants').VERSION,
  ajax = require('./ajax');

var LOCALE_DIR = '/libs/akamai-core/' + version + '/locales/mega-menu/',
  callback,
  i18nData;

function fetch() {
  config(function(data) {
    var url = LOCALE_DIR + data.locale + '.json';

    ajax.get(url, function(err, response) {
      if (!err) {
        i18nData = response;
      }

      // only support one callback because, unlike the config module, this should only be called
      // once per page load
      if (typeof callback === 'function') {
        callback(i18nData);
      }
    });
  });
}

/**
 * @ngdoc object
 * @name utils.i18nLoader
 * @param {Function} cb Callback we should execute after fetching the i18n data. The callback will
 * be passed correct locale JSON data
 * @param {Boolean} [force] Set to true to force a request to the server. Useful for when you wish
 * to update the data without a page refresh.
 * @description
 * Asynchronous module exports pattern. If we have loaded data, then call `cb` with the data
 * object. A usage example might look like the following:
 * <pre>
 *  var i18nLoader = require('../utils/i18n-loader');
 *  i18nLoader(function(data) {
 *    // Now you can translate keys
 *  });
 * </pre>
 */
module.exports = function(cb, force) {
  if (typeof i18nData === 'undefined' || force) {
    callback = cb;
    fetch();
  } else if (typeof cb === 'function') {
    cb(i18nData);
  }
};

