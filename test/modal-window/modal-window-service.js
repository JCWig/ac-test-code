'use strict';

var _ = require('lodash');
var utilities = require('../utilities');
describe('modalWindow service', function() {
    beforeEach(function() {
        var self = this;

        self.notify = sinon.spy();

        angular.mock.module(require('../../src/modal-window').name);
        angular.mock.module(function ($controllerProvider) {
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
                var fn = _.partial(this.modalWindow.open, {});
                expect(fn).to.throw(Error);
            });
        });

        it('should support a title option', function() {
            var title = 'Hello Akamai';
            var el;

            this.modalWindow.open({ title: title, template: '<p></p>' });
            this.$rootScope.$digest();

            el = document.querySelector('.modal .modal-title');
            expect(el.textContent).to.equal(title);
        });

        it('should support a private icon option', function() {
            var icon = 'svg-information';
            var el;

            this.modalWindow.open({ icon: icon, template: '<p></p>' });
            this.$rootScope.$digest();

            el = document.querySelector('.modal-header i:first-child');
            expect(el.classList.contains(icon)).to.be.true;
        });

        it('should support a cancel label option', function() {
            var label = 'Close';
            var el;

            this.modalWindow.open({ cancelLabel: label, template: '<p></p>' });
            this.$rootScope.$digest();

            el = document.querySelector('.modal-footer button:first-child');
            expect(el.textContent).to.match(new RegExp(label));
        });

        it('should support a submit label option', function() {
            var label = 'Submit';
            var el;

            this.modalWindow.open({ submitLabel: label, template: '<p></p>' });
            this.$rootScope.$digest();

            el = document.querySelector('.modal-footer button:last-child');
            expect(el.textContent).to.match(new RegExp(label));
        });

        it('should support an inline template option', function() {
            var scope = this.$rootScope.$new();
            var el;

            scope.name = 'Akamai';
            this.modalWindow.open({
                scope: scope,
                template: '<span>{{ name }}</span>'
            });
            this.$rootScope.$digest();

            el = document.querySelector('.modal-body');
            expect(el.textContent).to.equal(scope.name);
        });

        it('should support a template url option', function() {
            var url = 'modal-window/template.html';
            var template = '<span>{{ name }}</span>';
            var scope = this.$rootScope.$new();
            var el;

            scope.name = 'Akamai';
            this.$httpBackend.whenGET(url).respond(template);
            this.modalWindow.open({
                scope: scope,
                templateUrl: url
            });
            this.$httpBackend.flush();

            el = document.querySelector('.modal-body');
            expect(el.textContent).to.equal(scope.name);
            this.$httpBackend.verifyNoOutstandingRequest();
        });

        it('should support a hide submit button option', function() {
            var el;

            this.modalWindow.open({ hideSubmit: true, template: '<p></p>' });
            this.$rootScope.$digest();

            el = document.querySelectorAll('.modal-footer button');
            expect(el).to.have.length(1);
        });
        
        it('should support toggling the submit button disabled state', function() {
            var template = '<button class="toggle" ng-click="toggle()"></button>';
            var toggle;
            var button;

            this.modalWindow.open({ template: template, controller: 'Controller' });
            this.$rootScope.$digest();
            toggle = document.querySelector('.toggle');
            button = document.querySelector('.modal-footer button:last-child');

            utilities.click(toggle);
            this.$rootScope.$digest();
            expect(button.disabled).to.be.true;

            utilities.click(toggle);
            this.$rootScope.$digest();
            expect(button.disabled).to.be.false;
        });

        context('when a user clicks the submit button', function() {
            it('should notify the modal window to return a result', function() {
                var button;

                this.modalWindow.open({
                    template:  '<p></p>',
                    controller: 'Controller'
                });
                this.$rootScope.$digest();
                button = document.querySelector('.modal-footer button:last-child');

                utilities.click(button);
                this.$rootScope.$digest();
                expect(this.notify).to.have.been.called;
            });
        });

        context('when a user clicks the cancel button', function() {
            it('should dismiss the modal window', function() {
                var instance = this.modalWindow.open({ template: '<p></p>' });
                var button;

                this.$rootScope.$digest();
                button = document.querySelector('.modal-footer button:first-child');
                utilities.click(button);
                this.$rootScope.$digest();
                this.$timeout.flush();

                expect(document.querySelector('.modal')).to.be.null;
            });
        });

        context('when a user clicks the close icon', function() {
            it('should dismiss the modal window', function() {
                var instance = this.modalWindow.open({ template: '<p></p>' });
                var icon;

                this.$rootScope.$digest();
                icon = document.querySelector('.modal-header i');
                utilities.click(icon);
                this.$rootScope.$digest();
                this.$timeout.flush();

                expect(document.querySelector('.modal')).to.be.null;
            });
        });
    });
});
