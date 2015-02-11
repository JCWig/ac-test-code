'use strict';
var utilities = require('../utilities');
describe('akam-data-table', function() {
    var compile = null;
    var scope = null;
    var self = this;
    beforeEach(function() {
        self = this;
        angular.mock.module(require('../../src/data-table').name);
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
    context('when rendering data table', function() {
        it('should show progress bar until fully rendered', function(){});
        it('should render all parts', function() {});
        it('should not have anything selected', function() {});
        it('should have filter be clear', function() {});
        it('should have options for how many rows are displayed', function(){});
    });
    context('when data table is rendered', function(){
        it('should display the total number found', function(){});
        it('should display action options on mouse hover of a row', function(){});
        it('should show indeterminate progress bar when refreshed', function(){});
    });
    context('when data table is given below minimum columns', function(){
    });
    context('when data table is given above maximum columns', function(){
    });
    context('when rendered with bulk actions', function(){
        it('should be rendered with checkboxes column', function(){});
        it('should be able to select an item', function(){});
        it('should be able to deselect an item', function(){});
    });
    context('when selecting an item', function(){
        it('should update selected checkbox', function(){});
        it('should change background color of selected items', function(){});
    });
    context('when deselecting an item', function(){
        it('should update deselected checkbox', function(){});
        it('should change background color of deselected items', function(){});
    });
    context('when interacting with column headers', function(){
        it('should be able to sort alphabetically', function() {});
        it('should be able to sort reverse-alphabetically', function() {});
        it('should be able to sort numerically', function(){});
        it('should be able to sort reverse-numerically', function(){});
        it('should only be able to sort by one column at a time', function(){});
        it('should be able to have no sort associated', function(){});
    });
    context('when bulk deleting', function(){
        it('should have message box appear with confirmation of delete', function(){});
        it('should delete the chosen rows when confirmed', function(){});
        it('should not delete the chosen rows when canceled.', function(){});
        it('should not delete by close icon click', function(){});
    });
    context('when exporting', function(){
        it('should open mesage box', function(){});
        it('should be able to fill in save as field', function(){});
        it('should be able to change format field', function(){});
        it('should cancel exporting when cancel clicked', function(){});
        it('should cancel exporting when close icon clicked', function(){});
        it('should export selected items when export button clicked', function(){});
    });
    context('when editing a field', function(){
        it('should be able to edit a field', function(){});
        it('should activate inline validation of that field', function(){});
        it('should activate bubble help field if message over 40 characters', function(){});
        it('should highlight field where error is occuring', function(){});
        it('should accept edits when validation is complete', function(){});
    });
    context('when navigating the data table', function(){
        //ONLY ONE OF THESE IS GOING TO BE THE FINAL COURSE
        it('should be able to scroll through all of the rows', function(){});
        it('should be able to navigate through pagination', function(){});
    });
    context('when interacting with the filter bar', function(){
        it('should filter based on input beginning-middle-end matches', function(){});
        it('should change text color of matching input', function(){});
    });    
    context('when grouping items', function(){
        it('should display icon representing grouping of items',function(){});
        it('should use grouping/hierarchal tree to render',function(){});
        it('should expand grouping when arrow is clicked', function(){});
        it('should not use more than 3 levels of grouping', function(){});
        it('should perform action on each subitem when top level action happens', function(){});
    });
    context('when using action button', function(){
        it('should display all actions that can be taken', function(){});        
        it('should be able to be closed and no action taken', function(){});
        it('should perform an action on that row if asked to', function(){});
    });
    context('when mouseover events occur', function(){
        it('should change color of the row mouse is over', function(){});        
        it('should change color of the action the mouse is over', function(){});
    });
});