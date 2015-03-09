'use strict';
var utilities = require('../utilities')
var LIBRARY_PATH = '/libs/akamai-components/0.0.1/locales/en_US.json';
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
        context('when no headline option is provided', function() {
            it('should throw an error', function() {
                var opts = {
                    text: 'Some text'
                };
                var openingFunction = angular.bind(this.messageBox, this.messageBox._show, opts);
                expect(openingFunction).to.throw(Error);
            });
        });

        context('when no text option is provided', function() {
            it('should throw an error', function() {
                var opts = {
                    headline: 'Some text'
                };
                var openingFunction = angular.bind(this.messageBox, this.messageBox._show, opts);
                expect(openingFunction).to.throw(Error);
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
            expect(modalTitle.textContent).to.have.length(20);
        });

        it('should support a headline option', function() {
            var headline = 'Headline';

            this.messageBox._show({
                headline: headline,
                text: 'Message'
            });
            this.$rootScope.$digest();

            var modalHeadline = document.querySelector('.modal .message-box-headline');
            expect(modalHeadline.textContent).to.equal(headline);
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
            expect(cancelModalButton.textContent).to.contain(cancelLabelKey);
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
            expect(okayModalButton.textContent).to.contain(submitLabelKey);
        });


        it('should limit the headline to 48 characters', function() {
            var headline = 'A very long headline that will be truncated to 48 chars';

            this.messageBox._show({
                headline: headline,
                text: 'Message'
            });
            this.$rootScope.$digest();
            var modalHeadline= document.querySelector('.modal .message-box-headline');
            expect(modalHeadline.textContent).to.have.length(48);

        });

        it('should support a text option', function() {
            var text = 'Message';

            this.messageBox._show({
                headline: 'Headline',
                text: text
            });
            this.$rootScope.$digest();

            var modalMessageBoxText = document.querySelector('.modal .message-box-text');
            expect(modalMessageBoxText.textContent).to.equal(text);
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
            expect(modalMessageBoxText.textContent).to.have.length(220);
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
            expect(messageBoxDetails.textContent).to.match(new RegExp(details));
        });

        it('should support translating a question message', function() {
            var headline = 'Headline';

            this.messageBox._show({
                headline: headline,
                text: 'Message'
            }, "question");
            this.$rootScope.$digest();

            var modalTitle = document.querySelector('.modal .modal-title');
            expect(modalTitle.textContent).to.equal('components.message-box.title.question');
        });
        it('should support translating a error message', function() {
            var headline = 'Headline';

            this.messageBox._show({
                headline: headline,
                text: 'Message'
            }, "error");
            this.$rootScope.$digest();

            var modalTitle = document.querySelector('.modal .modal-title');
            expect(modalTitle.textContent).to.equal('components.message-box.title.error');
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
            expect(closeIcon).to.not.be.null;
            utilities.click(closeIcon);
            this.$rootScope.$digest();
            this.$timeout.flush();
            this.$timeout.flush();
            expect(document.querySelector('.modal-content')).to.be.null
        }); 

        context('when view details is clicked', function() {
            it('should toggle the visibility of the content', function() {
                this.messageBox._show({
                    headline: 'Headline',
                    text: 'Message',
                    details: 'Details'
                });
                this.$rootScope.$digest();

                var messageBoxDetails = document.querySelector('.message-box-details > div');
                var messageBoxDetailsTrigger = document.querySelector('.message-box-details > span');

                expect(angular.element(messageBoxDetails).css('height')).to.equal('0px');
                utilities.click(messageBoxDetailsTrigger);
                this.$timeout.flush();
                expect(angular.element(messageBoxDetails).css('height')).to.not.equal('0px');
            });
        });

        context('when submit button is clicked', function() {
            it('should close the message box', function() {
                var spyOnResultFunction = sinon.spy();
                var box = this.messageBox._show({
                    headline: 'Headline',
                    text: 'Message',
                    details: 'Details'
                });
                var button;

                box.result.then(spyOnResultFunction);
                this.$rootScope.$digest();

                var okayModalButton = document.querySelector('.modal-footer button:last-child');
                utilities.click(okayModalButton);
                this.$rootScope.$digest();

                expect(spyOnResultFunction).to.have.been.called;
            });
        });
        context('when cancel button is clicked', function() {
            it('should close the message box', function() {
                var spyOnResultFunction = sinon.spy();
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
                expect(document.querySelector('.modal-content')).to.be.null
                expect(spyOnResultFunction).to.not.have.been.called;
            });
        });
        context('when message box has been closed somehow', function(){
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
                
                
                expect(modalTitle.textContent).to.equal('I am a very differen');   
                expect(modalHeadline.textContent).to.equal('a new headline');   
                expect(modalMessageBoxText.textContent).to.equal('All the messages');   
            });
        });
    });

    describe('showInfo()', function() {
        context('when rendering a info message box', function(){
            it('should use the information icon', function() {
                var spyOnShowInfo = sinon.spy();

                this.messageBox._show = spyOnShowInfo;
                this.messageBox.showInfo();
                expect(spyOnShowInfo).to.have.been.called;
                expect(spyOnShowInfo.args[0][0].icon).to.equal('svg-information');
            });

            it('should use the information modifier class on the modal', function() {
                var spyOnShowInfo = sinon.spy();

                this.messageBox._show = spyOnShowInfo;
                this.messageBox.showInfo();
                expect(spyOnShowInfo).to.have.been.called;
                expect(spyOnShowInfo.args[0][0].windowClass).to.equal('information akam-message-box');
            });
        });
    });
    describe('showQuestion()', function() {
        context('when rendering a question message box', function(){
            it('should use the question icon', function() {
                var spyOnShowQuestion = sinon.spy();

                this.messageBox._show = spyOnShowQuestion;
                this.messageBox.showQuestion();
                expect(spyOnShowQuestion).to.have.been.called;
                expect(spyOnShowQuestion.args[0][0].icon).to.equal('svg-question');
            });

            it('should use the information modifier class on the modal', function() {
                var spyOnShowQuestion = sinon.spy();

                this.messageBox._show = spyOnShowQuestion;
                this.messageBox.showQuestion();
                expect(spyOnShowQuestion).to.have.been.called;
                expect(spyOnShowQuestion.args[0][0].windowClass).to.equal('question akam-message-box');
            });
        });
    });

    describe('showError()', function() {
        context('when rendering a error message box', function(){
            it('should use the error icon', function() {
                var spyOnShowError = sinon.spy();

                this.messageBox._show = spyOnShowError;
                this.messageBox.showError();
                expect(spyOnShowError).to.have.been.called;
                expect(spyOnShowError.args[0][0].icon).to.equal('svg-error');
            });

            it('should use the error modifier class on the modal', function() {
                var spyOnShowError = sinon.spy();

                this.messageBox._show = spyOnShowError;
                this.messageBox.showError();
                expect(spyOnShowError).to.have.been.called;
                expect(spyOnShowError.args[0][0].windowClass).to.equal('error akam-message-box');
            });
        }); 
    });
});
