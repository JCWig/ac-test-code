'use strict';

var _ = require('lodash');

describe('modalWindow service', function() {
    beforeEach(function() {
        var self = this;

        angular.mock.module(require('../../src/modal-window').name);
        inject(function(modalWindow, $rootScope) {
            self.modalWindow = modalWindow;
            self.$rootScope = $rootScope;
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

        it('should support an icon option');

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
        });
        
        it('should support toggling the submit button disabled state');

        context('when a user clicks the submit button', function() {
            it('should notify the modal window to return a result');
        });

        context('when a user clicks the cancel button', function() {
            it('should dismiss the modal window');
        });

        context('when a user clicks the close icon', function() {
            it('should dismiss the modal window');
        });

        context('when a user hits escape', function() {
            it('should dismiss the modal window');
        });
    });
});
