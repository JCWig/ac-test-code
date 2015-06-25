'use strict';

/**
 * @ngdoc object
 * @name alerts
 * @requires utils.config
 * @requires utils.renderer
 * @description
 * Module for showing the alert count
 */
var config = require('../utils/config'),
  fetchAndRender = require('../utils/renderer').fetchAndRender,
  template = require('./alertCount.hbs'),
  i18n = require('../helpers/i18n').i18n;

var selector = '#modular-mega-menu-header .alerts-count';

/**
 * @ngdoc function
 * @methodOf alerts
 * @name alerts.render
 * @param {Function} [callback] optional callback to be invoked upon completion.
 * @description
 * Renders the alert count
 */
function render(callback) {
  config(function(data) {
    var url;

    // show something while waiting for the json call
    document.querySelector(selector).innerHTML = i18n('header.alerts');
    url = '/svcs/messagecenter/' + encodeURIComponent(data.username) + '/alertcount.json';
    fetchAndRender(url, selector, template, callback);
  });
}

module.exports = {
  render: render
};

