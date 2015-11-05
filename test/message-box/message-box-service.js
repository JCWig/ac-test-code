'use strict';
var utilities = require('../utilities');
var LIBRARY_PATH = /\/libs\/akamai-core\/[0-9]*.[0-9]*.[0-9]*\/locales\/en_US.json/;
var CONFIG_PATH = '../../_appen_US.json';
var enUsMessagesResponse = require("../i18n/i18n_responses/messages_en_US.json");
var enUsResponse = require("../i18n/i18n_responses/en_US.json");
const CANCEL_BUTTON_SELECTOR = '.modal .btn:not(.btn-primary)';
const SUBMIT_BUTTON_SELECTOR = '.modal .btn.btn-primary';


describe('messageBox service', function() {
  var translationMock = {
    "components": {
      "message-box": {
        "title": {
          "question": "Question",
          "error": "Error"
        },
        "no": "No",
        "yes": "Yes",
        "variableReplacement": "{{first}} {{last}} has logged"
      },
      "name": "Msg box title"
    }
  };
  var $animate = null;

  beforeEach(function() {
    inject.strictDi(true);
    var self = this;

    angular.mock.module('ngAnimateMock');
    angular.mock.module(require('../../src/message-box').name);
    angular.mock.module(function($translateProvider) {
      $translateProvider.translations('en_US', translationMock);
      $translateProvider.useLoader('translateNoopLoader');
    });
    inject(function(messageBox, $rootScope, $timeout, $httpBackend, _$animate_) {
      self.messageBox = messageBox;
      self.$rootScope = $rootScope;
      self.$timeout = $timeout;
      $httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
      $httpBackend.when('GET', CONFIG_PATH).respond(enUsResponse);
      $animate = _$animate_;
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

  describe('show()', function() {
    describe('when no headline option is provided', function() {
      it('should throw an error', function() {
        var opts = {
          text: 'Some text'
        };
        var openingFunction = angular.bind(this.messageBox, this.messageBox.show, opts);
        expect(openingFunction).toThrowError();
      });
    });

    describe('when no text option is provided', function() {
      it('should throw an error', function() {
        var opts = {
          headline: 'Some text'
        };
        var openingFunction = angular.bind(this.messageBox, this.messageBox.show, opts);
        expect(openingFunction).toThrowError();
      });
    });
    describe('when text option is provided', function() {
      describe('and when text property consits of HTML', function() {
        it('should bind text property as html', function(){
          this.messageBox.show({
            title: 'Title',
            headline: 'Headline',
            text: '<h1>I am HTML</h1>',
            template: '<p></p>'
          });
          this.$rootScope.$digest();

          var modalTitle = document.querySelector('.message-box-text');
          expect(modalTitle.textContent).toBe('I am HTML');
        });
      });
      describe('and when text property does not consits of HTML', function() {
        it('should display text property', function(){
          this.messageBox.show({
            title: 'Title',
            headline: 'Headline',
            text: 'I am not HTML',
            template: '<p></p>'
          });
          this.$rootScope.$digest();

          var modalTitle = document.querySelector('.message-box-text');
          expect(modalTitle.textContent).toBe('I am not HTML');
        });
      });
    });

    it('should support a headline option', function() {
      var headline = 'Headline';

      this.messageBox.show({
        headline: headline,
        text: 'Message'
      });
      this.$rootScope.$digest();

      var modalHeadline = document.querySelector('.modal .message-box-headline');
      expect(modalHeadline.textContent).toEqual(headline);
    });

    it('should cancelLabel display translation key if not provide one', function() {
      var cancelLabelKey = 'No';

      this.messageBox.show({
        headline: 'headline',
        text: 'Message',
        cancelLabel: ''
      });
      this.$rootScope.$digest();

      var cancelModalButton = document.querySelector(CANCEL_BUTTON_SELECTOR);
      expect(cancelModalButton.textContent).toContain(cancelLabelKey);
    });

    it('should cancelLabel display translation key if provided', function() {
      var cancelLabelKey = 'Yes';

      this.messageBox.show({
        headline: 'headline',
        text: 'Message',
        cancelLabel: "components.message-box.yes"
      });
      this.$rootScope.$digest();

      var cancelModalButton = document.querySelector(CANCEL_BUTTON_SELECTOR);
      expect(cancelModalButton.textContent).toContain(cancelLabelKey);
    });

    it('should submitLabel display translation key if not provide one', function() {
      var submitLabelKey = 'Yes';

      this.messageBox.show({
        headline: 'headline',
        text: 'Message',
        submitLabel: submitLabelKey
      });
      this.$rootScope.$digest();

      var okayModalButton = document.querySelector(SUBMIT_BUTTON_SELECTOR);
      expect(okayModalButton.textContent).toContain(submitLabelKey);
    });
    it('should submitLabel display translation key if provided', function() {
      var submitLabelKey = 'No';

      this.messageBox.show({
        headline: 'headline',
        text: 'Message',
        submitLabel: 'components.message-box.no'
      });
      this.$rootScope.$digest();

      var okayModalButton = document.querySelector(SUBMIT_BUTTON_SELECTOR);
      expect(okayModalButton.textContent).toContain(submitLabelKey);
    });

    it('should title display translation key if provided', function() {
      var title = 'Msg box title';

      this.messageBox.show({
        title: 'components.name',
        headline: 'Headline',
        text: 'Message'
      });
      this.$rootScope.$digest();
      var modalHeadline = document.querySelector('.modal .modal-title');
      expect(modalHeadline.textContent).toEqual(title);
    });

    it('should support a text option', function() {
      var text = 'Message';

      this.messageBox.show({
        headline: 'Headline',
        text: text
      });
      this.$rootScope.$digest();

      var modalMessageBoxText = document.querySelector('.modal .message-box-text');
      expect(modalMessageBoxText.textContent).toEqual(text);
    });

    it('should support a details option', function() {
      var details = 'Message details';

      this.messageBox.show({
        headline: 'Headline',
        text: 'Message',
        details: details
      });
      this.$rootScope.$digest();

      var messageBoxDetails = document.querySelector('.modal .message-box-details > div');
      expect(messageBoxDetails.textContent).toMatch(new RegExp(details));
    });

    it('should have a close icon button which can close', function() {
      var details = 'Message details';

      this.messageBox.show({
        headline: 'Headline',
        text: 'Message',
        details: details
      });
      this.$rootScope.$digest();

      var closeIcon = document.querySelector('.modal-footer button');
      expect(closeIcon).not.toBe(null);
      utilities.click(closeIcon);

      $animate.flush();
      this.$rootScope.$digest();
      $animate.flush();
      this.$rootScope.$digest();

      expect(document.querySelector('.modal-content')).toBe(null);
    });

    describe('when view details is clicked', function() {
      it('should toggle the visibility of the content', function() {
        this.messageBox.show({
          headline: 'Headline',
          text: 'Message',
          details: 'Details'
        });
        this.$rootScope.$digest();

        var messageBoxDetails = document.querySelector('.message-box-details > div');
        var messageBoxDetailsTrigger = document.querySelector('.message-box-details > span');

        expect(messageBoxDetails.classList).not.toContain('in');
        utilities.click(messageBoxDetailsTrigger);
        this.$rootScope.$digest();

        expect(messageBoxDetails.classList).toContain('in');
      });
      describe('and when details property consits of HTML', function() {
        it('should bind details property as html', function(){
          this.messageBox.show({
          headline: 'Headline',
          text: 'Message',
          details: '<h1>I am HTML content</h1>'
        });

        this.$rootScope.$digest();

        var messageBoxDetails = document.querySelector('.message-box-details > div');
        var messageBoxDetailsTrigger = document.querySelector('.message-box-details > span');

        utilities.click(messageBoxDetailsTrigger);
        this.$rootScope.$digest();

        expect(messageBoxDetails.textContent).toBe('I am HTML content');
        });
      });
      describe('and when details property does not consits of HTML', function() {
        it('should display details property', function(){
          this.messageBox.show({
          headline: 'Headline',
          text: 'Message',
          details: 'I do not have any HTML content'
        });

        this.$rootScope.$digest();

        var messageBoxDetails = document.querySelector('.message-box-details > div');
        var messageBoxDetailsTrigger = document.querySelector('.message-box-details > span');

        utilities.click(messageBoxDetailsTrigger);
        this.$rootScope.$digest();

        expect(messageBoxDetails.textContent).toBe('I do not have any HTML content');
        });
      });
    });

    describe('when submit button is clicked', function() {
      it('should close the message box', function() {
        this.$rootScope.spyOnResultFunction = function() {};
        var spy = spyOn(this.$rootScope, "spyOnResultFunction");
        var box = this.messageBox.show({
          headline: 'Headline',
          text: 'Message',
          details: 'Details'
        });
        var button;

        box.result.then(this.$rootScope.spyOnResultFunction);
        this.$rootScope.$digest();

        expect(document.querySelector('.modal-content')).not.toBe(null);

        var okayModalButton = document.querySelector('.modal-footer button:last-child');
        utilities.click(okayModalButton);

        $animate.flush();
        this.$rootScope.$digest();
        $animate.flush();
        this.$rootScope.$digest();

        expect(document.querySelector('.modal-content')).toBe(null);
        expect(spy).toHaveBeenCalled();
      });
    });
    describe('when cancel button is clicked', function() {
      it('should close the message box', function() {
        this.$rootScope.spyOnResultFunction = function() {};
        var spy = spyOn(this.$rootScope, "spyOnResultFunction");
        var messageBox = this.messageBox.show({
          headline: 'Headline',
          text: 'Message',
          details: 'Details'
        });

        this.$rootScope.$digest();

        expect(document.querySelector('.modal-content')).not.toBe(null);

        var cancelModalButton = document.querySelector('.modal-footer button');
        utilities.click(cancelModalButton);

        $animate.flush();
        this.$rootScope.$digest();
        $animate.flush();
        this.$rootScope.$digest();

        expect(document.querySelector('.modal-content')).toBe(null);
        expect(spy).not.toHaveBeenCalled();
      });
    });
    describe('when message box has been closed somehow', function() {
      it('should be able to be opened with new data', function() {
        var title = 'I am very long title that should be truncated';
        var title2 = 'I am a very different title from the one before hand';
        this.messageBox.show({
          title: title,
          headline: 'Headline',
          text: 'Message'
        });
        this.$rootScope.$digest();
        var closeIcon = document.querySelector('.modal-content i.close-icon');
        utilities.click(closeIcon);

        $animate.flush();
        this.$rootScope.$digest();
        $animate.flush();
        this.$rootScope.$digest();

        this.messageBox.show({
          title: title2,
          headline: 'a new headline',
          text: 'All the messages'
        });
        this.$rootScope.$digest();
        var modalTitle = document.querySelector('.modal .modal-title');
        var modalHeadline = document.querySelector('.modal .message-box-headline');
        var modalMessageBoxText = document.querySelector('.modal .message-box-text');

        expect(modalTitle.textContent).toEqual(title2);
        expect(modalHeadline.textContent).toEqual('a new headline');
        expect(modalMessageBoxText.textContent).toEqual('All the messages');
      });
    });
  });

  describe('showInfo()', function() {
    describe('when rendering a info message box', function() {
      it('should use the information icon', function() {
        this.$rootScope.spyOnShowInfo = function() {};
        var spy = spyOn(this.$rootScope, "spyOnShowInfo");

        this.messageBox.show = this.$rootScope.spyOnShowInfo;
        this.messageBox.showInfo();
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.allArgs()[0][0].icon).toEqual('svg-information');
      });

      it('should use the information modifier class on the modal', function() {
        this.$rootScope.spyOnShowInfo = function() {};
        var spy = spyOn(this.$rootScope, "spyOnShowInfo");

        this.messageBox.show = this.$rootScope.spyOnShowInfo;
        this.messageBox.showInfo();
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.allArgs()[0][0].windowClass).toEqual('information akam-message-box');
      });
    });
  });
  describe('showQuestion()', function() {
    describe('when rendering a question message box', function() {
      it('should use the question icon', function() {
        this.$rootScope.spyOnShowQuestion = function() {};
        var spy = spyOn(this.$rootScope, "spyOnShowQuestion");

        this.messageBox.show = this.$rootScope.spyOnShowQuestion;
        this.messageBox.showQuestion();
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.allArgs()[0][0].icon).toEqual('svg-question');
      });

      it('should use the information modifier class on the modal', function() {
        this.$rootScope.spyOnShowQuestion = function() {};
        var spy = spyOn(this.$rootScope, "spyOnShowQuestion");

        this.messageBox.show = this.$rootScope.spyOnShowQuestion;
        this.messageBox.showQuestion();
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.allArgs()[0][0].windowClass).toEqual('question akam-message-box');
      });
    });
  });

  describe('showError()', function() {
    describe('when rendering a error message box', function() {
      it('should use the error icon', function() {
        this.$rootScope.spyOnShowError = function() {};
        var spy = spyOn(this.$rootScope, "spyOnShowError");

        this.messageBox.show = this.$rootScope.spyOnShowError;
        this.messageBox.showError();
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.allArgs()[0][0].icon).toEqual('svg-error');
      });

      it('should use the error modifier class on the modal', function() {
        this.$rootScope.spyOnShowError = function() {};
        var spy = spyOn(this.$rootScope, "spyOnShowError");

        this.messageBox.show = this.$rootScope.spyOnShowError;
        this.messageBox.showError();
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.allArgs()[0][0].windowClass).toEqual('error akam-message-box');
      });
    });
  });

  describe('Translate label text with variable replacement', function() {
    describe('given translation key provided', function() {
      describe('when no values hash property set on each option properties', function() {

        beforeEach(function() {
          let options = {
            headline: 'Headline',
            text: 'Message',
            title: 'components.message-box.variableReplacement',
            submitLabel: 'components.message-box.variableReplacement',
            cancelLabel: 'components.message-box.variableReplacement'
          }

          this.messageBox.show(options, "question");
          this.$rootScope.$digest();
        });

        it("should translated title displayed without variable replacements", function() {
          var modalTitle = document.querySelector('.modal .modal-title');
          expect(modalTitle.textContent).toEqual('has logged');
        });
        it("should translated cancel button displayed without variable replacements", function() {
          var cancelButton = document.querySelector(CANCEL_BUTTON_SELECTOR);
          expect(cancelButton.textContent.trim()).toEqual('has logged');
        });
        it("should translated submit button displayed without variable replacements", function() {
          var submitButton = document.querySelector(SUBMIT_BUTTON_SELECTOR);
          expect(submitButton.textContent.trim()).toEqual('has logged');
        });

      });
    });

  });

  describe('Translate label text with variable replacement', function() {
    describe('when translation key provided', function() {
      describe('when each option property values hash set', function() {

        beforeEach(function() {
          let options = {
            headline: 'components.message-box.variableReplacement',
            headlineValues: {"first": 'sean', "last": 'wang'},
            text: 'components.message-box.variableReplacement',
            textValues: {"first": 'sean', "last": 'wang'},
            title: 'components.message-box.variableReplacement',
            titleValues: {"first": 'sean', "last": 'wang'},
            submitLabel: 'components.message-box.variableReplacement',
            submitLabelValues: {"first": 'sean', "last": 'wang'},
            cancelLabel: 'components.message-box.variableReplacement',
            cancelLabelValues: {"first": 'sean', "last": 'wang'}
          }

          this.messageBox.show(options, "question");
          this.$rootScope.$digest();
        });
        it('should translate headline with label values', function() {
          let modalHeadline = document.querySelector('.modal .message-box-headline');
          expect(modalHeadline.textContent).toEqual('sean wang has logged');
        });
        it('should translate text with label values', function() {
          let modalMessageBoxText = document.querySelector('.modal .message-box-text');
          expect(modalMessageBoxText.textContent).toEqual('sean wang has logged');
        });
        it("should translated title displayed with variable replacements", function() {
          var modalTitle = document.querySelector('.modal .modal-title');
          expect(modalTitle.textContent).toEqual('sean wang has logged');
        });
        it("should translated cancel button displayed with variable replacements", function() {
          var cancelButton = document.querySelector(CANCEL_BUTTON_SELECTOR);
          expect(cancelButton.textContent.trim()).toEqual('sean wang has logged');
        });
        it("should translated submit button displayed with variable replacements", function() {
          var submitButton = document.querySelector(SUBMIT_BUTTON_SELECTOR);
          expect(submitButton.textContent.trim()).toEqual('sean wang has logged');
        });

      });
    });
  });

  describe('given a question message-box', function() {
    describe('when title is not provided', function() {
      beforeEach(function() {
        let options = {
          title: '',
          headline: 'Headline',
          text: 'Message'
        }

        this.messageBox.show(options, 'question');
        this.$rootScope.$digest();
      });

      it('should translate default question title', function() {
        let modalTitle = document.querySelector('.modal .modal-title');
        expect(modalTitle.textContent).toEqual('Question');
      });
    });
  });

  describe('given an error message-box', function() {
    describe('when title is not provided', function() {
      beforeEach(function() {
        let options = {
          title: '',
          headline: 'Headline',
          text: 'Message'
        }

        this.messageBox.show(options, 'error');
        this.$rootScope.$digest();
      });

      it('should translate default question title', function() {
        let modalTitle = document.querySelector('.modal .modal-title');
        expect(modalTitle.textContent).toEqual('Error');
      });
    });
  });
});
