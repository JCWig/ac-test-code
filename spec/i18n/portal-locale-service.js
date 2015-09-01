/* eslint-disable max-nested-callbacks */
/* globals beforeEach, afterEach, spyOn, jasmine, expect */

import angular from 'angular';
import i18n from '../../src/i18n';

// goodCookie has locale of it_IT
const goodCookie = 'aXRfSVR+TWQ2WjlwcTVvRmJPbVFRSzV1TXJXdkRJeHQ1OERLRlNOQ1ZGNldhMWJVZFV5dU5ZODZlK0NaRXpDcGdpdStZQUNidjlWSU09',
  badCookie = 'http://i.imgur.com/gTnmXKJ.gifv',
  defaultLocale = 'en_US';

describe('portalLocale', function() {

  beforeEach(function() {
    angular.mock.inject.strictDi(true);

    angular.mock.module(i18n.name);
    angular.mock.module(function($translateProvider) {
      $translateProvider.useLoader('translateNoopLoader');
    });

    this.setCookie = function(value) {
      angular.mock.module(function($provide) {
        $provide.value('$cookies', {

          // mock out $cookies.get to return whatever value we provide
          get: function() {
            return value;
          }
        });

      });

    };

    this.setup = function() {
      angular.mock.inject(function(portalLocale) {
        this.portalLocale = portalLocale;
      });
    };
  });

  describe('given portalLocale', function() {

    describe('and a valid AKALOCALE cookie', function() {

      describe('when called', function() {

        beforeEach(function() {
          this.setCookie(goodCookie);
          this.setup();
        });

        it('should return the locale', function() {
          expect(this.portalLocale).toEqual('it_IT');
        });

      });

    });

  });

  describe('given portalLocale', function() {

    describe('and an invalid AKALOCALE cookie', function() {

      describe('when called', function() {

        beforeEach(function() {
          this.setCookie(badCookie);
          this.setup();
        });

        it('should return the default locale', function() {
          expect(this.portalLocale).toEqual(defaultLocale);
        });

      });

    });

  });

});
