'use strict';


function click(el) {
    var ev = document.createEvent('MouseEvent');
    ev.initMouseEvent('click', true);
    el.dispatchEvent(ev);
};

describe('akamai.components.status-message-group', function() {
    describe('group status messages', function(){
        beforeEach(function() {
            var self = this;
            var compile;

            angular.mock.module(require('../../src/status-message').name);
            inject(function($compile, $rootScope, $timeout) {
                var markup = ('<akam-status-message-group items="items"></akam-status-message-group>');
                self.scope = $rootScope.$new();
                self.timeout = $timeout;
                self.scope.items = [{
                    "itemId":"first-item-id",
                    "text":"First Text Field",
                    "timeout": 2000
                },{
                    "itemId":"second-item-id",
                    "text":"Second Text Field",
                    "timeout": 2000
                }];
                self.element = $compile(markup)(self.scope)[0];
                compile = $compile;
                self.scope.$digest();
                document.body.appendChild(self.element);
            });
        });
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        context('when rendering', function(){
            it('should display correct information', function(){
                expect(document.querySelector('#first-item-id')).to.not.be.null;
                expect(document.querySelector('#second-item-id')).to.not.be.null;
                expect(document.querySelectorAll('.status-message-content')[0].textContent).to.match(/First Text Field/);
                expect(document.querySelectorAll('.status-message-content')[1].textContent).to.match(/Second Text Field/);
            });
        }); 
        context('when rendered', function(){
            it('should disspear after timeout', function(){
                this.timeout.flush();
                this.timeout.flush();
                this.timeout.verifyNoPendingTasks();
                expect(document.querySelector('#first-item-id')).to.be.null;
                expect(document.querySelector('#second-item-id')).to.be.null;
            });
        });
    });
    describe('group status messages with no items', function(){
        beforeEach(function() {
            var self = this;
            var compile;

            angular.mock.module(require('../../src/status-message').name);
            inject(function($compile, $rootScope, $timeout) {
                var markup = ('<akam-status-message-group items="items"></akam-status-message-group>');
                self.scope = $rootScope.$new();
                self.timeout = $timeout;
                self.scope.items = null;
                self.element = $compile(markup)(self.scope)[0];
                compile = $compile;
                self.scope.$digest();
                document.body.appendChild(self.element);
            });
        });
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        context('when rendering', function(){
            it('should not render any messages', function(){
                expect(document.querySelector('.status-message-content')).to.be.null;
            });
        });
    });

});
