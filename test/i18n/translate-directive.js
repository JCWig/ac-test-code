'use strict';

var INTERNATIONALIZATION_PATH = '/apps/appname/locales/en_US.json';
var LIBRARY_PATH = '/libs/akamai-components/0.0.1/locales/en_US.json';
var enUsMessagesResponse = require("./i18n_responses/messages_en_US.json");
var enUsResponse = require ("./i18n_responses/en_US.json");

describe('akam-translate directive', function() {
    var element, scope, compile, markup, timeout, httpBackend;
    var translationMock = {
        'TRANSLATION_ID':   'Lorem Ipsum {{value}}',
        'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
        'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}'
    };
    var self = this;
    function addElement(markup) {
        self.el = compile(markup)(scope);
        self.element = self.el[0];
        scope.$digest();
        document.body.appendChild(self.element);
    };
    afterEach(function() {
        document.body.removeChild(self.element);
    });
    describe('when rendering', function() {
        beforeEach(function() {
            angular.mock.module(require('../../src/i18n').name);
            angular.mock.module(function($provide, $translateProvider) {
                $translateProvider.useLoader('i18nCustomLoader');
            });
            inject(function(_$compile_, _$rootScope_, $timeout, $httpBackend) {
                compile = _$compile_;
                var rootScope = _$rootScope_;
                scope = rootScope.$new();
                timeout = $timeout;
                httpBackend = $httpBackend;
            });
            httpBackend.when('GET', INTERNATIONALIZATION_PATH).respond(translationMock);
            httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
        });
        it("should translate correctly with correct key", function() {
            var markup = '<span akam-translate="TRANSLATION_ID" class="akam-translate"></span>';
            addElement(markup);
            httpBackend.flush();
            timeout.flush();
            var translatedSpan = document.querySelector('.akam-translate');
            expect(translatedSpan.textContent).toEqual("Lorem Ipsum ");
        });

        it("should render empty string if no key value", function() {
            var markup = '<span akam-translate="" class="akam-translate2"></span>';
            addElement(markup);
            httpBackend.flush();
            timeout.flush();
            var translatedSpan = document.querySelector('.akam-translate2');
            expect(translatedSpan.textContent).toEqual('');
        });

        it("should render key value if set wrong key string", function() {
            var markup = '<span akam-translate="any.key" class="akam-translate3"></span>';
            addElement(markup);
            httpBackend.flush();
            timeout.flush();
            var translatedSpan = document.querySelector('.akam-translate3');
            expect(translatedSpan.textContent).toEqual("any.key");
        });
    });
});
