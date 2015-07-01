/* globals beforeEach, afterEach, sinon, $ */

'use strict';

var actualVersion = require('../../src/mega-menu/utils/constants').VERSION,
  expectedVersion = require('../../package.json').version;

describe('version', function() {

  it('should match the contents of package.json', function() {
    expect(expectedVersion).toContain(actualVersion);
  });

});
