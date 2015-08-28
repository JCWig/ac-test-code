'use strict';
var utilities = require('../utilities');
var translationMock = require('../fixtures/translationFixture.json');

var selectors = {
  ac: '.akam-autocomplete',
  ac_input: '.akam-autocomplete input',
  ac_clear: '.akam-autocomplete .clear-selected',
  ac_tip: '.akam-autocomplete .search-tip'
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

  var scope, compile, self, timeout, controller;

  beforeEach(function() {
    inject.strictDi(true);
    self = this;
    angular.mock.module(require('../../src/autocomplete').name);
    angular.mock.module(function($provide, $translateProvider) {
      $translateProvider.useLoader('i18nCustomLoader');
    });
    inject(function($rootScope, _$compile_, $httpBackend, $timeout, $q) {
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
    describe("using basic markup", function() {
      it('should verify rendered element and attributes', function() {
        addElement();
        var dirEl = document.querySelector(selectors.ac);

        expect(dirEl.classList.length).toBe(3);
        expect(dirEl.classList[0]).toEqual("akam-autocomplete");
        expect(dirEl.classList[1]).toEqual("dropdown");

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

      it('should verify rendered search tip element and attributes only in disbale true state', function() {
        var markup = '<akam-autocomplete ng-model="selectedItem" is-disabled="true"></akam-autocomplete>';
        addElement(markup);
        var tipEl = document.querySelector(selectors.ac_tip);
        expect(tipEl).not.toBe(undefined);
        expect(tipEl.classList).toContain("search-tip");
      });

      it('should verify rendered clear icon element and attributes', function() {
        addElement();
        var clearSelectedEl = document.querySelector(selectors.ac_clear);

        expect(clearSelectedEl).not.toBe(undefined);
        expect(clearSelectedEl.classList).toContain("clear-selected");
        expect(clearSelectedEl.getAttribute("ng-click")).not.toBe(undefined);
      });
    });
    describe("using all attributes", function() {
      it("should verify is-disabled attribute value", function() {
        var markup = '<akam-autocomplete ng-model="selectedItem" is-disabled="true"></akam-autocomplete>';
        addElement(markup);
        var inputEl = document.querySelector(selectors.ac_input);
        expect(inputEl.getAttribute("disabled")).toBeTruthy();
      });

      it("should verify placeholder attribute value", function() {
        var markup = '<akam-autocomplete ng-model="selectedItem" placeholder="{{ph}}"></akam-autocomplete>';
        scope.ph = "enter something";
        addElement(markup);
        var inputEl = document.querySelector(selectors.ac_input);
        expect(inputEl.getAttribute("placeholder")).toBe("enter something");

      });

      it("verify search tip text display", function() {
        addElement();
        var tip = angular.element(document.querySelector(selectors.ac)).find("span.search-tip");

        expect(tip.text()).toContain("matching results")
      });


      it("should verify search term not found", function() {
        var markup = '<akam-autocomplete ng-model="selectedItem" minimum-search="1" text-property="first" on-search="onSearch(term)"></akam-autocomplete>';
        scope.term = "";
        scope.onSearch = function(term) {}
        spyOn(scope, "onSearch");
        addElement(markup);

        var dirEl = document.querySelector(selectors.ac);
        var el = angular.element(dirEl).find("input");
        el.val("abcd");
        el.trigger('input');
        scope.$digest();

        expect(dirEl.classList.contains("open")).toBeFalsy();
      });

      it("should verify minimum-search value correctly", function() {
        var markup = '<akam-autocomplete ng-model="selectedItem" minimum-search="5" text-property="first" on-search="onSearch(term)"></akam-autocomplete>';
        scope.term = "";
        scope.onSearch = function(term) {}
        spyOn(scope, "onSearch");
        addElement(markup);

        var dirEl = document.querySelector(selectors.ac);
        var el = angular.element(dirEl).find("input");
        el.val("abcd");
        el.trigger('input');
        scope.$digest();

        expect(dirEl.classList.contains("open")).toBeFalsy();

      });

      it("should verify on-search method to be called", function() {
        var markup = '<akam-autocomplete ng-model="selectedItem" text-property="first" on-search="onSearch(term)"></akam-autocomplete>';
        scope.term = "";
        scope.onSearch = function(term) {}
        spyOn(scope, "onSearch");
        addElement(markup);

        var inputEl = document.querySelector(selectors.ac_input);
        utilities.click(inputEl);
        scope.$digest();
        var el = angular.element(inputEl).parent().find("input");
        el.val("a");
        el.trigger('input');
        scope.$digest();

        expect(scope.onSearch).toHaveBeenCalled();
      });

    });
    describe('on-search function promises', function() {
      var deferred;

      beforeEach(inject(function($q) {
        deferred = $q.defer();
        scope.onSearch = function() {
          return deferred.promise;
        };
        var markup = '<akam-autocomplete ng-model="selectedItem" text-property="first" on-search="onSearch(term)"></akam-autocomplete>';
        addElement(markup);
      }));

      it('should display matches from promise', function() {
        var dirEl = document.querySelector(selectors.ac);
        var el = angular.element(dirEl).find("input");
        el.val("a");
        el.trigger('input');
        scope.$digest();

        deferred.resolve(jsonMock);
        scope.$digest();

        expect(dirEl.classList).toContain("open");

      });

      it('should not display empty result from promise', function() {
        var dirEl = document.querySelector(selectors.ac);
        var el = angular.element(dirEl).find("input");
        el.val("a");
        el.trigger('input');
        scope.$digest();

        deferred.resolve([]);
        scope.$digest();

        expect(dirEl.classList.contains("open")).toBeFalsy();

      });

      it('should have rendered ul tag', function() {
        var dirEl = document.querySelector(selectors.ac);
        var el = angular.element(dirEl).find("input");
        el.val("a");
        el.trigger('input');
        scope.$digest();

        deferred.resolve([]);
        scope.$digest();

        expect(angular.element(dirEl).find("ul").length).toBe(1);

      });

      it('should not display when rejected from promise', function() {
        var dirEl = document.querySelector(selectors.ac);
        var el = angular.element(dirEl).find("input");
        el.val("a");
        el.trigger('input');
        scope.$digest();

        deferred.reject([]);
        scope.$digest();

        expect(dirEl.classList.contains("open")).toBeFalsy();

      });
    });

    describe('clear selected', function() {
      var deferred;

      beforeEach(inject(function($q) {
        deferred = $q.defer();
        scope.onSearch = function(term) {
          return deferred.promise;
        };
        scope.onSelect = function(item, label) {
          scope.item = item;
          scope.label = label;
        };
        var markup = '<akam-autocomplete ng-model="selectedItem" text-property="first" on-select="onSelect(item, label)" on-search="onSearch(term)"></akam-autocomplete>';
        addElement(markup);
      }));

      it('should selected query be cleared once x out', function() {
        var dirEl = document.querySelector(selectors.ac);
        var el = angular.element(dirEl).find("input");
        el.val("a");
        el.trigger('input');
        scope.$digest();

        deferred.resolve(jsonMock);
        scope.$digest();

        var clearIconEl = dirEl.querySelector(".input-option i.clear-selected");
        utilities.click(clearIconEl);
        scope.$digest();

        expect(el.val()).toBe("");

      });

      it('should selected item and query be cleared once x out ', function() {
        var dirEl = document.querySelector(selectors.ac);
        var el = angular.element(dirEl).find("input");
        el.val("a");
        el.trigger('input');
        scope.$digest();

        deferred.resolve(jsonMock);
        scope.$digest();

        var clearIconEl = dirEl.querySelector(".selected-option i.clear-selected");
        var selected = angular.element(dirEl.querySelector(".selected-option")).find("span");
        utilities.click(clearIconEl);
        scope.$digest();

        expect(el.val()).toBe("");
        expect(selected.text()).toBe("")
      });
    });

    describe("akam-autocomplete-items content provided", function() {
      var deferred;
      beforeEach(inject(function($q) {
        deferred = $q.defer();
        scope.onSearch = function(term) {
          return deferred.promise;
        };
        scope.onSelect = function(item, label) {
          scope.item = item;
          scope.label = label;
        };
        var markup =
        '<akam-autocomplete ng-model="selectedItem" text-property="first" on-select="onSelect(item, label)" on-search="onSearch(term)">'
        + '<akam-autocomplete-items>'
        +    '<a><span bind-html-unsafe="match.model.first"></span>'
        + '</akam-autocomplete-items>'
        + '</akam-autocomplete>';
        addElement(markup);
      }));

      it("should verify transclude content gone after rendered", function() {
        var dirEl = document.querySelector(selectors.ac);
        var el = angular.element(dirEl).find("input");
        el.val("a");
        el.trigger('input');
        scope.$digest();

        deferred.resolve(jsonMock);
        scope.$digest();

        expect(angular.element(dirEl).find("akam-autocomplete-items").length).toBe(0);

      });

      it("should verify items content is used", function() {
        var dirEl = document.querySelector(selectors.ac);
        var el = angular.element(dirEl).find("input");
        el.val("a");
        el.trigger('input');
        scope.$digest();

        deferred.resolve(jsonMock);
        scope.$digest();

        expect(dirEl.classList).toContain("open");

      });
    });
    describe('when displaying placeholder value', function() {
      it('should translate and display key if key not found', function() {
        var markup = '<akam-autocomplete ng-model="selectedItem" placeholder="Placeholder Value"></akam-autocomplete>';
        addElement(markup);
        var inputEl = document.querySelector(selectors.ac_input);
        expect(inputEl.getAttribute("placeholder")).toBe("Placeholder Value");
      });
      it('should translate and display translation if key is found', function() {
        var markup = '<akam-autocomplete ng-model="selectedItem" placeholder="examples.autocomplete.search.states"></akam-autocomplete>';
        addElement(markup);
        var inputEl = document.querySelector(selectors.ac_input);
        expect(inputEl.getAttribute("placeholder")).toBe("Search States");
      });
    });
    describe("akam-autocomplete-selected-item content provided", function() {
      var deferred;
      beforeEach(inject(function($q) {
        deferred = $q.defer();
        scope.onSearch = function(term) {
          return deferred.promise;
        };
        scope.onSelect = function(item, label) {
          scope.item = item;
          scope.label = label;
        };
        var markup =
        '<akam-autocomplete ng-model="selectedItem" text-property="first" on-select="onSelect(item, label)" on-search="onSearch(term)">'
        + '<akam-autocomplete-items>'
        +    '<a><span bind-html-unsafe="match.model.first"></span>'
        + '</akam-autocomplete-items>'
        + '<akam-autocomplete-selected-item>'
        + '<span>custom:</span>'
        + '</akam-autocomplete-selected-item>'
        + '</akam-autocomplete>';
        addElement(markup);
      }));

      it("should verify transclude content gone after rendered", function() {
        var dirEl = document.querySelector(selectors.ac);
        var el = angular.element(dirEl).find("input");
        el.val("a");
        el.trigger('input');
        scope.$digest();

        deferred.resolve(jsonMock);
        scope.$digest();

        expect(angular.element(dirEl).find("akam-autocomplete-selected-item").length).toBe(0);

      });

      it("should verify items content is used", function() {
        var dirEl = document.querySelector(selectors.ac);
        var el = angular.element(dirEl).find("input");
        el.val("a");
        el.trigger('input');
        scope.$digest();

        deferred.resolve(jsonMock);
        scope.$digest();
        expect(dirEl.classList).toContain("open");
      });
    });
  });
});
