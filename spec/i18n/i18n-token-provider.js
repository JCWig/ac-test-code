'use strict';
var INTERNATIONALIZATION_PATH = '/apps/appname/locales/en_US.json';
var LOCALE_BASE_PATH = /\/libs\/akamai-core\/[0-9]*.[0-9]*.[0-9]*\/locales/;
var LIBRARY_PATH = /\/libs\/akamai-core\/[0-9]*.[0-9]*.[0-9]*\/locales\/en_US.json/;
var CONFIG_PREFIX = 'prefix';
var enUsMessagesResponse = require("./i18n_responses/messages_en_US.json");
var enUsResponse = require("./i18n_responses/en_US.json");

describe('i18nTokenProvider', function() {

  var provider, config, cook, i18nConfig, location, i18nToken;

  beforeEach(function() {
    inject.strictDi(true);
    angular.mock.module(require('../../src/i18n').name);
    angular.mock.module(function(i18nTokenProvider) {
      provider = i18nTokenProvider;
    });
    inject(function(i18nConfig, $location, $cookies, i18nToken) {
      config = i18nConfig;
      cook = $cookies;
      location = $location;
      i18nToken = i18nToken;
    });

  });
  describe('when inspecting url field', function() {
    it('should contain correct component locale path ', function() {
      var compPath = config.localeComponentPath;
      var appPath = config.localeAppPath;
      expect(provider.rawUrls.length).toEqual(2);
      expect(provider.rawUrls[0].path).toEqual(compPath);
      expect(provider.rawUrls[1].path).toEqual(appPath);
    });

    it('should be able to add/retrieve another path', function() {
      expect(provider.rawUrls.length).toEqual(2);
      expect(provider.rawUrls[1].path).toContain('{appname}');
    });
    it('should not to add app locale value if given array as null', function() {
      expect(provider.rawUrls.length).toEqual(2);
    });
  });
  describe('when setting component locale paths to new values', function() {
    it('should change if rawUrl path is the default', function() {
      var compPath = config.localeComponentPath;
      var newUrl = "this/is/a/new/url";
      provider.setComponentLocalePath(newUrl);
      expect(provider.rawUrls.length).toEqual(2);
      expect(provider.rawUrls[0].path).not.toEqual(compPath);
      expect(provider.rawUrls[0].path).toEqual(newUrl);
      expect(provider.rawUrls[0].overridden).toEqual(true);
    });
    it('should not change if rawUrl path is not default', function() {
      var appPath = config.localeAppPath;
      var newUrl = "this/is/a/new/url";
      provider.setComponentLocalePath(newUrl);
      expect(provider.rawUrls.length).toEqual(2);
      expect(provider.rawUrls[1].path).toEqual(appPath);
      expect(provider.rawUrls[1].overridden).toBe(false);
    });
  });
  describe('when setting app locale paths to new values', function() {
    it('should change if rawUrl path is the default', function() {
      var compPath = config.localeComponentPath;
      var newUrl = "this/is/a/new/url";
      provider.setAppLocalePath(newUrl);
      expect(provider.rawUrls.length).toEqual(2);
      expect(provider.rawUrls[0].path).toEqual(compPath);
      expect(provider.rawUrls[0].overridden).toBe(false);
    });
    it('should not change if rawUrl path is not default', function() {
      var newUrl = "this/is/a/new/url";
      provider.setAppLocalePath(newUrl);
      expect(provider.rawUrls.length).toEqual(2);
      expect(provider.rawUrls[1].path).toEqual(newUrl);
      expect(provider.rawUrls[1].overridden).toEqual(true);
    });
  });
});
describe('i18nToken service', function() {

  var service, cookies, rootScope, provider, location, config, log;
  beforeEach(function() {
    inject.strictDi(true);
    angular.mock.module(require('../../src/i18n').name);
    angular.mock.module(function($provide, $translateProvider, i18nTokenProvider) {
      provider = i18nTokenProvider;
      $translateProvider.useLoader('i18nCustomLoader');
    });
    inject(function(i18nToken, _$cookies_, _$rootScope_, $httpBackend, i18nConfig, $location, $log) {
      service = i18nToken;
      rootScope = _$rootScope_.$new();
      cookies = _$cookies_;
      config = i18nConfig;
      location = $location;
      log = $log;
      $httpBackend.when('GET', INTERNATIONALIZATION_PATH).respond(enUsMessagesResponse);
      $httpBackend.when('GET', LIBRARY_PATH).respond(enUsResponse);
    });
    rootScope.$digest();
  });
  describe('when using token service', function() {
    it('should be defined', function() {
      expect(service).not.toBe(undefined);
    });

    it('should have "getLocale" method defined', function() {
      expect(service.getCurrentLocale).not.toBe(undefined);
    });

    it('should have "getUrls" method defined', function() {
      expect(service.getUrls).not.toBe(undefined);
    });

    it('should "getLocale" method return default locale value', function() {
      expect(service.getCurrentLocale()).toEqual("en_US");
    });

    it('should "getUrls" method return correct app url value', function() {
      var urlValues = service.getUrls();
      expect(urlValues.length).toEqual(2);
      expect(urlValues[1]).toEqual("/apps/appname/locales/");
    });
    it('should be able to retrieve appname from url', function() {
      spyOn(location, 'absUrl').and.returnValue('https://control.akamai.com/apps/banana-app/somethingelse');
      var urls = provider.$get(cookies, location, log).getUrls();
      expect(urls.length).toEqual(2);
      expect(urls[0]).toMatch(LOCALE_BASE_PATH);
      expect(urls[1]).toEqual('/apps/banana-app/locales/');
    });
    it('should be able to decode a URI component on a path', function() {
      spyOn(location, 'absUrl').and.returnValue('https://control.akamai.com/apps/%7Bappname%7D/somethingelse');
      var urls = provider.$get(cookies, location, log).getUrls();
      expect(urls.length).toEqual(2);
      expect(urls[0]).toMatch(LOCALE_BASE_PATH);
      expect(urls[1]).toEqual('/apps/appname/locales/');
    });
    it('should be able to retrieve appname from url and be given path and place appname anywhere', function() {
      spyOn(location, 'absUrl').and.returnValue('https://control.akamai.com/apps/pineapple-app/somethingelse');
      config.path = 'here/is/a/path/{appname}/ending/path';
      config.prefix = null;
      var urls = provider.$get(cookies, location, log).getUrls();
      expect(urls.length).toEqual(2);
      expect(urls[0]).toMatch(LOCALE_BASE_PATH);
      expect(urls[1]).toEqual('/apps/pineapple-app/locales/');
    });
    it('should properly retrieve changed values if only component path value changed', function() {
      var newUrl = 'this/is/a/new/url';
      provider.setComponentLocalePath(newUrl);
      spyOn(location, 'absUrl').and.returnValue('https://control.akamai.com/apps/pineapple-app/somethingelse');
      config.path = 'here/is/a/path/{appname}/ending/path';
      config.prefix = null;
      var urls = provider.$get(cookies, location, log).getUrls();
      expect(urls.length).toEqual(2);
      expect(urls[0]).toEqual(newUrl);
      expect(urls[1]).toEqual('/apps/pineapple-app/locales/');
    });
    it('should properly retrieve changed values if only app path value changed', function() {
      var newUrl = 'this/is/a/new/url';
      provider.setAppLocalePath(newUrl);
      spyOn(location, 'absUrl').and.returnValue('https://control.akamai.com/apps/pineapple-app/somethingelse');
      config.path = 'here/is/a/path/{appname}/ending/path';
      config.prefix = null;
      var urls = provider.$get(cookies, location, log).getUrls();
      expect(urls.length).toEqual(2);
      expect(urls[0]).toMatch(LOCALE_BASE_PATH);
      expect(urls[1]).toEqual(newUrl);
    });
    it('should properly retrieve changed values if both app and component paths changed', function() {
      var newUrl = 'this/is/a/new/url';
      provider.setComponentLocalePath(newUrl);
      provider.setAppLocalePath(newUrl);
      spyOn(location, 'absUrl').and.returnValue('https://control.akamai.com/apps/pineapple-app/somethingelse');
      config.path = 'here/is/a/path/{appname}/ending/path';
      config.prefix = null;
      var urls = provider.$get(cookies, location, log).getUrls();
      expect(urls.length).toEqual(2);
      expect(urls[0]).toEqual(newUrl);
      expect(urls[1]).toEqual(newUrl);
    });
  });
});
describe('locale cookie set to zn_CN will not properly encode', function() {
  var loader, config, translation, $translate, httpBackend, timeout, scope, provider, log, cookie;
  var enUsMessagesResponse = require("./i18n_responses/messages_en_US.json");
  var enUsResponse = require("./i18n_responses/en_US.json");
  beforeEach(function() {
    angular.mock.module(require('../../src/i18n').name);
    angular.mock.module(function(i18nTokenProvider) {
      provider = i18nTokenProvider;
    });
    inject(function(_$translate_, $timeout, i18nCustomLoader, $rootScope, i18nConfig, translate, $httpBackend, $log, _$cookies_) {
      _$cookies_.put('AKALOCALE', "emhfQ04=");
      $translate = _$translate_;
      loader = i18nCustomLoader;
      config = i18nConfig;
      translation = translate;
      timeout = $timeout;
      httpBackend = $httpBackend;
      scope = $rootScope;
      log = $log;
      cookie = _$cookies_;
    });
    httpBackend.when('GET', '/apps/appname/locales/zh_CN.json').respond(404, "BAD PATH");
    httpBackend.when('GET', /\/libs\/akamai-core\/[0-9]*.[0-9]*.[0-9]*\/locales\/zh_CN.json/).respond(404, "BAD PATH");
    httpBackend.when('GET', INTERNATIONALIZATION_PATH).respond(enUsResponse);
    httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
  });
  describe('when using custom loader service bad cookie', function() {
    it("should cookie 'AKALOCALE' value exists", function() {
      var locale = cookie.get('AKALOCALE');
      expect(locale).not.toBe(undefined);
    });
    it('should ignore gracefully and continue to english cookie', function() {
      httpBackend.flush();
      expect(translation.sync("billing-center.no-access")).toEqual("You have no access to Billing Center application.");
      expect(translation.sync("components.name")).toEqual("Akamai Common Components");
      expect(translation.sync("askjdfh.name")).toEqual("askjdfh.name");
    });
  });
});
describe('locale cookie set to "de_DE', function() {

  var service, cookies, rootScope, translation, httpBackend, cookies;

  beforeEach(function() {
    inject.strictDi(true);
    angular.mock.module(require('../../src/i18n').name);
    inject(function(i18nToken, _$cookies_, _$rootScope_, $httpBackend, translate, $timeout) {
      service = i18nToken;
      cookies = _$cookies_;
      cookies.put('AKALOCALE', "ZGVfREU=");
      rootScope = _$rootScope_.$new();
      $httpBackend.when('GET', '/apps/appname/locales/de_DE.json').respond({
        'billing-center': {
          'no-access': 'de_DE no access'
        }
      });
      $httpBackend.when('GET', /\/libs\/akamai-core\/[0-9]*.[0-9]*.[0-9]*\/locales\/de_DE.json/).respond({
        'components': {
          'name': '(de_DE) Akamai Common Components'
        }
      });
      httpBackend = $httpBackend;
      translation = translate;
    });
  });
  it("should cookie 'AKALOCALE' value exists", function() {
    var locale = cookies.get('AKALOCALE');
    expect(locale).not.toBe(undefined);
  });

  it('should locale value be "de_DE" after decoded', function() {
    var locale = cookies.get('AKALOCALE');
    expect(atob(locale.split("+")[0])).toEqual("de_DE");
  });
  it('should translate values into de_DE', function() {
    httpBackend.flush();
    expect(translation.sync("billing-center.no-access")).toEqual("de_DE no access");
    expect(translation.sync("components.name")).toEqual("(de_DE) Akamai Common Components");
  });
});

describe('locale cookie set to cookie without translation file', function() {
  var loader, config, translation, $translate, httpBackend, timeout, scope, provider, log, cookies;
  var enUsMessagesResponse = require("./i18n_responses/messages_en_US.json");
  var enUsResponse = require("./i18n_responses/en_US.json");
  beforeEach(function() {
    inject.strictDi(true);
    angular.mock.module(require('../../src/i18n').name);
    angular.mock.module(function(i18nTokenProvider) {
      provider = i18nTokenProvider;
    });
    inject(function(_$translate_, $timeout, i18nCustomLoader, $rootScope, i18nConfig, translate, $httpBackend, $log, _$cookies_) {
      $translate = _$translate_;
      loader = i18nCustomLoader;
      config = i18nConfig;
      translation = translate;
      timeout = $timeout;
      httpBackend = $httpBackend;
      scope = $rootScope;
      log = $log;
      _$cookies_.put('AKALOCALE', "ZGVfREU=");
    });
    httpBackend.when('GET', '/apps/appname/locales/de_DE.json').respond(404, "BAD PATH");
    httpBackend.when('GET', /\/libs\/akamai-core\/[0-9]*.[0-9]*.[0-9]*\/locales\/de_DE.json/).respond(404, "BAD PATH");
    httpBackend.when('GET', INTERNATIONALIZATION_PATH).respond(enUsResponse);
    httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
  });
  describe('when using custom loader service with cookie that has no files', function() {
    it('should ignore gracefully and continue to english cookie', function() {
      httpBackend.flush();
      expect(translation.sync("billing-center.no-access")).toEqual("You have no access to Billing Center application.");
      expect(translation.sync("components.name")).toEqual("Akamai Common Components");
      expect(translation.sync("askjdfh.name")).toEqual("askjdfh.name");
      expect(translation.sync('contractselector.filter.products')).toEqual('Filter Products');
    });
  });
});

describe('locale cookie set to invalid cookie', function() {
  var loader, config, translation, $translate, httpBackend, timeout, scope, provider, log, cookie;
  var enUsMessagesResponse = require("./i18n_responses/messages_en_US.json");
  var enUsResponse = require("./i18n_responses/en_US.json");
  beforeEach(function() {
    inject.strictDi(true);
    angular.mock.module(require('../../src/i18n').name);
    angular.mock.module(function(i18nTokenProvider) {
      provider = i18nTokenProvider;
    });
    inject(function(_$translate_, $timeout, i18nCustomLoader, $rootScope, i18nConfig, translate, $httpBackend, $log, _$cookies_) {
      _$cookies_.put('AKALOCALE', "TVFqSUJNbXRRay9VODJ5WjhJeEtCdkUxYmZRV1V0REE4cnpNcFJIMzhQVDRhcXArc2N4THdUMTJxVitnR3hkNWZZR2JuZm89");
      cookie = _$cookies_;
      $translate = _$translate_;
      loader = i18nCustomLoader;
      config = i18nConfig;
      translation = translate;
      httpBackend = $httpBackend;
      scope = $rootScope;
      log = $log;
    });
    httpBackend.when('GET', '/apps/appname/locales/MQjIBMmtQk.json').respond(404, "BAD PATH");
    httpBackend.when('GET', /\/libs\/akamai-core\/[0-9]*.[0-9]*.[0-9]*\/locales\/MQjIBMmtQk.json/).respond(404, "BAD PATH");
    httpBackend.when('GET', INTERNATIONALIZATION_PATH).respond(enUsResponse);
    httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
  });
  describe('when using custom loader service bad cookie', function() {
    it("should cookie 'AKALOCALE' value exists", function() {
      var locale = cookie.get('AKALOCALE');
      expect(locale).not.toBe(undefined);
    });
    it('should ignore gracefully and continue to english cookie', function() {
      httpBackend.flush();
      expect(translation.sync("billing-center.no-access")).toEqual("You have no access to Billing Center application.");
      expect(translation.sync("components.name")).toEqual("Akamai Common Components");
      expect(translation.sync("askjdfh.name")).toEqual("askjdfh.name");
    });
  });
});
describe('locale cookie already decoded', function() {
  var loader, config, translation, $translate, httpBackend, timeout, scope, provider, log, cookie;
  var enUsMessagesResponse = require("./i18n_responses/messages_en_US.json");
  var enUsResponse = require("./i18n_responses/en_US.json");
  beforeEach(function() {
    angular.mock.module(require('../../src/i18n').name);
    angular.mock.module(function(i18nTokenProvider) {
      provider = i18nTokenProvider;
    });
    inject(function(_$translate_, $timeout, i18nCustomLoader, $rootScope, i18nConfig, translate, $httpBackend, $log, _$cookies_) {
      _$cookies_.put('AKALOCALE', "zh_CN>MQjIBMmtQk/U82yZ8IxKBvE1bfQWUtDA8rzMpRH38PT4aqp+scxLwT12qV+gGxd5fYGbnfo=");
      cookie = _$cookies_;
      $translate = _$translate_;
      loader = i18nCustomLoader;
      config = i18nConfig;
      translation = translate;
      timeout = $timeout;
      httpBackend = $httpBackend;
      scope = $rootScope;
      log = $log;

    });
    httpBackend.when('GET', INTERNATIONALIZATION_PATH).respond(enUsResponse);
    httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
  });
  describe('when using custom loader service bad cookie', function() {
    it("should cookie 'AKALOCALE' value exists", function() {
      var locale = cookie.get('AKALOCALE');
      expect(locale).not.toBe(undefined);
    });
    it('should ignore gracefully and continue to english cookie', function() {
      httpBackend.flush();
      expect(translation.sync("billing-center.no-access")).toEqual("You have no access to Billing Center application.");
      expect(translation.sync("components.name")).toEqual("Akamai Common Components");
      expect(translation.sync("askjdfh.name")).toEqual("askjdfh.name");
    });
  });
});