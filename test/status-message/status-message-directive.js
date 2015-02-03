'use strict';


function click(el) {
    var ev = document.createEvent('MouseEvent');
    ev.initMouseEvent('click', true);
    el.dispatchEvent(ev);
};

describe('akamai.components.status-message', function() {
    describe('group status messages', function(){
        beforeEach(function() {
            var self = this;

            angular.mock.module(require('../../src/status-message').name);
            inject(function($compile, $rootScope, $timeout) {
                var markup = '<div>'+
                            '<akam-status-message id="identification" text="add a little bit more text" statusType="success"></akam-status-message>'+
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
            it('should display correct information', function(){
                //console.log(document);
                expect(document.querySelector('li.akam-status-message-item').id).to.not.be.null;
                expect(document.querySelector('.status-message-content').textContent).to.equal('\n        add a little bit more text\n    ');
            });
        });
        context('after rendered', function(){
            it('should disspear after timeout', function(){
                this.timeout.flush();
                this.timeout.flush();
                expect(document.querySelector('li.akam-status-message-item')).to.be.null;
                expect(document.querySelector('.status-message-content')).to.be.null;
            });
        });
    });

});
