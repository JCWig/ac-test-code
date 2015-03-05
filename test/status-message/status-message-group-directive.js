'use strict';

var STATUS_MESSAGE_CONTENT = '.status-message-content';

describe('akamai.components.status-message-group', function() {
    var compile = null;
    var scope = null;
    var timeout = null;
    beforeEach(function() {
        var self = this;

        angular.mock.module(require('../../src/status-message').name);
        inject(function($compile, $rootScope, $timeout) {
            scope = $rootScope.$new();
            timeout = $timeout;
            compile = $compile;
        });

        scope.items = [{
            "itemId":"first-item-id",
            "text":"First Text Field",
            "timeout": 2000
            },{
            "itemId":"second-item-id",
            "text":"Second Text Field",
            "timeout": 2000
        }];
    });
    afterEach(function() {
        if(self.element){
            document.body.removeChild(self.element);
            self.element = null;    
        }
    });
    function addElement(markup) {
        self.el = compile(markup)(scope);
        scope.$digest();
        self.element = document.body.appendChild(self.el[0]);
    };
    context('when rendering group status messages', function(){
        it('should display correct information', function(){
            var markup = ('<akam-status-message-group items="items"></akam-status-message-group>');
            addElement(markup);
            var firstStatusMessage = document.querySelector('#first-item-id');
            var secondStatusMessage = document.querySelector('#second-item-id');
            var firstStatusMessageContent = document.querySelectorAll(STATUS_MESSAGE_CONTENT)[0];
            var secondStatusMessageContent = document.querySelectorAll(STATUS_MESSAGE_CONTENT)[1];

            expect(firstStatusMessage).to.not.be.null;
            expect(secondStatusMessage).to.not.be.null;
            expect(firstStatusMessageContent.textContent).to.match(/First Text Field/);
            expect(secondStatusMessageContent.textContent).to.match(/Second Text Field/);
        });
    }); 
    context('when group status messages rendered', function(){
        it('should disspear after timeout', function(){
            var markup = ('<akam-status-message-group items="items"></akam-status-message-group>');
            addElement(markup);
            timeout.flush();
            timeout.flush();
            timeout.verifyNoPendingTasks();
                
            var firstStatusMessage = document.querySelector('#first-item-id');
            var secondStatusMessage = document.querySelector('#second-item-id');
                
            expect(firstStatusMessage).to.be.null;
            expect(secondStatusMessage).to.be.null;
        });
    });
    context('when rendering group status messages with no items', function(){
        it('should not render any messages', function(){
            var markup = ('<akam-status-message-group items="items"></akam-status-message-group>');
            scope.items = null;
            addElement(markup);
            var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);
            expect(statusMessageContent).to.be.null;
        });
    });
});
