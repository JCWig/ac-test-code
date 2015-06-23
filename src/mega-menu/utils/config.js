'use strict';

var CONFIG_KEY = 'akamai.components.mega-menu.config';

/**
 * @ngdoc object
 * @name utils.config
 * @param {Function} cb Callback we should execute after fetching the config object. The callback
 * will be passed the following object:
 *
 * - accountId {String} The current Account id
 * - timezone {String} Timezone short code for this user (i.e. "EDT")
 * - username {String} The username
 * - locale {String} Locale for this user, in the format `languageCode_countryCode` (i.e. "en_US")
 *
 * @description
 * Asynchronous module exports pattern. Assumes the config never changes after the page load. If
 * we have loaded the config object once, then call `cb` with the config object. A usage example
 * might look like the following:
 * <pre>
 *  var config = require('../utils/config');
 *  config(function(data) {
 *    // Callback goes here.
 *  });
 * </pre>
 */
module.exports = function(cb) {
  var config = JSON.parse(window.sessionStorage.getItem(CONFIG_KEY));

  if (typeof cb === 'function') {
    cb(config);
  }
};

