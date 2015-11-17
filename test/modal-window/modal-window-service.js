/* eslint-disable max-nested-callbacks */
/* global angular, inject*/

import _ from 'lodash';
import angular from 'angular';
import utilities from '../utilities';
import modalWindowService from '../../src/modal-window';
const translationMock = {
  'components': {
    'modal-window': {
      'label': {
        'cancel': 'Cancel {{name}}',
        'save': 'Save {{name}}'
      },
      'title': 'Modal Window {{name}}',
      'successMessage': 'Value has been successfully submitted. {{name}}',
      'errorMessage': 'Error occurs during last submission. {{name}}'
    }
  }
};
const CANCEL_BUTTON = '.modal-footer .cancel-button';
const SUBMIT_BUTTON = '.modal-footer .submit-button';
const MODAL_BODY = '.modal-body';
const MODAL_TITLE = '.modal .modal-title';

function cleanUp() {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
}

describe('modalWindow service', function() {
  let self = null;
  let $animate = null;

  beforeEach(function() {
    angular.mock.inject.strictDi(true);
    self = this;
    self.notify = function() {};
    spyOn(self, 'notify');

    angular.mock.module('ngAnimateMock');
    angular.mock.module(modalWindowService.name);
    angular.mock.module(function($translateProvider) {
      $translateProvider.translations('en_US', translationMock);
      $translateProvider.useLoader('translateNoopLoader');
    });
    angular.mock.module(function($controllerProvider) {
      function Controller($scope) {
        $scope.toggle = function() {
          if ($scope.isSubmitDisabled()) {
            $scope.enableSubmit();
          } else {
            $scope.disableSubmit();
          }
        };

        $scope.setOnSubmit(function() {
          self.notify();
          return true;
        });
      }
      Controller.$inject = ['$scope'];

      $controllerProvider.register('Controller', Controller);

      function ControllerResolve($scope, injectedLocal) {
        this.local = injectedLocal;
        $scope.setOnSubmit(function() {
          self.notify();
          return true;
        });
      }
      ControllerResolve.$inject = ['$scope', 'injectedLocal'];

      $controllerProvider.register('ControllerResolve', ControllerResolve);
    });

    inject(function(modalWindow, $rootScope, $httpBackend, $timeout, $q, _$animate_) {
      self.scope = $rootScope.$new();
      self.modalWindowService = modalWindow;
      self.httpBackend = $httpBackend;
      self.timeout = $timeout;
      self.q = $q;
      $animate = _$animate_;
    });
  });

  afterEach(function() {
    cleanUp();
  });

  describe('given a modal window', function(){
    describe('when showFullscreenToggle option is set to true', function(){
      beforeEach(function(){
        this.scope.showFullscreenToggle = true;
        this.modalWindowService.open({
          scope: this.scope,
          template: '<p></p>',
          showFullscreenToggle: true
        });
        this.scope.$apply();

        this.result = document.querySelector('i.max-min-icon');
      });
      it('should confirm the max min icon is visible', function() {
        expect(this.result).not.toBeNull();
      });

      it('should confirm the max min icon icon shows full screen', function() {
        expect(this.result.classList.contains('pulsar-fullscreen')).toBe(true);
      });
    });
  });

  describe('given a modal window', function(){
    describe('when showFullscreenToggle option is set to false', function(){
      beforeEach(function(){
        this.scope.showFullscreenToggle = true;
        this.modalWindowService.open({
          scope: this.scope,
          template: '<p></p>',
          showFullscreenToggle: false
        });
        this.scope.$apply();

        this.result = document.querySelector('i.max-min-icon');
      });

      it('should confirm the max min icon is not visible', function() {
        expect(this.result).toBeNull();
      });
    });
  });

  describe('given a modal window', function() {
    beforeEach(function() {
      this.modalWindowService.open({
        scope: this.scope,
        title: 'Hello Akamai',
        cancelLabel: 'Close',
        submitLabel: 'Submit',
        template: '<p></p>'
      });

      this.scope.$apply();
    });
    describe('when title is provided', function() {
      it('should support a title option', function() {
        let modalTitle = document.querySelector(MODAL_TITLE);
        expect(modalTitle.textContent).toEqual('Hello Akamai');
      });
    });
    describe('when cancel label is provided', function() {
      it('should display cancel label', function() {
        let cancelButton = document.querySelector(CANCEL_BUTTON);
        expect(cancelButton.textContent.trim()).toEqual('Close');
      });
    });
    describe('when submit label is provided', function() {
      it('should display submit label', function() {
        let submitButton = document.querySelector(SUBMIT_BUTTON);
        expect(submitButton.textContent.trim()).toEqual('Submit');
      });
    });
  });

  describe('given a modal window', function() {
    describe('when title is provided as translation key', function() {
      beforeEach(function() {
        this.modalWindowService.open({
          scope: this.scope,
          title: 'components.modal-window.title',
          template: '<p></p>'
        });
        this.scope.$apply();
      });
      it('should translate title key', function() {
        let modalTitle = document.querySelector(MODAL_TITLE);
        expect(modalTitle.textContent).toEqual('Modal Window ');
      });
    });
  });

  describe('given a modal window', function() {
    describe('when no template option is provided', function() {
      it('should throw an error', function() {
        let openFunction = _.partial(this.modalWindowService.open, {});
        expect(openFunction).toThrowError();
      });
    });
  });

  describe('given a modal window', function() {
    describe('when an angular element is used as a template', function() {
      beforeEach(function() {
        this.modalWindowService.open({
          scope: this.scope,
          template: angular.element('<p>angular element</p>')
        });
        this.scope.$apply();
      });
      it('should render the modal window', function() {
        expect(document.querySelector('.modal-body p').textContent).toBe('angular element');
      });
    });
  });

  describe('given a modal window', function() {
    describe('when an icon is provided', function() {
      beforeEach(function() {
        this.modalWindowService.open({
          scope: this.scope,
          icon: 'svg-information',
          template: '<p></p>'
        });
        this.scope.$apply();
      });
      it('should support a private icon option', function() {
        let modalPrivateIcon = document.querySelector('.modal-header i:first-child');
        expect(modalPrivateIcon.classList.contains('svg-information')).toBe(true);
      });
    });

    describe('given a modal window', function() {
      describe('when open', function() {
        let canceltButton, submitButton;
        beforeEach(function() {
          this.modalWindowService.open({
            scope: this.scope,
            template: '<p></p>'
          });
          this.scope.$apply();
          submitButton = document.querySelector(SUBMIT_BUTTON);
          canceltButton = document.querySelector(CANCEL_BUTTON);
        });
        it('should have button rendered with class name cancel-button ', function() {
          expect(canceltButton).not.toBe(null);
        });
        it('should have button rendered with class name submit-button ', function() {
          expect(submitButton).not.toBe(null);
        });
      });
    });

    describe('when an inline template is provided', function() {
      beforeEach(function() {
        this.scope.name = 'Akamai';
        this.modalWindowService.open({
          scope: this.scope,
          template: '<span>{{ name }}</span>'
        });
        this.scope.$apply();
      });
      it('should support an inline template option', function() {
        let modalBody = document.querySelector(MODAL_BODY);
        expect(modalBody.textContent.trim()).toEqual(this.scope.name);
      });
    });
    describe('when a templateUrl is provided', function() {
      beforeEach(function() {
        let url = 'modal-window/template.html';
        let template = '<span>{{ name }}</span>';

        this.scope.name = 'Akamai';
        this.httpBackend.whenGET(url).respond(template);
        this.modalWindowService.open({
          scope: this.scope,
          templateUrl: url
        });
        this.httpBackend.flush();
      });
      it('should support a template url option', function() {
        var modalBody = document.querySelector(MODAL_BODY);
        expect(modalBody.textContent.trim()).toEqual('Akamai');
        this.httpBackend.verifyNoOutstandingRequest();
      });
    });
    describe('when hide submit button is true', function() {
      beforeEach(function() {
        this.modalWindowService.open({
          scope: this.scope,
          hideSubmit: true,
          template: '<p></p>'
        });
        this.scope.$apply();
      });
      it('should hide submit button', function(){
        let allModalButtonsInFooter = document.querySelectorAll('.modal-footer button');
        expect(allModalButtonsInFooter.length).toEqual(1);
      });
    });
    describe('when submit button is shown', function() {
      beforeEach(function(){
        let template = '<button class="toggle" ng-click="toggle()"></button>';
        this.modalWindowService.open({
          scope: this.scope,
          template: template,
          controller: 'Controller'
        });
        this.scope.$apply();
      });
      it('should support toggling the submit button disabled state', function() {
        let toggleSubmitButton,
            submitButton;

        toggleSubmitButton = document.querySelector('button.toggle');
        submitButton = document.querySelector(SUBMIT_BUTTON);

        utilities.click(toggleSubmitButton);
        expect(submitButton.disabled).toBe(true);

        utilities.click(toggleSubmitButton);
        expect(submitButton.disabled).toBe(false);
      });
    });
    describe('when submit button is clicked', function() {
      beforeEach(function() {
        this.modalWindowService.open({
          scope: this.scope,
          template: '<p></p>',
          controller: 'Controller'
        });
        this.scope.$apply();
      });
      it('should notify the modal window to return a result', function() {
        let submitButton = document.querySelector(SUBMIT_BUTTON);

        utilities.click(submitButton);
        expect(this.notify).toHaveBeenCalled();
      });
    });

    describe('when submit button is clicked', function() {
      beforeEach(function() {
        this.deferral = this.q.defer();
        let self = this;

        function Controller($scope) {
          $scope.setOnSubmit(
            function() {
              return self.deferral.promise;
            }
          );
        }
        Controller.$inject = ['$scope'];

        this.modalWindowService.open({
          scope: this.scope,
          template: '<p></p>',
          controller: Controller
        });
        this.scope.$apply();
      });
      it('should disable submit button while processing', function() {
        let submitButton = document.querySelector(SUBMIT_BUTTON);

        utilities.click(submitButton);
        expect(submitButton.getAttribute('disabled')).toBeTruthy();
      });
      it('should enable submit button after processing fails', function() {
        let submitButton = document.querySelector(SUBMIT_BUTTON);

        utilities.click(submitButton);

        this.deferral.reject();
        this.timeout.flush();

        submitButton = document.querySelector(SUBMIT_BUTTON);
        expect(submitButton.getAttribute('disabled')).toBeNull();
      });
    });
    describe('when submit button is clicked', function() {
      describe('and when rejected promise', function() {
        beforeEach(function() {
          this.deferral = this.q.defer();
          let self = this;

          function Controller($scope) {
            $scope.setOnSubmit(
              function() {
                return self.deferral.promise;
              }
            );
          }
          Controller.$inject = ['$scope'];

          this.modalWindowService.open({
            scope: this.scope,
            template: '<p></p>',
            controller: Controller
          });
          this.scope.$apply();
        });
        it('should add error class in modal header', function() {
          let submitButton = document.querySelector(SUBMIT_BUTTON);
          let modalHeaderEl = angular.element(document.querySelector('.modal-header'));

          utilities.click(submitButton);

          expect(modalHeaderEl.hasClass('error')).toBe(false);
          this.deferral.reject();
          this.timeout.flush();

          expect(modalHeaderEl.hasClass('error')).toBe(true);
        });
        it('should verify akam-status-message-wrapper class added', function() {
          let submitButton = document.querySelector(SUBMIT_BUTTON);
          let statusMessageWrapperEl = document.querySelector('.akam-status-message-wrapper');

          utilities.click(submitButton);
          this.scope.$apply();

          expect(statusMessageWrapperEl).toBe(null);

          this.deferral.reject();
          this.timeout.flush();

          statusMessageWrapperEl = document.querySelector('.akam-status-message-wrapper');
          expect(statusMessageWrapperEl).not.toBe(null);

          let messageContentEl = document.querySelector('.alert');
          expect(messageContentEl.textContent).not.toBe(null);
        });
      });
    });
  });
  describe('given a modal window', function() {
    describe('when submit button is clicked', function() {
      beforeEach(function() {
        this.deferral = this.q.defer();
        let self = this;

        function Controller($scope) {
          $scope.setOnSubmit(
            function() {
              return self.deferral.promise;
            }
          );
        }
        Controller.$inject = ['$scope'];

        this.modalWindowService.open({
          scope: this.scope,
          template: '<p></p>',
          controller: Controller
        });

        this.scope.$apply();
      });
      it('should disable icons in header', function() {
        let submitButton = document.querySelector(SUBMIT_BUTTON);
        utilities.click(submitButton);

        let closeIcon = document.querySelector('.modal-header i');
        expect(closeIcon.classList.contains('disabled')).toBe(true);
      });
      it('should verify in-progress class when processing', function() {
        let submitButton = document.querySelector(SUBMIT_BUTTON);

        utilities.click(submitButton);
        expect(submitButton.classList.contains('in-progress')).toBe(true);
      });
    });
    describe('when submit button is clicked', function() {
      beforeEach(function() {
        function Controller($scope) {
          $scope.setOnSubmit(
            'hello'
          );
        }
        Controller.$inject = ['$scope'];

        this.modalWindowService.open({
          scope: this.scope,
          template: '<p></p>',
          controller: Controller
        });
        this.scope.$apply();
      });
      it('should handle onSubmit being set to a value', function() {
        let submitButton;
        submitButton = document.querySelector(SUBMIT_BUTTON);

        utilities.click(submitButton);

        $animate.flush();
        this.scope.$digest();
        $animate.flush();
        this.scope.$digest();

        let modalWindow = document.querySelector('.modal');
        expect(modalWindow).toBe(null);
      });
    });
    describe('when cancel button is clicked', function() {
      beforeEach(function() {
        this.modalWindowService.open({
          scope: this.scope,
          template: '<p></p>'
        });

        this.scope.$apply();
      });
      it('should dismiss the modal window', function() {
        let cancelButton = document.querySelector(CANCEL_BUTTON);
        utilities.click(cancelButton);

        $animate.flush();
        this.scope.$digest();
        $animate.flush();
        this.scope.$digest();

        let modalWindow = document.querySelector('.modal');
        expect(modalWindow).toBe(null);
      });
    });
    describe('when close icon is clicked', function() {
      beforeEach(function() {
        this.modalWindowService.open({
          scope: this.scope,
          template: '<p></p>'
        });

        this.scope.$apply();
      });
      it('should dismiss the modal window', function(){
        let closeIcon = document.querySelector('.modal-header i');
        utilities.click(closeIcon);

        $animate.flush();
        this.scope.$digest();
        $animate.flush();
        this.scope.$digest();

        let modalWindow = document.querySelector('.modal');
        expect(modalWindow).toBe(null);
      });
    });
    describe('when label values are not provided', function() {
      beforeEach(function() {
        this.modalWindowService.open({
          scope: this.scope,
          title: '',
          template: '<p></p>'
        });
        this.scope.$apply();
      });
      it('should display default value for title', function() {
        let modalTitle = document.querySelector(MODAL_TITLE);
        expect(modalTitle.textContent).toEqual('Modal Window ');
      });
      it('should display default value for cancel button', function() {
        let cancelButton = document.querySelector(CANCEL_BUTTON);
        expect(cancelButton.textContent).toContain('Cancel ');
      });
      it('should display default value for submit button', function() {
        let submitButton = document.querySelector(SUBMIT_BUTTON);
        expect(submitButton.textContent).toContain('Save ');
      });
    });
    describe('when translation keys are provided', function(){
      beforeEach(function() {
        this.modalWindowService.open({
          scope: this.scope,
          cancelLabel: 'components.modal-window.label.cancel',
          submitLabel: 'components.modal-window.label.save',
          template: '<p></p>'
        });
        this.scope.$apply();
      });
      it('should translate cancel label', function() {
        let cancelButton = document.querySelector(CANCEL_BUTTON);
        expect(cancelButton.textContent).toContain('Cancel ');
      });
      it('should translate submit label', function() {
        let submitButton = document.querySelector(SUBMIT_BUTTON);
        expect(submitButton.textContent).toContain('Save ');
      });
    });

    describe('when submit button is clicked', function() {
      describe('and processing fails', function() {
        describe('and error message is not provided', function() {
          beforeEach(function() {
            this.deferral = this.q.defer();
            let self = this;

            function Controller($scope) {
              $scope.setOnSubmit(
                function() {
                  return self.deferral.promise;
                }
              );
            }
            Controller.$inject = ['$scope'];

            this.modalWindowService.open({
              scope: this.scope,
              template: '<p></p>',
              controller: Controller
            });
            this.scope.$apply();

            let submitButton = document.querySelector(SUBMIT_BUTTON);
            utilities.click(submitButton);

            this.deferral.reject();
            this.timeout.flush();
          });
          it('should render default value for error message', function() {
            let messageContentEl = document.querySelector('.alert');
            expect(messageContentEl.textContent).toContain('Error occurs during last submission. ');
          });
        });
        describe('and error message is provided', function() {
          beforeEach(function() {
            this.deferral = this.q.defer();
            let self = this;

            function Controller($scope) {
              $scope.setOnSubmit(
                function() {
                  return self.deferral.promise;
                }
              );
            }
            Controller.$inject = ['$scope'];

            this.modalWindowService.open({
              scope: this.scope,
              template: '<p></p>',
              errorMessage: 'components.modal-window.errorMessage',
              controller: Controller
            });
            this.scope.$apply();

            let submitButton = document.querySelector(SUBMIT_BUTTON);
            utilities.click(submitButton);

            this.deferral.reject();
            this.timeout.flush();
          });
          it('should translate error message', function() {
            let messageContentEl = document.querySelector('.alert');
            expect(messageContentEl.textContent).toContain('Error occurs during last submission.');
          });
        });
      });
    });
    describe('when submit button is clicked', function() {
      describe('and processes successfully', function() {
        describe('and successMessage is not provided', function() {
          beforeEach(function() {
            this.deferral = this.q.defer();

            function Controller($scope) {
              $scope.setOnSubmit(
                'true'
              );
            }
            Controller.$inject = ['$scope'];

            this.modalWindowService.open({
              scope: this.scope,
              template: '<p></p>',
              controller: Controller
            });
            this.scope.$apply();

            let submitButton = document.querySelector(SUBMIT_BUTTON);
            utilities.click(submitButton);
          });
          it('should render default value for success message', function() {
            let messageContentEl = document.querySelectorAll('.alert');
            expect(messageContentEl[messageContentEl.length - 1].textContent).toContain('Value has been successfully submitted.');
          });
        });
        describe('and successMessage is provided', function() {
          beforeEach(function() {
            this.deferral = this.q.defer();

            function Controller($scope) {
              $scope.setOnSubmit(
                'true'
              );
            }
            Controller.$inject = ['$scope'];

            this.modalWindowService.open({
              scope: this.scope,
              template: '<p></p>',
              successMessage: 'components.modal-window.successMessage',
              controller: Controller
            });
            this.scope.$apply();

            let submitButton = document.querySelector(SUBMIT_BUTTON);
            utilities.click(submitButton);
          });
          it('should translate success message', function() {
            let messageContentEl = document.querySelectorAll('.alert');
            expect(messageContentEl[messageContentEl.length - 1].textContent).toContain('Value has been successfully submitted.');
          });
        });
      });
    });
    describe('when the modal window is dismissed', function() {
      beforeEach(function() {
        spyOn(this.scope, '$destroy');

        this.modalWindowService.open({
          scope: this.scope,
          template: '<p></p>',
          controller: 'Controller'
        });
        this.scope.$apply();

        let closeIcon = document.querySelector('.modal-header i');
        utilities.click(closeIcon);
      });
      it('should destroy the provided scope', function() {
        expect(this.scope.$destroy).toHaveBeenCalled();
      });
    });
    describe('when the modal window is closed', function() {
      beforeEach(function() {
        spyOn(this.scope, '$destroy');

        this.modalWindowService.open({
          scope: this.scope,
          template: '<p></p>',
          controller: 'Controller'
        });
        this.scope.$apply();

        var submitButton = document.querySelector(SUBMIT_BUTTON);
        utilities.click(submitButton);
      });

      it('should destroy the provided scope', function() {
        expect(this.scope.$destroy).toHaveBeenCalled();
      });
    });
  });
  describe('given a modal window', function() {
    describe('when label-values are provided', function(){
      beforeEach(function() {
        this.modalWindowService.open({
          scope: this.scope,
          title: 'components.modal-window.title',
          titleValues: {'name':'- Title'},
          successMessage: 'components.modal-window.successMessage',
          successMessageValues: {'name':'- Success'},
          errorMessage: 'components.modal-window.errorMessage',
          errorMessageValues: {'name':'- Error'},
          cancelLabel: 'components.modal-window.label.cancel',
          cancelLabelValues: {'name': '- Cancel'},
          submitLabel: 'components.modal-window.label.save',
          submitLabelValues: {'name': '- Save'},
          template: '<p></p>'
        });
        this.scope.$apply();
      });
      it('should translate titleValues', function() {
        let label = document.querySelector(MODAL_TITLE);
        expect(label.textContent).toContain('Modal Window - Title');
      });
      it('should translate cancelLabelValues', function() {
        let label = document.querySelector(CANCEL_BUTTON);
        expect(label.textContent).toContain('Cancel - Cancel');
      });
      it('should translate submitLabelValues', function() {
        let label = document.querySelector(SUBMIT_BUTTON);
        expect(label.textContent).toContain('Save - Save');
      });
    });
  });
  describe('given an open model window', function() {
    describe('when label-values are provided', function() {
      describe('and when submitting causes error', function() {
        beforeEach(function() {
          var submitButton,
            statusMessageWrapperEl,
            deferral = this.q.defer();

          function Controller($scope) {
            $scope.setOnSubmit(
              function() {
                return deferral.promise;
              }
            );
          }
          Controller.$inject = ['$scope'];

          this.modalWindowService.open({
            scope: this.scope,
            template: '<p></p>',
            controller: Controller,
            errorMessage: 'components.modal-window.errorMessage',
            errorMessageValues: {'name':'- Error'}
          });
          this.scope.$apply();
          submitButton = document.querySelector(SUBMIT_BUTTON);
          statusMessageWrapperEl = document.querySelector('.akam-status-message-wrapper');

          utilities.click(submitButton);

          expect(statusMessageWrapperEl).toBe(null);
          deferral.reject();
          this.timeout.flush();
        });
        it('should translate errorMessage and errorMessageValues', function() {
          let label = document.querySelector('.alert');
          expect(label.textContent).toContain('Error occurs during last submission. - Error');
        });
      });
    });
  });
  describe('given an open model window', function() {
    describe('when label-values are provided', function() {
      describe('and when submitting successfully', function() {
        beforeEach(function() {
          let submitButton;

          this.modalWindowService.open({
            scope: this.scope,
            template: '<p></p>',
            successMessage: 'components.modal-window.successMessage',
            successMessageValues: {'name':'- Success'}
          });
          this.scope.$apply();

          submitButton = document.querySelector(SUBMIT_BUTTON);
          utilities.click(submitButton);
        });
        it('should translate successMessage and successMessageValues', function() {
          let messageContentEl = document.querySelectorAll('.alert');
          expect(messageContentEl[messageContentEl.length - 1].textContent).toContain('Value has been successfully submitted. - Success');
        });
      });
    });
  });

  describe('given an open modal window with content scope', function() {
    describe('when the modal is dismissed', function () {
      beforeEach(function() {
        spyOn(this.scope, '$destroy');

        this.modalWindowService.open({
          scope: this.scope,
          template: '<p></p>',
          controller: 'Controller'
        });
        this.scope.$apply();

        let closeIcon = document.querySelector('.modal-header i');
        utilities.click(closeIcon);
      });

      it('should destroy the provided scope', function() {
        expect(this.scope.$destroy).toHaveBeenCalled();
      });
    });

    describe('when the modal is initialized with a resolve object', function() {
      beforeEach(function() {

        this.modalWindowService.open({
          scope: this.scope,
          template: '<p>{{test.local}}</p>',
          controller: 'ControllerResolve',
          controllerAs: 'test',
          resolve: {injectedLocal: 'bar'}
        });
        this.scope.$apply();
      });

      it('should use inject the resolve object properties into the controller', function() {
        expect(document.querySelector('.modal-body p').textContent).toBe('bar');
      });
    });
  });
});

