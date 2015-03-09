'use strict';
var INTERNATIONALIZATION_PATH = '/apps/appName/locales/en_US.json';
var LIBRARY_PATH = 'libs/akamai-components/0.0.1/locales/en_US.json'
var CONFIG_PATH = '../../_appen_US.json';
var SECOND_INTERNATIONALIZATION_PATH = '/random/path/that/doesnt/exist/';
var SECOND_INTERNATIONALIZATION_JSON_PATH = SECOND_INTERNATIONALIZATION_PATH+'en_US.json';
describe('i18nCustomLoader service', function() {

    var value, loader, config, translation, $translate, httpBackend, timeout, scope, provider, log, location;
    var enUsMessagesResponse = require("./i18n_responses/messages_en_US.json");
    var enUsResponse = require ("./i18n_responses/en_US.json");
    beforeEach(function(){
        angular.mock.module(require('../../src/i18n').name);
        angular.mock.module(function(i18nTokenProvider) {
            var config = {
                path  : "../../",
                prefix:  "_app",
                appName: "billing-center"
            }
            provider = i18nTokenProvider;
            provider.addAppLocalePath(config);
        });
        angular.mock.module(function($provide, $translateProvider) {
            $translateProvider.useLoader('i18nCustomLoader');
        });
        inject(function(_$translate_, $timeout, i18nCustomLoader, $rootScope, i18nConfig, translate, $httpBackend, $log, $location) {
            $translate = _$translate_;
            loader = i18nCustomLoader;
            config = i18nConfig;
            translation = translate;
            timeout = $timeout;
            httpBackend = $httpBackend;
            scope = $rootScope;
            log = $log;
            location = $location
        });
    });
    describe('when using custom Loader server', function(){
        beforeEach(function() {
            httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
            httpBackend.when('GET', CONFIG_PATH).respond(enUsResponse);
            scope.$digest();
            httpBackend.flush();
        });
        it('should custom loader be defined', function() {
            expect(loader).not.toBe(undefined);
        });

        it('should return a promise', function() {
            var promise = loader();
            expect(promise).not.toBe(undefined);
            expect(promise.then).not.toBe(undefined);
            expect(typeof promise.then).toEqual("function");
        });

        it('should return csame key value if key not found from tranlsation table', function() {
            expect(translation.sync("somekey.someotherkey")).toEqual("somekey.someotherkey");
        });

        it('should return correct translated value given app locale key from combined translation table', function() {
            expect(translation.sync("billing-center.no-access")).toEqual("You have no access to Billing Center application.");
        });

        it('should return correct translated value given component locale key from combined translation table', function() {
            expect(translation.sync("components.pagination.label.results")).toEqual("Results: ");
        });

        it('should return correct translated value given locale key from combined translation table', function() {
            expect(translation.sync("reseller-tools.incorrect-date")).toEqual("Incorrect date format. Please fix the date and try again.");
            expect(translation.sync("components.pagination.label.results")).toEqual("Results: ");
        });
    });

    describe('when using custom loader service with url returning no data', function(){
        beforeEach(function() {
            httpBackend.when('GET', CONFIG_PATH).respond(404, 'BAD PATH');
            httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
        });
        it('should ignore gracefully and continue to next url', function(){
            spyOn(log, "error");
            httpBackend.flush();
            timeout.flush();
            expect(log.error).toHaveBeenCalled();
            expect(translation.sync("billing-center.no-access")).toEqual("billing-center.no-access");
            expect(translation.sync("components.name")).toEqual("components.name");
        });
    });
    describe('when using custom loader service with error response', function(){
        beforeEach(function() {
            httpBackend.when('GET', LIBRARY_PATH).respond({});
            httpBackend.when('GET', CONFIG_PATH).respond(404, 'BAD PATH');
        });
        it('should error and break ', function(){
            spyOn(log, "error");
            scope.$digest();
            httpBackend.flush();
            expect(log.error).toHaveBeenCalled();
        });
    });
    describe('when using custom loader service with url returning no data', function(){
        beforeEach(function() {
            httpBackend.when('GET', LIBRARY_PATH).respond(null);
            httpBackend.when('GET', CONFIG_PATH).respond(enUsMessagesResponse);
        });
        it('should ignore gracefully and continue to next url', function(){
            spyOn(log, "error");
            scope.$digest();
            httpBackend.flush();
            expect(log.error).not.toHaveBeenCalled();
            expect(translation.sync("billing-center.no-access")).toEqual("You have no access to Billing Center application.");
            expect(translation.sync("components.name")).toEqual("components.name");
        });
    });
});
