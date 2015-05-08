'use strict';

describe('i18n $locale service', function() {
  var locale, rootScope, token, localeConstant;

  beforeEach(function() {
    inject.strictDi(true);
    angular.mock.module(require('../../src/i18n').name);
    angular.mock.module(/*@ngInject*/ function($provide, i18nTokenProvider) {
      $provide.decorator('$locale', function($delegate, LOCALES, i18nToken) {
        localeConstant = LOCALES;
        var loc = LOCALES[i18nToken.getCurrentLocale()];
        if (loc) {
          $delegate.DATETIME_FORMATS = loc.DATETIME_FORMATS;
          $delegate.NUMBER_FORMATS = loc.NUMBER_FORMATS;
        }
        return $delegate;
      });
    });
    inject(function(_$locale_, _$rootScope_, i18nToken) {
      rootScope = _$rootScope_.$new();
      locale = _$locale_;
      token = i18nToken;
    });
  });
  describe("when decorator intercept $locale service ", function() {

    it('should current locale has property of "NUMBER_FORMATS"', function() {
      expect(locale.NUMBER_FORMATS).not.toBe(undefined);
    });

    it('should current locale has property of "DATETIME_FORMATS"', function() {
      expect(locale.DATETIME_FORMATS).not.toBe(undefined);
    });

    it('should match current locale values from property of "NUMBER_FORMATS"', function() {
      var $localeNumFormats = locale.NUMBER_FORMATS,
        localeNumFormatsConstant = localeConstant[token.getCurrentLocale()].NUMBER_FORMATS;

      expect($localeNumFormats.CURRENCY_SYM).not.toBe(undefined);
      expect($localeNumFormats.CURRENCY_SYM).toMatch(localeNumFormatsConstant.CURRENCY_SYM);
    });

    it('should match current locale values from property of "DATETIME_FORMATS"', function() {
      var $localeDtFormats = locale.DATETIME_FORMATS,
        localeDtFormatsConstant = localeConstant[token.getCurrentLocale()].DATETIME_FORMATS;

      expect($localeDtFormats.DAY).not.toBe(undefined);
      expect($localeDtFormats.MONTH).not.toBe(undefined);
      expect($localeDtFormats.DAY.length).toEqual(7);
      expect($localeDtFormats.MONTH.length).toEqual(12);
      expect($localeDtFormats.DAY[0]).toMatch(localeDtFormatsConstant.DAY[0]);
      expect($localeDtFormats.MONTH[0]).toMatch(localeDtFormatsConstant.MONTH[0]);
    });
  });

});

describe("$locale service used as filter", function() {

  var INTERNATIONALIZATION_PATH = '/apps/appname/locales/en_US.json',
    LIBRARY_PATH = /\/libs\/akamai-core\/[0-9]*.[0-9]*.[0-9]*\/locales\/en_US.json/,
    enUsMessagesResponse = require("./i18n_responses/messages_en_US.json"),
    enUsResponse = require("./i18n_responses/en_US.json");

  var rootScope, httpBackend, timeout, element, compile, cookies, token;

  function addElement(markup) {
    element = angular.element(compile(markup)(rootScope));
    rootScope.$digest();
    httpBackend.flush();
    timeout.flush();
    document.body.appendChild(element[0]);
  }

  beforeEach(function() {
    inject.strictDi(true);
    angular.mock.module(require('../../src/i18n').name);
    angular.mock.module(/*@ngInject*/function($provide, $translateProvider, i18nTokenProvider) {
      $provide.decorator('$cookies', function($delegate) {
        $delegate = {
          AKALOCALE: "ZGVfREU=+TWRLSm1QZGEwNTBKNUZEZzFLZVQyNW9kTExYY1l6T3lHSVg3SjM1SjNJaXBaZ2JUaFRJVGZCWXROSjNmdFIzdXMzL0pJbms9; expires=Wed, 17 Mar 2083 13:04:59 GMT; path=/; domain=172.25.46.158; Secure"
        };
        return $delegate;
      });
      $translateProvider.useLoader('i18nCustomLoader');

      $provide.decorator('$locale', function($delegate, LOCALES, i18nToken) {
        var loc = LOCALES[i18nToken.getCurrentLocale()];
        if (loc) {
          $delegate.DATETIME_FORMATS = loc.DATETIME_FORMATS;
          $delegate.NUMBER_FORMATS = loc.NUMBER_FORMATS;
        }
        return $delegate;
      });
    });
    inject(function(_$locale_, _$cookies_, _$rootScope_, _$httpBackend_, _$timeout_, _$compile_, i18nToken) {
      rootScope = _$rootScope_.$new();
      //locale = _$locale_;
      cookies = _$cookies_;
      httpBackend = _$httpBackend_;
      timeout = _$timeout_;
      compile = _$compile_;
      token = i18nToken;
    });
    httpBackend.when('GET', '/apps/appname/locales/en_DE.json').respond(404, "BAD PATH");
    httpBackend.when('GET', /\/libs\/akamai-core\/[0-9]*.[0-9]*.[0-9]*\/locales\/de_DE.json/).respond(404, "BAD PATH");
    httpBackend.when('GET', INTERNATIONALIZATION_PATH).respond(enUsResponse);
    httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
  });

  describe("when rendering ", function() {
    afterEach(function() {
      document.body.removeChild(element[0]);
    });

    it('should value display correctly when using datetime filter ', function() {
      var markup = ["<div id='dtFilter'>",
        "<p>{{1288323623006 | date:'medium':'UTC'}} </p>",
        "<p>{{1288323623006 | date:'yyyy-MM-dd HH:mm:ss':'UTC'}}</p>",
        "<p>{{1288323623006 | date:'MM/dd/yyyy @ h:mma':'UTC'}}</p></div>"
      ].join("");
      addElement(markup);
      var all = document.querySelectorAll("#dtFilter > p");
      expect(all[0].textContent).toBe("Oct 29, 2010 3:40:23 AM ");
      expect(all[1].textContent).toBe("2010-10-29 03:40:23");
      expect(all[2].textContent).toBe("10/29/2010 @ 3:40AM");
    });

    it('should value display correctly when using currency filter ', function() {
      var markup = ["<div id='cuFilter'>",
        '<p>{{ 1000000 | currency }}</p>',
        '<p>{{ 1000000 | currency:"USD$"}}</p>'
      ].join("");
      addElement(markup);
      var all = document.querySelectorAll("#cuFilter > p");
      expect(all[0].textContent).toBe("$1,000,000.00");
      expect(all[1].textContent).toBe("USD$1,000,000.00");
    });

    it('should value display correctly when using number filter ', function() {
      var markup = ["<div id='numFilter'>",
        '<p>{{1234.56789 | number}}</p>',
        '<p>{{1234.56789 | number:0}}</p>',
        '<p>{{-1234.56789 | number:4}}</p>'
      ].join("");
      addElement(markup);
      var all = document.querySelectorAll("#numFilter > p");
      expect(all[0].textContent).toBe("1,234.568");
      expect(all[1].textContent).toBe("1,235");
      expect(all[2].textContent).toBe("-1,234.5679");
    });
  });
});
