'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($q, $injector, $location, akamAuth, akamHttpBuffer, akamTokenService) {
  var redirectToLoginProblemTypes =
    [
      'http://control.akamai.com/problems/no-akasession',
      'http://control.akamai.com/problems/invalid-akasession',
      'http://control.akamai.com/problems/expired-akasession'
    ];

  var authGrantProblemTypes =
    [
      'http://control.akamai.com/problems/no-token',
      'http://control.akamai.com/problems/expired-token'
    ];

  function redirectToLogin() {
    //redirect to login
    $location.url('/login.jsp');
  }

  return {
    responseError: function(response) {
      var problemType;
      var deferred;

      if (!akamAuth.isUsingPulsarAuth()) {
        return $q.reject(response);
      }

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
          // check if the problem type is one that should cause a login redirect
          if (redirectToLoginProblemTypes.indexOf(problemType) > -1) {
            redirectToLogin();
            return $q.reject(response);
          }

          if (authGrantProblemTypes.indexOf(problemType) > -1) {
            deferred = $q.defer();
            akamHttpBuffer.append(response.config, deferred);
            akamTokenService.create();
            return deferred;
          }
          break;
        case 403:
          // 403 Forbidden gets returned to the application to handle
          return $q.reject(response);
        case 409:
          if (problemType !== 'http://control.akamai.com/problems/account-mismatch') {
            return $q.reject(response);
          }

          // show message and redirect after
          break;
        default:
          return $q.reject(response);
      }
    }
  };
};