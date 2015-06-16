/* globals beforeEach, afterEach, sinon, $ */

'use strict';

var accountSelector = require('../../src/mega-menu/accountSelector'),
  clickElement = require('./phantom-utils').clickElement,
  menu = require('../../src/mega-menu/menu'),
  ACCOUNT_SELECTOR = '.account-selector',
  MENU_SELECTOR = '#modular-mega-menu-header .account-selector-menu',
  NAV_SELECTOR = MENU_SELECTOR + ' nav',
  HIDE_CLASS = require('../../src/mega-menu/utils/constants').HIDE_CLASS;

describe('account selector', function() {

  beforeEach(function() {
    this.server = sinon.fakeServer.create();

    this.server.respondWith('GET', /grp.json/, [
      200, {'Content-Type': 'application/json'}, JSON.stringify({
        "hasAccounts": "true"
      })
    ]);

    this.server.respondWith('GET', /accounts.json/, [
      200, {'Content-Type': 'application/json'}, JSON.stringify({
        "context": null,
        "users": null,
        "contextTitle": null,
        "accounts": {
          "mainMenuItems": [
            {
              "itemId": 0,
              "cps": null,
              "subMenuItems": null,
              "dps": null,
              "name": "Catnip Factory",
              "url": "/ui/home/manage",
              "contextId": 0
            }
          ]
        },
        "currentAccount": null,
        "tabs": null,
        "hasAccounts": null
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
    var accountMenu = $(ACCOUNT_SELECTOR);

    // the account selector depends on the menu rendering at some point in order to toggle its popup status properly
    menu.render();
    accountSelector.render();

    this.server.respond();

    var nav = $(NAV_SELECTOR);

    expect(nav.hasClass(HIDE_CLASS)).toBe(true);

    clickElement(accountMenu);
    expect(nav.hasClass(HIDE_CLASS)).toBe(false);

    clickElement(accountMenu);
    expect(nav.hasClass(HIDE_CLASS)).toBe(true);
  });

  it('should do nothing if there are no accounts', function() {
    this.server.respondWith('GET', /grp.json/, [
      200, {'Content-Type': 'application/json'}, JSON.stringify({
        "hasAccounts": "false"
      })
    ]);

    var accountMenu = $(ACCOUNT_SELECTOR);
    menu.render();
    this.server.respond();

    accountSelector.render();
    this.server.respond();

    var nav = $(NAV_SELECTOR);

    expect(nav.hasClass(HIDE_CLASS)).toBe(true);

    clickElement(accountMenu);
    expect(nav.hasClass(HIDE_CLASS)).toBe(true);
  });

  it('should do nothing if there are no accounts and the menu renders last', function() {
    this.server.respondWith('GET', /grp.json/, [
      200, {'Content-Type': 'application/json'}, JSON.stringify({
        "hasAccounts": "false"
      })
    ]);

    var accountMenu = $(ACCOUNT_SELECTOR);

    accountSelector.render();
    this.server.respond();

    menu.render();
    this.server.respond();

    var nav = $(NAV_SELECTOR);

    expect(nav.hasClass(HIDE_CLASS)).toBe(true);

    clickElement(accountMenu);
    expect(nav.hasClass(HIDE_CLASS)).toBe(true);
  });

});
