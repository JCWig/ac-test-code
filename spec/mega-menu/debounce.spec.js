/* globals beforeEach, afterEach, sinon, $ */

'use strict';

var debounce = require('../../src/mega-menu/utils/debounce');

describe('debounce', function() {

  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  it('should call the function after a delay', function() {
    var spy = jasmine.createSpy('spy');
    var debounced = debounce(spy, 100);

    debounced();
    debounced();
    debounced();
    expect(spy.calls.count()).toEqual(0);

    clock.tick(99);
    expect(spy.calls.count()).toEqual(0);

    clock.tick(1);
    expect(spy.calls.count()).toEqual(1);

  });

});
