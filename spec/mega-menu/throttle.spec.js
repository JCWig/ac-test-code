/* globals beforeEach, afterEach, sinon, $ */

'use strict';

var throttle = require('../../src/mega-menu/utils/throttle');

describe('throttle', function() {

  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  it('should only call the throttled function once every "threshold" ' +
    'seconds buffering up to one pending call', function() {
    var spy = jasmine.createSpy('spy');
    var throttled = throttle(spy, 100);

    throttled();
    expect(spy.calls.count()).toEqual(1);

    clock.tick(100);

    throttled();
    throttled();
    throttled();
    expect(spy.calls.count()).toEqual(2); // call one of the three calls above

    clock.tick(100);
    expect(spy.calls.count()).toEqual(3); // buffers the 2nd call

    clock.tick(100);
    expect(spy.calls.count()).toEqual(3); // remaining call is dropped
  });

});
