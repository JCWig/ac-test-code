'use strict';

var angular = require('angular');

/**
 * httpBuffer
 * Heavily based on the HTTP Auth Interceptor Module for Angular by Witold Szczerba
 * https://github.com/witoldsz/angular-http-auth
 */

/* @ngInject */
module.exports = function($injector, $q) {
  // Holds all the requests, so they can be re-requested in future.
  var buffer = [];

  // Service initialized later because of circular dependency problem.
  var $http;

  function retryHttpRequest(config, deferred) {
    function successCallback(response) {
      deferred.resolve(response);
    }
    function errorCallback(response) {
      deferred.reject(response);
    }
    $http = $http || $injector.get('$http');
    $http(config).then(successCallback, errorCallback);
  }

  return {

    /**
     * @name appendResponse
     * @description Appends HTTP response's request configuration object with deferred
     *  response attached to buffer and returns the promise of the deferred.
     * @param {object} response The response for which the config for the request will
     *  be queued to allow for the same request to be retried later
     * @return {promise} The promise to use to for the retried request
     */
    appendResponse: function(response) {
      var deferred = $q.defer();

      this.append(response.config, deferred);
      return deferred.promise;
    },

    /**
     * @name append
     * @description Appends HTTP request configuration object with deferred response
     *  attached to buffer.
     * @param {object} config The config for the request to allow for the same request
     *  to be retried later
     * @param {promise} deferred The promise to use to for the retried request
     */
    append: function(config, deferred) {
      buffer.push({
        config: config,
        deferred: deferred
      });
    },

    /**
     * @name rejectAll
     * @description Reject all the buffered requests.
     * @param {string} reason the reason for rejection
     */
    rejectAll: function(reason) {
      reason = reason || 'rejected';

      angular.forEach(buffer, function(value) {
        value.deferred.reject(reason);
      });

      this.clear();
    },

    /**
     * @name retryAll
     * @description Retries all the buffered requests clears the buffer.
     * @param {function} updater an optional transformation function that can modify the
     *  requests that are retried after having logged in.  This can be used for example
     *  to add an authentication token.  It must return the request.
     */
    retryAll: function() {
      angular.forEach(buffer, function(value) {
        retryHttpRequest(value.config, value.deferred);
      });

      this.clear();
    },

    /**
     * @name clear
     * @description Clears the buffer.
     */
    clear: function() {
      buffer = [];
    },

    /**
     * @name size
     * @description returns the size of the buffer.
     * @return {Number} the size of the buffer
     */
    size: function() {
      return buffer.length;
    }
  };
};