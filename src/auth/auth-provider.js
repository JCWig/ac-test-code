'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($q, $injector, $location) {
  var redirectToLoginProblemTypes =
    [
      'http://control.akamai.com/problems/no-akasession',
      'http://control.akamai.com/problems/invalid-akasession',
      'http://control.akamai.com/problems/expired-akasession'
    ];

  function redirectToLogin() {
    //redirect to login
    $location.url('/login.jsp');
  }

  return {
    responseError: function(response) {
      var problemType;

      // if content type does not contain problem+json, can not be intercepted
      if (response.headers('content-type').indexOf('application/problem+json') === -1) {
        return $q.reject(response);
      }

      /*
      problem+json format:
      {
        "type": "http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html",
        "detail": "Status failed validation",
        "status": 500,
        "title": "Internal Server Error"
      }
      */

      problemType = angular.isObject(response.data) ? response.data.type : null;

      switch (response.status) {
        case 401:
          if (redirectToLoginProblemTypes.indexOf(problemType) > -1) {
            redirectToLogin();
          }
          break;
        case 403:
          break;
        case 409:
          break;
        default:
          break;
      }

      return $q.reject(response);
    }
  };
};