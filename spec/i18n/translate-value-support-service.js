/* eslint-disable max-nested-callbacks */
/* globals beforeEach, afterEach, spyOn, jasmine, expect */

import angular from 'angular';
import i18n from '../../src/i18n';

describe('translateValueSupport', function() {
  var parse = null;

  beforeEach(function() {
    angular.mock.inject.strictDi(true);

    angular.mock.module(i18n.name);
    angular.mock.module(function($translateProvider) {
      $translateProvider.useLoader('translateNoopLoader');
    });

    inject(function($parse) {
      parse = $parse;
    });

    this.forDirective = function(ctrl, name, values) {
      let getValues = parse(values);

      if (getValues !== angular.noop) {
        ctrl[name + 'Values'] = getValues();
      }
    };
  });

  describe('given value spoort service of forDirective method', function() {

    describe('and with undefined hash values', function() {

      describe('when called', function() {

        var ctrl = {},
          name = 'textContent'; //values = {first: 'sean', last: 'Last'};
        beforeEach(function() {
          this.forDirective(ctrl, name, undefined);
        });

        it('should verify ctrl has no property called textContentValues', function() {
          expect(ctrl.textContentValues).toBe(undefined);
        });
      });
    });
  });

  describe('given value spoort service of forDirective method', function() {

    describe('and valid hash values', function() {

      describe('when called', function() {

        var name = 'textContent',
          ctrl = {},
          values = "{'first': 'sean','last': 'Last'}";

        beforeEach(function() {
          this.forDirective(ctrl, name, values);
        });

        it('should verify ctrl has property called textContentValues', function() {
          expect(ctrl.textContentValues).not.toBe(undefined);
        });

        it('should verify ctrl textContentValues property values', function() {
          expect(ctrl.textContentValues.first).toBe('sean');
        });
      });
    });
  });
});
