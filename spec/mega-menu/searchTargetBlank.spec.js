/* globals beforeEach, afterEach, sinon, $ */

'use strict';

var searchTargetBlank = require('../../src/mega-menu/helpers/searchTargetBlank');

describe('searchTargetBlank', function() {

  it('should return true if the input is "documentation"', function() {
    expect(searchTargetBlank('documentation')).toBe(true);
  });

  it('should return true if the input is "knowledge_base"', function() {
    expect(searchTargetBlank('knowledge_base')).toBe(true);
  });

  it('should return false for anything else', function() {
    expect(searchTargetBlank('anything else')).toBe(false);
  });

});
