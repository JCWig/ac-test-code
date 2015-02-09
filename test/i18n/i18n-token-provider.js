'use strict';

describe('i18nTokenProvider', function() {

    var provider, config;

    beforeEach(function() {

        angular.mock.module(require('../../src/i18n').name);

        angular.mock.module(function(i18nTokenProvider) {
            provider = i18nTokenProvider;
        });

        inject(function(i18nConfig) {
            config = i18nConfig;
        });
    });

    describe('$i18nTokenProvider#useLocale', function() {

        it('should be defined', function() {
            expect(provider.useLocale).to.not.be.undefined;
        });

        it('should be a function', function() {
            expect(typeof(provider.useLocale)).to.equal('function');
        });

        it('should variable "locale" init value be "en_US"', function() {
            expect(provider.locale).to.equal(config.defaultLocale);
        });

        it('should variable "urls" value be "../../../locales/component-locales/" if not added ', function() {
            expect(typeof(provider.urls)).to.not.equal('undefined');
            expect(provider.urls[0]).to.equal(config.localePath);
        });

        it('should variable "locale" value be "de_DE" if set from useLocale', function() {
            provider.useLocale("de_DE");
            expect(provider.locale).to.equal("de_DE");
        });

    });

    describe('$i18nTokenProvider#addAppLocalePath', function() {

        it('should be defined', function() {
            expect(provider.addAppLocalePath).to.not.be.undefined;
        });

        it('should be a function', function() {
            expect(typeof(provider.addAppLocalePath)).to.equal('function');
        });

        it('should array "urls"  contain correct value as string given no part value ', function() {
            provider.addAppLocalePath("../../");

            expect(provider.urls.length).to.equal(2);
            expect(provider.urls[1]).to.equal("../../");
            expect(provider.urls[0]).to.equal(config.localePath);
        });

        it('should array "urls"  contain correct value given with part value ', function() {
            provider.addAppLocalePath("../../", "_app");

            expect(provider.urls.length).to.equal(2);
            expect(provider.urls[1]).to.equal("../../_app");
            expect(provider.urls[0]).to.equal(config.localePath);
        });

        it('should array "urls" contain correct value given as array ', function() {
            var arrOfPath = [];
            arrOfPath.push("../../_app");

            provider.addAppLocalePath(arrOfPath);

            expect(provider.urls.length).to.equal(2);
            expect(provider.urls[1]).to.equal("../../_app");
            expect(provider.urls[0]).to.equal(config.localePath);
        });

        it('should array "urls" not to add value if given string as integer value ', function() {

            provider.addAppLocalePath(123);

            expect(provider.urls.length).to.equal(1);
            expect(provider.urls[0]).to.equal(config.localePath);
        });

        it('should array "urls" not to add value if given array as undefined', function() {
            var arrOfPath;

            provider.addAppLocalePath(arrOfPath);

            expect(provider.urls.length).to.equal(1);
            expect(provider.urls[0]).to.equal(config.localePath);

        });

        it('should array "urls" not to add value if given array as empty', function() {

            var arrOfPath = [];

            provider.addAppLocalePath(arrOfPath);

            expect(provider.urls.length).to.equal(1);
            expect(provider.urls[0]).to.equal(config.localePath);

        });

        it('should array "urls" not to add value if given array as null', function() {
            var arrOfPath = null;

            provider.addAppLocalePath(arrOfPath);

            expect(provider.urls.length).to.equal(1);
            expect(provider.urls[0]).to.equal(config.localePath);

        });
    });

    describe('$i18nTokenProvider#addComponentLocalePath', function() {

        it('should be defined', function() {
            expect(provider.addComponentLocalePath).to.not.be.undefined;
        });

        it('should be a function', function() {
            expect(typeof(provider.addComponentLocalePath)).to.equal('function');
        });

        it('should array "urls" contain correct value as string given no part value ', function() {
            provider.addComponentLocalePath("../../");

            expect(provider.urls.length).to.equal(1);
            expect(provider.urls[0]).to.equal("../../");
        });

        it('should array "urls" contain correct value given with part value ', function() {
            provider.addComponentLocalePath("../../", "_components");

            expect(provider.urls.length).to.equal(1);
            expect(provider.urls[0]).to.equal("../../_components");
        });

        it('should array "urls" contain correct value given as array ', function() {
            var arrOfPath = [];
            arrOfPath.push("../../_components");

            provider.addComponentLocalePath(arrOfPath);

            expect(provider.urls.length).to.equal(1);
            expect(provider.urls[0]).to.equal("../../_components");
        });

        it('should array "urls" not to add value if given string as integer value ', function() {

            provider.addComponentLocalePath(123);

            expect(provider.urls.length).to.equal(1);
        });

        it('should array "urls" not to add value if given array as undefined', function() {
            var arrOfPath;

            provider.addComponentLocalePath(arrOfPath);

            expect(provider.urls.length).to.equal(1);
            expect(provider.urls[0]).to.equal(config.localePath);

        });

        it('should array "urls" not to add value if given array as empty', function() {

            var arrOfPath = [];

            provider.addComponentLocalePath(arrOfPath);

            expect(provider.urls.length).to.equal(1);
            expect(provider.urls[0]).to.equal(config.localePath);

        });

        it('should array "urls" not to add value if given array as null', function() {
            var arrOfPath = null;

            provider.addComponentLocalePath(arrOfPath);

            expect(provider.urls.length).to.equal(1);
            expect(provider.urls[0]).to.equal(config.localePath);
        });
    });
});
