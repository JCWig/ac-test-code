'use strict';
var INTERNATIONALIZATION_PATH = '/apps/appname/locales/en_US.json';
var LIBRARY_PATH = '/libs/akamai-components/0.0.1/locales/en_US.json';
var CONFIG_PREFIX = 'prefix'
var enUsMessagesResponse = require("./i18n_responses/messages_en_US.json");
var enUsResponse = require ("./i18n_responses/en_US.json");
describe('i18nTokenProvider', function() {

    var provider, config, cook, i18nConfig, location,  i18nToken;

    beforeEach(function() {
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
    context('when inspecting url field', function(){
        it('should contain correct component locale path ', function() {
            var compPath = config.localeComponentPath;
            var appPath = config.localeAppPath;
            expect(provider.rawUrls.length).to.equal(2);
            expect(provider.rawUrls[0].path).to.equal(compPath);
            expect(provider.rawUrls[1].path).to.equal(appPath);
        });

        it('should be able to add/retrieve another path', function() {
            expect(provider.rawUrls.length).to.equal(2);
            expect(provider.rawUrls[1].path).to.contain('{appname}');
        });

        it('should not to add app locale value if given array as null', function() {
            var arrOfPath = null;

            expect(provider.rawUrls).to.have.length(2);
        });
    });
});
describe('i18nToken service', function() {

    var service, cookies, rootScope, provider, location, config;
    beforeEach(function() {
        angular.mock.module(require('../../src/i18n').name);
        angular.mock.module(function($provide, $translateProvider, i18nTokenProvider) {
            provider = i18nTokenProvider;
            $translateProvider.useLoader('i18nCustomLoader');
            $provide.decorator ('$cookies', function ($delegate) {
                $delegate = {AKALOCALE:"ZW5fVVN+TWJbms9; expires=Wed, 17 Mar 2083 13:04:59 GMT; path=/; domain=172.25.46.158; Secure"};
                return $delegate;
            });
        });
        inject(function(i18nToken, _$cookies_, _$rootScope_, $httpBackend, i18nConfig, $location) {
            service = i18nToken;
            rootScope = _$rootScope_.$new();
            cookies = _$cookies_;
            config = i18nConfig;
            location = $location;
            $httpBackend.when('GET', INTERNATIONALIZATION_PATH).respond(enUsMessagesResponse);
            $httpBackend.when('GET', LIBRARY_PATH).respond(enUsResponse);
        });
        rootScope.$digest();
    });
    context('when using token service', function(){
        it('should be defined', function() {
            expect(service).to.not.be.undefined;
        });

        it('should have "getLocale" method defined', function() {
            expect(service.getCurrentLocale).to.not.be.undefined;
        });

        it('should have "getUrls" method defined', function() {
            expect(service.getUrls).to.not.be.undefined;
        });

        it('should "getLocale" method return default locale value', function() {
            expect(service.getCurrentLocale()).to.equal("en_US");
        });

        it('should "getUrls" method return correct app url value', function() {
            var urlValues = service.getUrls();
            expect(urlValues.length).to.equal(2);
            expect(urlValues[1]).to.equal("/apps/appname/locales/");
        });
        it('should be able to retrieve appname from url', function(){
            location.absUrl = sinon.stub().returns('https://control.akamai.com/apps/banana-app/somethingelse'); 
            var urls = provider.$get(cookies, config, location).getUrls();
            expect(urls.length).to.equal(2);
            expect(urls[0]).to.equal('/libs/akamai-components/0.0.1/locales/');
            expect(urls[1]).to.equal('/apps/banana-app/locales/');
        }); 
        it('should be able to decode a URI component on a path', function(){
            location.absUrl = sinon.stub().returns('https://control.akamai.com/apps/%7Bappname%7D/somethingelse');
            var urls = provider.$get(cookies, config, location).getUrls();
            expect(urls.length).to.equal(2);
            expect(urls[0]).to.equal('/libs/akamai-components/0.0.1/locales/');
            expect(urls[1]).to.equal('/apps/appname/locales/');
        });
        it('should be able to retrieve appname from url and be given path', function(){
            location.absUrl = sinon.stub().returns('https://control.akamai.com/apps/pineapple-app/somethingelse');
            config.path = 'here/is/a/path/{appname}/ending/path';
            config.prefix = null;
            var urls = provider.$get(cookies, config, location).getUrls();
            expect(urls.length).to.equal(2);
            expect(urls[0]).to.equal('/libs/akamai-components/0.0.1/locales/');
            expect(urls[1]).to.equal('/apps/pineapple-app/locales/');
        });
    });
    context('when locale cookie set to "en_US', function() {

        it("should cookie 'AKALOCALE' value exists", function() {
            var locale = cookies.AKALOCALE;
            expect(locale).to.not.undefined;
        });

        it("should cookie locale value be 'en_US' after decoded", function() {
            var locale = cookies["AKALOCALE"];
            expect(atob(locale.split("+")[0])).to.equal(service.getCurrentLocale());
        });
    });
});
describe('locale cookie set to "de_DE', function() {

    var service, cookies, rootScope;

    beforeEach(function() {
        angular.mock.module(require('../../src/i18n').name);
        angular.mock.module(function($provide, $translateProvider, i18nTokenProvider) {
            $provide.decorator ('$cookies', function ($delegate) {
                $delegate = {AKALOCALE:"ZGVfREU=+TWRLSm1QZGEwNTBKNUZEZzFLZVQyNW9kTExYY1l6T3lHSVg3SjM1SjNJaXBaZ2JUaFRJVGZCWXROSjNmdFIzdXMzL0pJbms9; expires=Wed, 17 Mar 2083 13:04:59 GMT; path=/; domain=172.25.46.158; Secure"};
                return $delegate;
            });
            $translateProvider.useLoader('i18nCustomLoader');
        });
        inject(function(i18nToken, _$cookies_, _$rootScope_) {
            service = i18nToken;
            cookies = _$cookies_;
            rootScope = _$rootScope_.$new();
        });
    });

    afterEach(function() {
        // clean up
        cookies.AKALOCALE = undefined;
    });
    it("should cookie 'AKALOCALE' value exists", function() {
        var locale = cookies.AKALOCALE;
        expect(locale).to.not.undefined;
    });

    it('should locale value be "de_DE" after decoded', function() {
        var locale = cookies.AKALOCALE;
        expect(atob(locale.split("+")[0])).to.equal("de_DE");
    });
});

describe('locale cookie set to cookie without translation file', function() {
    var value, loader, config, translation, $translate, httpBackend, timeout, scope, provider, log;
    var enUsMessagesResponse = require("./i18n_responses/messages_en_US.json");
    var enUsResponse = require ("./i18n_responses/en_US.json");
    beforeEach(function(){
        angular.mock.module(require('../../src/i18n').name);
        angular.mock.module(function(i18nTokenProvider) {
            provider = i18nTokenProvider;
        });
        angular.mock.module(function($provide, $translateProvider) {
            $translateProvider.useLoader('i18nCustomLoader');
            $provide.decorator ('$cookies', function ($delegate) {
                $delegate = {AKALOCALE:"ZGVfREU=+TWRLSm1QZGEwNTBKNUZEZzFLZVQyNW9kTExYY1l6T3lHSVg3SjM1SjNJaXBaZ2JUaFRJVGZCWXROSjNmdFIzdXMzL0pJbms9; expires=Wed, 17 Mar 2083 13:04:59 GMT; path=/; domain=172.25.46.158; Secure"};
                return $delegate;
            });
        });
        inject(function(_$translate_, $timeout, i18nCustomLoader, $rootScope, i18nConfig, translate, $httpBackend, $log) {
            $translate = _$translate_;
            loader = i18nCustomLoader;
            config = i18nConfig;
            translation = translate;
            timeout = $timeout;
            httpBackend = $httpBackend;
            scope = $rootScope;
            log = $log;
        });
        httpBackend.when('GET', '/apps/appname/locales/de_DE.json').respond(404, "BAD PATH");
        httpBackend.when('GET', '/libs/akamai-components/0.0.1/locales/de_DE.json').respond(404, "BAD PATH");
        httpBackend.when('GET', INTERNATIONALIZATION_PATH).respond(enUsResponse);
        httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
    });
    context('when using custom loader service with cookie that has no files', function(){
        it('should ignore gracefully and continue to next url', function(){
            httpBackend.flush();
            expect(translation.sync("billing-center.no-access")).to.equal("You have no access to Billing Center application.");
            expect(translation.sync("components.name")).to.equal("Akamai Common Components");
            expect(translation.sync("askjdfh.name")).to.equal("askjdfh.name");
        });
    });
});

describe('locale cookie set to invalid cookie', function() {
    var value, loader, config, translation, $translate, httpBackend, timeout, scope, provider, log;
    var enUsMessagesResponse = require("./i18n_responses/messages_en_US.json");
    var enUsResponse = require ("./i18n_responses/en_US.json");
    beforeEach(function(){
        angular.mock.module(require('../../src/i18n').name);
        angular.mock.module(function(i18nTokenProvider) {
            provider = i18nTokenProvider;
        });
        angular.mock.module(function($provide, $translateProvider) {
            $translateProvider.useLoader('i18nCustomLoader');
            $provide.decorator ('$cookies', function ($delegate) {
                $delegate = {AKALOCALE:"FIzdXMzL0pJb=ms9; expires=Wed, 17 Mar 2083 13:04:59 GMT; path=/; domain=172.25.46.158; Secure"};
                return $delegate;
            });
        });
        inject(function(_$translate_, $timeout, i18nCustomLoader, $rootScope, i18nConfig, translate, $httpBackend, $log) {
            $translate = _$translate_;
            loader = i18nCustomLoader;
            config = i18nConfig;
            translation = translate;
            timeout = $timeout;
            httpBackend = $httpBackend;
            scope = $rootScope;
            log = $log;
        });
        httpBackend.when('GET', '../../_appde_DE.json').respond(404, "BAD PATH");
        httpBackend.when('GET', 'libs/akamai-components/0.0.1/locales/de_DE.json').respond(404, "BAD PATH");
        httpBackend.when('GET', INTERNATIONALIZATION_PATH).respond(enUsResponse);
        httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
    });
    context('when using custom loader service bad cookie', function(){
        it('should ignore gracefully and continue to next url', function(){
            httpBackend.flush();
            expect(translation.sync("billing-center.no-access")).to.equal("You have no access to Billing Center application.");
            expect(translation.sync("components.name")).to.equal("Akamai Common Components");
            expect(translation.sync("askjdfh.name")).to.equal("askjdfh.name");
        });
    });
});
