'use strict';

describe('i18n-custom-loader service', function() {
    beforeEach(function() {

        angular.mock.module(require('../../src/i18n').name);
        inject(function(i18nCustomLoader, i18nToken,, i18nConfig, $rootScope, $http, $q) {
            this.i18nCustomLoader = i18nCustomLoader;
            this.i18nTokenService = i18nToken;
            this.i18nConfig = i18nConfig;
            this.$rootScope = $rootScope;
            this.$http = $http;
            this.$q = $q;
        });
    });

    afterEach(function() {});
});