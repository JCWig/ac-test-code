'use strict';
/*global angular:false*/
var utilities = require('../utilities');

describe('Auth', function() {
  var http,
      httpBackend,
      buffer,
      tokenService,
      location;

  beforeEach(function before() {
    var self = this;
    angular.mock.inject.strictDi(true);
    angular.mock.module(require('../../src/auth').name);
    angular.mock.inject(function inject($http, $httpBackend, $location, httpBuffer, token) {
      http = $http;
      httpBackend = $httpBackend;
      location = $location;
      buffer = httpBuffer;
      tokenService = token;
    });
  });

  describe('Scenario: Receive unauthorized API response', function() {
    it('the component should queue the API request for re-submission', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request').respond(401);
      httpBackend.expectGET('/request_auth.jsp').respond(200);
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).toHaveBeenCalled();
      buffer.appendResponse.calls.reset();
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
      buffer.appendResponse.calls.reset();
      tokenService.create.calls.reset();
    });
  });

  describe('Scenario: Request a token', function() {
    it('the token request should be well formed', function() {
      httpBackend.expectGET('/request_auth.jsp').respond(200);
      tokenService.create();
      httpBackend.flush();
    });
  });

  /*
  when the component requests a token
  then the request body should include the client_id parameter
  and the request body should include grant_type=password_assertion parameter
  and the request header should include 'Akamai-Accept': 'akamai/cookie'
  and the request header should include 'Content-Type': 'application/x-www-form-urlencoded'
  */
});
