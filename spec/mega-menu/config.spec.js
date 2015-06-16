/* globals beforeEach, afterEach, sinon, $ */

'use strict';

var config = require('../../src/mega-menu/utils/config'),
  LOGIN_URL = require('../../src/mega-menu/utils/constants').LOGIN_URL;

describe('config', function() {

  beforeEach(function() {
    this.server = sinon.fakeServer.create();
    this.server.respondWith('GET', '/totem/api/pulsar/megamenu/config.json',
      [200, {"Content-Type": 'application/json'},
        JSON.stringify({username: 'stella'})]);
  });

  afterEach(function() {
    this.server.restore();
  });

  it('should redirect to the login page on error', function() {
    this.server.respondWith('GET', '/totem/api/pulsar/megamenu/config.json',
      [0, {"Content-Type": 'application/json'},
        JSON.stringify({username: 'stella'})]);

    var stub = sinon.stub(window.console, 'log');
    config(stub.restore, true);
    this.server.respond();

    var lastConsoleLog = stub.getCall(0).args[0];
    expect(lastConsoleLog).toContain(LOGIN_URL);
  });

  it('should return data', function() {
    var spy = jasmine.createSpy('spy');
    config(spy, true);
    this.server.respond();
    expect(spy.calls.mostRecent().args[0].username).toEqual('stella');
  });

  it('should return even if the callback is bogus', function() {
    config('bogus', true);
    this.server.respond();
  });

});
