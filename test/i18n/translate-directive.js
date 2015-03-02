'use strict';

describe('akam-translate directive', function() {
    var httpBackend, element, scope, compile, markup, translation, timeout;
    var translationMock = {
        'TRANSLATION_ID': 'Lorem Ipsum {{value}}',
        'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
        'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}'
    };
    var self = this;

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
            compile = _$compile_;
            var rootScope = _$rootScope_;
            scope = rootScope.$new();
            translation = translate;
            timeout = $timeout;
        });
    });
    function addElement(markup) {
        self.el = compile(markup)(scope);
        self.element = self.el[0];
        scope.$digest();
        timeout.flush();
        document.body.appendChild(self.element);
    };
    afterEach(function() {
        document.body.removeChild(self.element);
    });
    context('when rendering', function() {
        it("should translate correctly with correct key", function() {
            var markup = '<span akam-translate="TRANSLATION_ID" class="akam-translate"></span>';
            addElement(markup);
            var translatedSpan = document.querySelector('.akam-translate');
            expect(translatedSpan.textContent).to.equal("Lorem Ipsum ");
        });

        it("should render empty string if no kay value", function() {
            var markup = '<span akam-translate="" class="akam-translate2"></span>';
            addElement(markup);
            var translatedSpan = document.querySelector('.akam-translate2');
            expect(translatedSpan.textContent).to.be.empty;
        });

        it("should render key value if set wrong key string", function() {
            var markup = '<span akam-translate="any.key" class="akam-translate3"></span>';
            addElement(markup);
            var translatedSpan = document.querySelector('.akam-translate3');
            expect(translatedSpan.textContent).to.equal("any.key");
        });
    });
});
