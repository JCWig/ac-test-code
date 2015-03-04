'use strict';
var INTERNATIONALIZATION_PATH = '/assets/akamai-components/0.0.1/locales/en_US.json';
describe('i18nTokenProvider', function() {

    var provider, config;

    beforeEach(function() {
        angular.mock.module(require('../../src/i18n').name);
        angular.mock.module(function(i18nTokenProvider) {
            provider = i18nTokenProvider;
        });
        inject(function(i18nConfig) {
            config = i18nConfig;
        });
    });

    context('when inspecting $i18nTokenProvider#addAppLocalePath', function() {

        it('should be defined', function() {
            expect(provider.addAppLocalePath).to.not.be.undefined;
        });

        it('should be a function', function() {
            expect(typeof(provider.addAppLocalePath)).to.equal('function');
        });
    });
    context('when inspecting url field', function(){
        it('should contain correct component locale path ', function() {
            var compPath = config.localePath.replace(/\{version\}/g, config.baseVersion);

            expect(provider.urls.length).to.equal(1);
            expect(provider.urls[0]).to.equal(compPath);
        });

        it('should be able to add/retrieve another path', function() {
            provider.addAppLocalePath("../../");

            expect(provider.urls.length).to.equal(2);
            expect(provider.urls[1]).to.equal("../../");
        });

        it('should be able to add with part value and retrieve with correct response', function() {
            provider.addAppLocalePath("../../", "_app");
            var compPath = config.localePath.replace(/\{version\}/g, config.baseVersion);

            expect(provider.urls.length).to.equal(2);
            expect(provider.urls[1]).to.equal("../../_app");
        });

        it('should be able to add url in array format ', function() {
            var arrOfPath = [];
            arrOfPath.push("../../_app");

            provider.addAppLocalePath(arrOfPath);

            expect(provider.urls.length).to.equal(2);
            expect(provider.urls[1]).to.equal("../../_app");
        });

        it('should be able to add multiple urls in array format ', function() {
            var arrOfPath = [];
            arrOfPath.push("../../_app");
            arrOfPath.push("../../_bogus");

            provider.addAppLocalePath(arrOfPath);

            expect(provider.urls.length).to.equal(3);
            expect(provider.urls[1]).to.equal("../../_app");
            expect(provider.urls[2]).to.equal("../../_bogus");
        });

        it('should not to add app locale value if given string as integer value ', function() {

            provider.addAppLocalePath(123);

            expect(provider.urls).to.have.length(1);
        });

        it('should not to add app locale value if given array as undefined', function() {
            var arrOfPath = undefined;

            provider.addAppLocalePath(arrOfPath);

            expect(provider.urls).to.have.length(1);
        });

        it('should not to add app locale value if given array as empty', function() {
            var arrOfPath = [];

            provider.addAppLocalePath(arrOfPath);

            expect(provider.urls).to.have.length(1);
        });

        it('should not to add app locale value if given array as null', function() {
            var arrOfPath = null;

            provider.addAppLocalePath(arrOfPath);

            expect(provider.urls).to.have.length(1);
        });
        it('should not to add app locale value if given array as null', function() {
            var arrOfPath = null;

            expect(provider.urls).to.have.length(1);
        });
    });
});
describe('i18nToken service', function() {

    var service, cookies, rootScope;
    var akdjsfh = '../../_appen_US.json';
    beforeEach(function() {
        angular.mock.module(require('../../src/i18n').name);
        angular.mock.module(function($provide, $translateProvider, i18nTokenProvider) {
            i18nTokenProvider.addAppLocalePath("../../", "_app");
            $translateProvider.useLoader('i18nCustomLoader');
            $provide.decorator ('$cookies', function ($delegate) {
                $delegate = {AKALOCALE:"ZW5fVVN+TWRLSm1QZGEwNTBKNUZEZzFLZVQyNW9kTExYY1l6T3lHSVg3SjM1SjNJaXBaZ2JUaFRJVGZCWXROSjNmdFIzdXMzL0pJbms9; expires=Wed, 17 Mar 2083 13:04:59 GMT; path=/; domain=172.25.46.158; Secure"};
                return $delegate;
            });
        });

        inject(function(i18nToken, _$cookies_, _$rootScope_, $httpBackend) {
            service = i18nToken;
            rootScope = _$rootScope_.$new();
            $httpBackend.when('GET', akdjsfh).respond(require("./i18n_responses/messages_en_US.json"));
            $httpBackend.when('GET', INTERNATIONALIZATION_PATH).respond(require("./i18n_responses/messages_en_US.json"));     
            cookies = _$cookies_;
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
            expect(urlValues[1]).to.equal("../../_app");
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
            i18nTokenProvider.addAppLocalePath("../../", "_app");
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
describe('i18nTokenProvider with valid cookie', function() {

    var provider, config, cook, scope, httpBackend;
    var enUsMessagesResponse = require("./i18n_responses/messages_en_US.json");
    beforeEach(function() {
        angular.mock.module(require('../../src/i18n').name);
        angular.mock.module(function(i18nTokenProvider) {
            provider = i18nTokenProvider;
        });
        inject(function(i18nConfig, $cookies, $rootScope, $httpBackend) {
            config = i18nConfig;
            cook = $cookies;
            scope = $rootScope;
            httpBackend = $httpBackend;
        });
        httpBackend.when('GET', INTERNATIONALIZATION_PATH).respond(enUsMessagesResponse);
        cook["AKALOCALE"] = 'AKALOCALE';
    });
       

    context('when inspecting $i18nTokenProvider#addAppLocalePath', function() {
        it('should use localeCookie', function(){
            scope.$digest();
        });
    });
});
