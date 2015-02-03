'use strict';

describe('messageBox service', function() {
    beforeEach(function() {
        var self = this;

        angular.mock.module(require('../../src/message-box').name);
        inject(function(messageBox, $rootScope) {
            self.messageBox = messageBox;
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

    describe('_show()', function() {
        context('when no headline option is provided', function() {
            it('should throw an error', function() {
                var opts = { text: 'Some text' };
                var fn = angular.bind(this.messageBox, this.messageBox._show, opts);
                expect(fn).to.throw(Error);
            });
        });

        context('when no text option is provided', function() {
            it('should throw an error', function() {
                var opts = { headline: 'Some text' };
                var fn = angular.bind(this.messageBox, this.messageBox._show, opts);
                expect(fn).to.throw(Error);
            });
        });

        it('should support a headline option', function() {
            var headline = 'Headline';
            var el;

            this.messageBox._show({ headline: headline, text: 'Message' });
            this.$rootScope.$digest();

            el = document.querySelector('.modal .message-box-headline');
            expect(el.textContent).to.equal(headline);
        });

        it('should support a text option', function() {
            var text = 'Message';
            var el;

            this.messageBox._show({ headline: 'Headline', text: text });
            this.$rootScope.$digest();

            el = document.querySelector('.modal .message-box-text');
            expect(el.textContent).to.equal(text);
        });

        it('should support a details option', function() {
            var details = 'Message details';
            var el;

            this.messageBox._show({
                headline: 'Headline',
                text: 'Message',
                details: details
            });
            this.$rootScope.$digest();

            el = document.querySelector('.modal .message-box-details > div');
            expect(el.textContent).to.match(new RegExp(details));
        });

        context('when view details is clicked', function() {
            it('should toggle the visibility of the content');
        })
    });

    describe('showInfo()', function() {
        it('should use the information icon');
        it('should use the information modifier class on the modal');
    });

    describe('showQuestion()', function() {
        it('should use the question icon');
        it('should use the information modifier class on the modal');
    });

    describe('showError()', function() {
        it('should use the error icon');
        it('should use the error modifier class on the modal');
    });
});
