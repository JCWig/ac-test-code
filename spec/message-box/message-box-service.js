'use strict';
var utilities = require('../utilities');
var LIBRARY_PATH = /\/libs\/akamai-components\/[0-9]*.[0-9]*.[0-9]*\/locales\/en_US.json/;
var CONFIG_PATH = '../../_appen_US.json';
var enUsMessagesResponse = require("../i18n/i18n_responses/messages_en_US.json");
var enUsResponse = require ("../i18n/i18n_responses/en_US.json");

describe('messageBox service', function() {
    var translationMock = {
        "components": {
            "message-box": {
                "no": "No",
                "yes": "Yes"
            }
        }
    };
    beforeEach(function() {
        var self = this;

        angular.mock.module(require('../../src/message-box').name);
        angular.mock.module(function($provide, $translateProvider) {
            $provide.factory('i18nCustomLoader', function($q, $timeout) {
                return function(options) {
                    var deferred = $q.defer();
                    $timeout(function() {
                        deferred.resolve(translationMock);
                    });
                    return deferred.promise;
                };
            });
            $translateProvider.useLoader('i18nCustomLoader');
        });
        inject(function(messageBox, $rootScope, $timeout, $httpBackend) {
            self.messageBox = messageBox;
            self.$rootScope = $rootScope;
            self.$timeout = $timeout;
            $httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
            $httpBackend.when('GET', CONFIG_PATH).respond(enUsResponse);  
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
        describe('when no headline option is provided', function() {
            it('should throw an error', function() {
                var opts = {
                    text: 'Some text'
                };
                var openingFunction = angular.bind(this.messageBox, this.messageBox._show, opts);
                expect(openingFunction).toThrowError();
            });
        });

        describe('when no text option is provided', function() {
            it('should throw an error', function() {
                var opts = {
                    headline: 'Some text'
                };
                var openingFunction = angular.bind(this.messageBox, this.messageBox._show, opts);
                expect(openingFunction).toThrowError();
            });
        });

        it('should limit the title to 20 characters', function() {
            var title = 'I am very long title that should be truncated';

            this.messageBox._show({
                title: title,
                headline: 'Headline',
                text: 'Message',
                template: '<p></p>'
            });
            this.$rootScope.$digest();

            var modalTitle = document.querySelector('.modal .modal-title');
            expect(modalTitle.textContent.length).toEqual(20);
        });

        it('should support a headline option', function() {
            var headline = 'Headline';

            this.messageBox._show({
                headline: headline,
                text: 'Message'
            });
            this.$rootScope.$digest();

            var modalHeadline = document.querySelector('.modal .message-box-headline');
            expect(modalHeadline.textContent).toEqual(headline);
        });

        it('should cancelLabel display translation key if not provide one', function() {
            var cancelLabelKey = 'No';

            this.$timeout.flush();

            this.messageBox._show({
                headline: 'headline',
                text: 'Message',
                cancelLabel: ""
            });
            this.$rootScope.$digest();

            var cancelModalButton = document.querySelector('.modal .button:not(.primary)');
            expect(cancelModalButton.textContent).toContain(cancelLabelKey);
        });

        it('should submitLabel display translation key if not provide one', function() {
            var submitLabelKey = 'Yes';

            this.$timeout.flush();

            this.messageBox._show({
                headline: 'headline',
                text: 'Message',
                submitLabel: submitLabelKey
            });
            this.$rootScope.$digest();

            var okayModalButton = document.querySelector('.modal button.primary');
            expect(okayModalButton.textContent).toContain(submitLabelKey);
        });


        it('should limit the headline to 48 characters', function() {
            var headline = 'A very long headline that will be truncated to 48 chars';

            this.messageBox._show({
                headline: headline,
                text: 'Message'
            });
            this.$rootScope.$digest();
            var modalHeadline= document.querySelector('.modal .message-box-headline');
            expect(modalHeadline.textContent.length).toEqual(48);

        });

        it('should support a text option', function() {
            var text = 'Message';

            this.messageBox._show({
                headline: 'Headline',
                text: text
            });
            this.$rootScope.$digest();

            var modalMessageBoxText = document.querySelector('.modal .message-box-text');
            expect(modalMessageBoxText.textContent).toEqual(text);
        });

        it('should limit the text to 220 characters', function() {
            var text = new Array(300).join('x');
            var el;

            this.messageBox._show({
                headline: 'Headline',
                text: text
            });
            this.$rootScope.$digest();

            var modalMessageBoxText = document.querySelector('.modal .message-box-text');
            expect(modalMessageBoxText.textContent.length).toEqual(220);
        });

        it('should support a details option', function() {
            var details = 'Message details';

            this.messageBox._show({
                headline: 'Headline',
                text: 'Message',
                details: details
            });
            this.$rootScope.$digest();

            var messageBoxDetails = document.querySelector('.modal .message-box-details > div');
            expect(messageBoxDetails.textContent).toMatch(new RegExp(details));
        });

        it('should support translating a question message', function() {
            var headline = 'Headline';

            this.messageBox._show({
                headline: headline,
                text: 'Message'
            }, "question");
            this.$rootScope.$digest();

            var modalTitle = document.querySelector('.modal .modal-title');
            expect(modalTitle.textContent).toEqual('components.message-box.title.question');
        });
        it('should support translating a error message', function() {
            var headline = 'Headline';

            this.messageBox._show({
                headline: headline,
                text: 'Message'
            }, "error");
            this.$rootScope.$digest();

            var modalTitle = document.querySelector('.modal .modal-title');
            expect(modalTitle.textContent).toEqual('components.message-box.title.error');
        });

        it('should have a close icon button which can close', function(){
            var details = 'Message details';

            this.messageBox._show({
                headline: 'Headline',
                text: 'Message',
                details: details
            });
            this.$rootScope.$digest();

            var closeIcon = document.querySelector('.modal-footer button');
            expect(closeIcon).not.toBe(null)
            utilities.click(closeIcon);
            this.$rootScope.$digest();
            this.$timeout.flush();
            this.$timeout.flush();
            expect(document.querySelector('.modal-content')).toBe(null);
        }); 

        describe('when view details is clicked', function() {
            it('should toggle the visibility of the content', function() {
                this.messageBox._show({
                    headline: 'Headline',
                    text: 'Message',
                    details: 'Details'
                });
                this.$rootScope.$digest();

                var messageBoxDetails = document.querySelector('.message-box-details > div');
                var messageBoxDetailsTrigger = document.querySelector('.message-box-details > span');

                expect(angular.element(messageBoxDetails).css('height')).toEqual('0px');
                utilities.click(messageBoxDetailsTrigger);
                this.$timeout.flush();
                expect(angular.element(messageBoxDetails).css('height')).not.toEqual('0px');
            });
        });

        describe('when submit button is clicked', function() {
            it('should close the message box', function() {
                this.$rootScope.spyOnResultFunction = function(){};
                var spy = spyOn(this.$rootScope,"spyOnResultFunction");
                var box = this.messageBox._show({
                    headline: 'Headline',
                    text: 'Message',
                    details: 'Details'
                });
                var button;

                box.result.then(this.$rootScope.spyOnResultFunction);
                this.$rootScope.$digest();

                var okayModalButton = document.querySelector('.modal-footer button:last-child');
                utilities.click(okayModalButton);
                this.$rootScope.$digest();

                expect(spy).toHaveBeenCalled();
            });
        });
        describe('when cancel button is clicked', function() {
            it('should close the message box', function() {
                this.$rootScope.spyOnResultFunction = function(){};
                var spy = spyOn(this.$rootScope,"spyOnResultFunction");
                var messageBox = this.messageBox._show({
                    headline: 'Headline',
                    text: 'Message',
                    details: 'Details'
                });

                this.$rootScope.$digest();

                var cancelModalButton = document.querySelector('.modal-footer button');
                utilities.click(cancelModalButton);
                this.$rootScope.$digest();
                this.$timeout.flush();
                this.$timeout.flush();
                expect(document.querySelector('.modal-content')).toBe(null);
                expect(spy).not.toHaveBeenCalled();
            });
        });
        describe('when message box has been closed somehow', function(){
            it('should be able to be opened with new data', function(){
                var title = 'I am very long title that should be truncated';
                var title2 = 'I am a very different title from the one before hand';
                this.messageBox._show({
                    title: title,
                    headline: 'Headline',
                    text: 'Message'
                });
                this.$rootScope.$digest();
                var closeIcon = document.querySelector('.modal-content i.close-icon');                
                utilities.click(closeIcon);
                this.$timeout.flush();
                this.$timeout.flush();
                this.$rootScope.$digest();
                this.messageBox._show({
                    title: title2,
                    headline: 'a new headline',
                    text: 'All the messages'
                });
                this.$rootScope.$digest();
                var modalTitle = document.querySelector('.modal .modal-title');
                var modalHeadline= document.querySelector('.modal .message-box-headline');
                var modalMessageBoxText = document.querySelector('.modal .message-box-text');
                
                
                expect(modalTitle.textContent).toEqual('I am a very differen');   
                expect(modalHeadline.textContent).toEqual('a new headline');   
                expect(modalMessageBoxText.textContent).toEqual('All the messages');   
            });
        });
    });

    describe('showInfo()', function() {
        describe('when rendering a info message box', function(){
            it('should use the information icon', function() {
                this.$rootScope.spyOnShowInfo = function(){};
                var spy = spyOn(this.$rootScope,"spyOnShowInfo");

                this.messageBox._show = this.$rootScope.spyOnShowInfo;
                this.messageBox.showInfo();
                expect(spy).toHaveBeenCalled();
                expect(spy.calls.allArgs()[0][0].icon).toEqual('svg-information');
            });

            it('should use the information modifier class on the modal', function() {
                this.$rootScope.spyOnShowInfo = function(){};
                var spy = spyOn(this.$rootScope,"spyOnShowInfo");

                this.messageBox._show = this.$rootScope.spyOnShowInfo;
                this.messageBox.showInfo();
                expect(spy).toHaveBeenCalled();
                expect(spy.calls.allArgs()[0][0].windowClass).toEqual('information akam-message-box');
            });
        });
    });
    describe('showQuestion()', function() {
        describe('when rendering a question message box', function(){
            it('should use the question icon', function() {
                this.$rootScope.spyOnShowQuestion = function(){};
                var spy = spyOn(this.$rootScope,"spyOnShowQuestion");

                this.messageBox._show = this.$rootScope.spyOnShowQuestion;
                this.messageBox.showQuestion();
                expect(spy).toHaveBeenCalled();
                expect(spy.calls.allArgs()[0][0].icon).toEqual('svg-question');
            });

            it('should use the information modifier class on the modal', function() {
                this.$rootScope.spyOnShowQuestion = function(){};
                var spy = spyOn(this.$rootScope,"spyOnShowQuestion");

                this.messageBox._show = this.$rootScope.spyOnShowQuestion;
                this.messageBox.showQuestion();
                expect(spy).toHaveBeenCalled();
                expect(spy.calls.allArgs()[0][0].windowClass).toEqual('question akam-message-box');
            });
        });
    });

    describe('showError()', function() {
        describe('when rendering a error message box', function(){
            it('should use the error icon', function() {
                this.$rootScope.spyOnShowError = function(){};
                var spy = spyOn(this.$rootScope,"spyOnShowError");

                this.messageBox._show = this.$rootScope.spyOnShowError;
                this.messageBox.showError();
                expect(spy).toHaveBeenCalled();
                expect(spy.calls.allArgs()[0][0].icon).toEqual('svg-error');
            });

            it('should use the error modifier class on the modal', function() {
                this.$rootScope.spyOnShowError = function(){};
                var spy = spyOn(this.$rootScope,"spyOnShowError");

                this.messageBox._show = this.$rootScope.spyOnShowError;
                this.messageBox.showError();
                expect(spy).toHaveBeenCalled();
                expect(spy.calls.allArgs()[0][0].windowClass).toEqual('error akam-message-box');
            });
        }); 
    });
});
