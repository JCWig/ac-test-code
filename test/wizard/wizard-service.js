/*global angular, inject*/
'use strict';
var util = require('../utilities');
var translationMock = require('../fixtures/translationFixture.json');
var _ = require('lodash');

const CANCEL_BUTTON_SELECTOR = 'div.modal-footer > button.cancel-button';
const PREVIOUS_BUTTON_SELECTOR = 'div.modal-footer > button.previous-button';
const NEXT_BUTTON_SELECTOR = 'div.modal-footer > button.next-button';
const PREV_BUTTON_SELECTOR = 'div.modal-footer > button.previous-button';

describe('akamai.components.wizard', function() {
  var $scope, $compile, wizard, steps, submitFunction, $q, timeout;

  beforeEach(function() {
    inject.strictDi(true);

    angular.mock.module(require('../../src/wizard').name);

    angular.mock.module(function($translateProvider) {
      $translateProvider.translations('en_US', translationMock);
      $translateProvider.useLoader('translateNoopLoader');
    });

    angular.mock.module(function($controllerProvider) {

      function Controller1($scope) {
        $scope.foo = 'bar';

        if (angular.isFunction($scope.setOnSubmit)) {
          $scope.setOnSubmit(function() {
            return true;
          });
        }
      }
      Controller1.$inject = ['$scope'];

      function Controller2($scope) {
        if (angular.isFunction($scope.setOnSubmit)) {
          $scope.setOnSubmit(function() {
            return false;
          });
        }
      }
      Controller2.$inject = ['$scope'];

      $controllerProvider.register('Controller1', Controller1);
      $controllerProvider.register('Controller2', Controller2);
    });

    inject(function($rootScope, _$compile_, $httpBackend, _wizard_, _$q_, $timeout, statusMessage) {
      $scope = $rootScope;
      $compile = _$compile_;
      wizard = _wizard_;
      $q = _$q_;
      timeout = $timeout;

      steps = [
        { name: 'Step 1', template: '<p>Step 1 Content</p>' },
        { name: 'Step 2', template: '<p>Step 2 Content</p>' },
        { name: 'Step 3', template: '<p>Step 3 Content</p>' }
      ];

      statusMessage.clear();
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

        var nextButton = document.querySelector(NEXT_BUTTON_SELECTOR);
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

        var nextButton = document.querySelector(NEXT_BUTTON_SELECTOR);
        util.click(nextButton);

        var previousButton = document.querySelector(PREVIOUS_BUTTON_SELECTOR);
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

        var nextButton = document.querySelector(NEXT_BUTTON_SELECTOR);
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

        var nextButton = document.querySelector(NEXT_BUTTON_SELECTOR);
        expect(nextButton.disabled).toBe(true);
      });
    });
  });

  describe('given a scope', function() {
    describe('when a step template is provided', function() {
      it('should compile the step template using the provided scope', function() {
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
  //

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
      it('should display default value for next button if nextLabel attr is not provided', function() {
        wizard.open({steps: steps, });
        $scope.$digest();

        var nextButton = document.querySelector('span.button-switch > button');
        timeout(function(){
          expect(_.trim(nextButton.textContent)).toBe('Next');
        },0);
      });
      it('should translate next button if nextLabel attr is provided', function() {
        wizard.open({steps: steps, nextLabel: 'components.wizard.label.next'});
        $scope.$digest();

        var nextButton = document.querySelector('span.button-switch > button');
        timeout(function(){
          expect(_.trim(nextButton.textContent)).toBe('Next');
        },0);
      });
      it('should translate nextLabel and display key if key is invalid', function() {
        wizard.open({steps: steps, nextLabel: 'Continue'});
        $scope.$digest();

        var nextButton = document.querySelector(NEXT_BUTTON_SELECTOR);
        expect(_.trim(nextButton.textContent)).toBe('Continue');
      });
    });
  });

  describe('given a label for the previous button', function() {
    describe('when the wizard is opened', function() {
      it('should display default value for previous button if previousLabel attr is not provided', function() {
        wizard.open({steps: steps});
        $scope.$digest();

        var previousButton = document.querySelector(PREVIOUS_BUTTON_SELECTOR);
        expect(_.trim(previousButton.textContent)).toBe('Previous');
      });
      it('should translate previousLabel if previousLabel attr is provided', function() {
        wizard.open({steps: steps, previousLabel: 'components.wizard.label.next'});
        $scope.$digest();

        var previousButton = document.querySelector(PREVIOUS_BUTTON_SELECTOR);
        expect(_.trim(previousButton.textContent)).toBe('Next');
      });
      it('should translate previousLabel and display key if key is invalid', function() {
        wizard.open({steps: steps, previousLabel: 'Back'});
        $scope.$digest();

        var previousButton = document.querySelector(PREVIOUS_BUTTON_SELECTOR);
        expect(_.trim(previousButton.textContent)).toBe('Back');
      });
    });
  });


  describe('given a label for the submit button', function() {
    describe('when the wizard is opened', function() {
      it('should display default value for submit button if submitLabel attr is not provided', function() {
        wizard.open({steps: [steps[0]]});
        $scope.$digest();

        var submitButton = document.querySelector('span.button-switch > button');
        timeout(function(){
          expect(_.trim(submitButton.textContent)).toBe('Submit');
        },0);
      });
      it('should translate submitLabel if submitLabel attr is provided', function() {
        wizard.open({steps: [steps[0]], submitLabel: 'components.wizard.label.next'});
        $scope.$digest();

        var submitButton = document.querySelector('span.button-switch > button');
        timeout(function(){
          expect(_.trim(submitButton.textContent)).toBe('Next');
        },0);
      });
      it('should translate submitLabel and display key if key is invalid', function() {
        wizard.open({steps: [steps[0]], submitLabel: 'Enter'});
        $scope.$digest();

        var submitButton = document.querySelector(NEXT_BUTTON_SELECTOR);
        expect(_.trim(submitButton.textContent)).toBe('Enter');
      });
    });
  });

  describe('given a success message', function() {
    describe('when the wizard is submitted', function() {
      it('should display default success message as a status message on the page if successMessage attr is not provided', function() {
        wizard.open({steps: [steps[0]]});
        $scope.$digest();

        var submitButton = document.querySelector(NEXT_BUTTON_SELECTOR);
        util.click(submitButton);

        var statusMessage = document.querySelector('.status-message-content');
        timeout(function(){
          expect(_.trim(statusMessage.textContent)).toBe('The action has been completed.');
        },0);
      });
      it('should translate success message as a status message on the page if successMessage attr is provided', function() {
        wizard.open({steps: [steps[0]], successMessage:'components.wizard.label.next'});
        $scope.$digest();

        var submitButton = document.querySelector(NEXT_BUTTON_SELECTOR);
        util.click(submitButton);

        var statusMessage = document.querySelector('.status-message-content');
        timeout(function(){
          expect(_.trim(statusMessage.textContent)).toBe('Next');
        },0);
      });
      it('should translate success message as a status message on the page and display key if key is invalid', function() {
        wizard.open({steps: [steps[0]], successMessage:'Success'});
        $scope.$digest();

        var submitButton = document.querySelector(NEXT_BUTTON_SELECTOR);
        util.click(submitButton);

        var statusMessage = document.querySelector('.status-message-content');
        expect(_.trim(statusMessage.textContent)).toBe('Success');
      });
    });
  });

  describe('given an error message', function() {
    describe('when an error occurs when submitting the wizard', function() {
      it('should display default error message at the top of the wizard if errorMessage attr is not provided', function() {
        var wizardScope = $scope.$new();
        wizardScope.successfulSubmit = false;
        wizard.open({
          steps: [steps[0]],
          scope: wizardScope, controller: 'Controller2'
        });
        $scope.$digest();

        var submitButton = document.querySelector(NEXT_BUTTON_SELECTOR);
        util.click(submitButton);

        var errorMessage = document.querySelector('.modal-header .status-message-content');
        timeout(function(){
          expect(errorMessage.textContent).toMatch(/The action can't be completed/);
        },0);
      });
      it('should translate error message at the top of the wizard if errorMessage attr is provided', function() {
        var wizardScope = $scope.$new();
        wizardScope.successfulSubmit = false;
        wizard.open({
          steps: [steps[0]],
          scope: wizardScope, controller: 'Controller2',
          errorMessage: 'components.wizard.label.next'
        });
        $scope.$digest();

        var submitButton = document.querySelector(NEXT_BUTTON_SELECTOR);
        util.click(submitButton);

        var errorMessage = document.querySelector('.modal-header .status-message-content');
        timeout(function(){
          expect(_.trim(errorMessage.textContent)).toBe('Next');
        },0);
      });
      it('should translate error message at the top of the wizard and display key if key if invalid', function() {
        var wizardScope = $scope.$new();
        wizardScope.successfulSubmit = false;
        wizard.open({
          steps: [steps[0]],
          scope: wizardScope, controller: 'Controller2',
          errorMessage: 'Error'
        });
        $scope.$digest();

        var submitButton = document.querySelector(NEXT_BUTTON_SELECTOR);
        util.click(submitButton);

        var errorMessage = document.querySelector('.modal-header .status-message-content');
        timeout(function(){
          expect(_.trim(errorMessage.textContent)).toBe('Error');
        },0);
      });
    });
  });

  describe('given the default error message', function() {
    describe('when an error occurs when submitting the wizard', function() {
      it('should display the default error message', function() {
        var wizardScope = $scope.$new();
        wizardScope.successfulSubmit = false;
        wizard.open({steps: [steps[0]], scope: wizardScope, controller: 'Controller2'});
        $scope.$digest();

        var submitButton = document.querySelector(NEXT_BUTTON_SELECTOR);
        util.click(submitButton);

        var errorMessage = document.querySelector('.modal-header .status-message-content');
        timeout(function(){
          expect(_.trim(errorMessage.textContent))
            .toBe(translationMock.components.wizard.errorMessage);
        },0);
      });
    });
  });

  describe('given a step with an initialize method', function() {
    describe('when an error occurs while initializing', function() {

      beforeEach(function() {
        var wizardScope = $scope.$new();
        var times = 0;

        var step2 = {
          name: 'Step 2',
          template: '<p>Step 2 Content</p>',
          initialize: function () {
            var deferred = $q.defer();

            deferred.reject('failed to initialize step');
            return deferred.promise;
          }
        };

        wizard.open({steps: [steps[0], step2], scope: wizardScope});
        $scope.$digest();

        var nextButton = document.querySelector(NEXT_BUTTON_SELECTOR);
        util.click(nextButton);
      });

      it('should display the default error message', function() {
        var statusMessage = document.querySelector('.status-message-content');
        expect(_.trim(statusMessage.textContent)).toBe('failed to initialize step');
      });
    });
  });

  describe('given a step with an initialize method', function() {
    describe('when the step is initialized successfully', function() {

      beforeEach(function() {
        var wizardScope = $scope.$new();
        var times = 0;

        var step2 = {
          name: 'Step 2',
          template: '<p>Step 2 Content</p>',
          initialize: function () {
            var deferred = $q.defer();

            deferred.resolve();
            return deferred.promise;
          }
        };

        wizard.open({steps: [steps[0], step2], scope: wizardScope});
        $scope.$digest();

        var nextButton = document.querySelector(NEXT_BUTTON_SELECTOR);
        util.click(nextButton);
      });

      it('should activate the step', function() {
        var secondStep = document.querySelector('.wizard-steps ul li:first-child + li');
        expect(secondStep.classList.contains('active')).toBe(true);
      });
    });
  });

  describe('given an open wizard with content scope', function() {
    let wizardScope, wizardContrller;

    describe('when the wizard is dismissed', function() {
      beforeEach(function() {
        wizardScope = $scope.$new();
        spyOn(wizardScope, '$destroy');

        wizard.open({steps: [steps[0]], scope: wizardScope, controller: 'Controller1'});
        $scope.$digest();

        wizardContrller = angular.element(document.querySelector('div.modal-footer')).scope().wizard;
        spyOn(wizardContrller.instance, 'dismiss').and.callThrough();

        util.click(document.querySelector('.modal-header i'));
      });

      it('should destroy the provided scope', function() {
        expect(wizardScope.$destroy).toHaveBeenCalled();
      });
      it('should call instance dismiss function', function() {
        expect(wizardContrller.instance.dismiss).toHaveBeenCalled();
      });
    });

    describe('when the wizard is closed', function(){
      beforeEach(function() {
        wizardScope = $scope.$new();
        spyOn(wizardScope, '$destroy');

        wizard.open({steps: [steps[0]], scope: wizardScope, controller: 'Controller1'});
        $scope.$digest();

        util.click(document.querySelector(NEXT_BUTTON_SELECTOR));
      });

      it('should destroy the provided scope', function() {
        expect(wizardScope.$destroy).toHaveBeenCalled();
      });
    });
    describe('when the wizard is canceled', function() {
      beforeEach(function() {
        wizardScope = $scope.$new();
        spyOn(wizardScope, '$destroy');

        wizard.open({steps: [steps[0]], scope: wizardScope, controller: 'Controller1'});
        $scope.$digest();

        util.click(document.querySelector(CANCEL_BUTTON_SELECTOR));

      });

      it('should destroy the provided scope', function() {
        expect(wizardScope.$destroy).toHaveBeenCalled();
      });
    });
  });

  describe('given in submission state', () => {
    describe('when wizard is in processing', () => {
      let prevButton, cancelButton;
      beforeEach(() => {
        let wizardScope = $scope.$new();
        wizard.open({steps: [steps[0]], scope: wizardScope, controller: 'Controller1'});
        $scope.$digest();

        let wizardController = angular.element(document.querySelector('div.modal-footer')).scope().wizard;
        wizardController.processing = true;
        $scope.$digest();

        prevButton = document.querySelector(PREV_BUTTON_SELECTOR);
        cancelButton = document.querySelector(CANCEL_BUTTON_SELECTOR);
      });
      it('should disable the previous button', () => {
        expect(prevButton.disabled).toBe(true);
      });
      it('should disable the cancel button', () => {
        expect(cancelButton.disabled).toBe(true);
      });
    });
  });

  describe('given different labels for next and submit buttons', () => {
    describe('when the wizard is opened and click next button', () => {
      let nextButton;
      beforeEach(() => {
        let wizardScope = $scope.$new();
        var step2 = {
          name: 'Step 2',
          template: '<p>Step 2 Content</p>',
          initialize: function () {
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
          }
        };
        wizard.open({steps: [steps[0], step2], scope: wizardScope, nextLabel: 'next', submitLabel: 'last', controller: 'Controller1'});
        $scope.$digest();

        nextButton = document.querySelector(NEXT_BUTTON_SELECTOR);
      });

      it('should submit button text display next', () => {
          expect(_.trim(nextButton.textContent)).toBe('next');
      });

      it('should submit button text display last', function() {
        util.click(nextButton);
        $scope.$digest();

        expect(_.trim(nextButton.textContent)).toBe('last');
      });

    });
  });
});