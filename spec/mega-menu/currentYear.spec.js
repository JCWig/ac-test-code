/* globals beforeEach, afterEach, sinon, $ */

'use strict';

var currentYear = require('../../src/mega-menu/helpers/currentYear');

describe('currentYear', function() {

  it('should be a number', function() {
    expect(currentYear()).toEqual(jasmine.any(Number));
  });

  it('should be greater than 2014, this test was written in 2015', function() {
    expect(currentYear()).toBeGreaterThan(2014);
  });

});
