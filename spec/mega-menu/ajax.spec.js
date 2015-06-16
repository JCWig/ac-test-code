/* globals beforeEach, afterEach, sinon, $ */

'use strict';

var ajax = require('../../src/mega-menu/utils/ajax'),
  emptyFn = function() {};

describe('ajax', function() {

  beforeEach(function() {
    this.server = sinon.fakeServer.create();
    this.server.respondWith('GET', '/a/real/url',
      [200, {"Content-Type": 'application/json'},
        JSON.stringify({status: 'ok'})]);
  });

  afterEach(function() {
    this.server.restore();
  });

  it('should return a XMLHttpObject on GET', function() {
    var req = ajax.get('/a/fake/url', emptyFn);
    expect(req).toEqual(jasmine.any(XMLHttpRequest));
  });

  it('should return a XMLHttpObject on POST', function() {
    var req = ajax.post('/a/fake/url', {some: 'data'}, emptyFn);
    expect(req).toEqual(jasmine.any(XMLHttpRequest));
  });

  it('should call the callback on error', function() {
    var spy = jasmine.createSpy('spy');
    ajax.get('/a/fake/url', spy);
    this.server.respond();

    expect(spy.calls.mostRecent().args[0]).toBe(true);
  });

  it('should call the callback on success', function() {
    var spy = jasmine.createSpy('spy');
    ajax.get('/a/real/url', spy);
    this.server.respond();

    expect(spy.calls.mostRecent().args[0]).toBe(null);
    expect(spy.calls.mostRecent().args[1].status).toEqual('ok');
  });

});
