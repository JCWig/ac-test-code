'use strict';

describe('translate service', function() {
    var akTranslate, config, $translate, $rootScope, $timeout, $q, $scope;

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

            $provide.factory('i18nCustomLoader', ['$q', '$timeout', function($q, $tmout) {
                return function(options) {
                    var deferred = $q.defer();
                    $tmout(function() {
                        deferred.resolve({
                            'FOO': 'bar'
                        });
                    });
                    return deferred.promise;
                };
            }]);
        });

        inject(function(translate, _$q_, i18nConfig, _$rootScope_, _$translate_, _$timeout_) {
            akTranslate = translate;
            $rootScope = _$rootScope_;
            $translate = _$translate_;
            $timeout = _$timeout_;
            $q = _$q_;
            $scope = $rootScope.$new();
            config = i18nConfig;
        });
    });

    describe("akamTranslate", function() {
        it('should service be defined', function() {
            expect(akTranslate).to.not.be.undefined;
        });

        it('should have akamTranslate#sync method defined', function() {
            expect(akTranslate.sync).to.not.be.undefined;
        });

        it('should akamTranslate#sync be a function', function() {
            expect(typeof akTranslate.sync).to.equal("function");
        });

        it('should have akamTranslate#async method defined', function() {
            expect(akTranslate.async).to.not.be.undefined;
        });

        it('should akamTranslate#async be a function', function() {
            expect(typeof akTranslate.async).to.equal("function");
        });

        it('should sync function return key since translation table is not loaded', function() {
            expect(akTranslate.sync("somekey.somemorekey")).to.be.equal("somekey.somemorekey");
        });


        it('should async functon return key since translation table is not loaded', function() {
            var key = "something.something";
            var fst = $q.defer();

            fst.resolve(key);

            fst = akTranslate.async(key);
            fst.then(function(value) {
                value.should.eql(key);
                done();
            });
            $scope.$apply();
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

        it("should #sync method translate without given variable replacement", function() {
            expect(akTranslate.sync("TRANSLATION_ID")).to.be.equal("Lorem Ipsum ")
        });

        it("should #sync method translate given variable replacement", function() {
            expect(akTranslate.sync("TRANSLATION_ID", {
                "value": "Sean"
            })).to.be.equal("Lorem Ipsum Sean");
        });

        it("should #sync method translate to be appended given variable replacement of integer", function() {
            expect(akTranslate.sync("TRANSLATION_ID_3", {
                "value": "2"
            })).to.be.equal("Lorem Ipsum 22");
        });

        it('should async functon return translated value from valid key', function() {
            var key = "TRANSLATION_ID";
            var d = $q.defer();

            d = akTranslate.async(key);
            d.then(function(value) {
                value.should.eql("Lorem Ipsum ");
                done();
            });
            $scope.$apply();
        });

        it('should async functon return translated value from valid key with variable replacement', function() {
            var key = "TRANSLATION_ID";
            var d = $q.defer();
            d = akTranslate.async(key, {
                value: "sean"
            });
            d.then(function(value) {
                value.should.eql("Lorem Ipsum sean");
                done();
            });
            $scope.$apply();
        });

        it('should async functon return translated value with adding integer values from valid key with variable replacement', function() {
            var key = "TRANSLATION_ID_3";
            var d = $q.defer();

            d = akTranslate.async(key, {
                value: "2"
            });
            d.then(function(value) {
                value.should.eql("Lorem Ipsum 22");
                done();
            });
            $scope.$apply();
        });

        it('should async functon take array of keys return key value object', function() {
            var keys = ["TRANSLATION_ID", "TRANSLATION_ID_3"];
            var d = $q.defer();

            d = akTranslate.async(keys);
            d.then(function(values) {
                values[keys[0]].should.eql("Lorem Ipsum ");
                values[keys[1]].should.eql("Lorem Ipsum 2 ");
                done();
            });
            $scope.$apply();
        });

    });
});
