'use strict';

describe('i18nCustomLoader service', function() {

    var appLocaleJson, componentLocaleJson, provider, value, loader, service, config, $scope, $http, $q, $httpBackend, $translate;

    appLocaleJson = {
        "billing-center.no-access": "You have no access to Billing Center application.",
        "reseller-tools.incorrect-date": "Incorrect date format. Please fix the date and try again."
    };
    componentLocaleJson = {
        "components": {
            "error": {
                "invalid-json": "{{name}} json data is invalid.",
                "data-empty": "{{name}} data can not be empty."
            }
        }
    };

    beforeEach(function() {

        angular.mock.module(require('../../src/i18n').name);

        angular.mock.module(function($provide, $translateProvider, i18nTokenProvider) {
            //provider = i18nTokenProvider;

            //i18nTokenProvider.useLocale("en_DE");

            $provide.factory('i18nCustomLoader', function($q, $http, i18nToken) {
                return function(options) { //callback func option has: $http, key="en_US"

                    var deferred = $q.defer(),
                        promise = deferred.promise,
                        deferreds = [],
                        localeTable = {};

                    promise.then(function(translation) {
                        value = angular.toJson(translation);
                    });

                    deferreds.push(appLocaleJson);
                    deferreds.push(componentLocaleJson);
                    $q.all(deferreds).then(
                        function(responses) { //success
                            angular.forEach(responses, function(resp) {
                                var src = resp,
                                    clone = src ? angular.copy(src) : {};
                                angular.extend(localeTable, clone);
                            });

                            deferred.resolve(localeTable);
                        }
                    );
                    return deferred.promise;
                };
            });

            $translateProvider.useLoader('i18nCustomLoader');
        });

    });

    beforeEach(function() {

        inject(function(_$translate_, _$httpBackend_, i18nCustomLoader, $rootScope) {
            $httpBackend = _$httpBackend_;
            $translate = _$translate_;
            $scope = $rootScope;
            loader = i18nCustomLoader;
        });
    });

    it('should custom loader be defined', function() {
        expect(loader).to.be.not.undefined;
    });

    it('should return a promise', function() {
        var promise = loader();
        expect(promise).to.be.not.undefined;
    });

    it('should return a promise', function() {

        $scope.$digest();
        value = JSON.parse(value);
        //console.log(typeof value);
        //expect(keys).toEqual('billing-center.no-access');
        //expect(value).toEqual('');
    });
});

describe('i18nToken service', function() {

    var provider, loader, service, config, $scope, $http, $q, $httpBackend;

    beforeEach(function() {

        angular.mock.module(require('../../src/i18n').name);

        angular.mock.module(function($provide, $translateProvider, i18nTokenProvider) {
            provider = i18nTokenProvider;

            i18nTokenProvider.useLocale("en_DE");
            i18nTokenProvider.addAppLocalePath("../../", "_app");
            i18nTokenProvider.addComponentLocalePath("../../", "_component");

            $provide.factory('i18nCustomLoader', function($q, i18nToken) {
                var locale = i18nToken.getLocale(),
                    urls = i18nToken.getUrls();
                return function(options) {
                    var deferred = $q.defer();
                    deferred.resolve({});
                    return deferred.promise;
                };
            });

            $translateProvider.useLoader('i18nCustomLoader');
        });

        inject(function(i18nCustomLoader, i18nToken, i18nConfig, $rootScope) {
            loader = i18nCustomLoader;
            service = i18nToken;
            config = i18nConfig;
            $scope = $rootScope.$new();
        });
    });

    //context('i18nTokenService has getLocale() method', function() {
    //   sinon.stub(this.$http, 'get', function() {
    //   return null;
    // });
    //
    it('should be defined', function() {
        expect(service).to.not.be.undefined;
    });

    it('should have "getLocale" method defined', function() {
        expect(service.getLocale).to.not.be.undefined;
    });

    it('should have "getUrls" method defined', function() {
        expect(service.getUrls).to.not.be.undefined;
    });

    it('should "getLocale" method return default locale value', function() {
        expect(service.getLocale()).to.equal("en_DE");
    });

    it('should "getUrls" method return correct app url value', function() {
        expect(service.getUrls().length).to.equal(2);
        expect(service.getUrls()[1]).to.equal("../../_app");
    });

    it('should "getUrls" method return correct component url value', function() {
        expect(service.getUrls().length).to.equal(2);
        expect(service.getUrls()[0]).to.equal("../../_component");
    });
});
