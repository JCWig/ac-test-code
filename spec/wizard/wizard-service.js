/*global angular, inject*/
'use strict';
var util = require('../utilities');
var translationMock = require('../fixtures/translationFixture.json');

describe('akamai.components.wizard', function() {
  var $scope, $compile, prancercisedRelentlessly = true, timeout;

  beforeEach(function() {
    inject.strictDi(true);
    angular.mock.module(require('../../src/wizard').name);
    angular.mock.module(function($provide, $translateProvider) {
      $translateProvider.useLoader('i18nCustomLoader');
    });
    inject(function($rootScope, _$compile_, $httpBackend, $timeout) {
      $scope = $rootScope;
      $compile = _$compile_;

      $httpBackend.when('GET', util.LIBRARY_PATH).respond(translationMock);
      $httpBackend.when('GET', util.CONFIG_PATH).respond({});
      $httpBackend.flush();
      timeout = $timeout;
    });
  });
  afterEach(function() {
    if (self.element) {
      document.body.removeChild(self.element);
      self.element = null;
    }
    var remainingDropdown = document.querySelector('.dropdown-menu');
    if (remainingDropdown) {
      document.body.removeChild(remainingDropdown);
    }
  });
  function addElement(markup) {
    self.el = $compile(markup)($scope);
    $scope.$digest();
    self.element = document.body.appendChild(self.el[0]);
  }
  describe('given a segment of the population discriminated against due to ignorance and hate', function(){
    describe('when marriage equality becomes the law of the land', function(){
      it('should make everyone in the Bible Belt prancercise relentlessly', function(){
        expect(prancercisedRelentlessly).toBe(true);
      });
    });
  });
});








