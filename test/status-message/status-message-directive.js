'use strict';


function click(el) {
    var ev = document.createEvent('MouseEvent');
    ev.initMouseEvent('click', true);
    el.dispatchEvent(ev);
};

describe('akamai.components.status-message', function() {
    describe('status messages', function(){
        beforeEach(function() {
            var self = this;

            angular.mock.module(require('../../src/status-message').name);
            inject(function($compile, $rootScope, $timeout) {
                var markup = '<div>'+
                            '<akam-status-message id="identification" text="add a little bit more text" status="information"></akam-status-message>'+
                            '</div>';
                self.scope = $rootScope.$new();
                self.timeout = $timeout;
                self.element = $compile(markup)(self.scope)[0];
                self.scope.$digest();
                document.body.appendChild(self.element);
            });
        });
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        context('when rendering', function(){
            it('should display the message text', function(){
                expect(document.querySelector('.akam-status-message-item-wrapper').id).to.not.be.null;
                expect(document.querySelector('.status-message-content').textContent).to.match(/add a little bit more text/);
            });
            it('shoudl default to success status', function(){
                expect(document.querySelector('.akam-status-message-item-wrapper').classList.contains('information')).to.be.true;
            });
        });
        context('after rendered', function(){
            it('should disspear after timeout', function(){
                this.timeout.flush();
                this.timeout.flush();
                expect(document.querySelector('akam-status-message-item-wrapper')).to.be.null;
                expect(document.querySelector('.status-message-content')).to.be.null;
            });
        });
    });

});
