/* eslint-disable max-nested-callbacks */
/* globals beforeEach, afterEach, spyOn, jasmine, expect */

import angular from 'angular';
import i18n from '../../src/i18n';
import i18nLocales from '../../src/i18n/i18n-locale-constant';

describe('i18nLocale Service', function() {

  beforeEach(function() {
    angular.mock.inject.strictDi(true);

    angular.mock.module(i18n.name);
    angular.mock.module(function($translateProvider, i18nLocaleProvider) {
      $translateProvider.useLoader('translateNoopLoader');
      i18nLocaleProvider.setLocale('es_ES');
    });

    inject(function(_i18nLocale_, _$locale_) {
      this.i18nLocale = _i18nLocale_;
      this.$locale = _$locale_;
    });

  });

  describe('given a locale service', function() {
    describe('when the locale service is configured to the es_ES locale', function() {

      it('should use the es_ES date time format', function() {
        expect(this.$locale.DATETIME_FORMATS).toBe(i18nLocales.es_ES.DATETIME_FORMATS);
      });

      it('should use the es_ES number formats', function() {
        expect(this.$locale.NUMBER_FORMATS).toBe(i18nLocales.es_ES.NUMBER_FORMATS);
      });

    });
  });
});