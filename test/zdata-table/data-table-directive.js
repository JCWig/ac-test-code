'use strict';
var utilities = require('../utilities');
var FILTER_BOX = 'div.filter input[type="search"]';
var ALL_CHECKED_CHECKBOXES = 'input[type="checkbox"]:checked';
var TABLE_COLUMN_HEADER = '.akam-data-table thead tr th';
var TABLE_ROW = 'div.akam-data-table tbody tr';

var PREVIOUS_BUTTON = 'div.akam-pagination .pagination li:first-child';
var NEXT_BUTTON = 'div.akam-pagination .pagination li:last-child'
var TOTAL_ITEMS_SPAN = 'div.akam-pagination .total-items';
var PAGINATION_INDEX_NTH =  'div.akam-pagination .pagination li:nth-child';
var PAGINATION_INDEX_REVERSE =  'div.akam-pagination .pagination li:nth-last-child';
var PAGE_SIZE_SMALLEST = 'div.akam-pagination .page-size li:first-child';
var PAGE_SIZE_LARGEST = 'div.akam-pagination .page-size li:last-child';
var PAGE_SIZE_NTH = 'div.akam-pagination .page-size li:nth-child';
var PAGE_SIZES= 'div.akam-pagination .page-size li'


describe('zakam-data-table', function() {
    var compile = null;
    var scope = null;
    var self = this;
    var q = null;
    var timeout = null;
    var http = null;

    beforeEach(function() {
        self = this;
        angular.mock.module(require('../../src/data-table').name);
        inject(function($compile, $rootScope, $q, $timeout, $http) {
            compile = $compile;
            scope = $rootScope.$new();
            q = $q;
            timeout = $timeout;
            http = $http;
        });
        scope.mydata = [
            {
                first : 'Yair',
                last : 'Leviel',
                id : 1234,
                bu : "Luna",
                color: "Green",
                birthday : new Date(2001,10,20),
                generic : ["hello"]
            },
            {
                first : "Nick",
                last: "Leon",
                id : 2468,
                bu : "Luna",
                color:"Red",
                birthday : new Date(2002,10,20),
                generic : ["goodbye"]
            },
            {
                first: "K-Slice",
                last:"McYoungPerson",
                id:3141592653,
                bu:"Luna",
                color:"Yellow",
                birthday : new Date(2000,10,20),
                generic : ["shake it off"]
            }
        ];
        scope.columns = [
            {
                content : function(){
                    return this.first + ' ' + this.last;
                },
                header : 'Full Name',
                className : 'column-full-text-name'
            },
            {
                content : 'id',
                header : 'Employee ID'
            },
            {
                content:"color",
                header:"Favorite Color",
                sort: function(){
                    var colorsValues = {
                        'Red' : 1,
                        'Yellow' : 2,
                        'Green' : 3
                    };
                    return colorsValues[this.color];
                }
            },
            {
                content:"birthday",
                header:"Birthday"
            },
            {
                content:"generic",
                header:"Generic Sorting"
            }
        ];
    });
    function addElement(markup) {
        self.el = compile(markup)(scope);
        self.element = self.el[0];
        scope.$digest();
        document.body.appendChild(self.element);
    };
    context('when rendering data table', function() {
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        it('should show progress bar until fully rendered', function(){
            var deferred = q.defer();
            scope.delayeddata = deferred.promise;
            timeout(function(){
                deferred.resolve(scope.mydata);
            }, 2000);
            var markup = '<akam-data-table data="delayeddata" schema="columns"></akam-data-table>';
            addElement(markup);

            expect(document.querySelector('akam-indeterminate-progress').getAttribute('completed')).to.match(/false/);
            timeout.flush();
            var allRowsLoadedInTable = document.querySelectorAll(TABLE_ROW);

            expect(document.querySelector('akam-indeterminate-progress').getAttribute('completed')).to.match(/true/);
            expect(allRowsLoadedInTable).to.have.length(scope.mydata.length);
        });
        it('should render all parts data table and pagination', function() {
            var markup = '<akam-data-table data="mydata" schema="schema" filter-placeholder="yair"></akam-data-table>'
            addElement(markup);

            var dataTableContainer = document.querySelector('div.akam-data-table');
            var paginationContainer = document.querySelector('div.akam-pagination');

            expect(dataTableContainer).to.not.be.null;
            expect(paginationContainer).to.not.be.null;
        });
        //it('should not have anything selected if checkboxes are active', function() {});
        it('should have filter be clear', function() {
            var markup = '<akam-data-table data="mydata" schema="schema" filter-placeholder="yair"></akam-data-table>'
            addElement(markup);

            var filterBox = document.querySelector(FILTER_BOX);

            expect(filterBox.value).to.equal('');
        });
        it('should have 3 options for how many rows are displayed', function(){
            var markup = '<akam-data-table data="mydata" schema="schema" filter-placeholder="yair"></akam-data-table>'
            addElement(markup);

            var smallestPageSize = document.querySelector(PAGE_SIZE_SMALLEST);
            var mediumPageSize = document.querySelector(PAGE_SIZE_NTH+'(2)');
            var largestPageSize = document.querySelector(PAGE_SIZE_LARGEST);

            expect(smallestPageSize.textContent).to.match(/10/);
            expect(mediumPageSize.textContent).to.match(/25/);
            expect(largestPageSize.textContent).to.match(/50/);
        });
    });
    /*context('when data table is rendered', function(){
        it('should display the total number of results', function(){});
        it('should display action options on mouse hover of a row', function(){});
        it('should show indeterminate progress bar when refreshed', function(){});
    });
    context('when data table is loaded', function(){
        it('should be able to render without a toolbar', function(){});
        it('should be able to render without bulk delete', function(){});
        it('should be able to render without filter', function(){});
        it('should be able to render without export', function(){});
        it('should be able to render with only bulk delete', function(){});
        it('should be able to render with only export', function(){});
        it('should be able to render with only filter', function(){});
    });
    context('when rendered with bulk actions', function(){
        it('should be rendered with checkboxes column', function(){});
        it('should be able to select an item', function(){});
        it('should be able to deselect an item', function(){});
    });
    context('when data table is given below minimum columns (6)', function(){
    });
    context('when data table is given above maximum columns (12)', function(){
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
        it('should perform an action on that row if pressed', function(){});
        it('should be able to take user to a different location', function(){});
    });
    context('when mouseover events occur', function(){
        it('should change color of the row mouse is over', function(){});        
        it('should change color of the action the mouse is over', function(){});
    });*/
});