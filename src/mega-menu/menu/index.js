/**
 * @name menu
 * @requires querystring
 * @requires menu.currentAccount
 * @requires menu.tabs
 * @requires menu.user
 * @requires utils.ajax
 * @requires utils.config
 * @requires utils.renderer
 * @requires popup
 * @description
 * Module for handling methods relating to rendering the tabs and popup menu items. This module
 * primarily consumes `grp.json`. Sub modules are responsible for configuring their DOM selector
 * and the template that should be used for rendering.
 */
var querystring = require('querystring'),
  tabs = require('./tabs'),
  user = require('./user'),
  account = require('./currentAccount'),
  renderer = require('../utils/renderer'),
  Popup = require('../popup');

// mapping between data-id and popup objects. Used to figure out which element was clicked
var POPUP_MAPPING = {};

var usersPopup;

var OPEN_TAB = '-1';

/**
 * @methodOf menu
 * @name menu.render
 * @param {Object} data data to render
 * @param {Function} [callback] optional callback to be invoked upon completion. Will be passed a
 * boolean indicating if the render was successful.
 * @description
 * Renders everything for the menu. This includes the tabs, the user info at the top and the popups
 * for when a user clicks a tab. This call will first fetch `config.json` (if it hasn't been
 * fetched before) and then use the username to determine its URL.
 */
function renderAll(data, callback) {
  var qs = querystring.parse(window.location.search.replace('?', ''));

  if (data.tabs && qs.tab) {

    data.tabs = data.tabs.map(function(tab) {
      tab.active = qs.tab === tab.englishName;
      return tab;
    });
  }

  renderer.render(tabs.selector, tabs.template, data.tabs);
  renderer.render(user.selector, user.template, data.users);
  renderer.render(account.selector, account.template, data);

  if (data.hasAccounts !== 'true') {
    document.querySelector(account.selector).classList.add('no-hover');
  }

  bindEvents();

  if (typeof callback === 'function') {
    callback(true);
  }
}

/**
 * Binds click events to handle clicking the tabs.
 * @private
 */
function bindEvents() {
  var html = document.querySelector('html'),
    menu = document.querySelector(tabs.selector),
    items = menu.children,
    i, item, itemId, nav, users, usersPopupEl;

  for (i = 0; i < items.length; i++) {
    item = items[i];
    itemId = item.getAttribute('data-id');
    nav = item.querySelector('nav');

    POPUP_MAPPING[itemId] = new Popup(nav, item);
    item.addEventListener('click', showMenu);
  }

  users = document.querySelector(user.selector);
  usersPopupEl = users.querySelector('.popup');

  usersPopup = new Popup(usersPopupEl, users);
  users.addEventListener('click', showUserPopup);

  // setting useCapture to true should ensure that we call hideMenu before showMenu
  html.addEventListener('click', hideAllMenus, true);
  html.addEventListener('click', hideUserPopup, true);
}

function showUserPopup() {
  usersPopup.toggle();
}

function hideUserPopup(e) {
  if (e.target !== usersPopup.parent.querySelector('a')) {
    usersPopup.hide();
  }
}

/**
 * Hides all menu items
 * @param {Object} e JavaScript event
 * @private
 */
function hideAllMenus(e) {
  var items = document.querySelectorAll(tabs.selector + ' > section'),
    i, item, popup, id;

  for (i = 0; i < items.length; i++) {
    item = items[i];
    popup = POPUP_MAPPING[item.getAttribute('data-id')];

    // this is annoying because e.target is either the h1 element or HTML but we have to do it
    // to ensure that we don't hide the tab if we click on it twice. This allows us to correctly
    // implement the toggle functionality of the menu
    if (e.target.nextElementSibling) {
      id = e.target.parentElement.getAttribute('data-id');
    }

    if (id !== OPEN_TAB) {
      popup.hide();
    }
  }
}

/**
 * Shows a menu item. Expects the `this` parameter to be outer `<section>` element that responds
 * to the click event.
 * @private
 */
function showMenu() {
  var id = this.getAttribute('data-id'),
    popup = POPUP_MAPPING[id];

  popup.toggle();
  OPEN_TAB = id;
}

module.exports = {
  render: renderAll
};

