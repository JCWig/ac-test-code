'use strict';

describe('i18n-translation-resolver service', function() {
    beforeEach(function() {

        angular.mock.module(require('../../src/i18n').name);
        inject(function(i18nTranslationResolver, $rootScope, $translate) {
            this.i18nTranslationResolver = i18nTranslationResolver;
            this.$rootScope = $rootScope;
            this.$translate = $translate;
        });
    });

    afterEach(function() {});
});