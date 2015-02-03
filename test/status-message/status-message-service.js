'use strict';


function click(el) {
    var ev = document.createEvent('MouseEvent');
    ev.initMouseEvent('click', true);
    el.dispatchEvent(ev);
};

describe('akamai.components.status-message-service', function() {
    describe('group status messages', function(){
        beforeEach(function() {
            var self = this;

            self.notify = sinon.spy();
            angular.mock.module(require('../../src/status-message').name);
            
            angular.mock.module(function ($controllerProvider) {
                $controllerProvider.register('Controller', function($scope) {
                    $scope.wasOpened.then(self.notify())
                });
            });
            inject(function(statusMessage, $rootScope, $timeout) {
                self.statusMessage = statusMessage;
                self.scope = $rootScope;
                self.timeout = $timeout;
            });
        });
        afterEach(function(){
            var wrapper = document.querySelector('.akam-status-message-wrapper');
            if(wrapper){
                wrapper.parentNode.removeChild(wrapper);   
            }
            //var messages = document.querySelectorAll('li.status-message-item');
        });
        context('when rendering', function(){
            afterEach(function(){
                var wrapper = document.querySelector('.akam-status-message-wrapper');
                if(wrapper){
                    wrapper.parentNode.removeChild(wrapper);   
                }
            });
            /*it('should display correct information with success', function(){ 
                this.statusMessage.showSuccess({text : "message_text", timeout: 2000});
                this.scope.$digest();
                expect(document.querySelector('.akam-status-message-item').classList.contains('success'));
                expect(document.querySelector('#akam-status-message-1')).to.not.be.null;
                expect(document.querySelectorAll('.status-message-content')[0].textContent).to.equal('\n        message_text\n    ');
            });
            it('should display correct information with info', function(){ 
                this.statusMessage.showInfo({text : "message_text", timeout: 2000});
                this.scope.$digest();
                expect(document.querySelector('.akam-status-message-item').classList.contains('info'));
                expect(document.querySelector('#akam-status-message-1')).to.not.be.null;
                expect(document.querySelectorAll('.status-message-content')[0].textContent).to.equal('\n        message_text\n    ');
            });*/
            it('should display correct information with error', function(){ 
                this.statusMessage.showWarning({text : "message_text", timeout: 2000});
                this.scope.$digest();
                console.log(document);
                expect(document.querySelector('.akam-status-message-item').classList.contains('success'));
                expect(document.querySelector('.akam-status-message-item').classList.contains('info'));
                expect(document.querySelector('#akam-status-message-1')).to.not.be.null;
                expect(document.querySelectorAll('.status-message-content')[0].textContent).to.equal('\n        message_text\n    ');
            });
            /*it('should display correct information with warning', function(){ 
                this.statusMessage.showWarning({text : "message_text", timeout: 2000});
                this.scope.$digest();
                expect(document.querySelector('#akam-status-message-1')).to.not.be.null;
                expect(document.querySelectorAll('.status-message-content')[0].textContent).to.equal('\n        message_text\n    ');
            });*/
        }); 
        context('after rendered', function(){
            it('when timeout ends disspear', function(){
                this.statusMessage.showSuccess({text : "message_text", timeout: 2000});
                this.scope.$digest();
                expect(document.querySelector('div.status-message-content')).to.not.be.null
                this.timeout.flush();
                this.timeout.flush();
                expect(document.querySelector('.status-message-content')).to.be.null;
            });
        });
    });
});
