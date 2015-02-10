'use strict';

describe('i18n-translate-wrapper service', function() {
    var akTranslate, config, $translate, $rootScope, $timeout;

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

        inject(function(akamTranslate, i18nConfig, _$rootScope_, _$translate_, _$timeout_) {
            akTranslate = akamTranslate;
            $rootScope = _$rootScope_;
            $translate = _$translate_;
            $timeout = _$timeout_;
            config = i18nConfig;
        });
    });

    describe("akamTranslate", function() {
        it('should service be defined', function() {
            expect(akTranslate).to.not.be.undefined;
        });

        it('should have akamTranslate#get method defined', function() {
            expect(akTranslate.get).to.not.be.undefined;
        });

        it('should akamTranslate#get be a function', function() {
            expect(typeof akTranslate.get).to.equal("function");
        });

        it('should get return key since it is not ready', function() {
            expect(akTranslate.get("somekey.somemorekey")).to.be.equal("somekey.somemorekey");
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

        it("should #get method translate without given variable replacement", function() {
            expect(akTranslate.get("TRANSLATION_ID")).to.be.equal("Lorem Ipsum ")
        });

        it("should #get method translate given variable replacement", function() {
            expect(akTranslate.get("TRANSLATION_ID", { "value": "Sean"})).to.be.equal("Lorem Ipsum Sean");
        });

        it("should #get method translate to be appended given variable replacement of integer", function() {
            expect(akTranslate.get("TRANSLATION_ID_3", {
                "value": "2"
            })).to.be.equal("Lorem Ipsum 22");
        });
    });
});