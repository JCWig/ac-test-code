// Inspired by https://github.com/remy/libraries

var angular = require('angular'),
  querystring = require('querystring');

// regex to check for any status code with 20X or 30X.
var SUCCESS = /^(20\d|30\d)$/;

var request;

// polyfill for promises so we simply include it in modules that use them. No need to assign to a
// variable because it will do that for us. On all supported browsers (except for IE), this is a
// no-op. On IE, the polyfill will be used.
require('native-promise-only');

/**
 * @name utils.ajax
 * @param {String} type request type
 * @param {String} url request url
 * @param {Object} opts options to pass to the request
 * @param {Function} [callback] optional callback
 * @description
 * Tiny Ajax abstraction to allow for easier writing of xhr calls. Usage might look like the
 * following:
 * <pre>
 * var ajax = require('util/ajax');
 * var xhr = ajax.get('/status', function (err, status) {
 *      if (err) {
 *          // something went wrong
 *          return;
 *      }
 *      console.log('The current status is: ' + status);
 *  });
 * </pre>
 * @returns {XMLHttpRequest} a xhr request
 */
request = function(type, url, opts, callback) {
  var xhr = new XMLHttpRequest(),
    pd = null;

  if (typeof opts === 'function') {
    callback = opts;
    opts = null;
  }

  xhr.open(type, url);

  if ((type === 'POST' || type === 'PUT') && opts) {
    pd = querystring.stringify(opts);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  }

  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE) {
      if (SUCCESS.test(xhr.status.toString())) {
        callback.call(xhr, null, JSON.parse(xhr.responseText));
      } else {
        callback.call(xhr, true);
      }
    }

  };

  xhr.send(pd);

  return xhr;
};

module.exports = {

  /**
   * @name utils.ajax.get
   * @param {String} url The URL we should fetch
   * @param {Object} [opts] Options that should be sent to the server.
   * @param {Function} callback Callback function that we should call on completion. The `this`
   * parameter is set to the xhr.
   * @description
   * Method to perform an ajax GET request.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest|XMLHttpRequest}
   * @returns {XMLHttpRequest} The request object
   */
  get: angular.bind(this, request, 'GET'),

  /**
   * @name utils.ajax.post
   * @param {String} url The URL we should fetch
   * @param {Object} [opts] Options that should be sent to the server.
   * @param {Function} callback Callback function that we should call on completion. The `this`
   * parameter is set to the xhr.
   * @description
   * Method to perform an ajax POST request.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest|XMLHttpRequest}
   * @returns {XMLHttpRequest} The request object
   */
  post: angular.bind(this, request, 'POST'),

  /**
   * @name utils.ajax.put
   * @param {String} url The URL we should fetch
   * @param {Object} [opts] Options that should be sent to the server.
   * @param {Function} callback Callback function that we should call on completion. The `this`
   * parameter is set to the xhr.
   * @description
   * Method to perform an ajax PUT request.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest|XMLHttpRequest}
   * @returns {XMLHttpRequest} The request object
   */
  put: angular.bind(this, request, 'PUT'),

  /**
   * @name utils.ajax.delete
   * @param {String} url The URL we should delete
   * @param {Function} callback Callback function that we should call on completion. The `this`
   * parameter is set to the xhr.
   * @description
   * Method to perform an ajax DELETE request.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest|XMLHttpRequest}
   * @returns {XMLHttpRequest} The request object
   */
  'delete': angular.bind(this, request, 'DELETE'),

  /**
   * @name utils.ajax.promiseGet
   * @description Performs an ajax get request but returns a promise
   * @param {String} url The URL to fetch.
   * @returns {Promise} A Promise object
   */
  promiseGet: function(url) {
    return new Promise(function(resolve, reject) {
      request('GET', url, function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

};

