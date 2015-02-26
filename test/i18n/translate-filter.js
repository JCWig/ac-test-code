'use strict';

describe('akamTranslate filter', function() {
    var element, scope, compile, markup, translation, filter, timeout;

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
        inject(function(_$compile_, _$rootScope_, _$timeout_, _$filter_, translate) {
            markup = '<span class="akam-translate">{{"TRANSLATION_ID"| akamTranslate}}</span>';
            compile = _$compile_;
            filter = _$filter_;
            timeout = _$timeout_;
            var rootScope = _$rootScope_;
            scope = rootScope.$new();
            element = compile(markup)(rootScope)[0];
            translation = translate;
            timeout.flush();
            scope.$digest();
            document.body.appendChild(element);
        });
    });

    context('when rendering', function() {

        it("should translate filter used in html display value correctly", function() {
            expect(document.querySelector('.akam-translate').textContent).to.equal("Lorem Ipsum ");
        });

        it("should translate filter used in javascript display value correctly", function() {
            expect(filter("akamTranslate")("TRANSLATION_ID")).to.equal("Lorem Ipsum ");
        });

        it("should translate filter display key if key not found", function() {
            var markup = '<span class="akam-translate1">{{"UNKNOWN_KEY"| akamTranslate}}</span>';
            var scp = scope.$new();
            var el = compile(markup)(scp)[0];
            scp.$digest();
            document.body.appendChild(el);
            expect(document.querySelector('.akam-translate1').textContent).to.equal("UNKNOWN_KEY");
        });

        it("should translate filter used in javascript with value replacement display value correctly", function() {
            expect(filter("akamTranslate")("TRANSLATION_ID", {
                value: "Sean"
            })).to.equal("Lorem Ipsum Sean");
        });
    });
});
