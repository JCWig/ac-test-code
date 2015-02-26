'use strict';
var utilities = require('../utilities');

var STATUS_MESSAGE_WRAPPER = '.akam-status-message-item-wrapper'
var ID_OF_FIRST_STATUS_MESSAGE = '#akam-status-message-1'
var STATUS_MESSAGE_CONTENT = '.status-message-content'
var CLOSE_ICON = 'i.close'
describe('akamai.components.status-message-service', function() {
    describe('status message service', function(){
        beforeEach(function() {
            var self = this;
            angular.mock.module(require('../../src/status-message').name);
            angular.mock.module(function ($controllerProvider) {
                $controllerProvider.register('Controller', function($scope) {
                });
            });
            inject(function(statusMessage, $rootScope, $timeout, $compile) {
                self.statusMessage = statusMessage;
                self.scope = $rootScope;
                self.timeout = $timeout;
                self.$compile = $compile;
            });
        });
        afterEach(function(){
            var wrapper = document.querySelector('.common-css');
            if(wrapper){
                wrapper.parentNode.removeChild(wrapper);   
            }
        });
        context('when rendering', function(){
            afterEach(function(){
                var wrapper = document.querySelector('.common-css');
                if(wrapper){
                    wrapper.parentNode.removeChild(wrapper);   
                }
            });
            it('should display correct information with success', function(){ 
                this.statusMessage.showSuccess({text : "message_text", timeout: 2000});
                this.scope.$digest();

                var statusMessageWrapper = document.querySelector(STATUS_MESSAGE_WRAPPER);
                var statusMessageBar = document.querySelector(ID_OF_FIRST_STATUS_MESSAGE);
                var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);

                expect(getComputedStyle(statusMessageWrapper)['background-color']).to.contain('rgba(56, 142, 53, 0.949219)');//GREEN
                expect(statusMessageWrapper.classList.contains('success')).to.be.true;
                expect(statusMessageBar).to.not.be.null;
                expect(statusMessageContent.textContent).to.match(/message_text/);
            });
            it('should display correct information with info', function(){ 
                this.statusMessage.showInformation({text : "message_text2",status:"information"});
                this.scope.$digest();

                var statusMessageWrapper = document.querySelector(STATUS_MESSAGE_WRAPPER);
                var statusMessageBar = document.querySelector(ID_OF_FIRST_STATUS_MESSAGE);
                var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);

                expect(getComputedStyle(statusMessageWrapper)['background-color']).to.contain('rgba(47, 121, 201, 0.949219)');//BLUE
                expect(statusMessageWrapper.classList.contains('information')).to.be.true;
                expect(statusMessageBar).to.not.be.null;
                expect(statusMessageContent.textContent).to.match(/message_text2/);
            });
            it('should display correct information with error', function(){ 
                this.statusMessage.showError({text : "message_text3", timeout: 2000});
                this.scope.$digest();

                var statusMessageWrapper = document.querySelector(STATUS_MESSAGE_WRAPPER);
                var statusMessageBar = document.querySelector(ID_OF_FIRST_STATUS_MESSAGE);
                var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);

                expect(getComputedStyle(statusMessageWrapper)['background-color']).to.contain('rgba(163, 45, 45, 0.949219)');//RED
                expect(statusMessageWrapper.classList.contains('error')).to.be.true;
                expect(statusMessageBar).to.not.be.null;
                expect(statusMessageContent.textContent).to.match(/message_text3/);
            });
            it('should display correct information with warning', function(){ 
                this.statusMessage.showWarning({text : "message_text4", timeout: 2000});
                this.scope.$digest();

                var statusMessageWrapper = document.querySelector(STATUS_MESSAGE_WRAPPER);
                var statusMessageBar = document.querySelector(ID_OF_FIRST_STATUS_MESSAGE);
                var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);

                expect(getComputedStyle(statusMessageWrapper)['background-color']).to.contain('rgba(201, 120, 32, 0.949219)');//ORANGE
                expect(statusMessageWrapper.classList.contains('warning')).to.be.true;
                expect(statusMessageBar).to.not.be.null;
                expect(statusMessageContent.textContent).to.match(/message_text4/);
            });
        }); 
        context('when rendered', function(){
            afterEach(function(){
                var wrapper = document.querySelector('.common-css');
                if(wrapper){
                    wrapper.parentNode.removeChild(wrapper);   
                }
            });
            it('should disappear after timeout', function(){
                this.statusMessage.showSuccess({text : "message_text", timeout: 2000});
                this.scope.$digest();

                var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);

                expect(statusMessageContent).to.not.be.null
                
                this.timeout.flush();
                this.timeout.flush();

                statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);

                expect(statusMessageContent).to.be.null;
            });
            it('should default to normal timeout if incorrect given', function(){
                this.statusMessage.showSuccess({text : "message_text", timeout: -200});
                this.scope.$digest();

                var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);

                expect(statusMessageContent).to.not.be.null
                
                this.timeout.flush();
                this.timeout.flush();

                statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);

                expect(statusMessageContent).to.be.null;
            });
            it('should never disappear success info when timeout = 0', function(){
                this.statusMessage.showSuccess({text : "message_text", timeout: 0});
                this.statusMessage.showInformation({text : "message_text", timeout: 0});
                this.scope.$digest();

                var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);

                expect(statusMessageContent).to.not.be.null
                expect(this.timeout.verifyNoPendingTasks()).to.be.undefined;
            });

            it('should never disappear (warning and error)', function(){
                this.statusMessage.showWarning({text : "message_text", timeout: 2000});
                this.statusMessage.showError({text : "message_text", timeout: 2000});
                this.scope.$digest();

                var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);

                expect(statusMessageContent).to.not.be.null
                expect(this.timeout.verifyNoPendingTasks()).to.be.undefined;
            });
            it('should default to never disappear (warning and error)', function(){
                this.statusMessage.showWarning({text : "message_text", timeout: -200});
                this.statusMessage.showError({text : "message_text", timeout: -200});
                this.scope.$digest();

                var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);

                expect(statusMessageContent).to.not.be.null
                expect(this.timeout.verifyNoPendingTasks()).to.be.undefined;
            });
            it('should disappear when close is clicked', function(){
                this.statusMessage.showSuccess({text : "message_text", timeout: 100000});
                this.scope.$digest();

                var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);
                var closeIcon = document.querySelector('i.close')

                expect(statusMessageContent).to.not.be.null
                utilities.click(closeIcon);

                this.timeout.flush();

                statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);
                expect(statusMessageContent).to.be.null;
            });
            it('should close after mouse enters and leaves', function(){
                this.statusMessage.showSuccess({text : "message_text7", timeout: 2000});
                this.scope.$digest();

                var ev = document.createEvent('MouseEvent');
                ev.initMouseEvent('mouseover', true);
                var ev2 = document.createEvent('MouseEvent');
                ev2.initMouseEvent('mouseout', true);
                var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);


                statusMessageContent.dispatchEvent(ev);
                statusMessageContent.dispatchEvent(ev2);
                this.timeout.flush();
                this.timeout.flush();

                statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);

                expect(statusMessageContent).to.be.null;  
            });
            it('should stay open while mouse is hovering', function(){
                this.statusMessage.showSuccess({text : "message_text6", timeout: 2000, statustype:"error"});
                this.scope.$digest();
                var ev = document.createEvent('MouseEvent');
                ev.initMouseEvent('mouseover', true);
                
                var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);

                statusMessageContent.dispatchEvent(ev);
                expect(this.timeout.verifyNoPendingTasks()).to.be.undefined;
            });
            it('should stay open when second message is closed', function(){
                this.statusMessage.showSuccess({text : "message_text6", timeout: 0, statustype:"error"});
                this.statusMessage.showSuccess({text : "message_text7", timeout: 0, statustype:"error"});
                this.scope.$digest();

                var secondStatusMessageCloseIcon = document.querySelectorAll(CLOSE_ICON)[1];
                utilities.click(secondStatusMessageCloseIcon);
                this.timeout.flush();

                var firstStatusMessageContent = document.querySelectorAll('.status-message-content')[0];
                var secondStatusMessageContent = document.querySelectorAll('.status-message-content')[1];

                expect(firstStatusMessageContent.textContent).to.match(/message_text6/);
                expect(secondStatusMessageContent).to.be.undefined; 
            });
        });
        context('when providing no options', function(){
            afterEach(function(){
                var wrapper = document.querySelector('.common-css');
                if(wrapper){
                    wrapper.parentNode.removeChild(wrapper);   
                }
            });
            it('should render success with defaults', function(){
                this.statusMessage.showSuccess();
                this.scope.$digest();

                var statusMessageWrapper = document.querySelector(STATUS_MESSAGE_WRAPPER);
                var statusMessageBar = document.querySelector(ID_OF_FIRST_STATUS_MESSAGE);
                var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);

                expect(statusMessageWrapper.classList.contains('success')).to.be.true;
                expect(statusMessageBar).to.not.be.null;
                expect(statusMessageContent.textContent).to.match(/ /);
            });
            it('should render error with defaults', function(){
                this.statusMessage.showError();
                this.scope.$digest();

                var statusMessageWrapper = document.querySelector(STATUS_MESSAGE_WRAPPER);
                var statusMessageBar = document.querySelector(ID_OF_FIRST_STATUS_MESSAGE);
                var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);

                expect(statusMessageWrapper.classList.contains('error')).to.be.true;
                expect(statusMessageBar).to.not.be.null;
                expect(statusMessageContent.textContent).to.match(/ /);

            });
            it('should render warning with defaults', function(){
                this.statusMessage.showWarning();
                this.scope.$digest();

                var statusMessageWrapper = document.querySelector(STATUS_MESSAGE_WRAPPER);
                var statusMessageBar = document.querySelector(ID_OF_FIRST_STATUS_MESSAGE);
                var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);

                expect(statusMessageWrapper.classList.contains('warning')).to.be.true;
                expect(statusMessageBar).to.not.be.null;
                expect(statusMessageContent.textContent).to.match(/ /);
            });
            it('should render warning with defaults', function(){
                this.statusMessage.showInformation();
                this.scope.$digest();

                var statusMessageWrapper = document.querySelector(STATUS_MESSAGE_WRAPPER);
                var statusMessageBar = document.querySelector(ID_OF_FIRST_STATUS_MESSAGE);
                var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);

                expect(statusMessageWrapper.classList.contains('information')).to.be.true;
                expect(statusMessageBar).to.not.be.null;
                expect(statusMessageContent.textContent).to.match(/ /);
            });
            it('should render base show with defaults', function(){
                this.statusMessage.show();
                this.scope.$digest();

                var statusMessageWrapper = document.querySelector(STATUS_MESSAGE_WRAPPER);
                var statusMessageBar = document.querySelector(ID_OF_FIRST_STATUS_MESSAGE);
                var statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);

                expect(statusMessageWrapper.classList.contains('success')).to.be.true;
                expect(statusMessageBar).to.not.be.null;
                expect(statusMessageContent.textContent).to.match(/ /);
            });
        });
    });
});