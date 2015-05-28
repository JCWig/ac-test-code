'use strict';
var utilities = require('../utilities');

var SELECTED_TAGS = '.tag-input-selected-items';
var INPUT_FIELD = '.ui-select-search';
var DROPDOWN_OPTION = '.ui-select-choices-row';
var REMOVE_ICON = '.tag-input-remove';
var translationMock = require('../fixtures/translationFixture.json');
describe('akamai.components.tag-input', function() {
    var scope, compile, timeout;
    beforeEach(function() {
      inject.strictDi(true);
      var self = this;
      angular.mock.module(require('../../src/tag-input').name);
      inject(function($compile, $rootScope, $timeout, $httpBackend) {
        scope = $rootScope.$new();
        compile = $compile;
        timeout = $timeout;
        $httpBackend.when('GET', utilities.LIBRARY_PATH).respond(translationMock);
        $httpBackend.when('GET', utilities.CONFIG_PATH).respond({});
        $httpBackend.flush();
      });
      scope.items = ["Connor Kent","Bart Allen", "Cassandra Sandsmark"];
      scope.availableItems = [
        "Dick Grayson",
        "Jason Todd",
        "Tim Drake",
        "Barbara Gordon",
        "Connor Kent"
      ];
    });
    afterEach(function() {
        if(self.element){
            document.body.removeChild(self.element);
            self.element = null;
        }
    });
    function addElement(markup) {
      self.el = compile(markup)(scope);
      scope.$digest();
      self.element = document.body.appendChild(self.el[0]);
    }
    describe('when rendering', function(){
      it('should render all part', function(){
        var markup = '<akam-tag-input ng-model="items" available-items="availableItems"> </akam-tag-input>';
        addElement(markup);

        var allSelectedTags = document.querySelectorAll(SELECTED_TAGS);
        var inputField = document.querySelector(INPUT_FIELD);
        utilities.click(inputField);
        var allDropDownOptions = document.querySelectorAll(DROPDOWN_OPTION);

        expect(allSelectedTags.length).toEqual(scope.items.length);
        expect(inputField).not.toBe(null);
        expect(allDropDownOptions.length).toEqual(scope.availableItems.length - 1);//Bart Allen exists in both
      });
      it('should render no tags if no selected items provided', function(){
        scope.emptyItems = [];
        var markup = '<akam-tag-input ng-model="emptyItems" placeholder="placeholder" available-items="availableItems"> </akam-tag-input>';
        addElement(markup);

        var allSelectedTags = document.querySelectorAll(SELECTED_TAGS);
        var inputField = document.querySelector(INPUT_FIELD);
        utilities.click(inputField);
        var allDropDownOptions = document.querySelectorAll(DROPDOWN_OPTION);
        
        expect(allSelectedTags.length).toEqual(0);
        expect(inputField).not.toBe(null);
        expect(allDropDownOptions.length).toEqual(scope.availableItems.length);
      });
    });
    describe('when interacting with tag input', function(){
    it('should delete from selected list when deleted', function(){
      var markup = '<akam-tag-input ng-model="items" available-items="availableItems"> </akam-tag-input>';
      addElement(markup);

      var firstItemRemoveIcon = document.querySelector(REMOVE_ICON);
      utilities.click(firstItemRemoveIcon);
      scope.$digest();
      timeout.flush();

      expect(scope.items.length).toEqual(2);
      var inputField = document.querySelector(INPUT_FIELD);
      utilities.click(inputField);
      var allDropDownOptions = document.querySelectorAll(DROPDOWN_OPTION);
      
      expect(allDropDownOptions.length).toEqual(scope.availableItems.length);
    });
    it('should add in items if selected from drop down list', function(){
      var markup = '<akam-tag-input ng-model="items" available-items="availableItems"> </akam-tag-input>';
      addElement(markup);
      var inputField = document.querySelector(INPUT_FIELD);
      utilities.click(inputField);
      var firstDropDownOption = document.querySelector(DROPDOWN_OPTION);
      utilities.click(firstDropDownOption);
      scope.$digest();
      timeout.flush();
      expect(scope.items.length).toEqual(4);
    });
    it('should auto close dropdown on selected item', function(){
      var markup = '<akam-tag-input ng-model="items" available-items="availableItems"> </akam-tag-input>';
      addElement(markup);
      var inputField = document.querySelector(INPUT_FIELD);
      utilities.click(inputField);
      var firstDropDownOption = document.querySelector(DROPDOWN_OPTION);
      utilities.click(firstDropDownOption);
      scope.$digest();
      timeout.flush();
      firstDropDownOption = document.querySelector(DROPDOWN_OPTION);
      expect(firstDropDownOption).toBe(null);
    });
    it('should auto close dropdown on click away', function(){
      var markup = '<akam-tag-input ng-model="items" available-items="availableItems"> </akam-tag-input>';
      addElement(markup);
      var inputField = document.querySelector(INPUT_FIELD);
      utilities.click(inputField);
      utilities.clickAwayCreationAndClick('div');
      var firstDropDownOption = document.querySelector(DROPDOWN_OPTION);
      expect(firstDropDownOption).toBe(null);
    });
    it('should reopen token for editing on double click of token', function(){
      var markup = '<akam-tag-input ng-model="items" available-items="availableItems"> </akam-tag-input>';
      addElement(markup);
      var firstToken = document.querySelector(SELECTED_TAGS);
      utilities.dblClick(firstToken);
      scope.$digest();
      timeout.flush();
      var inputField = document.querySelector(INPUT_FIELD);
      var firstDropDownOption = document.querySelector(DROPDOWN_OPTION);
      expect(inputField.value).toContain('Connor Kent');
      expect(firstDropDownOption).not.toBe(null);
    });
    it('should reopen token for editing on double click of token even if dropdown already open', function(){
      var markup = '<akam-tag-input ng-model="items" available-items="availableItems"></akam-tag-input>';
      addElement(markup);
      var inputField = document.querySelector(INPUT_FIELD);
      utilities.click(inputField);
      var firstToken = document.querySelector(SELECTED_TAGS);
      utilities.dblClick(firstToken);
      scope.$digest();
      timeout.flush();
      var firstDropDownOption = document.querySelector(DROPDOWN_OPTION);
      expect(inputField.value).toContain('Connor Kent');
      expect(firstDropDownOption).not.toBe(null);
      expect(scope.items.length).toEqual(2);
    });
    it('should sort if given a function to sort off of', function(){
      scope.sortFunction = function(input){
          return input.sort();
      }
      var markup = '<akam-tag-input ng-model="items" available-items="availableItems" sort-function="sortFunction"></akam-tag-input>';
      addElement(markup);
      var firstSelectedTag = document.querySelectorAll(SELECTED_TAGS)[0];
      expect(firstSelectedTag.textContent).toContain("Bart Allen");
    });
    it('should auto sort when adding an item', function(){
      scope.sortFunction = function(input){
          return input.sort();
      }
      var markup = '<akam-tag-input ng-model="items" available-items="availableItems" sort-function="sortFunction"></akam-tag-input>';
      addElement(markup);
      var inputField = document.querySelector(INPUT_FIELD);
      utilities.click(inputField);
      var fourthDropDownOption = document.querySelectorAll(DROPDOWN_OPTION)[3];
      utilities.click(fourthDropDownOption);
      scope.$digest();
      timeout.flush();
      var firstSelectedTag = document.querySelectorAll(SELECTED_TAGS)[0];
      expect(firstSelectedTag.textContent).toContain("Barbara Gordon");
    });
    it('should remove drag and drop css classes when drag and drop triggered', function(){
      var markup = '<akam-tag-input ng-model="items" available-items="availableItems" tagging-label="new item"'+
                      'sort-function="sortFunction"></akam-tag-input>';
      addElement(markup);
      var firstSelectedTag = document.querySelectorAll(SELECTED_TAGS)[0]; 
      firstSelectedTag.classList.add('droppping', 'dropping-before', 'dropping-after');
      var isoScope = self.el.isolateScope();
      isoScope.$emit('uiSelectSort:change', {array:scope.items});
      expect(firstSelectedTag.classlist).not.toContain('dropping');
      expect(firstSelectedTag.classlist).not.toContain('dropping-before');
      expect(firstSelectedTag.classlist).not.toContain('dropping-after');
    });
    it('should change items if items is changed', function(){
      var markup = '<akam-tag-input ng-model="items" available-items="availableItems" tagging-label="new item"'+
                      'sort-function="sortFunction"></akam-tag-input>';
      addElement(markup);
      var firstSelectedTag = document.querySelectorAll(SELECTED_TAGS)[0]; 
      firstSelectedTag.classList.add('droppping', 'dropping-before', 'dropping-after');
      var isoScope = self.el.isolateScope();
      isoScope.$emit('uiSelectSort:change', 
          {array:  ["Tim Drake", "Barbara Gordon"] });
      scope.$digest();
      timeout.flush();
      firstSelectedTag = document.querySelectorAll(SELECTED_TAGS)[0]; 
      expect(scope.items).toContain('Tim Drake');
      expect(scope.items).toContain('Barbara Gordon');
    });
    });
    describe('when validating input', function(){
      it('should not allow selected items that are undefined', function(){
        var markup = '<akam-tag-input ng-model="items" available-items="availableItems" tagging-label="new item"'+
                      'sort-function="sortFunction"></akam-tag-input>';
        addElement(markup);
        var originalLength = scope.items.length;
        var isoScope = self.el.isolateScope();
        isoScope.onSelect(undefined);
        isoScope.onSelect(undefined);
        expect(scope.items.length).toEqual(originalLength);
        expect(isoScope.data.items.length).toEqual(originalLength);
      });
      it('should not allow selected items that do not pass a given validation function', function(){
        scope.validateFunction = function(item){ // dont allow strings with only one character
          if(!item || item.type === 'string' || item.length > 1){
            return true;
          }
          return false;
        };
        var markup = '<akam-tag-input ng-model="items" available-items="availableItems" tagging-label="new item"'+
                      'sort-function="sortFunction" validate-function="validateFunction"></akam-tag-input>';
        addElement(markup);
        var originalLength = scope.items.length;
        var isoScope = self.el.isolateScope();
        isoScope.data.items.push('1');
        scope.$digest();
        isoScope.onSelect('1');
        scope.$digest();
        var invalidActivatedDirective = document.querySelector('.invalid-tag');
        expect(invalidActivatedDirective).not.toBe(null);
      });
      it('should not allow selected items that are not in availableItems if restricted is set', function(){
        var markup = '<akam-tag-input ng-model="items" available-items="availableItems" tagging-label="new item"'+
                      'sort-function="sortFunction" restricted="true"></akam-tag-input>';
        addElement(markup);
        var originalLength = scope.items.length;
        var isoScope = self.el.isolateScope();
        isoScope.data.items.push('DOES NOT EXIST'); 
        isoScope.onSelect('DOES NOT EXIST');
        expect(scope.items.length).toEqual(originalLength);
        expect(isoScope.data.items.length).toEqual(originalLength);
        isoScope.data.items.push('Dick Grayson');
        isoScope.onSelect('Dick Grayson');
        expect(scope.items.length).toEqual(originalLength + 1);
        expect(isoScope.data.items.length).toEqual(originalLength + 1);
      });
    });
});