'use strict';

describe('i18n-translate-wrapper service', function() {
    beforeEach(function() {

        angular.mock.module(require('../../src/i18n').name);
        inject(function(akamTranslate, $rootScope, $translate) {
            this.akamTranslate = akamTranslate;
            this.$rootScope = $rootScope;
            this.$translate = $translate;
        });
    });

    afterEach(function() {});
});