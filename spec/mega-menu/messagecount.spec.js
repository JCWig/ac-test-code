/* globals angular, beforeEach, afterEach, sinon, $ */

'use strict';

var messages = require('../../src/mega-menu/messages'),
  util = require('./phantom-utils');

describe('messagecount', function() {

  var $scope, $compile;

  afterEach(function() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
  });

  beforeEach(function() {

    angular.mock.inject.strictDi(true);
    angular.mock.module(require('../../src/mega-menu').name);
    angular.mock.module(function(contextProvider) {
      contextProvider.setApplicationContext('standalone');
    });
    angular.mock.inject(function($rootScope, _$compile_, $httpBackend) {
      $scope = $rootScope;
      $compile = _$compile_;
      $httpBackend.when('GET', util.CONFIG_URL).respond(util.config());
    });

    this.el = $compile('<akam-menu-header></akam-menu-header>' +
    '<akam-menu-footer></akam-menu-footer>')($scope);
    $scope.$digest();
    this.element = document.body.appendChild(this.el[0]);

    this.server = sinon.fakeServer.create();
    this.server.respondWith('GET', /\/svcs\/messagecenter/, [
      200, {'Content-Type': 'application/json'}, JSON.stringify({count: 9001})
    ]);
  });

  afterEach(function() {
    this.server.restore();
  });

  it('should render on success', function() {
    var spy = jasmine.createSpy('spy');

    messages.render(spy);
    this.server.respond();

    expect(spy).toHaveBeenCalledWith(true);
  });

});
