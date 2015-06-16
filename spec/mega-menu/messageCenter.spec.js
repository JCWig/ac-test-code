/* globals beforeEach, afterEach, sinon, $ */

'use strict';

var messageCenter = require('../../src/mega-menu/messages/center'),
  keydown = require('./phantom-utils').keydown,
  keyup = require('./phantom-utils').keyup,
  clickElement = require('./phantom-utils').clickElement,
  SHOW_CLASS = require('../../src/mega-menu/utils/constants').SHOW_CLASS;

var spy;

describe('message center', function() {

  beforeEach(function() {
    this.server = sinon.fakeServer.create();

    this.server.respondWith('POST', /forward_email.jsp/, [
      200, {'Content-Type': 'application/json'}, JSON.stringify({})
    ]);

    this.server.respondWith('DELETE', /message\/1$/, [
      200, {'Content-Type': 'application/json'}, JSON.stringify({})
    ]);

    // message read
    this.server.respondWith('PUT', /message\/1.json/, [
      200, {'Content-Type': 'application/json'}, JSON.stringify({})
    ]);

    this.server.respondWith('GET', /messages.json/, [
      200, {'Content-Type': 'application/json'}, JSON.stringify({
        "messages": [{
          "content": "No content",
          "messageId": 1,
          "shortContent": "Blah blah blah",
          "createdDate": (new Date().valueOf()),
          "status": "N",
          "summary": "Blah"
        }, {
          "content": "Dear human, we wish to be patted more. And please give us more treats. Signed: all cats",
          "messageId": 2,
          "shortContent": "Meow meow meow meow",
          "createdDate": (new Date().valueOf()),
          "status": "R",
          "summary": "Message to humans"
        }
        ]
      })
    ]);
  });

  afterEach(function() {
    this.server.restore();
  });

  beforeEach(function() {
    spy = jasmine.createSpy('spy');
    messageCenter.render(spy);
    this.server.respond();
  });
  it('should render on success', function() {
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should close when the close icon is clicked', function() {
    clickElement($('.message-center .close-icon'));
    expect($('.message-center.modal').length).toEqual(0);
  });

  describe('list view', function() {

    it('should show a message when clicked', function() {
      clickElement($('.message-center tbody tr:first'));
      expect($('.message-center .message').length).toEqual(1);
    });

    it('should show the delete dialog when clicked', function() {
      clickElement($('.message-center tbody tr:first .luna-trash'));
      expect($('.delete.modal').hasClass(SHOW_CLASS)).toBe(true);
    });

    it('should show the forward dialog when clicked', function() {
      clickElement($('.message-center tbody tr:first .luna-reply'));
      expect($('.forward.modal').hasClass(SHOW_CLASS)).toBe(true);
    });

    it('should mark the message read when clicked', function() {
      var readMessages = $('.message-center tbody .read').length;

      clickElement($('.message-center tbody tr:first'));
      this.server.respond();
      clickElement($('.message-center .button.list'));

      // both messages should be read now and have the "read" class
      expect($('.message-center tbody .read').length).toEqual(readMessages + 1);
    });

  });

  describe('item view', function() {

    it('should go to the next item when "next" is clicked', function() {
      clickElement($('.message-center tbody tr:first'));
      clickElement($('.message-center .message button.next'));
      expect($('.message-center .message .subject').text()).toEqual('Message to humans');
    });

    it('should go to the previous item when "prev" is clicked', function() {
      clickElement($('.message-center tbody tr:first'));
      clickElement($('.message-center .message button.next'));
      clickElement($('.message-center .message button.prev'));
      expect($('.message-center .message .subject').text()).toEqual('Blah');
    });

  });

  describe('delete dialog', function() {

    it('should show message center when close icon is clicked', function() {
      clickElement($('.message-center tbody tr:first .luna-trash'));
      clickElement($('.delete.modal .close-icon'));
      expect($('.delete.modal').hasClass(SHOW_CLASS)).not.toBe(true);
      expect($('.message-center.modal').hasClass(SHOW_CLASS)).toBe(true);
    });

    it('should remove a row when a message is deleted', function() {
      var numRows = $('.message-center tbody tr').length;
      clickElement($('.message-center tbody tr:first .luna-trash'));
      clickElement($('.delete.modal .button.primary'));
      this.server.respond();
      expect($('.message-center tbody tr').length).toEqual(numRows - 1);
    });

  });

  describe('forward dialog', function() {

    it('should show message center when close icon is clicked', function() {
      clickElement($('.message-center tbody tr:first .luna-reply'));
      clickElement($('.forward.modal .close-icon'));
      expect($('.forward.modal').hasClass(SHOW_CLASS)).not.toBe(true);
      expect($('.message-center.modal').hasClass(SHOW_CLASS)).toBe(true);
    });

    it('should mark the email input invalid if it is empty on submission', function() {
      clickElement($('.message-center tbody tr:first .luna-reply'));
      clickElement($('.forward.modal .button.primary'));
      expect($('.forward.modal .emails').hasClass('invalid')).toBe(true);
    });

    it('should show the main view when submitted', function() {
      clickElement($('.message-center tbody tr:first .luna-reply'));

      // enter some email addresses
      clickElement($('.forward.modal .emails'));
      var $input = $('.taggle_input');
      $input.val('some@email.com');
      keydown($input, 13);
      keyup($input, 13);

      clickElement($('.forward.modal .button.primary'));
      this.server.respond();
      expect($('.message-center.modal').hasClass(SHOW_CLASS)).toBe(true);
    });

  });

});
