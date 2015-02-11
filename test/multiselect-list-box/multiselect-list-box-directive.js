'use strict';
var utilities = require('../utilities');
describe('akam-multiselect-list-box', function() {
    var compile = null;
    var scope = null;
    var self = this;
    beforeEach(function() {
        self = this;
        angular.mock.module(require('../../src/multiselect-list-box').name);
        inject(function($compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();
        });
    });
    afterEach(function() {
        document.body.removeChild(this.element);
    });
    function addElement(markup) {
        self.el = compile(markup)(scope);
        self.element = self.el[0];
        scope.$digest();
        document.body.appendChild(self.element);
    };
    describe('when rendering multiselect-list-box', function() {
        it('should render all parts', function() {});
        it('should not have anything selected', function() {});
        it('should have filter be clear', function() {});
    });
    describe('when nothing is selected', function(){
        it('should hide view selected only checkbox', function() {});
        it('should have selected field be 0', function() {});
    });
    describe('when under 10 items exist', function(){
        it('should not have a scroll bar', function() {});
    });
    describe('when over 10 items exist', function(){
        it('should have a scroll bar', function() {});
        it('should be able to scroll', function() {});
    });
    describe('when interacting with top bar', function(){
        it('should be able to select all items at once', function() {});
        it('should should be able to deselect all items at once', function() {});
        it('should be able to filter alphabetically', function() {});
        it('should be able to filter reverse-alphabetically', function() {});
        it('should be able to filter numerically', function(){});
        it('should be able to filter reverse-numerically', function(){});
        it('should only be able to filter by one column at a time', function(){});
    });
    describe('when selecting and item', function(){
        it('should be able to select an item', function(){});
        it('should update selected checkbox', function(){});
        it('should update total selected field', function(){});
        it('should make view selected only box visible', function(){});
        it('should change background color of selected items', function(){});
    });
    describe('when deselecting an item', function(){
        it('should be able to deselect an item', function(){});
        it('should update deselected checkbox', function(){});
        it('should updated total selected field', function(){});
        it('should maintain visibility of view selected only', function(){});
        it('should change background color of deselected items', function(){});
    });
    describe('when deselecting an item to 0 selected', function(){
        it('should be able to deselect an item', function(){});
        it('should updated selected field', function(){});
        it('should make view selected only box invisible', function(){});
    });
    describe('when activating view selected only option', function(){
        it('should hide unselected items when "view selected only" pressed', function(){});
        it('should activate selectall checkbox', function(){});
        it('should show unselected items when "view selected only" re-pressed', function(){});
        it('should deactivate selectall checkbox', function(){});
    });
    describe('when interacting with filter bar', function(){
        it('should filter based on input beginning-middle-end matches', function(){});
        it('should filter only selected items when view selected only selected', function(){});
        it('should not change selected value', function(){});
        it('should be able to clear filter text', function(){});
        it('should alert when no matches found', function(){});
        it('should offer suggestions when no matches found', function(){});
    });
    describe('when mouse interacting with multiselect-list-box', function(){
        it('should change color on mouse hover', function(){});
        it('should change back color on mouse leave', function(){});
    });
    describe('when navigating away and back', function(){
        it('will close when clicking away from box', function(){});
        it('will maintain state so when reopened those selected are still selected.', function(){});
    });
    describe('when  no options to choose from', function(){
    });
});