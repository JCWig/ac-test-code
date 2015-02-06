'use strict';

function click(el) {
    var ev = document.createEvent('MouseEvent');
    ev.initMouseEvent('click', true);
    el.dispatchEvent(ev);
}

describe('messageBox service', function() {
    beforeEach(function() {
        var self = this;

        angular.mock.module(require('../../src/message-box').name);
        inject(function(messageBox, $rootScope, $timeout) {
            self.messageBox = messageBox;
            self.$rootScope = $rootScope;
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
            it('should toggle the visibility of the content', function() {
                var trigger;
                var el;

                this.messageBox._show({
                    headline: 'Headline',
                    text: 'Message',
                    details: 'Details'
                });
                this.$rootScope.$digest();

                el = document.querySelector('.message-box-details > div');
                trigger = document.querySelector('.message-box-details > span');

                expect(angular.element(el).css('height')).to.equal('0px');
                click(trigger);
                this.$timeout.flush();
                expect(angular.element(el).css('height')).to.not.equal('0px');
            });
        });

        context('when submit button is clicked', function() {
            it('should close the message box', function() {
                var spy = sinon.spy();
                var box = this.messageBox._show({
                    headline: 'Headline',
                    text: 'Message',
                    details: 'Details'
                });
                var button;

                box.result.then(spy);
                this.$rootScope.$digest();

                button = document.querySelector('.modal-footer button:last-child');
                click(button);
                this.$rootScope.$digest();

                expect(spy).to.have.been.called;
            });
        });
    });

    describe('showInfo()', function() {
        it('should use the information icon', function() {
            var spy = sinon.spy();

            this.messageBox._show = spy;
            this.messageBox.showInfo();
            expect(spy).to.have.been.called;
            expect(spy.args[0][0].icon).to.equal('svg-information');
        });

        it('should use the information modifier class on the modal', function() {
            var spy = sinon.spy();

            this.messageBox._show = spy;
            this.messageBox.showInfo();
            expect(spy).to.have.been.called;
            expect(spy.args[0][0].windowClass).to.equal('information akam-message-box');
        });
    });

    describe('showQuestion()', function() {
        it('should use the question icon', function() {
            var spy = sinon.spy();

            this.messageBox._show = spy;
            this.messageBox.showQuestion();
            expect(spy).to.have.been.called;
            expect(spy.args[0][0].icon).to.equal('svg-question');
        });

        it('should use the information modifier class on the modal', function() {
            var spy = sinon.spy();

            this.messageBox._show = spy;
            this.messageBox.showQuestion();
            expect(spy).to.have.been.called;
            expect(spy.args[0][0].windowClass).to.equal('question akam-message-box');
        });
    });

    describe('showError()', function() {
        it('should use the error icon', function() {
            var spy = sinon.spy();

            this.messageBox._show = spy;
            this.messageBox.showError();
            expect(spy).to.have.been.called;
            expect(spy.args[0][0].icon).to.equal('svg-error');
        });

        it('should use the error modifier class on the modal', function() {
            var spy = sinon.spy();

            this.messageBox._show = spy;
            this.messageBox.showError();
            expect(spy).to.have.been.called;
            expect(spy.args[0][0].windowClass).to.equal('error akam-message-box');
        });
    });
});
