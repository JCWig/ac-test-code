'use strict';

describe('i18n-translation-resolver', function() {
    var resolver, config, $translate, $rootScope, $timeout, $q;

    var translationMock = {
        'TRANSLATION_ID': 'Lorem Ipsum {{value}}',
        'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
        'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}'
    };

    beforeEach(function() {

        angular.mock.module(require('../../src/i18n').name);

        angular.mock.module(function($provide, $translateProvider, i18nTokenProvider) {
            $translateProvider
                .translations('en_US', translationMock)
                .preferredLanguage('en_US')
                .fallbackLanguage('en_US')
                .useLoader('i18nCustomLoader');

            $provide.factory('i18nCustomLoader', ['$q', '$timeout', function($q, $timeout) {

                return function(options) {
                    var deferred = $q.defer();
                    $timeout(function() {
                        deferred.resolve({
                            'FOO': 'bar'
                        });
                    });
                    return deferred.promise;
                };
            }]);
        });

        inject(function(_$translate_, _$timeout_, _$rootScope_, _$q_, i18nTranslationResolver, i18nConfig) {
            $translate = _$translate_;
            $timeout = _$timeout_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            resolver = i18nTranslationResolver;
            config = i18nConfig;
        });
    });

    describe("i18nTranslationResolver", function() {

        it('should return a correct translated value ', function() {
            var deferred = $q.defer(),
                promise = deferred.promise,
                value;

            promise.then(function(translation) {
                value = translation[0];
            });
            $translate.use('en_US');
            resolver.get(['TRANSLATION_ID']).then(function(translation) {
                $timeout(function() {
                    deferred.resolve(translation);
                });
            });
            $timeout.flush();
            $rootScope.$digest();

            expect(value).to.equal('Lorem Ipsum ');
        });

        it('should return a correct translated value array with array of keys', function() {
            var deferred = $q.defer(),
                promise = deferred.promise,
                value;

            promise.then(function(translation) {
                value = translation;
            });
            $translate.use('en_US');
            resolver.get(['TRANSLATION_ID', "TRANSLATION_ID_2"]).then(function(translation) {
                $timeout(function() {
                    deferred.resolve(translation);
                });
            });
            $timeout.flush();
            $rootScope.$digest();

            expect(value).to.deep.equal(["Lorem Ipsum ", "Lorem Ipsum  + "]);
            expect(value[0]).to.equal('Lorem Ipsum ');
            expect(value[1]).to.equal('Lorem Ipsum  + ');
        });

        it('should return a correct translated value array with array of keys', function() {
            var deferred = $q.defer(),
                promise = deferred.promise,
                value;

            promise.then(function(translation) {
                value = translation;
            });
            $translate.use('en_US');
            resolver.get(['TRANSLATION_ID', {"TRANSLATION_ID_2":{value:2}}]).then(function(translation) {
                $timeout(function() {
                    deferred.resolve(translation);
                });
            });
            $timeout.flush();
            $rootScope.$digest();

            expect(value[0]).to.equal('Lorem Ipsum ');
            expect(value[1]).to.equal('Lorem Ipsum 2 + 2');
        });

        it('should i18nTranslationResolver#get be promise function', function() {

            $translate.use('en_US');
            $rootScope.$digest();

            expect(resolver.get().then).to.be.not.undefined;
            expect(typeof resolver.get().then).to.equal("function");
        });

        it('should service be defined', function() {
            expect(resolver).to.not.be.undefined;
        });

        it('should i18nTranslationResolver#get method defined', function() {
            expect(resolver.get).to.not.be.undefined;
        });

        it('should get be a function', function() {
            expect(typeof resolver.get).to.equal("function");
        });

        it("should '$translateChangeEnd' be called", function() {
            var spy = sinon.spy();
            $rootScope.$emit = spy;
            $translate.refresh();
            $timeout.flush();
            expect(spy).calledWith('$translateChangeEnd', {
                language: config.defaultLocale
            });
        });
    });
});
