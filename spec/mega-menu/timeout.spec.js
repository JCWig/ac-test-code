/* globals beforeEach, afterEach, sinon, $ */

'use strict';

var timeout = require('../../src/mega-menu/timeout'),
  config = require('../../src/mega-menu/utils/config'),
  SHOW_CLASS = require('../../src/mega-menu/utils/constants').SHOW_CLASS,
  MODAL_SELECTOR = '.timeout.modal',
  clickElement = require('./phantom-utils').clickElement;

describe('timeout', function() {

  var clock;

  beforeEach(function() {
    // clean up DOM
    $(MODAL_SELECTOR).removeClass(SHOW_CLASS).html('');

    clock = sinon.useFakeTimers();

    this.server = sinon.fakeServer.create();
    this.server.respondWith('GET', '/totem/api/pulsar/megamenu/config.json',
      [200, {"Content-Type": 'application/json'},
        JSON.stringify({
          username: 'stella',
          timeoutDuration: 5,
          logoutTimer: 2,
          isAutoLogoutEnabled: true
        })]);

    this.server.respondWith('GET', /\/extend$/,
      [200, {"Content-Type": 'application/json'},
        JSON.stringify({
          status: 'OK'
        })]);

    this.server.respondWith('GET', /\/warn$/,
      [200, {"Content-Type": 'application/json'},
        JSON.stringify({
          status: 'OK'
        })]);

    this.server.respondWith('GET', /\/invalidate$/,
      [200, {"Content-Type": 'application/json'},
        JSON.stringify({
          status: 'OK'
        })]);
  });

  afterEach(function() {
    clock.restore();
    this.server.restore();
  });

  it('should render the modal if timeout is enabled', function() {
    // we need to force the config object to be reloaded, otherwise the new data won't be loaded
    config(jasmine.createSpy('spy'), true);
    this.server.respond();

    timeout();
    var modal = $(MODAL_SELECTOR + ' .modal-dialog');
    expect(modal.get(0)).not.toBe(undefined);
  });

  it('should not render the modal if timeout is not enabled', function() {
    this.server.respondWith('GET', '/totem/api/pulsar/megamenu/config.json',
      [200, {"Content-Type": 'application/json'},
        JSON.stringify({
          username: 'stella',
          isAutoLogoutEnabled: false
        })]);

    config(jasmine.createSpy('spy'), true);
    this.server.respond();

    timeout();
    var modal = $(MODAL_SELECTOR + ' .modal-dialog');
    expect(modal.get(0)).toBe(undefined);
  });

  it('should show the dialog after (timeoutDuration - logoutTimer) minutes', function() {
    var modal = $(MODAL_SELECTOR);

    config(jasmine.createSpy('spy'), true);
    this.server.respond();
    timeout();

    expect(modal.hasClass(SHOW_CLASS)).not.toBe(true);

    clock.tick(3 * 60 * 1000);
    this.server.respond();

    expect(modal.hasClass(SHOW_CLASS)).toBe(true);
  });

  it('should log you out after timeoutDuration minutes', function() {
    config(jasmine.createSpy('spy'), true);
    this.server.respond();
    timeout();

    clock.tick(3 * 60 * 1000);
    this.server.respond();    // warn user call

    clock.tick(2 * 60 * 1000);
    this.server.respond();    // logout call

    var lastRequest = this.server.requests[this.server.requests.length - 1];
    expect(lastRequest.url).toContain('invalidate');
  });

  it('should hide the dialog when extending the session', function() {
    var modal = $(MODAL_SELECTOR);

    config(jasmine.createSpy('spy'), true);
    this.server.respond();
    timeout();

    // show dialog
    clock.tick(3 * 60 * 1000);
    this.server.respond();

    // click extend button
    clickElement(modal.find('button'));
    this.server.respond();    // should call "extend" and close dialog

    expect(modal.hasClass(SHOW_CLASS)).not.toBe(true);
  });

});
