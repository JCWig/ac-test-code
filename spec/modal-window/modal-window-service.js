'use strict';
var _ = require('lodash');

var utilities = require('../utilities');
var translationMock = {
  "components": {
    "modal-window": {
      "label": {
        "cancel": "Cancel",
        "save": "Save"
      },
      "title": "Modal Window",
      "successMessage": "Value has been successfully submitted.",
      "errorMessage": "Error occurs during last submission."
    }
  }
};
//i18n paths
var LIBRARY_PATH = /\/libs\/akamai-core\/[0-9]*.[0-9]*.[0-9]*\/locales\/en_US.json/;
var CONFIG_PATH = '/apps/appname/locales/en_US.json';
var enUsMessagesResponse = require("../i18n/i18n_responses/messages_en_US.json");
var enUsResponse = require("../i18n/i18n_responses/en_US.json");

var CANCEL_BUTTON = '.modal-footer button:first-child';
var SUBMIT_BUTTON = '.modal-footer button:last-child';
var MODAL_BODY = '.modal-body';
var MODAL_TITLE = '.modal .modal-title';
describe('modalWindow service', function() {
  var self = null;
  beforeEach(function() {
    inject.strictDi(true);
    self = this;
    self.notify = function() {};
    spyOn(self, "notify");

    angular.mock.module(require('../../src/modal-window').name);
    angular.mock.module(function($translateProvider) {
      $translateProvider.useLoader('i18nCustomLoader');
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
    });

    inject(function(modalWindow, $rootScope, $httpBackend, $timeout, $q) {
      self.scope = $rootScope.$new();
      self.modalWindowService = modalWindow;
      self.httpBackend = $httpBackend;
      self.timeout = $timeout;
      self.q = $q;
    });
    self.httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
    self.httpBackend.when('GET', CONFIG_PATH).respond(enUsResponse);
    self.httpBackend.flush();
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

  describe("given a modal window", function(){
    describe("when showFullscreenToggle option is set to true", function(){
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
        expect(this.result != null).toBe(true);
      });

      it('should confirm the max min icon icon shows full screen', function() {
        expect(this.result.classList.contains('pulsar-fullscreen')).toBe(true);
      });
    })
  });

  describe("given a modal window", function(){
    describe("when showFullscreenToggle option is set to false", function(){
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
        expect(this.result == null).toBe(true);
      });
    })
  });

  describe('open()', function() {
    describe('when no template option is provided', function() {
      it('should throw an error', function() {
        var openFunction = _.partial(this.modalWindowService.open, {});
        expect(openFunction).toThrowError();
      });
    });

    it('should support a title option', function() {
      var title = 'Hello Akamai';

      this.modalWindowService.open({
        scope: this.scope,
        title: title,
        template: '<p></p>'
      });
      this.scope.$apply();

      var modalTitle = document.querySelector(MODAL_TITLE);
      expect(modalTitle.textContent).toEqual(title);
    });

    it('should support a private icon option', function() {
      var icon = 'svg-information';

      this.modalWindowService.open({
        scope: this.scope,
        icon: icon,
        template: '<p></p>'
      });
      this.scope.$apply();

      var modalPrivateIcon = document.querySelector('.modal-header i:first-child');
      expect(modalPrivateIcon.classList.contains(icon)).toBe(true);
    });

    it('should support a cancel label option', function() {
      var label = 'Close';

      this.modalWindowService.open({
        scope: this.scope,
        cancelLabel: label,
        template: '<p></p>'
      });
      this.scope.$apply();

      var cancelButton = document.querySelector(CANCEL_BUTTON);
      expect(cancelButton.textContent).toMatch(new RegExp(label));
    });

    it('should support a submit label option', function() {
      var label = 'Submit';

      this.modalWindowService.open({
        scope: this.scope,
        submitLabel: label,
        template: '<p></p>'
      });
      this.scope.$apply();

      var submitButton = document.querySelector(SUBMIT_BUTTON);
      expect(submitButton.textContent).toMatch(new RegExp(label));
    });

    it('should support an inline template option', function() {
      this.scope.name = 'Akamai';
      this.modalWindowService.open({
        scope: this.scope,
        template: '<span>{{ name }}</span>'
      });
      this.scope.$apply();

      var modalBody = document.querySelector(MODAL_BODY);
      expect(modalBody.textContent.trim()).toEqual(this.scope.name);
    });

    it('should support a template url option', function() {
      var url = 'modal-window/template.html';
      var template = '<span>{{ name }}</span>';

      this.scope.name = 'Akamai';
      this.httpBackend.whenGET(url).respond(template);
      this.modalWindowService.open({
        scope: this.scope,
        templateUrl: url
      });
      this.httpBackend.flush();

      var modalBody = document.querySelector(MODAL_BODY);
      expect(modalBody.textContent.trim()).toEqual(this.scope.name);
      this.httpBackend.verifyNoOutstandingRequest();
    });

    it('should support a hide submit button option', function() {
      this.modalWindowService.open({
        scope: this.scope,
        hideSubmit: true,
        template: '<p></p>'
      });
      this.scope.$apply();

      var allModalButtonsInFooter = document.querySelectorAll('.modal-footer button');
      expect(allModalButtonsInFooter.length).toEqual(1);
    });

    it('should support toggling the submit button disabled state', function() {
      var template = '<button class="toggle" ng-click="toggle()"></button>';
      var toggleSubmitButton;
      var submitButton;

      this.modalWindowService.open({
        scope: this.scope,
        template: template,
        controller: 'Controller'
      });
      this.scope.$apply();
      toggleSubmitButton = document.querySelector('button.toggle');
      submitButton = document.querySelector(SUBMIT_BUTTON);

      utilities.click(toggleSubmitButton);
      this.scope.$apply();
      expect(submitButton.disabled).toBe(true);

      utilities.click(toggleSubmitButton);
      this.scope.$apply();
      expect(submitButton.disabled).toBe(false);
    });

    describe('when a user clicks the submit button', function() {
      it('should notify the modal window to return a result', function() {
        var submitButton;

        this.modalWindowService.open({
          scope: this.scope,
          template: '<p></p>',
          controller: 'Controller'
        });
        this.scope.$apply();
        submitButton = document.querySelector(SUBMIT_BUTTON);

        utilities.click(submitButton);
        this.scope.$apply();
        expect(this.notify).toHaveBeenCalled();
      });

      it('should handle processing scenario with rejected promise (reset submit)', function() {
        var submitButton;
        var deferral = this.q.defer();

        function Controller($scope, $q) {
          $scope.setOnSubmit(
            function() {
              return deferral.promise;
            }
          );
        }
        Controller.$inject = ['$scope', '$q'];

        this.modalWindowService.open({
          scope: this.scope,
          template: '<p></p>',
          controller: Controller
        });
        this.scope.$apply();
        submitButton = document.querySelector(SUBMIT_BUTTON);

        utilities.click(submitButton);
        this.scope.$apply();
        //ensure the submit button is disabled while processing
        expect(submitButton.getAttribute('disabled')).not.toBeNull();
        deferral.reject();
        this.timeout.flush();
        this.scope.$apply();
        submitButton = document.querySelector(SUBMIT_BUTTON);
        expect(submitButton.getAttribute('disabled')).toBeNull();
      });

      it('should verify error class added in modal-header node with rejected promise', function() {
        var submitButton,
          modalHeaderEl,
          deferral = this.q.defer();

        function Controller($scope, $q) {
          $scope.setOnSubmit(
            function() {
              return deferral.promise;
            }
          );
        }
        Controller.$inject = ['$scope', '$q'];

        this.modalWindowService.open({
          scope: this.scope,
          template: '<p></p>',
          controller: Controller
        });
        this.scope.$apply();
        submitButton = document.querySelector(SUBMIT_BUTTON);
        modalHeaderEl = angular.element(document.querySelector(".modal-header"));

        utilities.click(submitButton);
        this.scope.$apply();
        expect(modalHeaderEl.hasClass('error')).toBe(false);
        deferral.reject();
        this.timeout.flush();
        this.scope.$apply();
        expect(modalHeaderEl.hasClass('error')).toBe(true);
      });

      it('should verify akam-status-message-wrapper class added node with rejected promise', function() {
        var submitButton,
          statusMessageWrapperEl,
          deferral = this.q.defer();

        function Controller($scope, $q) {
          $scope.setOnSubmit(
            function() {
              return deferral.promise;
            }
          );
        }
        Controller.$inject = ['$scope', '$q'];

        this.modalWindowService.open({
          scope: this.scope,
          template: '<p></p>',
          controller: Controller
        });
        this.scope.$apply();
        submitButton = document.querySelector(SUBMIT_BUTTON);
        statusMessageWrapperEl = document.querySelector(".akam-status-message-wrapper");

        utilities.click(submitButton);
        this.scope.$apply();
        expect(statusMessageWrapperEl).toBe(null);
        deferral.reject();
        this.timeout.flush();
        this.scope.$apply();
        statusMessageWrapperEl = document.querySelector(".akam-status-message-wrapper");
        expect(statusMessageWrapperEl).not.toBe(null);
        var messageContentEl = document.querySelector(".status-message-content");
        expect(messageContentEl.textContent).not.toBe(null);
      });

      it('should not display close X when processing', function() {
        var submitButton;
        var deferral = this.q.defer();

        function Controller($scope, $q) {
          $scope.setOnSubmit(
            function() {
              return deferral.promise;
            }
          );
        }
        Controller.$inject = ['$scope', '$q'];

        this.modalWindowService.open({
          scope: this.scope,
          template: '<p></p>',
          controller: Controller
        });

        this.scope.$apply();
        submitButton = document.querySelector(SUBMIT_BUTTON);

        utilities.click(submitButton);
        this.scope.$apply();

        var closeIcon = document.querySelector('.modal-header i');
        expect(closeIcon).toBe(null);
      });

      it('should verify in-progress class when processing', function() {
        var submitButton;
        var deferral = this.q.defer();

        function Controller($scope, $q) {
          $scope.setOnSubmit(
            function() {
              return deferral.promise;
            }
          );
        }
        Controller.$inject = ['$scope', '$q'];

        this.modalWindowService.open({
          scope: this.scope,
          template: '<p></p>',
          controller: Controller
        });

        this.scope.$apply();
        submitButton = document.querySelector(SUBMIT_BUTTON);

        utilities.click(submitButton);
        this.scope.$apply();
        expect(submitButton.classList.contains('in-progress')).toBe(true);
      });

      it('should handle onSubmit being set to a value', function() {
        var submitButton;

        function Controller($scope, $q) {
          $scope.setOnSubmit(
            'hello'
          );
        }
        Controller.$inject = ['$scope', '$q'];

        this.modalWindowService.open({
          scope: this.scope,
          template: '<p></p>',
          controller: Controller
        });
        this.scope.$apply();
        submitButton = document.querySelector(SUBMIT_BUTTON);

        utilities.click(submitButton);
        this.scope.$apply();
        this.timeout.flush();
        var modalWindow = document.querySelector('.modal');

        expect(modalWindow).toBe(null);
      });

    });

    describe('when a user clicks the cancel button', function() {
      it('should dismiss the modal window', function() {
        this.modalWindowService.open({
          scope: this.scope,
          template: '<p></p>'
        });
        var cancelButton;

        this.scope.$apply();
        cancelButton = document.querySelector(CANCEL_BUTTON);
        utilities.click(cancelButton);
        this.scope.$apply();
        this.timeout.flush();
        var modalWindow = document.querySelector('.modal');

        expect(modalWindow).toBe(null);
      });
    });

    describe('when a user clicks the close icon', function() {
      it('should dismiss the modal window', function() {
        this.modalWindowService.open({
          scope: this.scope,
          template: '<p></p>'
        });
        var closeIcon;

        this.scope.$apply();
        closeIcon = document.querySelector('.modal-header i');
        utilities.click(closeIcon);
        this.scope.$apply();
        this.timeout.flush();
        var modalWindow = document.querySelector('.modal');

        expect(modalWindow).toBe(null);
      });
    });

    describe('when missing static label values', function() {
      it('should display translated default title text', function() {
        var title = 'Modal Window';
        var modalTitle;

        this.timeout.flush();

        this.modalWindowService.open({
          scope: this.scope,
          title: "",
          template: '<p></p>'
        });
        this.scope.$apply();

        modalTitle = document.querySelector(MODAL_TITLE);
        expect(modalTitle.textContent).toEqual(title);
      });

      it('should display translated default cancel button text', function() {
        var cancelLabel = 'Cancel';
        var cancelButton;

        this.timeout.flush();

        this.modalWindowService.open({
          scope: this.scope,
          cancelLabel: "",
          template: '<p></p>'
        });
        this.scope.$apply();

        cancelButton = document.querySelector(CANCEL_BUTTON);
        expect(cancelButton.textContent).toContain(cancelLabel);
      });

      it('should display translated default submit button text', function() {
        var submitLabel = 'Save';
        var submitButton;

        this.timeout.flush();

        this.modalWindowService.open({
          scope: this.scope,
          submitLabel: "",
          template: '<p></p>'
        });
        this.scope.$apply();

        submitButton = document.querySelector(SUBMIT_BUTTON);
        expect(submitButton.textContent).toContain(submitLabel);
      });
    });

    describe('given an open modal window with content scope', function(){
      describe('when the modal is closed', function(){
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
    });

  });
});
