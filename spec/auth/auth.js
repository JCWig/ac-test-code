/* globals angular, beforeEach, afterEach, spyOn */
/* eslint-disable max-nested-callbacks */
'use strict';

var utilities = require('../utilities');

describe('akamai.components.auth', function() {
  var http,
    httpBackend,
    buffer,
    tokenService,
    config,
    interceptor,
    win,
    provider,
    authPro,
    context,
    messageBox,
    $rootScope,
    location;

  var translationMock = {
    components: {
      'message-box': {
        no: 'No',
        yes: 'Yes'
      }
    }
  };

  afterEach(function() {
    var modal = document.querySelector('.modal');
    var backdrop = document.querySelector('.modal-backdrop');

    if (modal) {
      modal.parentNode.removeChild(modal);
    }
    if (backdrop) {
      backdrop.parentNode.removeChild(backdrop);
    }
  });

  beforeEach(function before() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(require('../../src/auth').name);
    angular.mock.module(function($translateProvider) {
      $translateProvider.translations('en_US', translationMock);
      $translateProvider.useLoader('translateNoopLoader');
    });

    angular.mock.module(function($provide, authProvider) {
      provider = authProvider;

      function Context($q) {
        var accountChangedValue = false;

        return {
          group: $q.when({
            id: 123
          }),
          property: $q.when({
            id: 456
          }),
          account: {
            name: 'test account'
          },
          accountChanged: function() {
            return accountChangedValue;
          },

          getAccountFromCookie: function() {
            return {
              id: 1,
              name: 'test account'
            };
          },

          resetAccount: jasmine.createSpy('resetAccount'),

          // This is for testing purposes only
          setAccountChanged: function(val) {
            accountChangedValue = val;
          }
        };
      }

      Context.$inject = ['$q'];

      // mock out context group and property fetching
      $provide.factory('context', Context);
    });

    angular.mock.inject(function inject($http, $httpBackend, httpBuffer, token, authConfig,
                                        authInterceptor, $window, $location, auth, _context_,
                                        _messageBox_, _$rootScope_) {
      http = $http;
      httpBackend = $httpBackend;
      buffer = httpBuffer;
      tokenService = token;
      config = authConfig;
      interceptor = authInterceptor;
      win = $window;
      location = $location;
      authPro = auth;
      context = _context_;
      messageBox = _messageBox_;
      $rootScope = _$rootScope_;
      $httpBackend.when('GET', /grp.json/).respond({});
    });
    spyOn(tokenService, 'logout').and.callThrough();
    spyOn(win.location, 'replace');
    spyOn(authPro, 'getBlacklistedUris').and.returnValue(['/a/page/to/ignore.json', /^\/another\/page\/.*$/i]);
  });

  function generateErrorCodeResponse(code, title) {
    return {
      code: code,
      title: title || code,
      incidentId: '58c2725f-002d-4494-8535-4c6186814756',
      requestId: '6658f551-7cb1-4a23-822f-d6a827194bd9'
    };
  }

  describe('Scenario: Receive unauthorized API response - new token request', function() {
    it('given invalid token, the component should queue the API request for re-submission', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(401, generateErrorCodeResponse('invalid_token', 'Invalid Token'));
      httpBackend.expectPOST(config.tokenUrl).respond(200);
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).toHaveBeenCalled();
      expect(tokenService.logout).not.toHaveBeenCalled();
    });

    it('given invalid username in akasession, the component should queue the API request for re-submission', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(401, generateErrorCodeResponse('akasession_username_invalid', 'Session does not match username'));
      httpBackend.expectPOST(config.tokenUrl).respond(200);
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).toHaveBeenCalled();
      expect(tokenService.logout).not.toHaveBeenCalled();
    });

    it('Given incorrect current account, the component should queue the API request for re-submission', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(401, generateErrorCodeResponse('incorrect_current_account', 'incorrect current account'));
      httpBackend.expectPOST(config.tokenUrl).respond(200);
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).toHaveBeenCalled();
      expect(tokenService.logout).not.toHaveBeenCalled();
    });

    it('Given incorrect contract type, the component should queue the API request for re-submission', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(401, generateErrorCodeResponse('incorrect_contract_type', 'incorrect contract type'));
      httpBackend.expectPOST(config.tokenUrl).respond(200);
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).toHaveBeenCalled();
      expect(tokenService.logout).not.toHaveBeenCalled();
    });

    it('Given incorrect cross site request forgery token, the component should queue the API request for re-submission', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(401, generateErrorCodeResponse('invalid_xsrf', 'incorrect cross site request forgery token'));
      httpBackend.expectPOST(config.tokenUrl).respond(200);
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).toHaveBeenCalled();
      expect(tokenService.logout).not.toHaveBeenCalled();
    });

    it('Given incorrect token type, the component should queue the API request for re-submission', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(401, generateErrorCodeResponse('invalid_token_type', 'incorrect token type'));
      httpBackend.expectPOST(config.tokenUrl).respond(200);
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).toHaveBeenCalled();
      expect(tokenService.logout).not.toHaveBeenCalled();
    });

    it('Given incorrect token id, the component should queue the API request for re-submission', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(401, generateErrorCodeResponse('invalid_token_id', 'incorrect token id'));
      httpBackend.expectPOST(config.tokenUrl).respond(200);
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).toHaveBeenCalled();
      expect(tokenService.logout).not.toHaveBeenCalled();
    });

    it('Given revoked token, the component should queue the API request for re-submission', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(401, generateErrorCodeResponse('token_is_revoked', 'token is revoked'));
      httpBackend.expectPOST(config.tokenUrl).respond(200);
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).toHaveBeenCalled();
      expect(tokenService.logout).not.toHaveBeenCalled();
    });

    it('Given expired token, the component should queue the API request for re-submission', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(401, generateErrorCodeResponse('token_is_expired', 'token is expired'));
      httpBackend.expectPOST(config.tokenUrl).respond(200);
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).toHaveBeenCalled();
      expect(tokenService.logout).not.toHaveBeenCalled();
    });

    it('Given token with invalid subject, the component should queue the API request for re-submission', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(401, generateErrorCodeResponse('invalid_token_subject', 'token has invalid subject'));
      httpBackend.expectPOST(config.tokenUrl).respond(200);
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).toHaveBeenCalled();
      expect(tokenService.logout).not.toHaveBeenCalled();
    });

    it('Given token that does not match the akasession data, the component should queue the API request for re-submission', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(401, generateErrorCodeResponse('token_and_akasession_mismatch', 'token and akasession mismatch'));
      httpBackend.expectPOST(config.tokenUrl).respond(200);
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).toHaveBeenCalled();
      expect(tokenService.logout).not.toHaveBeenCalled();
    });

    it('Given missing token, the component should queue the API request for re-submission', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(401, generateErrorCodeResponse('missing_token', 'missing token'));
      httpBackend.expectPOST(config.tokenUrl).respond(200);
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).toHaveBeenCalled();
      expect(tokenService.logout).not.toHaveBeenCalled();
    });

    it('Given missing xsrf token, the component should queue the API request for re-submission', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(401, generateErrorCodeResponse('missing_xsrf_token', 'missing xsrf token'));
      httpBackend.expectPOST(config.tokenUrl).respond(200);
      http.get('/unauthorized/request');
      httpBackend.flush();
      expect(buffer.appendResponse).toHaveBeenCalled();
      expect(tokenService.logout).not.toHaveBeenCalled();
    });

  });

  describe('Scenario: Receive unauthorized API response - multiple calls being handled', function() {
    it('should queue intermediate error responses for re-submission', function() {
      spyOn(tokenService, 'create').and.callThrough();
      tokenService.create();
      tokenService.create();
      //note that this expectation is for one request and not two
      httpBackend.expectPOST(config.tokenUrl).respond(200);

      expect(tokenService.create).toHaveBeenCalled();

    });

    it('should logout for intermediate error (with no token replacement code) response', function() {
      spyOn(buffer, 'appendResponse').and.callThrough();
      spyOn(tokenService, 'isPending').and.returnValue(true);
      spyOn(tokenService, 'create');
      interceptor.responseError({status: 401,
        config: {
          method: 'GET',
          url: '/should/be/deferred/for/token/auth2',
          headers: {Accept: 'application/json, text/plain, */*'}
        }
      });
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
    it('the component should request logout for akasession_username_invalid', function() {
      spyOn(buffer, 'appendResponse');
      httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(401, {
        code: 'akasession_username_invalid',
        title: 'Invalid Username',
        incidentId: '58c2725f-002d-4494-8535-4c6186814756',
        requestId: '6658f551-7cb1-4a23-822f-d6a827194bd9'
      });
      http.get('/unauthorized/request');
      spyOn(tokenService, 'create');
      httpBackend.when('GET', '/authorized/request1?aid=456&gid=123').respond(200);
      httpBackend.when('GET', '/authorized/request2?aid=456&gid=123').respond(302);
      httpBackend.when('GET', '/authorized/request3?aid=456&gid=123').respond(500);
      http.get('/authorized/request1');
      http.get('/authorized/request2');
      http.get('/authorized/request3');
    });

    describe('Scenario: Receive unauthorized API response with logout codes', function() {
      it('given an expired akasession, the component should request logout', function() {
        spyOn(buffer, 'appendResponse');
        httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(401, generateErrorCodeResponse('expired_akasession', 'Expired Akasession'));
        http.get('/unauthorized/request');
        httpBackend.flush();
        expect(buffer.appendResponse).not.toHaveBeenCalled();
        expect(tokenService.logout).toHaveBeenCalled();
      });

      it('given a malformed akasession, the component should request logout', function() {
        spyOn(buffer, 'appendResponse');
        httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(401, generateErrorCodeResponse('malformed_akasession', 'Malformed Akasession'));
        http.get('/unauthorized/request');
        httpBackend.flush();
        expect(buffer.appendResponse).not.toHaveBeenCalled();
        expect(tokenService.logout).toHaveBeenCalled();
      });

      it('given a malformed akalastmanaged account, the component should request logout', function() {
        spyOn(buffer, 'appendResponse');
        httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(401, generateErrorCodeResponse('malformed_akalastmanaged_account', 'Malformed Akalastmanaged'));
        http.get('/unauthorized/request');
        httpBackend.flush();
        expect(buffer.appendResponse).not.toHaveBeenCalled();
        expect(tokenService.logout).toHaveBeenCalled();
      });

      it('given an akasession that can not be decrypted, the component should request logout', function() {
        spyOn(buffer, 'appendResponse');
        httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(401, generateErrorCodeResponse('akasession_decryption_problem', 'Akasession can not be decrypted'));
        http.get('/unauthorized/request');
        httpBackend.flush();
        expect(buffer.appendResponse).not.toHaveBeenCalled();
        expect(tokenService.logout).toHaveBeenCalled();
      });

      it('given a missing akasession, the component should request logout', function() {
        spyOn(buffer, 'appendResponse');
        httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(401, generateErrorCodeResponse('missing_akasession', 'Missing Akasession'));
        http.get('/unauthorized/request');
        httpBackend.flush();
        expect(buffer.appendResponse).not.toHaveBeenCalled();
        expect(tokenService.logout).toHaveBeenCalled();
      });
    });

    describe('Scenario: Receive 502 internal error, API response with logout codes', function() {

      it('given an internal server error, the component should request logout', function() {
        spyOn(buffer, 'appendResponse');
        httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(502, generateErrorCodeResponse('internal.server.error', 'internal server error'));
        http.get('/unauthorized/request');
        httpBackend.flush();
        expect(buffer.appendResponse).not.toHaveBeenCalled();
        expect(tokenService.logout).toHaveBeenCalled();
      });

      it('given an invalid status code server error, the component should request logout', function() {
        spyOn(buffer, 'appendResponse');
        httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(502, generateErrorCodeResponse('invalid_status_code', 'internal server error'));
        http.get('/unauthorized/request');
        httpBackend.flush();
        expect(buffer.appendResponse).not.toHaveBeenCalled();
        expect(tokenService.logout).toHaveBeenCalled();
      });

      it('given an invalid response format server error, the component should request logout', function() {
        spyOn(buffer, 'appendResponse');
        httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(502, generateErrorCodeResponse('invalid_response_format', 'internal server error'));
        http.get('/unauthorized/request');
        httpBackend.flush();
        expect(buffer.appendResponse).not.toHaveBeenCalled();
        expect(tokenService.logout).toHaveBeenCalled();
      });

      it('given a 502 server error that is unknown, the component should reject the promise and nothing more', function() {
        spyOn(buffer, 'appendResponse');
        httpBackend.when('GET', '/unauthorized/request?aid=456&gid=123').respond(502, generateErrorCodeResponse('unknown code', 'something we do not know about'));
        http.get('/unauthorized/request');
        httpBackend.flush();
        expect(buffer.appendResponse).not.toHaveBeenCalled();
        expect(tokenService.logout).not.toHaveBeenCalled();
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
        interceptor.request({
          method: 'POST',
          url: '/should/be/deferred/for/token/auth1',
          data: '',
          headers: {Accept: 'application/json, text/plain, */*'}
        });
        interceptor.request({
          method: 'GET',
          url: '/should/be/deferred/for/token/auth2',
          headers: {Accept: 'application/json, text/plain, */*'}
        });
        expect(buffer.appendRequest).toHaveBeenCalled();
        expect(tokenService.isPending).toHaveBeenCalled();
        expect(buffer.size()).toBe(2);
      });
    });

    describe('Scenario: Receive valid token', function() {
      it('should submit queued API requests', function() {
        spyOn(buffer, 'retryAll').and.callThrough();
        buffer.appendRequest({
          method: 'GET',
          url: '/deferred/for/token/auth1',
          data: '',
          headers: {Accept: 'application/json, text/plain, */*'}
        });
        buffer.appendRequest({
          method: 'GET',
          url: '/deferred/for/token/auth2',
          data: '',
          headers: {Accept: 'application/json, text/plain, */*'}
        });
        httpBackend.when('GET', '/deferred/for/token/auth1?aid=456&gid=123').respond(400);
        httpBackend.when('GET', '/deferred/for/token/auth2?aid=456&gid=123').respond(200);
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
        buffer.appendRequest({
          method: 'GET',
          url: '/deferred/for/token/auth1',
          data: '',
          headers: {Accept: 'application/json, text/plain, */*'}
        });
        buffer.appendRequest({
          method: 'GET',
          url: '/deferred/for/token/auth2',
          data: '',
          headers: {Accept: 'application/json, text/plain, */*'}
        });
        httpBackend.when('GET', '/deferred/for/token/auth1?aid=456&gid=123').respond(401);
        httpBackend.when('GET', '/deferred/for/token/auth2?aid=456&gid=123').respond(200);
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
        buffer.appendRequest({
          method: 'GET',
          url: '/deferred/for/token/auth',
          data: '',
          headers: {Accept: 'application/json, text/plain, */*'}
        });
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
        httpBackend.when('GET', /\/ui\/services\/nav\/megamenu\/someUser\/grp.json/).respond(401);
        httpBackend.when('GET', /\/core\/services\/session\/another_user\/extend/).respond(401);
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
        interceptor.request({
          method: 'GET',
          url: '/a/page/to/ignore.json',
          data: '',
          headers: {Accept: 'application/json, text/plain, */*'}
        });
        interceptor.request({
          method: 'GET',
          url: '/another/page/to/ignore/12345.json',
          data: '',
          headers: {Accept: 'application/json, text/plain, */*'}
        });
        // test mega menu urls
        interceptor.request({
          method: 'GET',
          url: '/ui/services/nav/megamenu/someUser/grp.json',
          data: '',
          headers: {Accept: 'application/json, text/plain, */*'}
        });
        interceptor.request({
          method: 'POST',
          url: '/core/services/session/another_user/extend',
          data: '',
          headers: {Accept: 'application/json, text/plain, */*'}
        });
        interceptor.request({
          method: 'DELETE',
          url: '/svcs/messagecenter/yet_SOME_other_USER/message/12345.json',
          data: '',
          headers: {Accept: 'application/json, text/plain, */*'}
        });
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

    describe('given a loaded, group centric app', function() {

      describe('when an api request is sent', function() {

        describe('and the account has not changed', function() {

          it('should add the current group as a gid query string parameter', function() {
            httpBackend.expectGET('/abc.json?aid=456&gid=123').respond(200);
            http.get('/abc.json');
            httpBackend.flush();
          });

        });

        describe('and account has changed', function() {

          beforeEach(function() {
            context.setAccountChanged(true);
            spyOn(messageBox, 'show').and.callThrough();
            http.get('/abc.json');
            $rootScope.$digest();
          });

          it('should show a message box asking the user if the account should be changed', function() {
            expect(messageBox.show).toHaveBeenCalled();
          });

        });

      });

    });

    describe('given the message box shown', function() {

      describe('when the user accepts changing the account', function() {
        var elem;

        beforeEach(function() {
          context.setAccountChanged(true);
          http.get('/abcd.json');
          $rootScope.$digest();

          httpBackend.expectGET('/abcd.json?aid=456&gid=123').respond(200);
          elem = document.querySelector('.modal-footer .btn-primary');
          angular.element(elem).trigger('click');
        });

        it('should should send a request for current account context data', function() {
          expect(context.resetAccount).toHaveBeenCalled();
        });

        it('should continue the original API request', function() {
          // covered by the httpBackend.expectGET above
          expect(true).toBeTruthy();
        });

      });

      describe('when the user declines changing the account', function() {

        beforeEach(function() {
          context.setAccountChanged(true);
          http.get('/abc.json');
          $rootScope.$digest();
        });

        it('should go to the home page', function() {

          // clicking the element will cause the http promise above to be rejected
          expect(function() {
            angular.element(document.querySelector('.modal-footer button')).trigger('click');
          }).toThrow();

          expect(win.location.replace).toHaveBeenCalled();
        });

      });
    });
  });
});