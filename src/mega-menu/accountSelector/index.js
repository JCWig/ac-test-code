/**
 * @name accountSelector
 * @requires utils.config
 * @requires utils.renderer
 * @requires popup
 * @description
 * Module for showing the account selector dropdown
 */
var config = require('../utils/config'),
  fetchAndRender = require('../utils/renderer').fetchAndRender,
  template = require('./accountList.hbs'),
  Popup = require('../popup');

var selector = '#modular-mega-menu-header .account-selector-menu',
  accountList, header, accountSelector;

/**
 * Shows or hides the account list. We declare it here just so we don't have to clean up the event
 * listeners if we render multiple times as this function won't be added twice.
 */
function toggleAccountList() {
  // this class is added in the menu module (which renders grp.json) so we have to check in the
  // click handler because we don't know which json call will return first. Alternative is to use
  // a pub/sub implementation
  if (!accountSelector.classList.contains('no-hover')) {
    accountList.toggle();
  }
}

/**
 * Hide the account list unless we click outside of the account selector.
 * @param {Object} e event
 */
function outsideClicked(e) {
  // don't hide if we're clicking on the account selector because we want to close the menu.
  // if we hide the popup here then it will just occur again because this event will occur before
  // the click event bubbles from the accountSelector element
  if (e.target !== accountSelector && e.target !== header) {
    accountList.hide();
  }
}

/**
 * Adds event listeners to control showing / hiding the account selector. We never call
 * removeEventListener because the function we attach never changes across multiple calls to
 * this method.
 * @see http://www.w3.org/TR/2011/WD-dom-20110915/#dom-eventtarget-addeventlistener
 */
function bindEvents() {
  var html = document.querySelector('html'),
    nav = document.querySelector(selector + ' nav');

  // cache globals since this is a singleton
  header = document.querySelector(selector + ' header');
  accountSelector = document.querySelector('.account-selector');
  accountList = new Popup(nav, accountSelector);

  accountSelector.addEventListener('click', toggleAccountList);
  html.addEventListener('click', outsideClicked, true);
}

/**
 * @methodOf accountSelector
 * @name accountSelector.render
 * @param {Function} [callback] optional callback to be invoked upon completion.
 * @description
 * Renders the account selector dropdown
 */
function render(callback) {
  config(function(data) {
    var url = '/ui/services/nav/megamenu/' + encodeURIComponent(data.username) + '/accounts.json';

    fetchAndRender(url, selector, template, function() {
      bindEvents();

      if (typeof callback === 'function') {
        callback.apply(this, arguments);
      }
    });
  });
}

module.exports = {
  render: render
};

