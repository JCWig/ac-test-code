/* eslint-disable max-nested-callbacks */
/* globals angular, beforeEach, afterEach, spyOn */
'use strict';

import { i18nConfig } from '../../src/i18n/translate-config.js';

describe('translate', function() {

  var translationMock = {
    TRANSLATION_ID: 'Lorem Ipsum {{value}}',
    TRANSLATION_ID_2: 'Lorem Ipsum {{value}} + {{value}}',
    TRANSLATION_ID_3: 'Lorem Ipsum {{value + value}}'
  };

  beforeEach(function() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(require('../../src/i18n').name);
    angular.mock.module(function($translateProvider) {
      $translateProvider.translations('en_US', translationMock);
      $translateProvider.useLoader('translateNoopLoader');
    });

    angular.mock.inject(function(translate, $rootScope, $translate, $timeout) {
      this.translate = translate;
      this.$rootScope = $rootScope;
      this.$translate = $translate;
      this.$timeout = $timeout;
      this.$scope = $rootScope.$new();
    });
  });

  describe('when using akamTranslate service', function() {

    describe('when inspecting service', function() {

      it('should service be defined', function() {
        expect(this.translate).not.toBe(undefined);
      });

      it('should have akamTranslate#sync method defined', function() {
        expect(this.translate.sync).not.toBe(undefined);
      });

      it('should akamTranslate#sync be a function', function() {
        expect(typeof this.translate.sync).toEqual('function');
      });

      it('should have akamTranslate#async method defined', function() {
        expect(this.translate.async).not.toBe(undefined);
      });

      it('should akamTranslate#async be a function', function() {
        expect(typeof this.translate.async).toEqual('function');
      });

      it('should sync function return key since translation table is not loaded', function() {
        expect(this.translate.sync('somekey.somemorekey')).toEqual('somekey.somemorekey');
      });

      it('should "$translateChangeEnd" be called', function() {
        var spy = spyOn(this.$rootScope, '$emit');

        this.$translate.refresh();
        this.$timeout.flush();
        expect(spy).toHaveBeenCalledWith('$translateChangeEnd', {
          language: i18nConfig.defaultLocale
        });

      });

    });

    describe('when using sync function', function() {

      it('should translate without given variable replacement', function() {
        var syncedResponse = this.translate.sync('TRANSLATION_ID');

        expect(syncedResponse).toEqual('Lorem Ipsum ');
      });

      it('should translate given variable replacement', function() {
        var syncedResponse = this.translate.sync('TRANSLATION_ID', {value: 'Sean'});

        expect(syncedResponse).toEqual('Lorem Ipsum Sean');
      });

      it('should translate to be appended given variable replacement of integer', function() {
        var syncedResponse = this.translate.sync('TRANSLATION_ID_3', {value: '2'});

        expect(syncedResponse).toEqual('Lorem Ipsum 22');
      });

      it('should translate default key if translation id is not provided', function() {
        var defaultKey = 'TRANSLATION_ID';
        var syncedResponse = this.translate.sync('', null, defaultKey);

        expect(syncedResponse).toEqual('Lorem Ipsum ');
      });

      it('should translate translation id if translation id and default key' +
        ' are not provided', function() {
        var syncedResponse = this.translate.sync('', null, '');

        expect(syncedResponse).toEqual('');
      });

      it('should translate to null if translation id and default key are null', function() {
        var syncedResponse = this.translate.sync(null, null, null);

        expect(syncedResponse).toEqual(null);
      });

    });

    describe('when using async funtion', function() {

      it('should return translated value from valid key', function() {
        angular.mock.inject(function() {
          var key = 'TRANSLATION_ID';
          var response = this.translate.async(key);

          this.$timeout.flush();
          expect(response.$$state.value).toEqual('Lorem Ipsum ');
        });
      });

      it('should return translated value from valid key with variable replacement', function() {
        var key = 'TRANSLATION_ID';
        var response = this.translate.async(key, {value: 'sean'});

        this.$timeout.flush();
        expect(response.$$state.value).toEqual('Lorem Ipsum sean');
      });

      it('should return translated value with adding integer values from valid key with ' +
        'variable replacement', function() {
        var key = 'TRANSLATION_ID_3';
        var response = this.translate.async(key, {value: '2'});

        this.$timeout.flush();
        expect(response.$$state.value).toEqual('Lorem Ipsum 22');
      });

      it('should take array of keys return key value object', function() {
        var keys = ['TRANSLATION_ID', 'TRANSLATION_ID_3'];
        var response = this.translate.async(keys);

        this.$timeout.flush();
        expect(response.$$state.value[keys[0]]).toEqual('Lorem Ipsum ');
        expect(response.$$state.value[keys[1]]).toEqual('Lorem Ipsum ');
      });

      it('should return key since translation table is not loaded', function() {
        var key = 'something.something';
        var response = this.translate.async(key);

        this.$timeout.flush();
        this.$scope.$apply();
        expect(response.$$state.value).toEqual(key);
      });

      it('should translate default key if translation id is not provided', function() {
        var defaultKey = 'TRANSLATION_ID';
        var response = this.translate.async('', null, defaultKey);

        this.$timeout.flush();
        expect(response.$$state.value).toEqual('Lorem Ipsum ');
      });

      it('should translate to empty if translation id and default key are not provided',
        function() {
        var response = this.translate.async('', null, '');

        this.$timeout.flush();
        expect(response.$$state.value).toEqual('');
      });

      it('should translate to null if translation id and default key are null', function() {
        var response = this.translate.async(null, null, null);

        this.$timeout.flush();
        expect(response.$$state.value).toEqual(null);
      });

    });

  });

});
