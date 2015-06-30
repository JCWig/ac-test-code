/* globals angular, beforeEach, afterEach, sinon, $ */

'use strict';

var accountSelector = require('../../src/mega-menu/accountSelector'),
  clickElement = require('./phantom-utils').clickElement,
  config = require('./phantom-utils').config,
  CONFIG_URL = require('./phantom-utils').CONFIG_URL,
  menu = require('../../src/mega-menu/menu'),
  HIDE_CLASS = require('../../src/mega-menu/utils/constants').HIDE_CLASS;

var ACCOUNT_SELECTOR = '.account-selector',
  MENU_SELECTOR = '#modular-mega-menu-header .account-selector-menu',
  NAV_SELECTOR = MENU_SELECTOR + ' nav';

describe('account selector', function() {

  var $scope, $compile;

  // cleanup mega menu mocking messiness.
  afterEach(function() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
  });

  beforeEach(function() {

    // mega menu mocking messiness. It's ugly. Deal with it.

    angular.mock.inject.strictDi(true);
    angular.mock.module(require('../../src/mega-menu').name);
    angular.mock.module(function(contextProvider) {
      contextProvider.setApplicationContext(contextProvider.OTHER_CONTEXT);
    });
    angular.mock.inject(function($rootScope, _$compile_, $httpBackend) {
      $scope = $rootScope;
      $compile = _$compile_;
      $httpBackend.when('GET', CONFIG_URL).respond(config());
    });

    this.el = $compile('<akam-menu-header></akam-menu-header>' +
    '<akam-menu-footer></akam-menu-footer>')($scope);
    $scope.$digest();
    this.element = document.body.appendChild(this.el[0]);

    // end mega menu mocking messiness

    this.server = sinon.fakeServer.create();

    this.server.respondWith('GET', /grp.json/, [
      200, {'Content-Type': 'application/json'}, JSON.stringify({
        hasAccounts: 'true'
      })
    ]);

    this.server.respondWith('GET', /accounts.json/, [
      200, {'Content-Type': 'application/json'}, JSON.stringify({
        context: null,
        users: null,
        contextTitle: null,
        accounts: {
          mainMenuItems: [
            {
              itemId: 0,
              cps: null,
              subMenuItems: null,
              dps: null,
              name: 'Catnip Factory',
              url: '/ui/home/manage',
              contextId: 0
            }
          ]
        },
        currentAccount: null,
        tabs: null,
        hasAccounts: null
      })
    ]);
  });

  afterEach(function() {
    this.server.restore();
  });

  it('should render if there are accounts', function() {
    var spy = jasmine.createSpy('spy');

    accountSelector.render(spy);

    this.server.respond();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should toggle when clicked multiple times', function() {
    var accountMenu = $(ACCOUNT_SELECTOR), nav;

    // the account selector depends on the menu rendering at some point in order to toggle its popup status properly
    menu.render();
    accountSelector.render();

    this.server.respond();

    nav = $(NAV_SELECTOR);

    expect(nav.hasClass(HIDE_CLASS)).toBe(true);

    clickElement(accountMenu);
    expect(nav.hasClass(HIDE_CLASS)).toBe(false);

    clickElement(accountMenu);
    expect(nav.hasClass(HIDE_CLASS)).toBe(true);
  });

  it('should do nothing if there are no accounts', function() {
    var accountMenu, nav;

    this.server.respondWith('GET', /grp.json/, [
      200, {'Content-Type': 'application/json'}, JSON.stringify({
        hasAccounts: 'false'
      })
    ]);

    accountMenu = $(ACCOUNT_SELECTOR);
    menu.render();
    this.server.respond();

    accountSelector.render();
    this.server.respond();

    nav = $(NAV_SELECTOR);

    expect(nav.hasClass(HIDE_CLASS)).toBe(true);

    clickElement(accountMenu);
    expect(nav.hasClass(HIDE_CLASS)).toBe(true);
  });

  it('should do nothing if there are no accounts and the menu renders last', function() {
    var accountMenu, nav;

    this.server.respondWith('GET', /grp.json/, [
      200, {'Content-Type': 'application/json'}, JSON.stringify({
        hasAccounts: 'false'
      })
    ]);

    accountMenu = $(ACCOUNT_SELECTOR);

    accountSelector.render();
    this.server.respond();

    menu.render();
    this.server.respond();

    nav = $(NAV_SELECTOR);

    expect(nav.hasClass(HIDE_CLASS)).toBe(true);

    clickElement(accountMenu);
    expect(nav.hasClass(HIDE_CLASS)).toBe(true);
  });

});
