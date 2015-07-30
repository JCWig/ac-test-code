/**
 * @name search
 * @requires utils.ajax
 * @requires utils.renderer
 * @requires popup
 * @description
 * Module for showing the alert count
 */
var renderer = require('../utils/renderer'),
  ajax = require('../utils/ajax'),
  i18n = require('../helpers/i18n').i18n,
  debounce = require('../utils/debounce'),
  redirect = require('../utils/redirect'),
  windowOpen = require('../utils/open'),
  searchTargetBlank = require('../helpers/searchTargetBlank'),
  Popup = require('../popup'),
  template = require('./search.hbs'),
  selectedCategoryTemplate = require('./searchSelectedCategory.hbs'),
  searchResultsTemplate = require('./searchResults.hbs'),
  HIDE_CLASS = require('../utils/constants').HIDE_CLASS;

var DEBOUNCE_DELAY = 200; // milliseconds
var NUM_PER_CATEGORY = 5;

// UI elements
var categoryButton, categoryValue, categoryMenu, searchInput, resultPopup, loadingIndicator,
  noResultsIndicator;

var SELECTED_CATEGORY = 'search.all', LAST_SEARCH = '';

// debounced event handler for the search input box
var debouncedSearch = debounce(function(e) {
  var query = e.target.value.trim();

  if (query && query !== LAST_SEARCH) {
    LAST_SEARCH = query;
    search(query);
  }
}, DEBOUNCE_DELAY);

var selector = '#modular-mega-menu-header .search-placeholder',
  selectedCategorySelector = '#modular-mega-menu-header .selected-placeholder';

// categories for the search box. The ID and displayKey are used for i18n. category is used as a
// query param when calling the search API
var CATEGORIES = [{
  id: 'search.all',
  category: 'all',
  hideFromResults: true,   // used to not show a section in the results
  displayKey: 'search.all' //used for header i18n
}, {
  id: 'search.accounts',
  category: 'accounts',
  displayKey: 'search.accounts'
}, {
  id: 'search.applications',
  category: 'applications',
  displayKey: 'search.applications'
}, {
  id: 'search.properties',
  category: 'property',
  displayKey: 'search.properties'
}, {
  id: 'search.groups',
  category: 'group',
  displayKey: 'search.groups'
}, {
  id: 'search.users',
  category: 'users',
  displayKey: 'search.users'
}, {
  id: 'search.documentation',
  category: 'documentation',
  displayKey: 'search.documentation'
}, {
  id: 'search.kb',
  category: 'knowledge_base',
  displayKey: 'search.knowledgeBase'
}];

// polyfill
require('native-promise-only');

/**
 * Finds a category object given an ID
 * @param {String} id id to check
 * @returns {*} the category with the given id
 */
function categoryById(id) {
  return CATEGORIES.filter(function(element) {
    return element.id === id;
  })[0];
}

/**
 * Takes in the ID of the category you wish to fetch and generates the right URL
 *
 * @param {String} query query to run
 * @param {String} category category to check
 * @returns {String} url for search
 */
function getUrl(query, category) {
  return '/search/api/v1/query?offset=0&limit=' + NUM_PER_CATEGORY + '&category=' + category +
    '&q=' + encodeURIComponent(query);
}

/**
 * Method to get the URL to the search results page
 * @param {String} query query to run
 * @param {String} category category to check
 * @returns {String} search page URL
 */
function getSearchResults(query, category) {
  return '/search/#q=' + encodeURIComponent(query) + '&category=' + category;
}

/**
 * Simple method to set values for module level DOM elements
 * @private
 */
function bindElements() {
  categoryButton = document.querySelector(selector + ' button');
  categoryMenu = document.querySelector(selector + ' .search-categories');
  categoryValue = categoryButton.querySelector('span');
  searchInput = document.querySelector(selector + ' input.search');
  resultPopup = new Popup(document.querySelector('.popup.search-results'), searchInput);
  loadingIndicator = document.querySelector('.popup.search-results .loading');
  noResultsIndicator = document.querySelector('.popup.search-results .no-results');
}

/**
 * Binds click events for search
 * @private
 */
function bindEvents() {
  var html = document.querySelector('html');

  categoryButton.addEventListener('click', toggleMenu);
  html.addEventListener('click', hideMenu, true);
  categoryMenu.addEventListener('click', getNewSelectedItem);
  searchInput.addEventListener('keyup', debouncedSearch);
  searchInput.addEventListener('keyup', toggleResultsPopup);
  searchInput.addEventListener('focus', toggleResultsPopup);
}

/**
 * Handles what happens when a user clicks on a row in the section, as well as what happens when
 * a user clicks on the section title itself
 * @param {String} sectionSelector Used to find the section that is being rendered
 */
function bindRowEvents(sectionSelector) {
  var rows = document.querySelectorAll(sectionSelector + ' section'),
    i, row, header;

  for (i = 0; i < rows.length; i++) {
    row = rows[i];
    row.addEventListener('click', searchResultClicked);
  }

  header = document.querySelector(sectionSelector + ' header');
  header.addEventListener('click', headerClicked);
}

/**
 * When the header is clicked, we toggle the category in the search dropdown between the clicked
 * header's category and "All".
 * @this HTMLElement
 */
function headerClicked() {
  var category = this.getAttribute('data-category');

  if (SELECTED_CATEGORY !== 'search.all') {
    category = 'search.all';
  }
  changeSelectedItem(category);
  resultPopup.show();
}

/**
 * Since it's weird to have anchor tags inside of anchor tags, we have to use javascript to
 * basically redirect the user to a url. Some URLs should be opened with `window.open` instead of
 * setting `window.location`.
 * @this HTMLElement
 */
function searchResultClicked() {
  var url = this.getAttribute('data-target'),
    category = this.getAttribute('data-category'),
    elem, query;

  if (url === '') {
    // innerText is IE specific but causes a DOM reflow. Bad IE.
    elem = this.querySelector('.info .title');
    query = elem.textContent || elem.innerText;

    url = getSearchResults(query, category);
  }

  if (searchTargetBlank(category)) {
    windowOpen(url, '_blank');
  } else {
    redirect(url);
  }
}

/**
 * Callback for when we select a category from the dropdown menu
 * @param {Object} e event
 * @private
 */
function getNewSelectedItem(e) {
  var newValue = e.target.getAttribute('data-value');

  changeSelectedItem(newValue);
}

/**
 * Changes the selected value of the dropdown and, if necessary, does a search
 * @param {String} value the new category
 */
function changeSelectedItem(value) {
  var changed = value !== SELECTED_CATEGORY,
    query = searchInput.value.trim(),
    categoryKey, searchKey;

  SELECTED_CATEGORY = value;
  if (changed && query) {
    search(query);
  }

  renderSelectedItem();
  showSections();

  // updates the placeholder text based on what is selected
  categoryKey = SELECTED_CATEGORY;
  searchKey = 'search.search';

  if (categoryKey !== 'search.all') {
    searchKey = 'search.searchFor';
  }
  if (categoryKey === 'search.documentation') {
    categoryKey = 'search.docs';  // of course there is one key that doesn't match 1 to 1.
  }
  searchInput.setAttribute('placeholder', i18n(searchKey, {
    category: i18n(categoryKey).toLowerCase()
  }));
}

/**
 * Convenience method for rendering the selected item.
 * @private
 */
function renderSelectedItem() {
  renderer.render(selectedCategorySelector, selectedCategoryTemplate, {
    selected: SELECTED_CATEGORY
  });
}

/**
 * Shows or hides search sections based on the selected category
 */
function showSections() {
  var sections = document.querySelectorAll('.popup.search-results section'),
    i, section;

  for (i = 0; i < sections.length; i++) {
    section = sections[i];

    if (section.getAttribute('data-value') === SELECTED_CATEGORY ||
      SELECTED_CATEGORY === 'search.all') {
      section.classList.remove(HIDE_CLASS);
    } else {
      section.classList.add(HIDE_CLASS);
    }
  }
}

/**
 * Toggles the menu dropdown
 */
function toggleMenu() {
  categoryButton.classList.toggle('open');
  categoryMenu.classList.toggle(HIDE_CLASS);
}

/**
 * Hides the menu and search result popup
 * @param {Object} e event
 */
function hideMenu(e) {
  if (e.target !== categoryButton && e.target !== categoryValue) {
    categoryButton.classList.remove('open');
    categoryMenu.classList.add(HIDE_CLASS);
  }

  if (e.target !== resultPopup.parent && e.target !== resultPopup.el) {
    resultPopup.hide();
  }
}

/**
 * Toggles the result panel
 * @param {Object} e event
 */
function toggleResultsPopup(e) {
  if (searchInput.value.trim() &&
    (e.keyCode !== 27 /* escape */ || e.keyCode === 40 /* down arrow */ )) {
    resultPopup.show();
  } else {
    resultPopup.hide();
  }
}

/**
 * Searches and renders the results
 * @param {String} query query to run
 * @param {String} category category to check
 * @returns {Promise} a promise to fetch search results
 */
function searchAndRender(query, category) {
  return ajax.promiseGet(getUrl(query, category.category)).then(function(results) {
    var categorySelector = '.popup.search-results section[data-value="' + category.id + '"]';
    var count = results.typeFacets[category.category].count;

    renderer.render(categorySelector, searchResultsTemplate, {
      results: results,
      category: category,
      count: count,
      query: new RegExp(results.query, 'ig'),
      seeAll: i18n('search.seeAll', {category: i18n(category.displayKey)}),
      showAll: count > NUM_PER_CATEGORY
    });

    if (count > 0) {
      bindRowEvents(selector);
    }

    return results; //returns the results so we can continue the promise chain
  });
}

/**
 * Performs a search based on the inputted query. This method will fire several ajax requests
 * so any function limiting should be done before this method is called (i.e. not calling this
 * method if the search text hasn't changed).
 * @param {String} query query to run
 */
function search(query) {
  var promises = [];

  if (SELECTED_CATEGORY === 'search.all') {
    CATEGORIES.forEach(function(category) {
      if (category.id !== 'search.all') {
        promises.push(searchAndRender(query, category));
      }
    });
  } else {
    promises.push(searchAndRender(query, categoryById(SELECTED_CATEGORY)));
  }

  loadingIndicator.classList.remove(HIDE_CLASS);
  Promise.race(promises).then(function() {
    loadingIndicator.classList.add(HIDE_CLASS);
  });

  // show the no results indicator if every promise returns no hits
  noResultsIndicator.classList.add(HIDE_CLASS);
  Promise.all(promises).then(function(values) {
    var total = values.reduce(function(previous, result) {
      return previous + result.hits.length;
    }, 0);

    if (total === 0) {
      noResultsIndicator.classList.remove(HIDE_CLASS);
    }
  });
}

/**
 * @name search.render
 * @param {Function} [callback] optional callback
 * @description
 * Renders the search bar
 */
function render(callback) {
  renderer.render(selector, template, {categories: CATEGORIES});
  renderSelectedItem();
  bindElements();
  bindEvents();

  if (typeof callback === 'function') {
    callback(true);
  }
}

module.exports = {
  render: render
};

