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
      authPro,
      location;

  beforeEach(function before() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(require('../../src/auth').name);
    angular.mock.module(function(authProvider) {
      provider = authProvider;
    });
    angular.mock.inject(function inject($http, $httpBackend, httpBuffer, token, authConfig, authInterceptor, $window, $location, auth) {
      http = $http;
      httpBackend = $httpBackend;
      buffer = httpBuffer;
      tokenService = token;
      config = authConfig;
      interceptor = authInterceptor;
      win = $window;
      location = $location;
      authPro = auth;
    });
    spyOn(tokenService, 'logout').and.callThrough();
    spyOn(win.location, 'replace');
    spyOn(authPro, 'getBlacklistedUris').and.returnValue(['/a/page/to/ignore.json', /^\/another\/page\/.*$/i]);
  });

  describe('Scenario: Receive unauthorized API response', function() {
    it('the component should queue the API request for re-submission for invalid token case', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request').respond(401, {
        code: 'invalid_token',
        title: 'Invalid JWT Token',
        incidentId: '58c2725f-002d-4494-8535-4c6186814756',
        requestId: '6658f551-7cb1-4a23-822f-d6a827194bd9'
      });
      httpBackend.expectPOST(config.tokenUrl).respond(200);
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).toHaveBeenCalled();
      expect(tokenService.logout).not.toHaveBeenCalled();
    });

    it('the component should queue the API request for re-submission for missing token case', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request').respond(401, {
        code: 'missing_token',
        title: 'Missing JWT Token',
        incidentId: '58c2725f-002d-4494-8535-4c6186814756',
        requestId: '6658f551-7cb1-4a23-822f-d6a827194bd9'
      });
      httpBackend.expectPOST(config.tokenUrl).respond(200);
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).toHaveBeenCalled();
      expect(tokenService.logout).not.toHaveBeenCalled();
    });

    it('the component should queue the API request for re-submission for expired token case', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request').respond(401, {
        code: 'token_is_expired',
        title: 'JWT Token is Expired',
        incidentId: '58c2725f-002d-4494-8535-4c6186814756',
        requestId: '6658f551-7cb1-4a23-822f-d6a827194bd9'
      });
      httpBackend.expectPOST(config.tokenUrl).respond(200);
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).toHaveBeenCalled();
      expect(tokenService.logout).not.toHaveBeenCalled();
    });

    it('should queue intermediate error (with token replacement code) response re-submission', function() {
      spyOn(buffer, 'appendResponse').and.callThrough();
      spyOn(tokenService, 'isPending').and.returnValue(true);
      interceptor.responseError({ status: 401, config: {method: 'POST', url: '/should/be/deferred/for/token/auth1'}, data: {
        code: 'missing_token',
        title: 'Missing JWT Token',
        incidentId: '58c2725f-002d-4494-8535-4c6186814756',
        requestId: '6658f551-7cb1-4a23-822f-d6a827194bd9'
      } });
      expect(buffer.appendResponse).toHaveBeenCalled();
      expect(tokenService.isPending).toHaveBeenCalled();
      expect(buffer.size()).toBe(1);
    });

    it('should logout for intermediate error (with no token replacement code) response', function() {
      spyOn(buffer, 'appendResponse').and.callThrough();
      spyOn(tokenService, 'isPending').and.returnValue(true);
      spyOn(tokenService, 'create');
      interceptor.responseError({ status: 401, config: {method: 'GET', url: '/should/be/deferred/for/token/auth2', headers: { Accept: 'application/json, text/plain, */*'}}});
      expect(buffer.appendResponse).not.toHaveBeenCalled();
      expect(tokenService.isPending).not.toHaveBeenCalled();
      expect(tokenService.create).not.toHaveBeenCalled();
      expect(tokenService.logout).toHaveBeenCalled();
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

  describe('Scenario: Receive unauthorized API response with logout codes', function() {
    it('the component should request logout for revoked token', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request').respond(401, {
        code: 'token_is_revoked',
        title: 'Token is revoked',
        incidentId: '58c2725f-002d-4494-8535-4c6186814756',
        requestId: '6658f551-7cb1-4a23-822f-d6a827194bd9'
      });
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).not.toHaveBeenCalled();
      expect(tokenService.logout).toHaveBeenCalled();
    });

    it('the component should request logout for akasession_username_invalid', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request').respond(401, {
        code: 'akasession_username_invalid',
        title: 'Invalid Username',
        incidentId: '58c2725f-002d-4494-8535-4c6186814756',
        requestId: '6658f551-7cb1-4a23-822f-d6a827194bd9'
      });
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).not.toHaveBeenCalled();
      expect(tokenService.logout).toHaveBeenCalled();
    });

    it('the component should request logout for expired_akasession', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request').respond(401, {
        code: 'expired_akasession',
        title: 'Expired Akasession',
        incidentId: '58c2725f-002d-4494-8535-4c6186814756',
        requestId: '6658f551-7cb1-4a23-822f-d6a827194bd9'
      });
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).not.toHaveBeenCalled();
      expect(tokenService.logout).toHaveBeenCalled();
    });

    it('the component should request logout for malformed_akasession', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request').respond(401, {
        code: 'malformed_akasession',
        title: 'Malformed Akasession',
        incidentId: '58c2725f-002d-4494-8535-4c6186814756',
        requestId: '6658f551-7cb1-4a23-822f-d6a827194bd9'
      });
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).not.toHaveBeenCalled();
      expect(tokenService.logout).toHaveBeenCalled();
    });

    it('the component should request logout for incorrect_current_account', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request').respond(401, {
        code: 'incorrect_current_account',
        title: 'Incorrect Account',
        incidentId: '58c2725f-002d-4494-8535-4c6186814756',
        requestId: '6658f551-7cb1-4a23-822f-d6a827194bd9'
      });
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).not.toHaveBeenCalled();
      expect(tokenService.logout).toHaveBeenCalled();
    });

    it('the component should request logout for invalid_xsrf', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request').respond(401, {
        code: 'invalid_xsrf',
        title: 'Invalid Cross Site Request Forgery Nonce',
        incidentId: '58c2725f-002d-4494-8535-4c6186814756',
        requestId: '6658f551-7cb1-4a23-822f-d6a827194bd9'
      });
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).not.toHaveBeenCalled();
      expect(tokenService.logout).toHaveBeenCalled();
    });

    it('the component should request logout for an unknown 401 code', function() {
      httpBackend.when('GET', '/unauthorized/request').respond(401, {
        code: 'unknown_code',
        title: 'Some code we do not know about',
        incidentId: '55555555-002d-4494-8535-4c6186814756',
        requestId: '66666666-7cb1-4a23-822f-d6a827194bd9'
      });
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(tokenService.logout).toHaveBeenCalled();
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

  describe('Scenario: Receive valid token, but the service is still erroring out on the server side', function() {
    it('should submit queued API requests and when one of them returns a 401, log out', function() {
      tokenService.logout.and.stub();
      spyOn(buffer, 'retryAll').and.callThrough();
      buffer.appendRequest({method: 'GET', url: '/deferred/for/token/auth1', data: '', headers: { Accept: 'application/json, text/plain, */*'}});
      buffer.appendRequest({method: 'GET', url: '/deferred/for/token/auth2', data: '', headers: { Accept: 'application/json, text/plain, */*'}});
      httpBackend.when('GET', '/deferred/for/token/auth1').respond(401);
      httpBackend.when('GET', '/deferred/for/token/auth2').respond(200);
      httpBackend.expectPOST(config.tokenUrl).respond(200);
      tokenService.create();
      httpBackend.flush();
      expect(buffer.retryAll).toHaveBeenCalled();
      expect(tokenService.logout).toHaveBeenCalled();
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
      var domain = 'some.domain.com';
      var path = '/some/path';
      var fakeCurrentUrl = 'https://' + domain + path;
      var base64EncodedCurrentUrl = win.btoa(path);
      spyOn(location, 'absUrl').and.returnValue(fakeCurrentUrl);
      spyOn(location, 'host').and.returnValue(domain);
      httpBackend.expectPOST(config.tokenUrl).respond(400);
      tokenService.create();
      httpBackend.flush();
      expect(tokenService.logout).toHaveBeenCalled();
      expect(win.location.replace).toHaveBeenCalledWith(config.lunaLogoutUrl + base64EncodedCurrentUrl);
    });

    it('should redirect to the logout page with current url correctly base64 encoded', function() {
      var domain = 'some.domain.com';
      var path = '/some/path?foo=bar&baz=xoxo#/some/other/path?plus_new=parameters&hash=values';
      var fakeCurrentUrl = 'https://' + domain + path;
      var base64EncodedCurrentUrl = win.btoa(path);
      spyOn(location, 'host').and.returnValue(domain);
      spyOn(location, 'absUrl').and.returnValue(fakeCurrentUrl);
      httpBackend.expectPOST(config.tokenUrl).respond(400);
      tokenService.create();
      httpBackend.flush();
      expect(tokenService.logout).toHaveBeenCalled();
      expect(win.location.replace).toHaveBeenCalledWith(config.lunaLogoutUrl + base64EncodedCurrentUrl);
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
