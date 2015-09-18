/*global angular, inject*/
'use strict';
var util = require('../utilities');
var translationMock = require('../fixtures/translationFixture.json');

describe('akamai.components.wizard', function() {
  var $scope, $compile, $httpBackend, self = this;

  beforeEach(function() {
    inject.strictDi(true);

    angular.mock.module(require('../../src/wizard').name);

    angular.mock.module(function($translateProvider) {
      $translateProvider.translations('en_US', translationMock);
      $translateProvider.useLoader('translateNoopLoader');
    });

    inject(function($rootScope, _$compile_, _$httpBackend_) {
      $scope = $rootScope;
      $compile = _$compile_;
      $httpBackend = _$httpBackend_;
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

        $scope.wizard = {};
        $scope.wizard.contentScope = $scope.$new();
        $scope.wizard.contentScope.foo = 'bar'
        $scope.wizard.stepIndex = 0;

        $scope.wizard.steps = [{
          template: '<span>Hello {{ foo }}</span>'
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

        $scope.wizard = {};
        $scope.wizard.contentScope = $scope.$new();
        $scope.wizard.contentScope.foo = 'bar'
        $scope.wizard.stepIndex = 0;

        $scope.wizard.steps = [{
          templateUrl: url
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
