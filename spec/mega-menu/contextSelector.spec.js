/* globals beforeEach, afterEach, sinon, $ */

'use strict';

var contextSelector = require('../../src/mega-menu/contextSelector'),
  keyup = require('./phantom-utils').keyup,
  clickElement = require('./phantom-utils').clickElement,
  HIDE_CLASS = require('../../src/mega-menu/utils/constants').HIDE_CLASS,
  SEARCH_DELAY = 100;

var spy, clock;

describe('context selector', function() {
  beforeEach(function() {
    this.server = sinon.fakeServer.create();

    this.server.respondWith('GET', /context.json/, [
      200, {'Content-Type': 'application/json'}, JSON.stringify(
        {
          "context": {
            "mainMenuItems": [
              {
                "itemId": 123,
                "contextId": 0,
                "cps": null,
                "dps": null,
                "url": "/ui/home",
                "name": "Scratching Post Site",
                "subMenuItems": [
                  {
                    "itemId": 0,
                    "contextId": 1,
                    "cps": null,
                    "subMenuItems": null,
                    "dps": [
                      "more-catnip",
                      "tiny-mouse"
                    ],
                    "url": "/ui/home",
                    "name": "sisal-is-awesome"
                  }
                ]
              }
            ]
          }
        })
    ]);

    this.server.respondWith('GET', /cpcodes.json/, [
      200, {'Content-Type': 'application/json'}, JSON.stringify(
        {
          "context": {
            "mainMenuItems": [
              {
                "itemId": 123,
                "contextId": 0,
                "cps": null,
                "dps": null,
                "url": "/ui/home",
                "name": "Scratching Post Site",
                "subMenuItems": [
                  {
                    "itemId": 0,
                    "contextId": 1,
                    "cps": [
                      123,
                      456
                    ],
                    "subMenuItems": null,
                    "dps": null,
                    "url": "/ui/home",
                    "name": "sisal-is-awesome"
                  }
                ]
              }
            ]
          }
        })
    ]);
  });

  beforeEach(function(done) {
    clock = sinon.useFakeTimers();
    spy = jasmine.createSpy('spy');

    // wait for context selector to render because it relies on two promise objects. This can be largely cleaned up
    // if we move to having ajax (and render) calls return promises instead of calling callbacks.
    contextSelector.render(function(err) {
      spy(err);
      done();
    });
    this.server.respond();
  });

  afterEach(function() {
    clock.restore();
  });

  afterEach(function() {
    this.server.restore();
  });

  it('should call the callback', function() {
    expect(spy).toHaveBeenCalledWith(true);
  });

  describe('search results', function() {

    it('should do nothing if there is no input', function() {
      var input = $('.context input');
      keyup(input, 13);
      clock.tick(SEARCH_DELAY);

      expect($('.context .search-results').hasClass(HIDE_CLASS)).toBe(true);
    });

    it('should show the search results when an input is entered', function() {
      var input = $('.context input');
      input.val('a search term');
      keyup(input, 13);
      clock.tick(SEARCH_DELAY);

      expect($('.context .search-results').hasClass(HIDE_CLASS)).not.toBe(true);
    });

  });

});
