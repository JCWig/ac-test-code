/* eslint-disable max-nested-callbacks */
/* globals beforeEach, afterEach, spyOn, jasmine, expect */

import angular from 'angular';
import i18n from '../../src/i18n';

import locales from '../../src/i18n/i18n-locale-constant';

describe('$locale', function() {

  beforeEach(function() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(i18n.name);
    angular.mock.module(function($translateProvider) {
      $translateProvider.useLoader('translateNoopLoader');
    });

    angular.mock.module(function($provide) {
      $provide.value('portalLocale', 'zh_CN');
    });

    angular.mock.inject(function($locale, portalLocale) {
      this.$locale = $locale;
      this.portalLocale = portalLocale;
    });

  });

  describe('when called', function() {

    it('should current locale has property of "NUMBER_FORMATS"', function() {
      expect(this.$locale.NUMBER_FORMATS).not.toBeUndefined();
    });

    it('should current locale has property of "DATETIME_FORMATS"', function() {
      expect(this.$locale.DATETIME_FORMATS).not.toBeUndefined();
    });

    it('should match current locale values from property of "NUMBER_FORMATS"', function() {
      var $localeNumFormats = this.$locale.NUMBER_FORMATS,
        localeNumFormatsConstant = locales[this.portalLocale].NUMBER_FORMATS;

      expect($localeNumFormats.CURRENCY_SYM).not.toBe(undefined);
      expect($localeNumFormats.CURRENCY_SYM).toMatch(localeNumFormatsConstant.CURRENCY_SYM);
    });

    it('should match current locale values from property of "DATETIME_FORMATS"', function() {
      var $localeDtFormats = this.$locale.DATETIME_FORMATS,
        localeDtFormatsConstant = locales[this.portalLocale].DATETIME_FORMATS;

      expect($localeDtFormats.DAY).not.toBe(undefined);
      expect($localeDtFormats.MONTH).not.toBe(undefined);
      expect($localeDtFormats.DAY.length).toEqual(7);
      expect($localeDtFormats.MONTH.length).toEqual(12);
      expect($localeDtFormats.DAY[0]).toMatch(localeDtFormatsConstant.DAY[0]);
      expect($localeDtFormats.MONTH[0]).toMatch(localeDtFormatsConstant.MONTH[0]);
    });

  });

});
