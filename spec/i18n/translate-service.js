'use strict';

describe('translate service', function() {
  var akTranslate, config, $translate, $rootScope, $timeout, $q, $scope;

  var translationMock = {
    'TRANSLATION_ID': 'Lorem Ipsum {{value}}',
    'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
    'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}'
  };

  beforeEach(function() {
    angular.mock.module(require('../../src/i18n').name);
    angular.mock.module(function($provide, $translateProvider, i18nTokenProvider) {
      $translateProvider
        .translations('en_US', translationMock)
        .preferredLanguage('en_US')
        .fallbackLanguage('en_US')
        .useLoader('i18nCustomLoader');

      $provide.factory('i18nCustomLoader', ['$q', '$timeout', function($q, $tmout) {
        return function(options) {
          var deferred = $q.defer();
          $tmout(function() {
            deferred.resolve({
              'FOO': 'bar'
            });
          });
          return deferred.promise;
        };
      }]);
    });

    inject(function(translate, _$q_, i18nConfig, _$rootScope_, _$translate_, _$timeout_) {
      akTranslate = translate;
      $rootScope = _$rootScope_;
      $translate = _$translate_;
      $timeout = _$timeout_;
      $q = _$q_;
      $scope = $rootScope.$new();
      config = i18nConfig;
    });
  });
  describe("when using akamTranslate service", function() {
    describe('when inspecting service', function() {
      it('should service be defined', function() {
        expect(akTranslate).not.toBe(undefined);
      });

      it('should have akamTranslate#sync method defined', function() {
        expect(akTranslate.sync).not.toBe(undefined);
      });

      it('should akamTranslate#sync be a function', function() {
        expect(typeof akTranslate.sync).toEqual("function");
      });

      it('should have akamTranslate#async method defined', function() {
        expect(akTranslate.async).not.toBe(undefined);
      });

      it('should akamTranslate#async be a function', function() {
        expect(typeof akTranslate.async).toEqual("function");
      });

      it('should sync function return key since translation table is not loaded', function() {
        expect(akTranslate.sync("somekey.somemorekey")).toEqual("somekey.somemorekey");
      });
      it("should '$translateChangeEnd' be called", function() {
        var spy = spyOn($rootScope, "$emit");
        $translate.refresh();
        $timeout.flush();
        expect(spy).toHaveBeenCalledWith('$translateChangeEnd', {
          language: config.defaultLocale
        });
      });
    });

    describe('when using sync function', function() {
      it("should translate without given variable replacement", function() {
        var syncedResponse = akTranslate.sync("TRANSLATION_ID");
        expect(syncedResponse).toEqual("Lorem Ipsum ");
      });

      it("should translate given variable replacement", function() {
        var syncedResponse = akTranslate.sync("TRANSLATION_ID", {"value": "Sean"})
        expect(syncedResponse).toEqual("Lorem Ipsum Sean");
      });

      it("should translate to be appended given variable replacement of integer", function() {
        var syncedResponse = akTranslate.sync("TRANSLATION_ID_3", {"value": "2"});
        expect(syncedResponse).toEqual("Lorem Ipsum 22");
      });
    });

    describe('when using async funtion', function() {
      it('should return translated value from valid key', function() {
        var key = "TRANSLATION_ID";
        var deferedResponse = $q.defer();

        deferedResponse = akTranslate.async(key);
        deferedResponse.then(function(value) {
          expect(value).toEqual("Lorem Ipsum ");
        });
      });

      it('should return translated value from valid key with variable replacement', function() {
        var key = "TRANSLATION_ID";
        var deferedResponse = $q.defer();
        deferedResponse = akTranslate.async(key, {
          value: "sean"
        });
        deferedResponse.then(function(value) {
          expect(value).toEqual("Lorem Ipsum sean");
        });
      });

      it('should return translated value with adding integer values from valid key with variable replacement', function() {
        var key = "TRANSLATION_ID_3";
        var deferedResponse = $q.defer();

        deferedResponse = akTranslate.async(key, {
          value: "2"
        });
        deferedResponse.then(function(value) {
          expect(value).toEqual("Lorem Ipsum 22");
        });
      });

      it('should take array of keys return key value object', function() {
        var keys = ["TRANSLATION_ID", "TRANSLATION_ID_3"];
        var deferedResponse = $q.defer();

        deferedResponse = akTranslate.async(keys);
        deferedResponse.then(function(values) {
          expect(values[keys[0]]).toEqual("Lorem Ipsum ");
          expect(values[keys[1]]).toEqual("Lorem Ipsum 2 ");
        });
      });
      it('should return key since translation table is not loaded', function() {
        var key = "something.something";
        var deferedResponse = $q.defer();

        deferedResponse.resolve(key);

        deferedResponse = akTranslate.async(key);
        deferedResponse.then(function(value) {
          expect(value).toEqual(key);
        });
        $scope.$apply();
      });
    });
  });
});
