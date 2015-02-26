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
    context('when using custom Loader server', function(){
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
});

describe('i18nToken service', function() {

    var service, cookieStore, rootScope;

    beforeEach(function() {
        angular.mock.module(require('../../src/i18n').name);
        angular.mock.module(function($provide, $translateProvider, i18nTokenProvider) {

            $provide.decorator('$cookieStore', function($delegate) {
                $delegate.put('AKALOCALE', 'ZW5fVVN+TVlqYmlndFZJQnpraWIrVTB1NmU4dmc0MU50MFV6WEhlUzJEODVnRFBackNVc0xWUXl3RkowK2JObEh3eFNiZDBXMncyNDQ9');
                return $delegate;
            });

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

        inject(function(i18nToken, _$cookieStore_, _$rootScope_) {
            service = i18nToken;
            cookieStore = _$cookieStore_;
            rootScope = _$rootScope_.$new();
        });
    });

    afterEach(function() {
        // clean up
        cookieStore.remove('AKALOCALE');
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

        it("should cookie locale value not same as 'en_US' because it is encoded", function() {
            var locale = cookieStore.get("AKALOCALE");
            expect(locale).to.not.equal(service.getCurrentLocale());
        });

        it("should cookie locale value be 'en_US' after decoded", function() {
            var locale = cookieStore.get("AKALOCALE");
            expect(atob(locale.split("+")[0])).to.equal(service.getCurrentLocale());
        });
    });
});

describe('locale cookie set to "de_DE', function() {

    var service, cookieStore, rootScope;

    beforeEach(function() {
        angular.mock.module(require('../../src/i18n').name);
        angular.mock.module(function($provide, $translateProvider, i18nTokenProvider) {

            $provide.decorator('$cookieStore', function($delegate) {
                $delegate.put('AKALOCALE', 'ZGVfREU=+TVlqYmlndFZJQnpraWIrVTB1NmU4dmc0MU50MFV6WEhlUzJEODVnRFBackNVc0xWUXl3RkowK2JObEh3eFNiZDBXMncyNDQ9');
                return $delegate;
            });

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

        inject(function(i18nToken, _$cookieStore_, _$rootScope_) {
            service = i18nToken;
            cookieStore = _$cookieStore_;
            rootScope = _$rootScope_.$new();
        });
    });

    afterEach(function() {
        // clean up
        cookieStore.remove('AKALOCALE');
    });

    it('should locale value be "de_DE" after set cookie to encoded "de_DE"', function() {
        var locale = cookieStore.get("AKALOCALE");
        expect(atob(locale.split("+")[0])).to.equal("de_DE");
    });

    it('should getCurrentLocale() method return value be "de_DE" ', function() {
        var locale = cookieStore.get("AKALOCALE");
        expect(atob(locale.split("+")[0])).to.equal(service.getCurrentLocale());
    });
});
