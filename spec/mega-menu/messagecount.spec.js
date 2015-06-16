/* globals beforeEach, afterEach, sinon, $ */

'use strict';

var messages = require('../../src/mega-menu/messages');

describe('messagecount', function() {

  beforeEach(function() {
    this.server = sinon.fakeServer.create();
    this.server.respondWith('GET', /\/svcs\/messagecenter/, [
      200, {'Content-Type': 'application/json'}, JSON.stringify({count: 9001})
    ]);
  });

  afterEach(function() {
    this.server.restore();
  });

  it('should render on success', function() {
    var spy = jasmine.createSpy('spy');

    messages.render(spy);
    this.server.respond();

    expect(spy).toHaveBeenCalledWith(true);
  });

});
