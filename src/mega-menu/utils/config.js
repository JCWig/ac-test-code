'use strict';

// small module to fetch and set the configuration object
var ajax = require('./ajax'),
  redirect = require('./redirect'),
  loginUrl = require('./constants').LOGIN_URL;

var CONFIG_URL = '/totem/api/pulsar/megamenu/config.json',
  callbacks = [],
  config;

// performs the AJAX call once and then executes an array of callbacks. The callbacks are added
// when a user tries to call the config object but the request is still in flight.
function fetch() {
  ajax.get(CONFIG_URL, function(err, response) {
    var callback;

    if (!err) {
      config = response;

    } else if (this.status === 0) {
      // testing shows that even though we expect a 302, we get a status code of 0 when
      // the config call bounces to the login page. No headers are sent for this XHR
      redirect(loginUrl);
    }

    // call all registered callbacks and pop off the callback queue
    callback = callbacks.shift();
    while (callback) {
      if (typeof callback === 'function') {
        callback(config);
      }
      callback = callbacks.shift();
    }

  });
}

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
 * @param {Boolean} [force] Set to true to force a request to the server. Useful for when you wish
 * to update the data without a page refresh.
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
module.exports = function(cb, force) {
  if (typeof config === 'undefined' || force) {
    callbacks.push(cb);
    fetch();
  } else if (typeof cb === 'function') {

    cb(config);
  }
};

