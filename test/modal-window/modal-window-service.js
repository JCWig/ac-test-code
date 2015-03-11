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
            "title": "Modal Window"
        }
    }
};
//i18n paths
var LIBRARY_PATH = '/libs/akamai-components/0.0.1/locales/en_US.json';
var CONFIG_PATH = '/apps/appName/locales/en_US.json';
var enUsMessagesResponse = require("../i18n/i18n_responses/messages_en_US.json");
var enUsResponse = require ("../i18n/i18n_responses/en_US.json");

var CANCEL_BUTTON = '.modal-footer button:first-child'
var SUBMIT_BUTTON = '.modal-footer button:last-child'
var MODAL_BODY = '.modal-body';
var MODAL_TITLE = '.modal .modal-title'
describe('modalWindow service', function() {
    var self = null;
    beforeEach(function() {
        var self = this;
        self.notify = function(){};
        spyOn(self,"notify");

        angular.mock.module(require('../../src/modal-window').name);
        angular.mock.module(function($translateProvider) {            
            $translateProvider.useLoader('i18nCustomLoader');
        });
        angular.mock.module(function ($controllerProvider) {
            $controllerProvider.register('Controller', function($scope) {
            });
        });

        inject(function(modalWindow, $rootScope, $httpBackend, $timeout) {
            self.scope = $rootScope.$new();
            self.modalWindowService = modalWindow;
            self.httpBackend = $httpBackend;
            self.timeout = $timeout;
        });
        self.httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
        self.httpBackend.when('GET', CONFIG_PATH).respond(enUsResponse);
        self.httpBackend.flush();
    });

    afterEach(function() {
        var modal = document.querySelector('.modal');
        var backdrop = document.querySelector('.modal-backdrop');

        if (modal) {
            modal.parentNode.removeChild(modal);
        }
        if (backdrop) {
            backdrop.parentNode.removeChild(backdrop);
        }
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
            this.scope.$digest();

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
            this.scope.$digest();

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
            this.scope.$digest();

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
            this.scope.$digest();

            var submitButton = document.querySelector(SUBMIT_BUTTON);
            expect(submitButton.textContent).toMatch(new RegExp(label));
        });

        it('should support an inline template option', function() {
            this.scope.name = 'Akamai';
            this.modalWindowService.open({
                scope: this.scope,
                template: '<span>{{ name }}</span>'
            });
            this.scope.$digest();

            var modalBody = document.querySelector(MODAL_BODY);
            expect(modalBody.textContent).toEqual(scope.name);
        });

        it('should support a template url option', function() {
            var url = 'modal-window/template.html';
            var template = '<span>{{ name }}</span>';
            var scope = this.$rootScope.$new();

            this.scope.name = 'Akamai';
            httpBackend.whenGET(url).respond(template);
            this.modalWindowService.open({
                scope: this.scope,
                templateUrl: url
            });
            this.httpBackend.flush();

            var modalBody = document.querySelector(MODAL_BODY);
            expect(modalBody.textContent).toEqual(scope.name);
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should support a hide submit button option', function() {
            this.modalWindowService.open({
                scope: this.scope,
                hideSubmit: true,
                template: '<p></p>'
            });
            this.scope.$digest();

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
            this.scope.$digest();
            toggleSubmitButton = document.querySelector('.toggle');
            submitButton = document.querySelector(SUBMIT_BUTTON);

            utilities.click(toggleSubmitButton);
            this.scope.$digest();
            expect(submitButton.disabled).toBe(true);

            utilities.click(toggleSubmitButton);
            this.scope.$digest();
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
                this.scope.$digest();
                submitButton = document.querySelector(SUBMIT_BUTTON);

                utilities.click(submitButton);
                this.scope.$digest();
                expect(this.notify).toHaveBeenCalled();
            });
        });

        describe('when a user clicks the cancel button', function() {
            it('should dismiss the modal window', function() {
                var instance = this.modalWindowService.open({
                    scope: this.scope,
                    template: '<p></p>'
                });
                var cancelButton;

                this.scope.$digest();
                cancelButton = document.querySelector(CANCEL_BUTTON);
                utilities.click(cancelButton);
                this.scope.$digest();
                this.timeout.flush();
                var modalWindow = document.querySelector('.modal');

                expect(modalWindow).toBe(null);
            });
        });

        describe('when a user clicks the close icon', function() {
            it('should dismiss the modal window', function() {
                var instance = this.modalWindowService.open({
                    scope: this.scope,
                    template: '<p></p>'
                });
                var closeIcon;

                this.scope.$digest();
                closeIcon = document.querySelector('.modal-header i');
                utilities.click(closeIcon);
                this.scope.$digest();
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

                this.modalWindowServiceopen({
                    scope: this.scope,
                    title: "",
                    template: '<p></p>'
                });
                this.scope.$digest();

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
                this.scope.$digest();


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
                this.scope.$digest();

                submitButton = document.querySelector(SUBMIT_BUTTON);
                expect(submitButton.textContent).toContain(submitLabel);
            });
        });
    });
});
