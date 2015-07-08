/* eslint-disable max-nested-callbacks */
/* globals angular, beforeEach, afterEach, spyOn */
'use strict';

var contextModule = require('../../src/context');

var ACCOUNT_COOKIE = 'QWthbWFpIEludGVybmFsX0FrYW1haSBJbnRlcm5hbH5+MS03S0xHSA==',
  COOKIE_NAME = 'AKALASTMANAGEDACCOUNT',
  CHANGED_COOKIE = 'Rml4dHVyZSBTZXJ2ZXJfRmFrZSBDb250cmFjdH5+MS0yMzQ1';

describe('akamai.components.context', function() {

  var context, $rootScope, $httpBackend, $http, $cookies;

  // common setup for all beforeEach blocks
  function commonBeforeEach() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(contextModule.name);
    angular.mock.module(function(contextProvider) {
      contextProvider.setApplicationContext(contextProvider.GROUP_CONTEXT);
    });
    angular.mock.inject(function(_$rootScope_, _$httpBackend_, _$http_, _context_, _$cookies_) {
      $httpBackend = _$httpBackend_;
      $http = _$http_;
      context = _context_;
      $rootScope = _$rootScope_;
      $cookies = _$cookies_;
      $cookies.put(COOKIE_NAME, ACCOUNT_COOKIE);
      $httpBackend.when('GET', /core\/services\/session\/username\/extend/).respond({
        status: 'OK'
      });
      $httpBackend.when('GET', /context.json/).respond({
        context: {
          mainMenuItems: [
            {
              itemId: 123,
              contextId: 0,
              cps: null,
              dps: null,
              url: '/ui/home',
              name: 'Stella Cat',
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
                  url: '/ui/home?gid=123',
                  name: 'Property not configured property (no aid in URL)'
                }, {
                  itemId: 987,
                  contextId: 0,
                  cps: null,
                  dps: null,
                  url: '/ui/home',
                  name: 'Toys',
                  subMenuItems: [{
                    itemId: 0,
                    contextId: 1,
                    cps: null,
                    subMenuItems: null,
                    dps: [ ],
                    url: '/ui/home?aid=1&gid=987',
                    name: 'Crinkle Ball'
                  }, {
                    itemId: 888,
                    contextId: 1,
                    cps: null,
                    subMenuItems: [
                      {
                        itemId: 0,
                        contextId: 1,
                        cps: null,
                        subMenuItems: null,
                        dps: [],
                        url: '/ui/home?aid=2&gid=888',
                        name: 'Food'
                      },
                      {
                        itemId: 0,
                        contextId: 1,
                        cps: null,
                        subMenuItems: null,
                        dps: [],
                        url: '/ui/home?aid=3&gid=888',
                        name: 'Water'
                      }
                    ],
                    dps: [ ],
                    url: '/ui/home',
                    name: 'Child Group'
                  }]
                }
              ]
            }, {
              itemId: 999,
              contextId: 0,
              cps: null,
              dps: null,
              url: '/ui/home',
              name: 'Iron Maiden',
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
                  url: '/ui/home?aid=666&gid=999',
                  name: 'Number of the Beast'
                }
              ]
            }
          ]
        }
      });
    });
  }

  describe('given a loaded app', function() {

    describe('when an app requests its context', function() {

      beforeEach(commonBeforeEach);

      it('should return the correct context', function() {
        expect(context.isGroupContext()).toBeTruthy();
      });

    });

    describe('when an app requests the current group', function() {

      var group;

      beforeEach(function() {
        commonBeforeEach();
        context.group = 987;
        context.group.then(function(g) {
          group = g;
        });
        $httpBackend.flush();
        $rootScope.$apply();
      });

      it('should return the current group’s name and identifier', function() {
        expect(group.name).toEqual('Toys');
      });

      it('should return the current group’s parents', function() {
        expect(group.parent.id).toEqual(123);
      });

      it('should return the current group’s child groups', function() {
        expect(group.children[0].name).toEqual('Child Group');
      });

      it('should return the current group’s properties', function() {
        expect(group.properties[0].name).toEqual('Crinkle Ball');
      });

    });

    describe('when an app requests the current property', function() {

      var property;

      beforeEach(function() {
        commonBeforeEach();
        context.property = 666;
        context.property.then(function(p) {
          property = p;
        });
        $httpBackend.flush();
        $rootScope.$apply();
      });

      it('should return the current property’s name and identifier', function() {
        expect(property.name).toEqual('Number of the Beast');
      });

      it('should return the current property’s parents', function() {
        expect(property.group.name).toEqual('Iron Maiden');
      });

    });

    describe('when an app requests the current account', function() {
      beforeEach(function() {
        commonBeforeEach();
        context.account = {
          id: 1,
          name: 'account'
        };
        $httpBackend.flush();
        $rootScope.$apply();
      });

      it('should return the current account', function() {
        expect(context.account.name).toBe('account');
      });

    });

    describe('when an app sets the current group', function() {

      var property;

      beforeEach(function() {
        commonBeforeEach();
        context.property = 666;
        context.property.then(function(p) {
          property = p;
        });
        $httpBackend.flush();
        $rootScope.$apply();
      });

      it('should change the property to null', function() {
        context.group = 123;
        $rootScope.$apply();

        context.property.then(function(p) {
          property = p;
        });
        $httpBackend.flush();

        expect(property.id).toBeNull();
      });

      it('should make a request to extend the session with the gid ' +
      'query string parameter', function() {

        var spy = spyOn($http, 'get').and.callThrough();

        context.group = 123;
        $rootScope.$apply();
        $httpBackend.flush();

        expect(spy.calls.mostRecent().args[0]).toMatch(/gid=123/);
      });

    });

    describe('when an app sets the current property', function() {

      var group;

      beforeEach(function() {
        commonBeforeEach();
        context.group = 888;
        context.group.then(function(g) {
          group = g;
        });
        $httpBackend.flush();
        $rootScope.$apply();
      });

      it('should update the current group to be a parent of the current property', function() {
        context.property = 666;
        $rootScope.$apply();

        context.group.then(function(g) {
          group = g;
        });
        $httpBackend.flush();

        expect(group.id).toBe(999);
      });

      it('should not update the group if it is already a parent of the ' +
      'current property', function() {
        context.property = 2;
        $rootScope.$apply();

        context.group.then(function(g) {
          group = g;
        });
        $httpBackend.flush();

        expect(group.id).toBe(888);
      });

      it('should make a request to extend the session with the aid ' +
      'query string parameter', function() {
        var spy = spyOn($http, 'get').and.callThrough();

        context.property = 666;
        $rootScope.$apply();
        $httpBackend.flush();

        expect(spy.calls.mostRecent().args[0]).toMatch(/aid=666/);
      });

    });

  });

  describe('given an application with the initial account set', function() {

    describe('and when the AKALASTMANAGEDACCOUNT cookie changes', function() {

      beforeEach(function() {
        context.account = {
          id: '1-7KLGH',
          name: 'Akamai Internal',
          cookieValue: ACCOUNT_COOKIE
        };
      });

      it('should detect that the account has changed', function() {
        context.account = {
          id: 1,
          name: 'a name',
          cookieValue: CHANGED_COOKIE
        };

        expect(context.accountChanged()).toBeTruthy();
      });

    });

    describe('and when a user resets their account to the initial one', function() {

      beforeEach(function() {
        $httpBackend.expectGET(/\/ui\/home\/manage\?idaction=set_customer&newProvisioningAcct/)
          .respond(200);

        context.account = {
          id: '1-7KLGH',
          name: 'Akamai Internal',
          cookieValue: ACCOUNT_COOKIE
        };

      });

      it('should send a request to update the current account', function() {
        context.resetAccount();
        $httpBackend.flush();
      });

    });

  });

});

