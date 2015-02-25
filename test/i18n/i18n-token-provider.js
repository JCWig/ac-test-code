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

    describe('$i18nTokenProvider#addAppLocalePath', function() {

        it('should be defined', function() {
            expect(provider.addAppLocalePath).to.not.be.undefined;
        });

        it('should be a function', function() {
            expect(typeof(provider.addAppLocalePath)).to.equal('function');
        });

        it('should urls  contain correct value as string given no part value ', function() {
            provider.addAppLocalePath("../../");

            expect(provider.urls.length).to.equal(2);
            expect(provider.urls[1]).to.equal("../../");
            expect(provider.urls[0]).to.equal(config.localePath);
        });

        it('should urls  contain correct value given with part value ', function() {
            provider.addAppLocalePath("../../", "_app");

            expect(provider.urls.length).to.equal(2);
            expect(provider.urls[1]).to.equal("../../_app");
            expect(provider.urls[0]).to.equal(config.localePath);
        });

        it('should urls contain correct value given as array ', function() {
            var arrOfPath = [];
            arrOfPath.push("../../_app");

            provider.addAppLocalePath(arrOfPath);

            expect(provider.urls.length).to.equal(2);
            expect(provider.urls[1]).to.equal("../../_app");
            expect(provider.urls[0]).to.equal(config.localePath);
        });

        it('should "urls" not to add app locale value if given string as integer value ', function() {

            provider.addAppLocalePath(123);

            expect(provider.urls.length === 2).to.be.false;
            expect(provider.urls[0]).to.equal(config.localePath);
        });

        it('should urls not to add app locale value if given array as undefined', function() {
            var arrOfPath;

            provider.addAppLocalePath(arrOfPath);

            expect(provider.urls.length === 2).to.be.false;
            expect(provider.urls[0]).to.equal(config.localePath);
        });

        it('should urls not to add app locale value if given array as empty', function() {

            var arrOfPath = [];

            provider.addAppLocalePath(arrOfPath);

            expect(provider.urls.length === 2).to.be.false;
            expect(provider.urls[0]).to.equal(config.localePath);
        });

        it('should urls not to add app locale value if given array as null', function() {
            var arrOfPath = null;

            provider.addAppLocalePath(arrOfPath);

            expect(provider.urls.length).to.equal(1);
            expect(provider.urls[0]).to.equal(config.localePath);
        });
    });
});
