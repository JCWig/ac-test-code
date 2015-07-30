/**
 * @name contextSelector
 * @requires utils.config
 * @requires utils.ajax
 * @requires utils.renderer
 * @requires utils.constants
 * @requires utils.debounce
 * @requires popup
 * @description
 * Module for showing the context selector dropdown
 */
var angular = require('angular'),
  config = require('../utils/config'),
  i18n = require('../helpers/i18n').i18n,
  ajax = require('../utils/ajax'),
  renderer = require('../utils/renderer'),
  debounce = require('../utils/debounce'),
  flatten = require('../utils/flatten'),
  Popup = require('../popup'),
  template = require('./contextSelector.hbs'),
  searchResultsTemplate = require('./contextSearchResults.hbs'),
  HIDE_CLASS = require('../utils/constants').HIDE_CLASS;

var selector = '#modular-mega-menu-header .context-selector';

var searchResultsSelector = '#modular-mega-menu-header .context .search-results';

var DEBOUNCE_DELAY = 100; // milliseconds

var contextSelector,  // the popup
  contextWithArl,     // data with ARL info
  contextWithCpcodes, // data with cpcode info
  allContexts,        // DOM element representing all context info
  searchResults;      // DOM element for showing search results

var performSearch;

require('native-promise-only');

/**
 * A cribbed method to escape regex control characters out of a regex so we can parse it as a
 * string.
 * @param {String} str string to escape
 * @returns {*} an escaped string
 */
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

/**
 * Function we call when the user performs a search. Simply handles showing/hiding the proper
 * sections. Heavy lifting is done by the search function. To be in line with the current
 * implementation, we only check one list depending on whether the input is numeric or not. The
 * current context selector will only return matches against context names and ARLs if the input
 * is not numeric and return matches against context names and cpcodes if the input is numeric.
 * @param {Object} e error
 */
performSearch = debounce(function(e) {
  var searchString = e.target.value.trim();

  if (searchString.length) {
    renderer.render(searchResultsSelector, searchResultsTemplate, getResults(searchString));

    searchResults.classList.remove(HIDE_CLASS);
    allContexts.classList.add(HIDE_CLASS);
  } else {
    searchResults.classList.add(HIDE_CLASS);
    allContexts.classList.remove(HIDE_CLASS);
  }

}, DEBOUNCE_DELAY);

/**
 * Handles filtering either `contextWithArl` or `contextWithCpcodes`.
 * @param {String} search text to search
 * @returns {Object} result data
 */
function getResults(search) {
  var data = contextWithArl,
    searchRegex = new RegExp(escapeRegExp(search), 'gi'),
    results = {
      query: searchRegex,
      extraText: i18n('context.arl'),
      extraKey: 'dps'
    };

  // input is numeric?
  if (parseInt(search, 10).toString() === search) {
    data = contextWithCpcodes;
    results.extraText = i18n('context.cpcode');
    results.extraKey = 'cps';
  }

  results.items = data.filter(angular.bind(this, searchMatch, searchRegex, results.extraKey));
  return results;
}

/**
 * Determines if a single object matches
 * @param {RegExp} searchRegex The inputted search string plus case insensitive regex options
 * @param {String} extraKey Key into either cpcodes or arl array. Used to check for secondary
 * matches
 * @param {Object} object The object we should search.
 * @param {String} object.name Primary field we search
 * @param {String[]} object.cps List of cpcodes associated with this object. Which one we search
 * is defined by `extraKey`.
 * @param {String[]} object.dps List of ARLs associated with this object.
 * @returns {boolean} true if object matches
 */
function searchMatch(searchRegex, extraKey, object) {

  // either array of ARLs or CPCodes
  var extraData = object[extraKey] || [],
    testFn = function(item) {
      return searchRegex.test(item);
    };

  // match the actual name or the cps / dps array
  return !!(testFn(object.name) || extraData.some(testFn));
}

/**
 * Binds all events for this component
 */
function bindEvents() {
  var html = document.querySelector('html'),
    el = document.querySelector(selector),
    nav = el.querySelector('nav'),
    arrowDownIcons = el.querySelectorAll('a + i'),
    search = el.querySelector('input'),
    i, item;

  // references to the two scrollable panels that we may show
  allContexts = el.querySelector('.all-contexts');
  searchResults = document.querySelector(searchResultsSelector);

  contextSelector = new Popup(nav, nav.parentElement);

  el.addEventListener('click', angular.bind(contextSelector, contextSelector.toggle));

  html.addEventListener('click', function(e) {
    if (e.target !== el) {
      contextSelector.hide();
    }
  }, true);

  for (i = 0; i < arrowDownIcons.length; i++) {
    item = arrowDownIcons[i];
    item.addEventListener('click', toggleMenu);
  }

  search.addEventListener('keyup', performSearch);
}

/**
 * Callback for when the user clicks on the arrow icon. Used to toggle showing sub-menu items
 */
function toggleMenu() {
  this.parentElement.nextElementSibling.classList.toggle(HIDE_CLASS);
  this.previousElementSibling.classList.toggle('open');
  this.classList.toggle('arrow-up');
  this.classList.toggle('arrow-down');
}

/**
 * @methodOf accountSelector
 * @name accountSelector.render
 * @param {Object} contextData required data from reading context.json
 * @param {Function} [callback] optional callback to be invoked upon completion.
 * @description
 * Renders the account selector dropdown
 */
function render(contextData, callback) {
  config(function(data) {
    var cpcodesURL = '/ui/services/nav/megamenu/' + encodeURIComponent(data.username) +
      '/cpcodes.json';

    var cpPromise = ajax.promiseGet(cpcodesURL);

    cpPromise.then(function(value) {
      contextWithArl = flatten(contextData.context.mainMenuItems, 'subMenuItems');
      contextWithCpcodes = flatten(value.context.mainMenuItems, 'subMenuItems');

      renderer.render(selector, template, contextData.context);
      bindEvents();
      if (typeof callback === 'function') {
        callback(true);
      }
    }, function() {
      if (typeof callback === 'function') {
        callback(false);
      }
    });

  });
}

module.exports = {
  render: render
};

