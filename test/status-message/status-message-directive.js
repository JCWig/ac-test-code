'use strict';

var STATUS_MESSAGE_WRAPPER = '.akam-status-message-item-wrapper';
var STATUS_MESSAGE_CONTENT = '.status-message-content';

describe('akamai.components.status-message-directive', function() {
    var scope = null;
    var timeout = null;
    var compile = null
    beforeEach(function() {
        var self = this;

        angular.mock.module(require('../../src/status-message').name);
        inject(function($compile, $rootScope, $timeout) {
            scope = $rootScope.$new();
            timeout = $timeout;
            compile = $compile;
        });
        var markup = '<div><akam-status-message id="identification" text="add a little bit more text" status="information"></akam-status-message></div>';
        addElement(markup);
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

    describe('when rendering', function(){
        it('should display the message text', function(){
            var statusMessageBar = document.querySelector(STATUS_MESSAGE_WRAPPER);
            var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);

            expect(statusMessageBar.id).not.toBe(null);
            expect(statusMessageContent.textContent).toMatch(/add a little bit more text/);
        });
        it('shoudld default to success status', function(){
            var statusMessageBar = document.querySelector(STATUS_MESSAGE_WRAPPER);
            expect(statusMessageBar.classList.contains('information')).toBe(true);
        });
    });
    describe('when rendered', function(){
        it('should disspear after timeout', function(){
            timeout.flush();
            timeout.flush();
                
            var statusMessageBar = document.querySelector(STATUS_MESSAGE_WRAPPER);
            var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);
                
            expect(statusMessageBar).toBe(null);
            expect(statusMessageContent).toBe(null);
        });
    });

});
