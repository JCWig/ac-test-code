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
      beforeEach(function() {
        let markup = '<akam-wizard-content></akam-wizard-content>';

        $scope.wizard = {};
        $scope.wizard.contentScope = $scope.$new();
        $scope.wizard.contentScope.foo = 'bar';
        $scope.wizard.stepIndex = 0;

        $scope.wizard.steps = [{
          template: '<span>Hello {{ foo }}</span>'
        }];

        addElement(markup);
      });
      it('should render the inline template', function() {
        expect(document.querySelector('.modal-body span').textContent).toBe('Hello bar');
      });
      it('should render cache the compiled template in the step object', function() {
        let modalBody = angular.element(document.querySelector('.modal-body'));

        expect(modalBody.scope().wizard.steps[0].compiledTemplate).toBeDefined();
      });
    });
    describe('when wizard processing', function() {
      beforeEach(function() {
        var markup = '<akam-wizard-content></akam-wizard-content>';

        $scope.wizard = {};
        $scope.wizard.contentScope = $scope.$new();
        $scope.wizard.contentScope.foo = 'bar';
        $scope.wizard.stepIndex = 0;

        $scope.wizard.steps = [{
          template: '<span>Hello {{ foo }}</span>'
        }];
        $scope.wizard.processing = true;
        $scope.processing = true;
        addElement(markup);
      });
      it('should add processing class to modal-body to set overflow to hidden', function() {
        var wizardBodyContent = document.querySelector('.modal-body.processing');
        expect(wizardBodyContent).not.toBe(null);
      });
      it('should add backwash to modal-body', function() {
        var wizardBodyContent = document.querySelector('.modal-body.processing .backwash');
        expect(wizardBodyContent.classList).not.toContain('ng-hide');
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
