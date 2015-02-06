'use strict';

describe('i18n-token-provider service', function() {
    beforeEach(function() {

        angular.mock.module(require('../../src/i18n').name);
        inject(function(i18nTokenProvider, i18nConfig, $rootScope, $http, $q) {
            this.i18nTokenProvider = i18nTokenProvider;
            this.i18nConfig = i18nConfig;
            this.$rootScope = $rootScope;
        });
    });

    afterEach(function() {});
});