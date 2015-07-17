/* eslint-disable max-nested-callbacks */
/* globals angular, beforeEach, afterEach, spyOn, jasmine */
'use strict';

// for some reason, this test messes up the rest of the mega menu tests so we make sure it runs
// last. We do this by prefixing the file with "zzz". This is something that should be fixed
// but there isn't enough time.

var megaMenuModule = require('../../src/mega-menu/index'),
  messagesModule = require('../../src/mega-menu/messages/index'),
  menuModule = require('../../src/mega-menu/menu/index'),
  alertsModule = require('../../src/mega-menu/alerts/index'),
  accountSelectorModule = require('../../src/mega-menu/accountSelector/index'),
  searchModule = require('../../src/mega-menu/search/index'),
  util = require('./phantom-utils');

// corresponds to id of '1-7KLGH'
var ACCOUNT_COOKIE = 'QWthbWFpIEludGVybmFsX0FrYW1haSBJbnRlcm5hbH5+MS03S0xHSA==',
  COOKIE_NAME = 'AKALASTMANAGEDACCOUNT',
  ACCOUNT_ID = '1-7KLGH';

var CONFIG_KEY = 'akamai.components.mega-menu.config',
  BREADCRUMB_SELECTOR = '#modular-mega-menu-header .mega-menu-breadcrumb li';

describe('akamai.components.mega-menu', function() {

  var context, megaMenuData, $cookies, $rootScope, $window, $httpBackend, $http,
    $compile, locationSpy;

  // prevent the mega menu from rendering any of its sub modules.
  beforeEach(function() {
    spyOn(menuModule, 'render');
    spyOn(alertsModule, 'render');
    spyOn(messagesModule, 'render');
    spyOn(accountSelectorModule, 'render');
    spyOn(searchModule, 'render');
  });

  afterEach(function() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
  });

  function compileMenu() {
    this.el = $compile('<akam-menu-header></akam-menu-header>')($rootScope);
    $rootScope.$digest();
    this.element = document.body.appendChild(this.el[0]);
  }

  function commonBeforeEach(isGroup, isValid) {
    angular.mock.inject.strictDi(true);
    angular.mock.module(megaMenuModule.name);
    angular.mock.module(function(contextProvider, $provide) {
      if (isGroup) {
        contextProvider.setApplicationContext(contextProvider.GROUP_CONTEXT);
      } else {
        contextProvider.setApplicationContext(contextProvider.ACCOUNT_CONTEXT);
      }
      $provide.factory('$location', function() {
        return {
          search: function() {
            if (isValid) {
              return {gid: 123, aid: null};
            }
            return {};
          }
        };
      });
    });
    angular.mock.inject(function(_$rootScope_, _$httpBackend_, _$http_, _$cookies_, _$compile_,
                                 _context_, _megaMenuData_, $location, _$window_) {
      $httpBackend = _$httpBackend_;
      $http = _$http_;
      $window = _$window_;
      $compile = _$compile_;
      $cookies = _$cookies_;
      context = _context_;
      megaMenuData = _megaMenuData_;
      $rootScope = _$rootScope_;
      $cookies.put(COOKIE_NAME, ACCOUNT_COOKIE);
      locationSpy = spyOn($location, 'search');

      $httpBackend.when('GET', /core\/services\/session\/username\/extend/).respond({
        status: 'OK'
      });
      $httpBackend.when('GET', util.CONFIG_URL).respond({
        username: 'me',
        locale: 'en_US'
      });
      $httpBackend.when('GET', /grp.json/).respond({});
      $httpBackend.when('GET', util.FOOTER_URL).respond({});
      $httpBackend.when('GET', util.BRANDING_URL).respond({});
      $httpBackend.when('GET', util.LOCALE_URL).respond({});
      $httpBackend.when('GET', /context.json/).respond({
        context: {
          mainMenuItems: [
            {
              itemId: 123,
              contextId: 0,
              cps: null,
              dps: null,
              url: '/ui/home',
              name: 'Stella Cat',
              subMenuItems: [
                {
                  itemId: 0,
                  contextId: 1,
                  cps: null,
                  subMenuItems: null,
                  dps: [
                    'more-catnip',
                    'tiny-mouse'
                  ],
                  url: '/ui/home?gid=123&aid=456',
                  name: 'Food'
                }, {
                  itemId: 987,
                  contextId: 0,
                  cps: null,
                  dps: null,
                  url: '/ui/home',
                  name: 'Toys',
                  subMenuItems: null
                }
              ]
            }
          ]
        }
      });
      $rootScope.$digest();
    });
  }

  describe('given an unloaded app', function() {
    var menuData;

    beforeEach(function() {
      commonBeforeEach();
      megaMenuData.fetch().then(function(data) {
        menuData = data;
      });
      $httpBackend.flush();
    });

    it('should fetch all the necessary data for the mega menu to render', function() {
      expect(menuData).not.toBeUndefined();
    });

    it('should clear the items if instructed to', function() {
      megaMenuData.clear();
      expect($window.sessionStorage.getItem(CONFIG_KEY)).toBeNull();
    });

  });

  describe('given an AKALASTMANAGEDACCOUNT cookie', function() {

    describe('when the app loads', function() {
      var contextData;

      beforeEach(function() {
        commonBeforeEach();
        compileMenu.call(this);
        context.account.context.then(function(data) {
          contextData = data;
        });
        $httpBackend.flush();
        $rootScope.$apply();
      });

      it('should decode the cookie for the current account', function() {
        expect(context.account.id).toBe(ACCOUNT_ID);
      });

      it('should send a request for current account context data', function() {
        expect(contextData).not.toBeUndefined();
      });

    });

  });

  describe('given a group centric app', function() {

    describe('and a valid gid query string parameter', function() {

      describe('when the app loads', function() {
        var breadcrumbs;

        beforeEach(function() {
          commonBeforeEach(true, true);
          compileMenu.call(this);
          $httpBackend.flush();
          $rootScope.$apply();
          breadcrumbs = document.querySelectorAll(BREADCRUMB_SELECTOR);
        });

        it('should show the breadcrumb', function() {
          expect(breadcrumbs.length).toBeGreaterThan(0);
        });

      });

    });

    describe('and an invalid gid query string parameter', function() {

      describe('when the app loads', function() {

        it('should throw a invalid group error', function() {
          expect(angular.bind(this, commonBeforeEach, true, false)).toThrow();
        });

      });

    });

  });

  describe('given an account centric app', function() {

    describe('when the app loads', function() {

      var breadcrumbs;

      beforeEach(function() {
        commonBeforeEach();
        compileMenu.call(this);
        $httpBackend.flush();
        $rootScope.$apply();
        breadcrumbs = document.querySelectorAll(BREADCRUMB_SELECTOR);
      });

      it('should hide the breadcrumb', function() {
        expect(breadcrumbs.length).toBe(0);
      });

    });

  });

  describe('given a loaded app', function() {

    describe('when an app sets the current group/property', function() {

      beforeEach(function() {
        commonBeforeEach();
        compileMenu.call(this);
        $httpBackend.flush();
        $rootScope.$apply();
      });

      it('should update the browser location with the new gid and aid query ' +
      'string parameter', function() {

        context.property = 456;
        $httpBackend.flush();
        $rootScope.$apply();
        expect(locationSpy.calls.mostRecent().args).toEqual(jasmine.arrayContaining(['aid', 456]));
      });

    });

  });

});

