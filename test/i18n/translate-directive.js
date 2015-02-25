'use strict';

describe('akam-translate directive', function() {
    var httpBackend, element, scope, compile, markup, translation;

    var translationMock = {
        'TRANSLATION_ID': 'Lorem Ipsum {{value}}',
        'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
        'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}'
    };

    beforeEach(function() {
        angular.mock.module(require('../../src/i18n').name);
        angular.mock.module(function($provide, $translateProvider) {
            $provide.factory('i18nCustomLoader', function($q, $timeout) {
                return function(options) {
                    var deferred = $q.defer();
                    $timeout(function() {
                        deferred.resolve(translationMock);
                    });
                    return deferred.promise;
                };
            });
            $translateProvider.useLoader('i18nCustomLoader');
        });
        inject(function(_$compile_, _$rootScope_, _$httpBackend_, $timeout, translate) {
            markup = '<span akam-translate="TRANSLATION_ID" class="akam-translate"></span>';
            compile = _$compile_;
            var rootScope = _$rootScope_;
            scope = rootScope.$new();
            element = compile(markup)(rootScope)[0];
            translation = translate;
            $timeout.flush();
            scope.$digest();
            document.body.appendChild(element);
        });
    });

    context('when rendering', function() {
        it("should translate correctly with correct key", function() {
            expect(document.querySelector('.akam-translate').textContent).to.equal("Lorem Ipsum ");
        });

        it("should render empty string if no kay value", function() {
            var mk = '<span akam-translate="" class="akam-translate2"></span>';
            var elm = compile(mk)(scope)[0];

            scope.$digest();
            document.body.appendChild(elm);

            expect(document.querySelector('.akam-translate2').textContent).to.be.empty;
        });

        it("should render key value if set wrong key string", function() {
            var mk = '<span akam-translate="any.key" class="akam-translate3"></span>';
            var elm = compile(mk)(scope)[0];

            scope.$digest();
            document.body.appendChild(elm);

            expect(document.querySelector('.akam-translate3').textContent).to.equal("any.key");
        });
    });
});
