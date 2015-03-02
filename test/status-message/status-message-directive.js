'use strict';

var STATUS_MESSAGE_WRAPPER = '.akam-status-message-item-wrapper';
var STATUS_MESSAGE_CONTENT = '.status-message-content';

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
                var statusMessageBar = document.querySelector(STATUS_MESSAGE_WRAPPER);
                var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);

                expect(statusMessageBar.id).to.not.be.null;
                expect(statusMessageContent.textContent).to.match(/add a little bit more text/);
            });
            it('shoudld default to success status', function(){
                var statusMessageBar = document.querySelector(STATUS_MESSAGE_WRAPPER);
                expect(statusMessageBar.classList.contains('information')).to.be.true;
            });
        });
        context('after rendered', function(){
            it('should disspear after timeout', function(){
                this.timeout.flush();
                this.timeout.flush();
                
                var statusMessageBar = document.querySelector(STATUS_MESSAGE_WRAPPER);
                var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);
                
                expect(statusMessageBar).to.be.null;
                expect(statusMessageContent).to.be.null;
            });
        });
    });

});
