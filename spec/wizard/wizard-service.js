/*global angular, inject*/
'use strict';
var util = require('../utilities');
var translationMock = require('../fixtures/translationFixture.json');
var _ = require('lodash');

describe('akamai.components.wizard', function() {
  var $scope, $compile, wizard, steps, submitFunction;

  beforeEach(function() {
    inject.strictDi(true);

    angular.mock.module(require('../../src/wizard').name);

    angular.mock.module(function($translateProvider) {
      $translateProvider.useLoader('i18nCustomLoader');
    });

    angular.mock.module(function($controllerProvider) {
      $controllerProvider.register('Controller1', /*@ngInject*/function($scope) {
        $scope.foo = 'bar';

        if (angular.isFunction($scope.setOnSubmit)) {
          $scope.setOnSubmit(function() {
            return true;
          });
        }
      });
      $controllerProvider.register('Controller2', /*@ngInject*/function($scope) {
        if (angular.isFunction($scope.setOnSubmit)) {
          $scope.setOnSubmit(function() {
            return false;
          });
        }
      });
    });

    inject(function($rootScope, _$compile_, $httpBackend, _wizard_) {
      $scope = $rootScope;
      $compile = _$compile_;
      wizard = _wizard_;

      $httpBackend.when('GET', util.LIBRARY_PATH).respond(translationMock);
      $httpBackend.when('GET', util.CONFIG_PATH).respond({});
      $httpBackend.flush();

      steps = [
        { name: 'Step 1', template: '<p>Step 1 Content</p>' },
        { name: 'Step 2', template: '<p>Step 2 Content</p>' },
        { name: 'Step 3', template: '<p>Step 3 Content</p>' }
      ];
    });
  });

  afterEach(function() {
    var modal = document.querySelector('.modal');
    var backdrop = document.querySelector('.modal-backdrop');
    var statusMessgeWrapper = document.querySelector('.akam-status-message-wrapper');

    if (modal) {
      modal.parentNode.removeChild(modal);
    }
    if (backdrop) {
      backdrop.parentNode.removeChild(backdrop);
    }
    if (statusMessgeWrapper) {
      statusMessgeWrapper.parentNode.removeChild(statusMessgeWrapper);
    }
  });


  function addElement(markup) {
    this.el = $compile(markup)($scope);
    $scope.$digest();
    this.element = document.body.appendChild(this.el[0]);
  }

  describe('given 3 steps', function() {
    describe('when the wizard is opened', function() {
      it('should rendered the wizard with just a single step', function() {
        wizard.open({steps: steps});
        $scope.$digest();

        var modalContent = document.querySelector('.modal-body p');
        expect(modalContent.textContent).toBe('Step 1 Content');

        var stepNav = document.querySelector('.wizard-steps ul');
        var stepElems = stepNav.getElementsByTagName('li');
        expect(stepElems.length).toBe(3);
      });
    });
  });


  describe('given 3 steps', function() {
    describe('when the next button is clicked', function() {

      it('should navigate to the next step', function() {
        wizard.open({steps: steps});
        $scope.$digest();

        var firstStep = document.querySelector('.wizard-steps ul li:first-child');
        expect(firstStep.classList.contains('active')).toBe(true);
        expect(firstStep.classList.contains('visited')).toBe(true);
        expect(firstStep.classList.contains('current')).toBe(true);

        var secondStep = document.querySelector('.wizard-steps ul li:first-child + li');
        expect(secondStep.classList.contains('active')).toBe(false);
        expect(secondStep.classList.contains('visited')).toBe(false);
        expect(secondStep.classList.contains('current')).toBe(true);

        var nextButton = document.querySelector('span.button-switch > button');
        util.click(nextButton);
        expect(firstStep.classList.contains('active')).toBe(false);
        expect(firstStep.classList.contains('visited')).toBe(true);
        expect(firstStep.classList.contains('current')).toBe(false);

        expect(secondStep.classList.contains('active')).toBe(true);
        expect(secondStep.classList.contains('visited')).toBe(true);
        expect(secondStep.classList.contains('current')).toBe(true);
      });
    });
  });

  describe('given 3 steps', function() {
    describe('when the previous button is clicked', function() {
      it('should navigate to the previous step', function() {
        wizard.open({steps: steps});
        $scope.$digest();

        var nextButton = document.querySelector('span.button-switch > button');
        util.click(nextButton);

        var previousButton = document.querySelector('.modal-footer button:first-child');
        util.click(previousButton);

        var firstStep = document.querySelector('.wizard-steps ul li:first-child');
        expect(firstStep.classList.contains('active')).toBe(true);
        expect(firstStep.classList.contains('visited')).toBe(true);
        expect(firstStep.classList.contains('current')).toBe(false);

        var secondStep = document.querySelector('.wizard-steps ul li:first-child + li');
        expect(secondStep.classList.contains('active')).toBe(false);
        expect(secondStep.classList.contains('visited')).toBe(true);
        expect(secondStep.classList.contains('current')).toBe(true);
      });
    });
  });

  describe('given 3 steps', function() {
    describe('when a previous step is clicked in the step navigation bar', function() {
      it('should navigate directly to the clicked step', function() {
        expect(true).toBe(true);
        wizard.open({steps: steps});
        $scope.$digest();

        var nextButton = document.querySelector('span.button-switch > button');
        util.click(nextButton);

        var firstStep = document.querySelector('.wizard-steps ul li:first-child');
        util.click(firstStep);
        expect(firstStep.classList.contains('active')).toBe(true);
        expect(firstStep.classList.contains('visited')).toBe(true);
        expect(firstStep.classList.contains('current')).toBe(false);

        var modalContent = document.querySelector('.modal-body p');
        expect(modalContent.textContent).toBe('Step 1 Content');
      });
    });
  });


  describe('given 3 steps', function() {
    describe('when a step is not valid', function() {
      it('should disable the next button', function() {
        steps[0].validate = function() { return false; };

        wizard.open({steps: steps});
        $scope.$digest();

        var nextButton = document.querySelector('span.button-switch > button');
        expect(nextButton.disabled).toBe(true);
      });
    });
  });

  describe('given a scope', function() {
    describe('when a step template is provided', function() {
      it('should the step template should be compiled using the provided scope', function() {
        var wizardScope = $scope.$new();
        wizardScope.foo = 'bar';

        steps[0].template = '<p>{{foo}}</p>';

        wizard.open({steps: steps, scope: wizardScope});
        $scope.$digest();

        var modalContent = document.querySelector('.modal-body p');
        expect(modalContent.textContent).toBe('bar');
      });
    });
  });


  describe('given a controller', function() {
    describe('when the content scope is initialized', function() {
      it('should use the provided controller to initialize the content scope', function() {
        var wizardScope = $scope.$new();
        steps[0].template = '<p>{{foo}}</p>';

        wizard.open({steps: steps, scope: wizardScope, controller: 'Controller1'});
        $scope.$digest();

        var modalContent = document.querySelector('.modal-body p');
        expect(modalContent.textContent).toBe('bar');
      });
    });
  });


  describe('given a title', function() {
    describe('when the wizard is opened', function() {
      it('should display the provided title as the wizard title', function() {
        wizard.open({steps: steps, title: 'Wizard Title Test'});
        $scope.$digest();

        var wizardTitle = document.querySelector('.modal-header h3');
        expect(wizardTitle.textContent).toBe('Wizard Title Test');
      });
    });
  });


  describe('given a label for the next button', function() {
    describe('when the wizard is opened', function() {
      it('should display the next button with the label', function() {
        wizard.open({steps: steps, nextLabel: 'Continue'});
        $scope.$digest();

        var nextButton = document.querySelector('span.button-switch > button');
        expect(_.trim(nextButton.textContent)).toBe('Continue');
      });
    });
  });

  describe('given a label for the previous button', function() {
    describe('when the wizard is opened', function() {
      it('should display the previous button with the label', function() {
        wizard.open({steps: steps, previousLabel: 'Back'});
        $scope.$digest();

        var previousButton = document.querySelector('.modal-footer button:first-child');
        expect(_.trim(previousButton.textContent)).toBe('Back');
      });
    });
  });


  describe('given a label for the submit button', function() {
    describe('when the wizard is opened', function() {
      it('should display the submit button with the label', function() {
        wizard.open({steps: [steps[0]], submitLabel: 'Enter'});
        $scope.$digest();

        var submitButton = document.querySelector('span.button-switch > button');
        expect(_.trim(submitButton.textContent)).toBe('Enter');
      });
    });
  });

  describe('given a success message', function() {
    describe('when the wizard is submitted', function() {
      it('should display the success message as a status message on the page', function() {
        wizard.open({steps: [steps[0]], successMessage:'Success'});
        $scope.$digest();

        var submitButton = document.querySelector('span.button-switch > button');
        util.click(submitButton);

        var statusMessage = document.querySelector('.status-message-content');
        expect(_.trim(statusMessage.textContent)).toBe('Success');
      });
    });
  });

  describe('given an error message', function() {
    describe('when an error occurs when submitting the wizard', function() {
      it('should display the error message at the top of the wizard', function() {

        var wizardScope = $scope.$new();
        wizardScope.successfulSubmit = false;
        wizard.open({steps: [steps[0]], scope: wizardScope, controller: 'Controller2', errorMessage: 'Error'});
        $scope.$digest();

        var submitButton = document.querySelector('span.button-switch > button');
        util.click(submitButton);

        var errorMessage = document.querySelector('.modal-header .status-message-content');
        expect(_.trim(errorMessage.textContent)).toBe('Error');
      });
    });
  });

});








