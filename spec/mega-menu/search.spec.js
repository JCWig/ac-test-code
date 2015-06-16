/* globals beforeEach, afterEach, sinon, $ */

'use strict';

var search = require('../../src/mega-menu/search'),
  keyup = require('./phantom-utils').keyup,
  clickElement = require('./phantom-utils').clickElement,
  HIDE_CLASS = require('../../src/mega-menu/utils/constants').HIDE_CLASS;

var SEARCH_DELAY = 200;

var spy, categoryButton, input, menu, searchResults;

describe('search', function() {
  beforeEach(function() {
    this.server = sinon.fakeServer.create();

    this.server.respondWith('GET', /\/search\/api\/v1\/query/, [
      200, {'Content-Type': 'application/json'}, JSON.stringify({
        'typeFacets': {
          'all': {
            'key': 'all',
            'label': 'All',
            'count': 9002
          },
          'group': {
            'key': 'group',
            'label': 'Group',
            'count': 2
          },
          'property': {
            'key': 'property',
            'label': 'Properties',
            'count': 6
          }
        },
        'hits': [
          {
            'id': '1',
            'type': 'group',
            'title': 'Kittens',
            'classes': null,
            'description': [
              'Kitties!'
            ]
          },
          {
            'id': '2',
            'type': 'group',
            'title': 'Give me treats!',
            'classes': null,
            'description': [
              'Yummy!'
            ]
          }
        ]
      })
    ]);
  });

  afterEach(function() {
    this.server.restore();
  });

  beforeEach(function() {
    spy = jasmine.createSpy();
    search.render(spy);
    this.server.respond();

    // set up global dom elements for usage in tests
    categoryButton = $('.search-placeholder button');
    input = $('input.search');
    menu = $('.search-categories');
    searchResults = $('.search-placeholder .search-results');
  });

  it('should call the callback', function() {
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should open the category menu when clicked', function() {
    expect(menu.hasClass(HIDE_CLASS)).toBe(true);
    clickElement(categoryButton);
    expect(menu.hasClass(HIDE_CLASS)).not.toBe(true);
  });

  it('should close the category menu when clicked outside', function() {
    clickElement(categoryButton);
    clickElement($('body'));
    expect(menu.hasClass(HIDE_CLASS)).toBe(true);
  });

  it('should change the placeholder text in the input box when a category is selected', function() {
    clickElement(categoryButton);
    clickElement(menu.find('li[data-value="search.kb"]'));
    expect(input.attr('placeholder')).toEqual('Search for kb');
  });

  it('should show a different placeholder text when "Docs" is selected', function() {
    clickElement(categoryButton);
    clickElement(menu.find('li[data-value="search.documentation"]'));
    expect(input.attr('placeholder')).toEqual('Search for docs');
  });

  it('should show a different placeholder text when "ALL" is selected', function() {
    clickElement(categoryButton);
    clickElement(menu.find('li[data-value="search.all"]'));
    expect(input.attr('placeholder')).toEqual('Search');
  });

  it('should close the search box if the escape key is pressed', function() {
    input.val('asdf');
    keyup(input, 13);

    keyup(input, 27);
    expect(searchResults.hasClass(HIDE_CLASS)).toBe(true);
  });

  it('should open the search box if the down arrow is pressed and there is input text', function() {
    input.val('asdf');
    keyup(input, 13);

    keyup(input, 27); // press escape to close the results
    keyup(input, 40); // press down arrow to open it again

    expect(searchResults.hasClass(HIDE_CLASS)).not.toBe(true);
  });

  it('should search, after a delay, when text is entered', function(done) {
    input.val('asdf');
    keyup(input, 13);

    // awful way for doing a search because the search uses promises and we have no way to resolve them in a single
    // stack frame. So we have to use setinterval to create new execution stack frames so the promise can be resolved
    var _this = this;
    setInterval(function() {
      _this.server.respond();
      var sections = $('.search-placeholder .search-results header');
      if (sections.length > 0) {
        done();
      }
    }, SEARCH_DELAY);
  });

  it('should toggle the selected category when a section header is clicked', function(done) {
    input.val('a search term');
    keyup(input, 13);

    var _this = this;
    setInterval(function() {
      _this.server.respond();
      var sections = $('.search-placeholder .search-results header');
      if (sections.length > 0) {

        clickElement(sections.first()); // should be 'properties' as per the CATEGORIES array
        expect(categoryButton.text().trim()).toEqual('properties');

        clickElement(sections.first());
        expect(categoryButton.text().trim()).toEqual('ALL');

        done();
      }
    }, SEARCH_DELAY);
  });

  it('should go to another page when a result is clicked', function(done) {

    input.val('a search term');
    keyup(input, 13);

    // redirect will log their output in karma tests so we stub that and look for the URL to be logged
    var stub = sinon.stub(window.console, 'log');

    var _this = this;
    setInterval(function() {
      _this.server.respond();
      var sections = $('.search-placeholder .search-results header');
      if (sections.length > 0) {

        clickElement($('.search-placeholder .search-results section.result').first());

        var lastConsoleLog = stub.getCall(0).args[0];
        expect(lastConsoleLog).toContain('R:');
        expect(lastConsoleLog).toContain('/search/#q');
        stub.restore();
        done();
      }
    }, SEARCH_DELAY);

  });

});
