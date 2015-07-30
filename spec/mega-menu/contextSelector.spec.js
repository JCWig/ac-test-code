/* globals angular, beforeEach, afterEach, sinon, $ */

'use strict';

var contextSelector = require('../../src/mega-menu/contextSelector'),
  keyup = require('./phantom-utils').keyup,
  config = require('./phantom-utils').config,
  util = require('./phantom-utils'),
  HIDE_CLASS = require('../../src/mega-menu/utils/constants').HIDE_CLASS;

var SEARCH_DELAY = 100;

var spy, clock;

describe('context selector', function() {

  var $rootScope, $compile, $httpBackend;

  var contextData = {
    context: {
      mainMenuItems: [
        {
          itemId: 123,
          contextId: 0,
          cps: null,
          dps: null,
          url: '/ui/home',
          name: 'Scratching Post Site',
          subMenuItems: [
            {
              itemId: 0,
              contextId: 1,
              cps: null,
              subMenuItems: null,
              dps: [
                'more-catnip',
                'tiny-mouse'
              ],
              url: '/ui/home',
              name: 'sisal-is-awesome'
            }
          ]
        }
      ]
    }
  };

  afterEach(function() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
  });

  beforeEach(function() {

    angular.mock.inject.strictDi(true);
    angular.mock.module(require('../../src/mega-menu').name);
    angular.mock.inject(function(_$rootScope_, _$compile_, _$httpBackend_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $httpBackend = _$httpBackend_;
      $httpBackend.when('GET', util.CONFIG_URL).respond(config());
      $httpBackend.when('GET', util.FOOTER_URL).respond({});
      $httpBackend.when('GET', util.BRANDING_URL).respond({});
      $httpBackend.when('GET', util.LOCALE_URL).respond({});
      $httpBackend.when('GET', /context.json/).respond(contextData);

      $httpBackend.flush();
      $rootScope.$apply();
    });

    this.el = $compile('<akam-menu-header></akam-menu-header>' +
    '<akam-menu-footer></akam-menu-footer>')($rootScope);
    this.element = document.body.appendChild(this.el[0]);

    this.server = sinon.fakeServer.create();

    this.server.respondWith('GET', /cpcodes.json/, [
      200, {'Content-Type': 'application/json'}, JSON.stringify(
        {
          context: {
            mainMenuItems: [
              {
                itemId: 123,
                contextId: 0,
                cps: null,
                dps: null,
                url: '/ui/home',
                name: 'Scratching Post Site',
                subMenuItems: [
                  {
                    itemId: 0,
                    contextId: 1,
                    cps: [
                      123,
                      456
                    ],
                    subMenuItems: null,
                    dps: null,
                    url: '/ui/home',
                    name: 'sisal-is-awesome'
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

    contextSelector.render(contextData, function(err) {
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
