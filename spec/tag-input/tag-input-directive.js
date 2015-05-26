'use strict';
var utilities = require('../utilities');

var SELECTED_TAGS = '.tag-input-selected-items';
var INPUT_FIELD = '.ui-select-search';
var DROPDOWN_OPTION = '.ui-select-choices-row';
var REMOVE_ICON = '.tag-input-remove';
describe('akamai.components.tag-input', function() {
    var scope, compile, timeout;
    beforeEach(function() {
        inject.strictDi(true);
        var self = this;
        angular.mock.module(require('../../src/tag-input').name);
        inject(function($compile, $rootScope, $timeout) {
            scope = $rootScope.$new();
            compile = $compile;
            timeout = $timeout;
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
        var markup = '<akam-tag-input items="items" available-items="availableItems"> </akam-tag-input>';
        addElement(markup);

        var allSelectedTags = document.querySelectorAll(SELECTED_TAGS);
        var inputField = document.querySelector(INPUT_FIELD);
        utilities.click(inputField);
        var allDropDownOptions = document.querySelectorAll(DROPDOWN_OPTION);

        expect(allSelectedTags.length).toEqual(scope.items.length);
        expect(inputField).not.toBe(null);
        expect(allDropDownOptions.length).toEqual(scope.availableItems.length - 1);//Bart Allen exists in both
      });
    });
    describe('when interacting with tag input', function(){
      it('should delete from selected list when deleted', function(){
        var markup = '<akam-tag-input items="items" available-items="availableItems"> </akam-tag-input>';
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
        var markup = '<akam-tag-input items="items" available-items="availableItems"> </akam-tag-input>';
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
        var markup = '<akam-tag-input items="items" available-items="availableItems"> </akam-tag-input>';
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
        var markup = '<akam-tag-input items="items" available-items="availableItems"> </akam-tag-input>';
        addElement(markup);
        var inputField = document.querySelector(INPUT_FIELD);
        utilities.click(inputField);
        utilities.clickAwayCreationAndClick('div');
        var firstDropDownOption = document.querySelector(DROPDOWN_OPTION);
        expect(firstDropDownOption).toBe(null);
      });
      it('should reopen token for editing on double click of token', function(){
        var markup = '<akam-tag-input items="items" available-items="availableItems"> </akam-tag-input>';
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
        var markup = '<akam-tag-input items="items" available-items="availableItems"></akam-tag-input>';
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
    });
});