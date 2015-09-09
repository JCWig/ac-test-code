'use strict';

var STATUS_MESSAGE_CONTENT = '.status-message-content';

describe('akamai.components.status-message-group', function() {
  beforeEach(function() {
    inject.strictDi(true);

    angular.mock.module(require('../../src/status-message').name);
    inject(function($compile, $rootScope, $timeout, statusMessage) {
      this.scope = $rootScope.$new();
      this.$timeout = $timeout;
      this.$compile = $compile;
      this.statusMessage = statusMessage;
    });
  });

  afterEach(function() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
  });


  describe('given status message group directive and statusMessage service', function(){
    describe('when multiple status messages are returned from the getItems', function(){
      beforeEach(function(){
        spyOn(this.statusMessage, 'getItems').and.returnValue([{
          "itemId": "first-item-id",
          "text": "First Text Field",
          "timeout": 2000
        }, {
          "itemId": "second-item-id",
          "text": "Second Text Field",
          "timeout": 2000
        }]);

        this.el = this.$compile('<akam-status-message-group></akam-status-message-group>')(this.scope);
        this.element = document.body.appendChild(this.el[0]);
        this.scope.$digest();
      });

      it('should ensure the first message exists', function(){
        expect(document.querySelector('#first-item-id')).not.toBe(null);
      });

      it('should ensure the first message has the correct text content', function(){
        expect(document.querySelectorAll(STATUS_MESSAGE_CONTENT)[0].textContent).toMatch(/First Text Field/);
      });

      it('should ensure the second message exists', function(){
        expect(document.querySelector('#second-item-id')).not.toBe(null);
      });

      it('should ensure the second message has the correct text content', function(){
        expect(document.querySelectorAll(STATUS_MESSAGE_CONTENT)[1].textContent).toMatch(/Second Text Field/);
      });


    })
  });

  describe('given status message group directive and statusMessage service', function(){
    describe('when multiple status messages are returned from the getItems', function(){
      describe('when timeout occurs for all', function(){
        beforeEach(function(){
          spyOn(this.statusMessage, 'getItems').and.returnValue([{
            "itemId": "first-item-id",
            "text": "First Text Field",
            "timeout": 2000
          }, {
            "itemId": "second-item-id",
            "text": "Second Text Field",
            "timeout": 2000
          }]);

          this.el = this.$compile('<akam-status-message-group></akam-status-message-group>')(this.scope);
          this.element = document.body.appendChild(this.el[0]);
          this.scope.$digest();

          spyOn(this.statusMessage, 'remove');

          this.$timeout.flush();
          this.$timeout.flush();
          this.$timeout.verifyNoPendingTasks();
        });

        it('should call remove twice', function() {
          expect(this.statusMessage.remove.calls.count()).toBe(2);
        });
      });
    });
  });

  describe('given status message group directive and statusMessage service', function(){
    describe('when rendering group status messages with no items', function() {
      beforeEach(function(){
        spyOn(this.statusMessage, 'getItems').and.returnValue([]);
        this.el = this.$compile('<akam-status-message-group></akam-status-message-group>')(this.scope);
        this.element = document.body.appendChild(this.el[0]);
        this.scope.$digest();
      });

      it('should not render any messages', function() {
        expect(document.querySelector(STATUS_MESSAGE_CONTENT)).toBe(null);
      });
    });
  });
});
