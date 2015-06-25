/* globals angular, beforeEach, afterEach, sinon, $ */

'use strict';

var contextSelector = require('../../src/mega-menu/contextSelector'),
  keyup = require('./phantom-utils').keyup,
  config = require('./phantom-utils').config,
  CONFIG_URL = require('./phantom-utils').CONFIG_URL,
  HIDE_CLASS = require('../../src/mega-menu/utils/constants').HIDE_CLASS;

var SEARCH_DELAY = 100;

var spy, clock;

xdescribe('context selector', function() {

  var $scope, $compile, $httpBackend;

  afterEach(function() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
  });

  beforeEach(function() {

    angular.mock.inject.strictDi(true);
    angular.mock.module(require('../../src/mega-menu').name);
    angular.mock.inject(function($rootScope, _$compile_, _$httpBackend_) {
      $scope = $rootScope;
      $compile = _$compile_;
      $httpBackend = _$httpBackend_;
      $httpBackend.when('GET', CONFIG_URL).respond(config());
      $httpBackend.when('GET', /context.json/).respond({
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
      });
    });

    this.el = $compile('<akam-menu-header></akam-menu-header>' +
    '<akam-menu-footer></akam-menu-footer>')($scope);
    $scope.$digest();
    $httpBackend.flush();
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

  beforeEach(function() {
    clock = sinon.useFakeTimers();
    spy = jasmine.createSpy('spy');

    contextSelector.render(spy);
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
