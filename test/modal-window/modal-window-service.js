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
var CANCEL_BUTTON = '.modal-footer button:first-child'
var SUBMIT_BUTTON = '.modal-footer button:last-child'
var MODAL_BODY = '.modal-body';
var MODAL_TITLE = '.modal .modal-title'
describe('modalWindow service', function() {
    beforeEach(function() {
        var self = this;

        self.notify = sinon.spy();

        angular.mock.module(require('../../src/modal-window').name);
        angular.mock.module(function($provide, $translateProvider) {
            $provide.factory('i18nCustomLoader', function($q, $timeout) {
                return function(options) {
                    var deferred = $q.defer();
                    $timeout(function() {
                        deferred.resolve(translationMock);
                    });
                    return deferred.promise;
                };
            });
            $translateProvider.useLoader('i18nCustomLoader');
        });
        angular.mock.module(function($controllerProvider) {
            $controllerProvider.register('Controller', function($scope) {
                $scope.submitted.then(self.notify);
                $scope.toggle = function() {
                    if ($scope.isSubmitDisabled()) {
                        $scope.enableSubmit();
                    } else {
                        $scope.disableSubmit();
                    }
                };
            });
        });

        inject(function(modalWindow, $rootScope, $httpBackend, $timeout) {
            self.modalWindow = modalWindow;
            self.$rootScope = $rootScope;
            self.$httpBackend = $httpBackend;
            self.$timeout = $timeout;
        });
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
        context('when no template option is provided', function() {
            it('should throw an error', function() {
                var openFunction = _.partial(this.modalWindow.open, {});
                expect(openFunction).to.throw(Error);
            });
        });

        it('should support a title option', function() {
            var title = 'Hello Akamai';

            this.modalWindow.open({
                title: title,
                template: '<p></p>'
            });
            this.$rootScope.$digest();

            var modalTitle = document.querySelector(MODAL_TITLE);
            expect(modalTitle.textContent).to.equal(title);
        });

        it('should support a private icon option', function() {
            var icon = 'svg-information';

            this.modalWindow.open({
                icon: icon,
                template: '<p></p>'
            });
            this.$rootScope.$digest();

            var modalPrivateIcon = document.querySelector('.modal-header i:first-child');
            expect(modalPrivateIcon.classList.contains(icon)).to.be.true;
        });

        it('should support a cancel label option', function() {
            var label = 'Close';

            this.modalWindow.open({
                cancelLabel: label,
                template: '<p></p>'
            });
            this.$rootScope.$digest();

            var cancelButton = document.querySelector(CANCEL_BUTTON);
            expect(cancelButton.textContent).to.match(new RegExp(label));
        });

        it('should support a submit label option', function() {
            var label = 'Submit';

            this.modalWindow.open({
                submitLabel: label,
                template: '<p></p>'
            });
            this.$rootScope.$digest();

            var submitButton = document.querySelector(SUBMIT_BUTTON);
            expect(submitButton.textContent).to.match(new RegExp(label));
        });

        it('should support an inline template option', function() {
            var scope = this.$rootScope.$new();

            scope.name = 'Akamai';
            this.modalWindow.open({
                scope: scope,
                template: '<span>{{ name }}</span>'
            });
            this.$rootScope.$digest();

            var modalBody = document.querySelector(MODAL_BODY);
            expect(modalBody.textContent).to.equal(scope.name);
        });

        it('should support a template url option', function() {
            var url = 'modal-window/template.html';
            var template = '<span>{{ name }}</span>';
            var scope = this.$rootScope.$new();

            scope.name = 'Akamai';
            this.$httpBackend.whenGET(url).respond(template);
            this.modalWindow.open({
                scope: scope,
                templateUrl: url
            });
            this.$httpBackend.flush();

            var modalBody = document.querySelector(MODAL_BODY);
            expect(modalBody.textContent).to.equal(scope.name);
            this.$httpBackend.verifyNoOutstandingRequest();
        });

        it('should support a hide submit button option', function() {
            this.modalWindow.open({
                hideSubmit: true,
                template: '<p></p>'
            });
            this.$rootScope.$digest();

            var allModalButtonsInFooter = document.querySelectorAll('.modal-footer button');
            expect(allModalButtonsInFooter).to.have.length(1);
        });

        it('should support toggling the submit button disabled state', function() {
            var template = '<button class="toggle" ng-click="toggle()"></button>';
            var toggleSubmitButton;
            var submitButton;

            this.modalWindow.open({
                template: template,
                controller: 'Controller'
            });
            this.$rootScope.$digest();
            toggleSubmitButton = document.querySelector('.toggle');
            submitButton = document.querySelector(SUBMIT_BUTTON);

            utilities.click(toggleSubmitButton);
            this.$rootScope.$digest();
            expect(submitButton.disabled).to.be.true;

            utilities.click(toggleSubmitButton);
            this.$rootScope.$digest();
            expect(submitButton.disabled).to.be.false;
        });

        context('when a user clicks the submit button', function() {
            it('should notify the modal window to return a result', function() {
                var submitButton;

                this.modalWindow.open({
                    template: '<p></p>',
                    controller: 'Controller'
                });
                this.$rootScope.$digest();
                submitButton = document.querySelector(SUBMIT_BUTTON);

                utilities.click(submitButton);
                this.$rootScope.$digest();
                expect(this.notify).to.have.been.called;
            });
        });

        context('when a user clicks the cancel button', function() {
            it('should dismiss the modal window', function() {
                var instance = this.modalWindow.open({
                    template: '<p></p>'
                });
                var cancelButton;

                this.$rootScope.$digest();
                cancelButton = document.querySelector(CANCEL_BUTTON);
                utilities.click(cancelButton);
                this.$rootScope.$digest();
                this.$timeout.flush();
                var modalWindow = document.querySelector('.modal');

                expect(modalWindow).to.be.null;
            });
        });

        context('when a user clicks the close icon', function() {
            it('should dismiss the modal window', function() {
                var instance = this.modalWindow.open({
                    template: '<p></p>'
                });
                var closeIcon;

                this.$rootScope.$digest();
                closeIcon = document.querySelector('.modal-header i');
                utilities.click(closeIcon);
                this.$rootScope.$digest();
                this.$timeout.flush();
                var modalWindow = document.querySelector('.modal');

                expect(modalWindow).to.be.null;
            });
        });

        context('when missing static label values', function() {
            it('should display translated default title text', function() {
                var title = 'Modal Window';
                var modalTitle;

                this.$timeout.flush();

                this.modalWindow.open({
                    title: "",
                    template: '<p></p>'
                });
                this.$rootScope.$digest();

                modalTitle = document.querySelector(MODAL_TITLE);
                expect(modalTitle.textContent).to.eql(title);
            });

            it('should display translated default cancel button text', function() {
                var cancelLabel = 'Cancel';
                var cancelButton;

                this.$timeout.flush();

                this.modalWindow.open({
                    cancelLabel: "",
                    template: '<p></p>'
                });
                this.$rootScope.$digest();


                cancelButton = document.querySelector(CANCEL_BUTTON);
                expect(cancelButton.textContent).to.contain(cancelLabel);
            });

            it('should display translated default submit button text', function() {
                var submitLabel = 'Save';
                var submitButton;

                this.$timeout.flush();

                this.modalWindow.open({
                    submitLabel: "",
                    template: '<p></p>'
                });
                this.$rootScope.$digest();

                submitButton = document.querySelector(SUBMIT_BUTTON);
                expect(submitButton.textContent).to.contain(submitLabel);
            });
        });
    });
});
