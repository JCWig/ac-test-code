'use strict';
var INTERNATIONALIZATION_PATH = '/apps/appname/locales/en_US.json';
var LIBRARY_PATH = /\/libs\/akamai-components\/[0-9]*.[0-9]*.[0-9]*\/locales\/en_US.json/;
var enUsMessagesResponse = require("./i18n_responses/messages_en_US.json");
var enUsResponse = require ("./i18n_responses/en_US.json");
describe('akamTranslate filter', function() {
    var element, scope, compile, markup, translation, filter, timeout, httpBackend, self;

    var translationMock = {
        'TRANSLATION_ID': 'Lorem Ipsum {{value}}',
        'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
        'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}'
    };

    beforeEach(function() {
        self = this;
        angular.mock.module(require('../../src/i18n').name);
        angular.mock.module(function($provide, $translateProvider) {
            $translateProvider.useLoader('i18nCustomLoader');
        });
        inject(function($compile, $rootScope, $timeout, $filter, translate, $httpBackend) {
            compile = $compile;
            filter = $filter;
            timeout = $timeout;
            scope = $rootScope.$new();
            translation = translate;
            httpBackend = $httpBackend;
        });
        httpBackend.when('GET', INTERNATIONALIZATION_PATH).respond(translationMock);
        httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
    });
    function addElement(markup) {
        self.el = compile(markup)(scope);
        self.element = self.el[0];
        scope.$digest();
        httpBackend.flush();
        timeout.flush();
        document.body.appendChild(self.element);
    }
    describe('when rendering', function() {
        afterEach(function(){
            document.body.removeChild(self.element);
        });
        it("should translate filter used in html display value correctly", function() {
            var markup = '<span class="akam-translate">{{"TRANSLATION_ID"| akamTranslate}}</span>';
            addElement(markup);
            expect(document.querySelector('.akam-translate').textContent).toEqual("Lorem Ipsum ");
        });
        it("should translate filter used in javascript display value correctly", function() {
            var markup = '<span class="akam-translate">{{"TRANSLATION_ID"| akamTranslate}}</span>';
            addElement(markup);
            expect(filter("akamTranslate")("TRANSLATION_ID")).toEqual("Lorem Ipsum ");
        });
        it("should translate filter display key if key not found", function() {
            var markup = '<span class="akam-translate1">{{"UNKNOWN_KEY"| akamTranslate}}</span>';
            addElement(markup);
            expect(document.querySelector('.akam-translate1').textContent).toEqual("UNKNOWN_KEY");
        });

        it("should translate filter used in javascript with value replacement display value correctly", function() {
            var markup = '<span class="akam-translate1">{{"UNKNOWN_KEY"| akamTranslate}}</span>';
            addElement(markup);
            expect(filter("akamTranslate")("TRANSLATION_ID", {
                value: "Sean"
            })).toEqual("Lorem Ipsum Sean");
        });
    });
});
