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
var defaultMarkup = '<akam-autocomplete items="items" ng-model="selectedItem"></akam-autocomplete>';

describe('akamAutocomplete directive', function() {

  var scope, compile, self, controller, objects;

  beforeEach(function() {
    inject.strictDi(true);
    self = this;
    angular.mock.module(require('../../src/autocomplete').name);
    inject(function($rootScope, _$compile_) {
      scope = $rootScope.$new();
      compile = _$compile_;
    });
  });

  afterEach(function() {
    if (self.element) {
      document.body.removeChild(self.element);
      self.element = null;
    }
  });

  function addElement(markup) {
    var tpl = markup ? markup : defaultMarkup;

    tpl = '<div><form name="form">' + tpl + '</form></div>';
    var el = compile(tpl)(scope);
    self.autocompleteEl = el.find("akam-autocomplete");
    controller = self.autocompleteEl.isolateScope().ac;
    scope.$digest();

    self.element = document.body.appendChild(el[0]);
  }

  describe("when rendering", function() {
    it('should rendered with a placeholder string', function() {

    });

  });


});
