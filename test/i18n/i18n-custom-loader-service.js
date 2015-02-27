'use strict';

describe('i18nCustomLoader service', function() {

    var value, loader, config, translation, $translate;

    beforeEach(function() {
        angular.mock.module(require('../../src/i18n').name);
        angular.mock.module(function($provide, $translateProvider) {
            $provide.factory('i18nCustomLoader', function($q, $timeout) {
                return function(options) {
                    var deferred = $q.defer(),
                        promise = deferred.promise,
                        deferreds = [],
                        localeTable = {};
                    promise.then(function(translation) {
                        value = translation;
                    });
                    deferreds.push(require("../../locales/en_US.json"));
                    deferreds.push(require("../../examples/i18n/locales/json/messages/messages_en_US.json"));
                    $q.all(deferreds).then(
                        function(responses) { //success
                            angular.forEach(responses, function(resp) {
                                var src = resp,
                                    clone = src ? angular.copy(src) : {};
                                angular.extend(localeTable, clone);
                            });
                            $timeout(function() {
                                deferred.resolve(localeTable);
                            });
                        }
                    );
                    return deferred.promise;
                };
            });
            $translateProvider.useLoader('i18nCustomLoader');
        });
    });

    beforeEach(function() {
        inject(function(_$translate_, $timeout, i18nCustomLoader, $rootScope, i18nConfig, translate) {
            $translate = _$translate_;
            loader = i18nCustomLoader;
            config = i18nConfig;
            translation = translate;
            $timeout(function() {
                $translate.use(config.defaultLocale);
            });
            $timeout.flush();
            $rootScope.$digest();
        });
    });

    it('should custom loader be defined', function() {
        expect(loader).to.be.not.undefined;
    });

    it('should return a promise', function() {
        var promise = loader();
        expect(promise).to.be.not.undefined;
        expect(promise.then).to.be.not.undefined;
        expect(typeof promise.then).to.equal("function");
    });

    it('should return csame key value if key not found from tranlsation table', function() {
        expect(translation.sync("somekey.someotherkey")).to.equal("somekey.someotherkey");
    });

    it('should return correct translated value given app locale key from combined translation table', function() {
        expect(translation.sync("billing-center.no-access")).to.equal("You have no access to Billing Center application.");
    });

    it('should return correct translated value given component locale key from combined translation table', function() {
        expect(translation.sync("components.pagination.label.results")).to.equal("Results: ");
    });

    it('should return correct translated value given locale key from combined translation table', function() {
        expect(translation.sync("reseller-tools.incorrect-date")).to.equal("Incorrect date format. Please fix the date and try again.");
        expect(translation.sync("components.pagination.label.results")).to.equal("Results: ");
    });
});

describe('i18nToken service', function() {

    var service, cookies, rootScope;

    beforeEach(function() {
        angular.mock.module(require('../../src/i18n').name);
        angular.mock.module(function($provide, $translateProvider, i18nTokenProvider) {
            i18nTokenProvider.addAppLocalePath("../../", "_app");
            $provide.factory('i18nCustomLoader', function($q, i18nToken) {
                var locale = i18nToken.getCurrentLocale(),
                    urls = i18nToken.getUrls();
                return function(options) {
                    var deferred = $q.defer();
                    deferred.resolve({});
                    return deferred.promise;
                };
            });
            $translateProvider.useLoader('i18nCustomLoader');
        });

        inject(function(i18nToken, _$cookies_, _$rootScope_) {
            service = i18nToken;
            cookies = _$cookies_;
            rootScope = _$rootScope_.$new();
            cookies.AKALOCALE = "ZW5fVVN+TWRLSm1QZGEwNTBKNUZEZzFLZVQyNW9kTExYY1l6T3lHSVg3SjM1SjNJaXBaZ2JUaFRJVGZCWXROSjNmdFIzdXMzL0pJbms9; expires=Wed, 17 Mar 2083 13:04:59 GMT; path=/; domain=172.25.46.158; Secure";
        });
    });

    afterEach(function() {
        // clean up
        cookies.AKALOCALE = undefined;
    });

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
        expect(service.getUrls().length).to.equal(2);
        expect(service.getUrls()[1]).to.equal("../../_app");
    });

    context('locale cookie set to "en_US', function() {

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
            $provide.factory('i18nCustomLoader', function($q, i18nToken) {
                var locale = i18nToken.getCurrentLocale(),
                    urls = i18nToken.getUrls();
                return function(options) {
                    var deferred = $q.defer();
                    deferred.resolve({});
                    return deferred.promise;
                };
            });
            $translateProvider.useLoader('i18nCustomLoader');
        });

        inject(function(i18nToken, _$cookies_, _$rootScope_) {
            service = i18nToken;
            cookies = _$cookies_;
            rootScope = _$rootScope_.$new();
            cookies.AKALOCALE = "ZGVfREU=+TWRLSm1QZGEwNTBKNUZEZzFLZVQyNW9kTExYY1l6T3lHSVg3SjM1SjNJaXBaZ2JUaFRJVGZCWXROSjNmdFIzdXMzL0pJbms9; expires=Wed, 17 Mar 2083 13:04:59 GMT; path=/; domain=172.25.46.158; Secure";
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
