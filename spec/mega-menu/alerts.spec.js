/* globals beforeEach, afterEach, sinon, $ */

'use strict';

var alerts = require('../../src/mega-menu/alerts');

describe('alerts', function() {

  beforeEach(function() {
    this.server = sinon.fakeServer.create();
    this.server.respondWith('GET', /\/svcs\/messagecenter/, [
      200, {'Content-Type': 'application/json'}, JSON.stringify({count: 123})
    ]);
  });

  afterEach(function() {
    this.server.restore();
  });

  it('should render on success', function() {
    var spy = jasmine.createSpy();
    alerts.render(spy);
    this.server.respond();

    expect(spy).toHaveBeenCalledWith(true);
  });

});
