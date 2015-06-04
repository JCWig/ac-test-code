'use strict';
/*global angular:false*/
var utilities = require('../utilities');

describe('Auth', function() {
  var scope,
      timeout,
      compile,
      q,
      http,
      httpBackend,
      location;

  beforeEach(function before() {
    var self = this;
    angular.mock.inject.strictDi(true);
    angular.mock.module(require('../../src/auth').name);
    angular.mock.inject(function inject($compile, $rootScope, $timeout, $q, $log, $http, $httpBackend, $location) {
      scope = $rootScope.$new();
      timeout = $timeout;
      compile = $compile;
      q = $q;
      http = $http;
      httpBackend = $httpBackend;
      location = $location;
    });
  });
  describe('given: no AKASESSION cookie', function() {
    describe('when an API request is sent', function() {
      it('should redirect to login page', function() {
        var urlSpy = spyOn(location, 'url');
        httpBackend.when('GET', '/no/akasession/cookie').respond(401, {
          type: 'http://control.akamai.com/problems/no-akasession'
        }, {'content-type': 'application/problem+json'});
        http.get('/no/akasession/cookie');
        httpBackend.flush();
        expect(urlSpy).toHaveBeenCalledWith('/login.jsp');
      });
    });
  });
  describe('given an invalid AKASESSION cookie', function() {
    describe('when an API request is sent', function() {
      it('should redirect to login page', function() {
        var urlSpy = spyOn(location, 'url');
        httpBackend.when('GET', '/invalid/akasession/cookie').respond(401, {
          type: 'http://control.akamai.com/problems/invalid-akasession'
        }, {'content-type': 'application/problem+json'});
        http.get('/invalid/akasession/cookie');
        httpBackend.flush();
        expect(urlSpy).toHaveBeenCalledWith('/login.jsp');
      });
    });
  });
  describe('given an expired AKASESSION cookie', function() {
    describe('when an API request is sent', function() {
      it('should redirect to login page', function() {
        var urlSpy = spyOn(location, 'url');
        httpBackend.when('GET', '/expired/akasession/cookie').respond(401, {
          type: 'http://control.akamai.com/problems/expired-akasession'
        }, {'content-type': 'application/problem+json'});
        http.get('/expired/akasession/cookie');
        httpBackend.flush();
        expect(urlSpy).toHaveBeenCalledWith('/login.jsp');
      });
    });
  });
  describe('given a valid AKASESSION cookie with no JWT cookie', function() {
    it('should request an authorization grant', function() {
      var calls = 0;
      var errorResponse = [401, {
        type: 'http://control.akamai.com/problems/no-token'
      }, {'content-type': 'application/problem+json'}];
      var successResponse = [200, {success: true}];

      httpBackend.expectGET('/request_auth.jsp').respond('');
      httpBackend.when('GET', '/no/jwt/token').respond(
        function(method, url, data, headers){
          if (calls === 0) {
            calls++;
            return errorResponse;
          } else {
            return successResponse;
          }
        });
      http.get('/no/jwt/token');
      httpBackend.flush();

    });
    it('should retry the API request with the valid JWT cookie', function() {

    });
  });
  describe('given a valid AKASESSION cookie with expired JWT cookie', function() {
    it('should request an authorization grant', function() {

    });
    it('should retry the API request with the valid JWT cookie', function() {

    });
  });
});
