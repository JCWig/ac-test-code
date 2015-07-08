'use strict';
var utilities = require('../utilities');
var translationMock = require('../fixtures/translationFixture.json');

var selectors = {
  ac: '.akam-autocomplete',
  ac_open: '.akam-autocomplete .open',
  ac_input: '.akam-autocomplete input',
  ac_clear: '.akam-autocomplete .clear-selected',
  ac_tip: '.akam-autocomplete .search-tip',
  ac_toggle: '.akam-autocomplete div.input-toggle',
  ac_option: '.akam-autocomplete span.selected-option',
  ac_defaultProvided: '.akam-autocomplete span.selected-option .default-provided',
  ac_customProvided: '.akam-autocomplete span.selected-option .custom-provided'
};
var config = {
  SEARCH_MINIMUM: 1,
  ITEMS_TEMPLATE_NAME: 'AKAM-AUTOCOMPLETE-ITEMS',
  SELECTED_ITEM_TEMPLATE_NAME: 'AKAM-AUTOCOMPLETE-SELECTED-ITEM'
};
var defaultMarkup = '<akam-autocomplete ng-model="selectedItem"></akam-autocomplete>';

var jsonMock = [{
    first: 'Yair',
    last: 'leviel',
    joined: '2 month ago',
    email: 'yair@email.com'
  }, {
    first: 'Shawn',
    last: 'Dahlen',
    joined: '2 days ago',
    email: 'shawn@ac.org'
  }, {
    first: 'Mike',
    last: "D'Abrosio",
    joined: 'a week ago',
    email: 'mike@gmail.com'
  }, {
    first: 'Nick',
    last: 'Leon',
    joined: 'Just now',
    email: 'nick@msn.com'
  }];

describe('akamAutocomplete directive', function() {

  var scope, compile, self, timeout, controller, objects;

  beforeEach(function() {
    inject.strictDi(true);
    self = this;
    angular.mock.module(require('../../src/autocomplete').name);
    angular.mock.module(function($provide, $translateProvider) {
      $translateProvider.useLoader('i18nCustomLoader');
    });
    inject(function($rootScope, _$compile_, $httpBackend, $timeout) {
      scope = $rootScope.$new();
      compile = _$compile_;

      $httpBackend.when('GET', utilities.LIBRARY_PATH).respond(translationMock);
      $httpBackend.when('GET', utilities.CONFIG_PATH).respond({});
      $httpBackend.flush();
      timeout = $timeout;
    });
    self = this;
  });

  afterEach(function() {
    if (self.element) {
      document.body.removeChild(self.element);
      self.element = null;
    }

  var remainingDropdown = document.querySelector('.dropdown-menu');
    if (remainingDropdown) {
      document.body.removeChild(remainingDropdown);
    }
  });

  function addElement(markup) {
    var tpl = markup ? markup : defaultMarkup;

    tpl = '<div><form name="form">' + tpl + '</form></div>';
    var el = compile(tpl)(scope);
    scope.$digest();
    self.element = document.body.appendChild(el[0]);
  }

  describe("when rendering", function() {
    it('should verify rendered element and attributes', function() {
      addElement();
      var dirEl = document.querySelector(".akam-autocomplete");

      expect(dirEl.classList.length).toBe(4);
      expect(dirEl.classList[0]).toEqual("akam-autocomplete");
      expect(dirEl.classList[1]).toEqual("dropdown");
      expect(dirEl.classList[2]).toEqual("akam-dropdown");

      var childEl = dirEl.querySelector(".input-option");
      expect(childEl).not.toBe(undefined);
    });

    it('should verify rendered input element and attributes and values', function() {
      addElement();
      var inputEl = document.querySelector(selectors.ac_input);

      expect(inputEl.getAttribute('placeholder')).not.toBe(undefined);
      expect(inputEl.getAttribute('id')).not.toBe(undefined);
      expect(inputEl.getAttribute('typeahead')).not.toBe(undefined);
      expect(inputEl.getAttribute('typeahead-on-select')).not.toBe(undefined);
      expect(inputEl.getAttribute('typeahead-min-length')).not.toBe(undefined);
      expect(inputEl.getAttribute('typeahead-template-url')).not.toBe(undefined);
      expect(inputEl.getAttribute('typeahead-focus-first')).not.toBe(undefined);
    });

    it('should verify rendered search tip element and attributes', function() {
      addElement();
      //console.log(self.autocompleteEl)
    });

    it('should verify rendered clear icon element and attributes', function() {
      addElement();
      //console.log(self.autocompleteEl)
    });

    it('should verify rendered element and attributes', function() {
      addElement();
      //console.log(self.autocompleteEl)
    });



  });


});
