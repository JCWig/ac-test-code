'use strict';
/*global angular:false*/
var utilities = require('../utilities');

describe('Auth', function() {
  var http,
      httpBackend,
      buffer,
      tokenService,
      config,
      interceptor;

  beforeEach(function before() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(require('../../src/auth').name);
    angular.mock.inject(function inject($http, $httpBackend, httpBuffer, token, authConfig, authInterceptor) {
      http = $http;
      httpBackend = $httpBackend;
      buffer = httpBuffer;
      tokenService = token;
      config = authConfig;
      interceptor = authInterceptor;
    });
    spyOn(tokenService, 'logout');
  });

  describe('Scenario: Receive unauthorized API response', function() {
    it('the component should queue the API request for re-submission', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request').respond(401);
      httpBackend.expectPOST(config.tokenUrl).respond(200);
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).toHaveBeenCalled();
    });

    it('should queue intermediate error responses re-submission', function() {
      spyOn(buffer, 'appendResponse').and.callThrough();
      spyOn(tokenService, 'isPending').and.returnValue(true);
      spyOn(tokenService, 'create');
      interceptor.responseError({ status: 401, config: {method: 'POST', url: '/should/be/deferred/for/token/auth1', data: '', headers: { Accept: 'application/json, text/plain, */*'}} });
      interceptor.responseError({ status: 401, config: {method: 'GET', url: '/should/be/deferred/for/token/auth2', headers: { Accept: 'application/json, text/plain, */*'}}});
      expect(buffer.appendResponse).toHaveBeenCalled();
      expect(tokenService.isPending).toHaveBeenCalled();
      expect(tokenService.create).not.toHaveBeenCalled();
      expect(buffer.size()).toBe(2);
    });

    it('should queue intermediate error responses re-submission', function() {
      spyOn(tokenService, 'create').and.callThrough();
      tokenService.create();
      tokenService.create();
      //note that this expectation is for one request and not two
      httpBackend.expectPOST(config.tokenUrl).respond(200);

      expect(tokenService.create).toHaveBeenCalled();
    });
  });

  describe('Scenario: Receive authorized API response', function() {
    it('the component should pass through the response to the app', function() {
      spyOn(buffer, 'appendResponse');
      spyOn(tokenService, 'create');
      httpBackend.when('GET', '/authorized/request1').respond(200);
      httpBackend.when('GET', '/authorized/request2').respond(302);
      httpBackend.when('GET', '/authorized/request3').respond(500);
      http.get('/authorized/request1');
      http.get('/authorized/request2');
      http.get('/authorized/request3');
      httpBackend.flush();
      expect(buffer.appendResponse).not.toHaveBeenCalled();
      expect(tokenService.create).not.toHaveBeenCalled();
    });
  });

  describe('Scenario: Request a token', function() {
    it('the token request should be well formed', function() {
      httpBackend.expectPOST(
        config.tokenUrl,

        // check if the correct body was sent.
        'client_id=' + config.clientId + '&grant_type=password_assertion',

        function(headers) {
          // check if the correct header was sent
          var allHeadersValid = (headers['Akamai-Accept'] === 'akamai/cookie') &&
            (headers['Content-Type'] === 'application/x-www-form-urlencoded');
          return allHeadersValid;
        }
      ).respond(200);
      tokenService.create();
      httpBackend.flush();
    });
  });

  describe('Scenario: Wait for token response', function() {
    it('the component should queue the API request for submission', function() {
      spyOn(buffer, 'appendRequest').and.callThrough();
      spyOn(tokenService, 'isPending').and.returnValue(true);
      interceptor.request({method: 'POST', url: '/should/be/deferred/for/token/auth1', data: '', headers: { Accept: 'application/json, text/plain, */*'}});
      interceptor.request({method: 'GET', url: '/should/be/deferred/for/token/auth2', headers: { Accept: 'application/json, text/plain, */*'}});
      expect(buffer.appendRequest).toHaveBeenCalled();
      expect(tokenService.isPending).toHaveBeenCalled();
      expect(buffer.size()).toBe(2);
    });
  });

  describe('Scenario: Receive valid token', function() {
    it('should submit queued API requests', function() {
      spyOn(buffer, 'retryAll').and.callThrough();
      buffer.appendRequest({method: 'GET', url: '/deferred/for/token/auth1', data: '', headers: { Accept: 'application/json, text/plain, */*'}});
      buffer.appendRequest({method: 'GET', url: '/deferred/for/token/auth2', data: '', headers: { Accept: 'application/json, text/plain, */*'}});
      httpBackend.when('GET', '/deferred/for/token/auth1').respond(400);
      httpBackend.when('GET', '/deferred/for/token/auth2').respond(200);
      httpBackend.expectPOST(config.tokenUrl).respond(200);
      tokenService.create();
      httpBackend.flush();
      expect(buffer.retryAll).toHaveBeenCalled();
    });
  });

  describe('Scenario: Receive token error', function() {
    it('should clear the API request queue', function() {
      spyOn(buffer, 'clear').and.callThrough();
      buffer.appendRequest({method: 'GET', url: '/deferred/for/token/auth', data: '', headers: { Accept: 'application/json, text/plain, */*'}});
      httpBackend.expectPOST(config.tokenUrl).respond(400);
      tokenService.create();
      httpBackend.flush();
      expect(buffer.clear).toHaveBeenCalled();
      expect(buffer.size()).toBe(0);
    });

    it('should redirect to the logout page', function() {
      httpBackend.expectPOST(config.tokenUrl).respond(400);
      tokenService.create();
      httpBackend.flush();
      expect(tokenService.logout).toHaveBeenCalled();
    });
  });
});
