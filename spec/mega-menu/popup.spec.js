/* globals beforeEach, afterEach, sinon, $ */

'use strict';

var popup = require('../../src/mega-menu/popup');

describe('popup', function() {

  it('should return a popup without the new keyword', function() {
    var el = document.createElement('div');
    var p1 = popup(el);

    expect(p1).toEqual(jasmine.any(popup));
  });

});
