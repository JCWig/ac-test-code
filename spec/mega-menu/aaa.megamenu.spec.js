/* globals beforeEach, afterEach, sinon, $ */

'use strict';

// This is really silly but we need to have this file loaded first. It's because this file creates the skeleton DOM
// structure for use after the dependent AJAX calls complete. Unfortunately, this skeleton DOM depends on two AJAX
// calls itself: the config call and the i18n call. Furthermore, simply including the top level script
// causes these requests to be made. So we sadly have to mock out those two API calls and require the module afterwards.

// Karma sorts its test files alphabetically so we use 'aaa' in front of the file name to ensure that this test gets
// run first. In the future, we can look at using something like https://github.com/karma-runner/karma-html2js-preprocessor
// to more properly set up DOM structures for unit testing.

var megamenu,
  config = require('../../src/mega-menu/utils/config'),
  translations = require('./phantom-utils').translations;

describe('megamenu', function() {

  beforeEach(function() {
    this.server = sinon.fakeServer.create();
    this.server.respondWith('GET', '/totem/api/pulsar/megamenu/config.json',
      [200, {"Content-Type": 'application/json'},
        JSON.stringify({username: 'me', locale: 'en_US'})
      ]
    );
    this.server.respondWith('GET', /locales\/mega-menu\/en_US.json/,
      [200, {"Content-Type": 'application/json'}, translations]
    );

    config(jasmine.createSpy('spy'), true);  // force config load
    this.server.respond();

    // there is no load function for menu so we have to load it once after simulating the fetch to get config and translation data
    // many tests would break if this require statement is moved to the top (before the fake server is configured)
    megamenu = require('../../src/mega-menu/megamenu');
    this.server.respond();
  });

  afterEach(function() {
    this.server.restore();
  });

  it('should exist', function() {
    expect(megamenu).not.toBe(null);
  });

  it('should have a version', function() {
    expect(megamenu.VERSION).toEqual(jasmine.any(String));
  });

});
