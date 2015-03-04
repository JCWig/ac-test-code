/*'use strict';

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

    context('when $i18nTokenProvider#addAppLocalePath', function() {

        it('should be defined', function() {
            expect(provider.addAppLocalePath).to.not.be.undefined;
        });

        it('should be a function', function() {
            expect(typeof(provider.addAppLocalePath)).to.equal('function');
        });

        it('should urls  contain correct component locale path ', function() {
            var compPath = config.localeComponentPath;

            expect(provider.rawUrls.length).to.equal(2);
            expect(provider.rawUrls[0].path).to.equal(compPath);
        });

        it('should urls  contain correct value as string given no part value ', function() {
            expect(provider.rawUrls.length).to.equal(2);
            expect(provider.rawUrls[1].path).to.contain("{appName}");
        });

        it('should urls  contain correct value given with part value ', function() {
            provider.addAppLocalePath({path:"../../", prefix:"_app", app: true});
            var compPath = config.localeComponentPath.replace(/\{version\}/g, config.baseVersion);

            expect(provider.rawUrls.length).to.equal(3);
            expect(provider.rawUrls[2].path).to.equal("../../_app");
        });

    /*    it('should urls contain correct value given as array ', function() {
            var arrOfPath = [];
            arrOfPath.push("../../_app");

            provider.addAppLocalePath(arrOfPath);

            expect(provider.rawUrls.length).to.equal(2);
            expect(provider.rawUrls[1].path).to.equal("../../_app");
        });

        it('should "urls" not to add app locale value if given string as integer value ', function() {

            provider.addAppLocalePath(123);

            expect(provider.rawUrls.length === 1).to.be.true;
        });

        it('should urls not to add app locale value if given array as undefined', function() {
            var arrOfPath;

            provider.addAppLocalePath(arrOfPath);

            expect(provider.rawUrls.length === 1).to.be.true;
        });

        it('should urls not to add app locale value if given array as empty', function() {

            var arrOfPath = [];

            provider.addAppLocalePath(arrOfPath);

            expect(provider.rawUrls.length === 1).to.be.true;
        });

        it('should urls not to add app locale value if given array as null', function() {
            var arrOfPath = null;

            provider.addAppLocalePath(arrOfPath);

            expect(provider.urls.length).to.equal(1);
        });

    });
});
*/