'use strict';
var LIBRARY_PATH = '/libs/akamai-components/0.0.1/locales/en_US.json'
var CONFIG_PATH = '/apps/appName/locales/en_US.json';
var CONFIG_PREFIX = 'prefix'
var enUsMessagesResponse = require("./i18n_responses/messages_en_US.json");
var enUsResponse = require ("./i18n_responses/en_US.json");
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
            var compPath = config.localeComponentPath;

            expect(provider.rawUrls.length).to.equal(2);
            expect(provider.rawUrls[0].path).to.equal(compPath);
        });

        it('should be able to add/retrieve another path', function() {
            expect(provider.rawUrls.length).to.equal(2);
            expect(provider.rawUrls[1].path).to.contain('{appName}');
        });

        it('should be able to add with part value and retrieve with correct response', function() {
            provider.addAppLocalePath({path:"../../", prefix:"_app", app: true});
            var compPath = config.localeComponentPath.replace(/\{version\}/g, config.baseVersion);

            expect(provider.rawUrls.length).to.equal(3);
            expect(provider.rawUrls[2].path).to.equal("../../_app");
        });
        it('should not to add app locale value if given array as undefined', function() {
            var arrOfPath = undefined;

            provider.addAppLocalePath(arrOfPath);

            expect(provider.rawUrls).to.have.length(3);
        });
        it('should handle config without prefix', function() {
            config.prefix = CONFIG_PREFIX;
            provider.addAppLocalePath({path:"../../", app:true});
            expect(provider.rawUrls[2].path).to.equal('../../'+CONFIG_PREFIX);
        });
        it('should handle not from app with no path', function() {
            config.prefix = CONFIG_PREFIX;
            provider.addAppLocalePath({path:"", app:false});
            expect(provider.rawUrls[2].path).to.equal('/apps/{appname}/locales/');
        });
        it('should handle not from app', function() {
            config.prefix = CONFIG_PREFIX;
            provider.addAppLocalePath({path:"../../.."});
            expect(provider.rawUrls[2].path).to.equal('../../..'+CONFIG_PREFIX);
        });
        it('should not to add app locale value if given array as null', function() {
            var arrOfPath = null;

            provider.addAppLocalePath(arrOfPath);

            expect(provider.rawUrls).to.have.length(3);
        });
        it('should not to add app locale value if given array as null', function() {
            var arrOfPath = null;

            expect(provider.rawUrls).to.have.length(2);
        });
    });
});
describe('i18nToken service', function() {

    var service, cookies, rootScope;
    beforeEach(function() {
        angular.mock.module(require('../../src/i18n').name);
        angular.mock.module(function($provide, $translateProvider, i18nTokenProvider) {
            $translateProvider.useLoader('i18nCustomLoader');
            $provide.decorator ('$cookies', function ($delegate) {
                $delegate = {AKALOCALE:"ZW5fVVN+TWRLSm1QZGEwNTBKNUZEZzFLZVQyNW9kTExYY1l6T3lHSVg3SjM1SjNJaXBaZ2JUaFRJVGZCWXROSjNmdFIzdXMzL0pJbms9; expires=Wed, 17 Mar 2083 13:04:59 GMT; path=/; domain=172.25.46.158; Secure"};
                return $delegate;
            });
        });
        inject(function(i18nToken, _$cookies_, _$rootScope_, $httpBackend) {
            service = i18nToken;
            rootScope = _$rootScope_.$new();
            cookies = _$cookies_;
            $httpBackend.when('GET', CONFIG_PATH).respond(enUsMessagesResponse);
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
            expect(urlValues[1]).to.equal("/apps/appName/locales/");
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
