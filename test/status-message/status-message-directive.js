'use strict';

var STATUS_MESSAGE_WRAPPER = '.akam-status-message-item-wrapper';
var STATUS_MESSAGE_CONTENT = '.alert';

describe('akamai.components.status-message-directive', function() {
  beforeEach(function() {
    inject.strictDi(true);
    angular.mock.module(require('../../src/status-message').name);
    inject(function($compile, $rootScope, $timeout, statusMessage) {
      this.scope = $rootScope.$new();
      this.$timeout = $timeout;
      this.statusMessage = statusMessage;

      var markup = '<div><akam-status-message id="identification" text="add a little bit more text" timeout="500"></akam-status-message></div>';
      this.el = $compile(markup)(this.scope);
      this.scope.$digest();
      this.element = document.body.appendChild(this.el[0]);
    });
  });

  afterEach(function() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
  });

  describe('given status-message-directive', function() {

    describe('when rendering', function() {
      beforeEach(function () {
        this.statusMessageBar = document.querySelector(STATUS_MESSAGE_WRAPPER);
        this.statusMessageContent = document.querySelector(STATUS_MESSAGE_CONTENT);
      })

      it('should have an id attribute', function(){
        expect(this.statusMessageBar.hasAttribute('id')).toBe(true);
      });

      it('should have an id that is not empty', function(){
        expect(this.statusMessageBar.getAttribute('id').length).toBeGreaterThan(0);
      });

      it('should have message content that matches the text', function(){
        expect(this.statusMessageContent.textContent).toMatch(/add a little bit more text/);
      });

      it('should default to success status', function() {
        expect(this.statusMessageBar.classList.contains('success')).toBe(true);
      });
    });

  });

  describe('given status-message-directive', function() {

    describe('when timed out', function() {

      beforeEach(function () {
        spyOn(this.statusMessage, 'remove');
        this.$timeout.flush();
        this.$timeout.flush();
        this.scope.$digest();
      });

      it('should call the close method', function(){
        expect(this.statusMessage.remove).toHaveBeenCalled();
      });

    });

  });

});
