/*global angular, inject*/
'use strict';
var util = require('../utilities');
var translationMock = require('../fixtures/translationFixture.json');
var _ = require('lodash');

describe('akamai.components.wizard', function() {
  var $scope, $compile, $httpBackend, self = this;

  beforeEach(function() {
    inject.strictDi(true);

    angular.mock.module(require('../../src/wizard').name);

    angular.mock.module(function($translateProvider) {
      $translateProvider.useLoader('i18nCustomLoader');
    });


    inject(function($rootScope, _$compile_, _$httpBackend_, _wizard_) {
      $scope = $rootScope;
      $compile = _$compile_;
      $httpBackend = _$httpBackend_;

      $httpBackend.when('GET', util.LIBRARY_PATH).respond(translationMock);
      $httpBackend.when('GET', util.CONFIG_PATH).respond({});
      $httpBackend.flush();
    });
  });

  afterEach(function() {
    if (self.element) {
      document.body.removeChild(self.element);
      self.element = null;
    }
  });

  function addElement(markup) {
    self.el = $compile(markup)($scope);
    $scope.$digest();
    self.element = document.body.appendChild(self.el[0]);
  }

  describe('given an inline template', function() {
    describe('when rendering', function() {
      it('should render the inline template', function() {

        var markup = '<akam-wizard-content></akam-wizard-content>';

        $scope.contentScope = $scope.$new();
        $scope.contentScope.foo = 'bar'
        $scope.stepIndex = 0;

        $scope.steps = [{
          template: '<span>Hello {{ foo }}</span>',
        }];

        addElement(markup);

        var wizardBodyContent = document.querySelector('.modal-body span');
        expect(wizardBodyContent.textContent).toBe('Hello bar');
      });
    });
  });

  describe('given templateUrl', function() {
    describe('when rendering', function() {
      it('should render the template for the templateUrl', function() {
        var markup = '<akam-wizard-content></akam-wizard-content>';
        var template = '<span>Hello {{ foo }}</span>';
        var url = 'wizard/template.html';

        $scope.contentScope = $scope.$new();
        $scope.contentScope.foo = 'bar'
        $scope.stepIndex = 0;

        $scope.steps = [{
          templateUrl: url,
        }];

        $httpBackend.whenGET(url).respond(template);
        addElement(markup);
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();


        var wizardBodyContent = document.querySelector('.modal-body span');
        expect(wizardBodyContent.textContent).toBe('Hello bar');
      });
    });
  });



});








