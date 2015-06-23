'use strict';
/*global angular:false*/
var utilities = require('../utilities');

describe('Auth', function() {
  var http,
      httpBackend,
      buffer,
      tokenService,
      config,
      interceptor,
      win,
      provider,
      authPro;

  beforeEach(function before() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(require('../../src/auth').name);
    angular.mock.module(function(contextProvider, authProvider) {
      provider = authProvider;
      contextProvider.setApplicationContext('standalone');
    });
    angular.mock.inject(function inject($http, $httpBackend, httpBuffer, token, authConfig, authInterceptor, $window, auth) {
      http = $http;
      httpBackend = $httpBackend;
      buffer = httpBuffer;
      tokenService = token;
      config = authConfig;
      interceptor = authInterceptor;
      win = $window;
      authPro = auth;
    });
    spyOn(tokenService, 'logout').and.callThrough();
    spyOn(win.location, 'replace');
    spyOn(authPro, 'getBlacklistedUris').and.returnValue(['/a/page/to/ignore.json', /^\/another\/page\/.*$/i]);
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
      expect(win.location.replace).toHaveBeenCalledWith(config.lunaLogoutUrl);
    });
  });

  describe('Scenario: Blacklisted API requests', function() {
    it('should pass through the response', function() {
      spyOn(buffer, 'appendResponse').and.callThrough();
      spyOn(tokenService, 'create').and.callThrough();
      httpBackend.when('GET', '/ui/services/nav/megamenu/someUser/grp.json').respond(401);
      httpBackend.when('GET', '/core/services/session/another_user/extend').respond(401);
      httpBackend.when('GET', '/svcs/messagecenter/yet_SOME_other_USER/message/12345.json').respond(401);
      http.get('/ui/services/nav/megamenu/someUser/grp.json');
      http.get('/core/services/session/another_user/extend');
      http.get('/svcs/messagecenter/yet_SOME_other_USER/message/12345.json');
      httpBackend.flush();
      expect(buffer.appendResponse).not.toHaveBeenCalled();
      expect(tokenService.create).not.toHaveBeenCalled();
    });
    it('should process any blacklisted request without queing', function() {
      spyOn(buffer, 'appendRequest').and.callThrough();
      spyOn(tokenService, 'isPending').and.returnValue(true);
      // test custom blacklisted pages
      interceptor.request({method: 'GET', url: '/a/page/to/ignore.json', data: '', headers: { Accept: 'application/json, text/plain, */*'}});
      interceptor.request({method: 'GET', url: '/another/page/to/ignore/12345.json', data: '', headers: { Accept: 'application/json, text/plain, */*'}});
      // test mega menu urls
      interceptor.request({method: 'GET', url: '/ui/services/nav/megamenu/someUser/grp.json', data: '', headers: { Accept: 'application/json, text/plain, */*'}});
      interceptor.request({method: 'POST', url: '/core/services/session/another_user/extend', data: '', headers: { Accept: 'application/json, text/plain, */*'}});
      interceptor.request({method: 'DELETE', url: '/svcs/messagecenter/yet_SOME_other_USER/message/12345.json', data: '', headers: { Accept: 'application/json, text/plain, */*'}});
      expect(buffer.appendRequest).not.toHaveBeenCalled();
      expect(tokenService.isPending).toHaveBeenCalled();
      expect(buffer.size()).toBe(0);
    });
  });
  describe('Config Provider', function() {
    describe('When setting blacklisted URI as a string', function() {
      beforeEach(function() {
        provider.setBlacklistedUris('/abc.json');
      });
      it('should return an array with a single string value', function() {
        expect(provider.$get().getBlacklistedUris()).toEqual(['/abc.json']);
      });
    });
    describe('When setting blacklisted URI as a regexp', function() {
      beforeEach(function() {
        provider.setBlacklistedUris(/^\/a\/page\/.*$/i);
      });
      it('should return array of one regexp value', function() {
        expect(provider.$get().getBlacklistedUris()).toEqual([/^\/a\/page\/.*$/i]);
      });
    });
    describe('When setting blacklisted URIs as an array', function() {
      beforeEach(function() {
        provider.setBlacklistedUris(['/abc/123.json', /^\/a\/page\/.*$/i]);
      });
      it('should return given array', function() {
        expect(provider.$get().getBlacklistedUris()).toEqual(['/abc/123.json', /^\/a\/page\/.*$/i]);
      });
    });
    describe('When setting blacklisted URIs as anything other than a string/regexp/array', function() {
      beforeEach(function() {
        provider.setBlacklistedUris(12345);
      });
      it('should return an empty array', function() {
        expect(provider.$get().getBlacklistedUris()).toEqual([]);
      });
    });

  });
});
