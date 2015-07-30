/**
 * @name messages.center
 * @requires utils.config
 * @requires utils.ajax
 * @requires utils.renderer
 * @description
 * Module for rendering the message center widget
 */
var config = require('../utils/config'),
  ajax = require('../utils/ajax'),
  i18n = require('../helpers/i18n').i18n,
  constants = require('../utils/constants'),
  Taggle = require('../utils/taggle'),
  renderer = require('../utils/renderer'),
  template = require('./index.hbs'),
  listTemplate = require('./list.hbs'),
  messageItemTemplate = require('./item.hbs'),
  messageContentTemplate = require('./content.hbs'),
  messageCountTemplate = require('./header.hbs');

var ID_ATTR = 'data-id',
  MESSAGE_READ = 'R',
  MESSAGE_UNREAD = 'N';

var selector = '#modular-mega-menu-header .message-center-placeholder',
  mainSelector = selector + ' .message-center .modal-body',
  messageCountSelector = selector + ' .message-center .modal-title';

// ui variables
var mainView,
  messageCenter,
  messageCenterForward,
  messageCenterForwardEmails,
  messageCenterForwardComment,
  messageCenterDelete,
  messageCenterMessages,
  messageURIBase;

/**
 * Taken from billing center application.
 * @param {String} term string to check
 * @returns {Boolean} true if the input string matches the "email" regex.
 */
function isValidEmail(term) {
  var VALID_EMAIL_RE = /\S+@(\S+\.)+\S+/;

  return VALID_EMAIL_RE.test(term);
}

/**
 * Returns a message by messageId
 * @param {Number} id ID to look up
 * @returns {Object} an individual message
 * @private
 */
function getMessageById(id) {
  return messageCenterMessages.filter(function(message) {
    return message.messageId === id;
  })[0];
}

/**
 * Helper method to get the number of unread messages
 * @returns {String} the i18n string we need to display
 * @private
 */
function getUnreadCountString() {
  var length = messageCenterMessages.filter(function(msg) {
    return msg.status === MESSAGE_UNREAD;
  }).length;

  return i18n('messages.unread', {count: length}).toUpperCase();
}

/**
 * Binds events for this module
 * @private
 */
function bindEvents() {
  mainView = document.querySelector(selector);
  messageCenter = mainView.querySelector('.message-center');
  messageCenterForward = mainView.querySelector('.forward');
  messageCenterDelete = mainView.querySelector('.delete');
  messageCenterForwardComment = messageCenterForward.querySelector('textarea');

  messageCenter.querySelector('.close-icon').addEventListener('click', closeMessageCenter);

  messageCenterForward.querySelector('.close-icon').addEventListener('click', showMessageCenter);
  messageCenterForward.querySelector('button.cancel').addEventListener('click', showMessageCenter);
  messageCenterForward.querySelector('button.primary').addEventListener('click', forwardMessage);

  messageCenterDelete.querySelector('.close-icon').addEventListener('click', showMessageCenter);
  messageCenterDelete.querySelector('button.cancel').addEventListener('click', showMessageCenter);
  messageCenterDelete.querySelector('button.primary').addEventListener('click', deleteMessage);
}

/**
 * Closes the message center. Events will lose their DOM binding so they will be eventually
 * garbage collected.
 */
function closeMessageCenter() {
  mainView.innerHTML = '';
}

/**
 * Renders the header for the message count. Includes number of read and unread messages
 * @private
 */
function renderMessageCountHeader() {
  renderer.render(messageCountSelector, messageCountTemplate, {
    read: i18n('messages.header', {count: messageCenterMessages.length}).toUpperCase(),
    unread: getUnreadCountString()
  });
}

/**
 * Renders the message list and binds events
 * @private
 */
function renderMessageList() {
  var messagesDom, i;

  renderer.render(mainSelector, listTemplate, {
    messages: messageCenterMessages
  });

  messagesDom = messageCenter.querySelectorAll('tbody tr');
  for (i = 0; i < messagesDom.length; i++) {
    messagesDom[i].addEventListener('click', renderMessageEvent);
    messagesDom[i].querySelector('.luna-reply').addEventListener('click', showForwardMessage);
    messagesDom[i].querySelector('.luna-trash').addEventListener('click', showDeleteMessage);
  }
}

// email addresses are separated with a space when sending to server
function showForwardMessage(e) {
  var id, elem;

  e.preventDefault();
  e.stopPropagation();

  id = e.currentTarget.getAttribute(ID_ATTR);
  messageCenterForward.setAttribute(ID_ATTR, id);

  messageCenterForward.classList.add(constants.SHOW_CLASS);
  messageCenter.classList.remove(constants.SHOW_CLASS);

  // initialize taggle after showing the mesesage, otherwise the input doesn't size correctly
  elem = messageCenterForward.querySelector('.emails');

  // only new the taggle instance once
  if (!messageCenterForwardEmails || messageCenterForwardEmails.getContainer() !== elem) {
    messageCenterForwardEmails = new Taggle(elem, {
      validate: isValidEmail,
      placeholder: i18n('messages.forwardEmailValidation')
    });
  }

  messageCenterForwardEmails.removeAll();
  messageCenterForwardEmails.getContainer().classList.remove('invalid');
  messageCenterForwardComment.value = '';
}

function showDeleteMessage(e) {
  var id;

  e.preventDefault();
  e.stopPropagation();

  id = e.currentTarget.getAttribute(ID_ATTR);
  messageCenterDelete.setAttribute(ID_ATTR, id);

  messageCenterDelete.classList.add(constants.SHOW_CLASS);
  messageCenter.classList.remove(constants.SHOW_CLASS);
}

function showMessageCenter() {
  messageCenterDelete.setAttribute(ID_ATTR, '');
  messageCenterForward.setAttribute(ID_ATTR, '');

  messageCenterForward.classList.remove(constants.SHOW_CLASS);
  messageCenterDelete.classList.remove(constants.SHOW_CLASS);
  messageCenter.classList.add(constants.SHOW_CLASS);
}

/**
 * Call back for when a message is clicked in the list
 * @param {Object} e event
 * @private
 */
function renderMessageEvent(e) {
  var id = parseInt(e.currentTarget.getAttribute(ID_ATTR), 10);
  var message = getMessageById(id);

  renderMessage(message);
}

/**
 * Renders an individual message and binds events
 * @param {Object} message the message to render
 * @private
 */
function renderMessage(message) {
  var index = messageCenterMessages.indexOf(message),
    length = messageCenterMessages.length,
    prev, next, messageContent, frame;

  if (index > 0) {
    prev = messageCenterMessages[index - 1];
  }

  if (index < length) {
    next = messageCenterMessages[index + 1];
  }

  renderer.render(mainSelector, messageItemTemplate, {
    message: message,
    prev: prev,
    next: next
  });

  messageCenter.querySelector('.list').addEventListener('click', renderMessageList);
  messageCenter.querySelector('.prev').addEventListener('click', function() {
    renderMessage(prev);
  });
  messageCenter.querySelector('.next').addEventListener('click', function() {
    renderMessage(next);
  });

  messageCenter.querySelector('.luna-reply').addEventListener('click', showForwardMessage);
  messageCenter.querySelector('.luna-trash').addEventListener('click', showDeleteMessage);

  // renders the message content as an iframe. Super ugly but we need to allow for HTML
  messageContent = messageContentTemplate({
    content: message.content
  });
  frame = messageCenter.querySelector('iframe');
  frame.contentDocument.write(messageContent);

  if (message.status === MESSAGE_UNREAD) {
    markMessageRead(message);
  }
}

/**
 * Marks a message as read
 * @param {Object} message the message to mark as read
 * @param {String} message.messageId The id of this message
 * @private
 */
function markMessageRead(message) {
  var url = messageURIBase + message.messageId + '.json',
    newElem;

  ajax.put(url, {status: MESSAGE_READ}, function(err) {
    if (!err) {
      newElem = getMessageById(message.messageId);
      newElem.status = MESSAGE_READ;
      renderMessageCountHeader();
    }
  });
}

function forwardMessage() {
  var id = parseInt(messageCenterForward.getAttribute(ID_ATTR), 10),
    url = '/portal/pages/messagecenter/forward_email.jsp',
    data;

  // validate
  if (messageCenterForwardEmails.getTagValues().length === 0) {
    messageCenterForwardEmails.getContainer().classList.add('invalid');
    return;
  }

  data = {
    'aui-mc-postid': id,
    'aui-mc-addresses': encodeURIComponent(messageCenterForwardEmails.getTagValues()),
    'aui-mc-comments': encodeURIComponent(messageCenterForwardComment.value)
  };

  ajax.post(url, data, function() { });
  showMessageCenter();
}

function deleteMessage() {
  var id = parseInt(messageCenterDelete.getAttribute(ID_ATTR), 10),
    url = messageURIBase + id;

  // delete the message
  ajax.delete(url, function() {
    messageCenterMessages = messageCenterMessages.filter(function(message) {
      return message.messageId !== id;
    });

    renderMessageList();
    renderMessageCountHeader();
    showMessageCenter();
  });
}

/**
 * @methodOf messages.center
 * @name messages.center.render
 * @param {Function} [callback] optional callback
 * @description
 * Renders the message center
 */
function render(callback) {
  config(function(data) {
    var url = '/svcs/messagecenter/' + encodeURIComponent(data.username) +
      '/messages.json?orderbyasc1=false&orderbyasc2=true&orderbyattr2=' +
      'messagetyperanking&orderbyattr1=modifieddate';

    messageURIBase = '/svcs/messagecenter/' + encodeURIComponent(data.username) + '/message/';
    ajax.get(url, function(err, messageData) {
      if (!err) {
        messageCenterMessages = messageData.messages;
        renderer.render(selector, template, {});
        renderMessageCountHeader();
        bindEvents();
        renderMessageList();
      }

      if (typeof callback === 'function') {
        callback(!err);
      }
    });

  });
}

module.exports = {
  render: render
};

