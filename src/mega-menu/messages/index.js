/**
 * @name messages
 * @requires utils.config
 * @requires utils.renderer
 * @requires messages.center
 * @description
 * Module for showing the alert count
 */
var config = require('../utils/config'),
  messageCenter = require('./center'),
  fetchAndRender = require('../utils/renderer').fetchAndRender,
  template = require('./messageCount.hbs'),
  i18n = require('../helpers/i18n').i18n;

var selector = '#modular-mega-menu-header .messages-count';

/**
 * @name messages.render
 * @param {Function} [callback] optional callback
 * @description
 * Renders the message count
 */
function render(callback) {
  config(function(data) {
    var url;

    document.querySelector(selector).innerHTML = i18n('header.messages');
    url = '/svcs/messagecenter/' + encodeURIComponent(data.username) +
    '/messages/count.json?status=N&gerpy=' + (new Date()).valueOf();
    fetchAndRender(url, selector, template, function(status) {

      // render the message center when we click on the message count link
      document.querySelector(selector).addEventListener('click', messageCenter.render);

      if (typeof callback === 'function') {
        callback(status);
      }
    });
  });
}

module.exports = {
  render: render
};

