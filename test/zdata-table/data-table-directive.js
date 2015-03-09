'use strict';
var utilities = require('../utilities');
var FILTER_BOX = 'div.filter input[type="search"]';
var ALL_CHECKED_CHECKBOXES = 'input[type="checkbox"]:checked';
var TABLE_COLUMN_HEADER = '.akam-data-table thead tr th';
var TABLE_ROW = 'div.akam-data-table tbody tr';

var PREVIOUS_BUTTON = 'div.akam-pagination .pagination li:first-child';
var NEXT_BUTTON = 'div.akam-pagination .pagination li:last-child'
var TOTAL_ITEMS_SPAN = 'div.akam-pagination .total-items';
var PAGINATION_PAGE_ONE = 'div.akam-pagination .pagination li:first-child';
var PAGINATION_INDEX_NTH =  'div.akam-pagination .pagination li:nth-child';
var PAGINATION_INDEX_REVERSE =  'div.akam-pagination .pagination li:nth-last-child';
var PAGE_SIZE_SMALLEST = 'div.akam-pagination .page-size li:first-child';
var PAGE_SIZE_LARGEST = 'div.akam-pagination .page-size li:last-child';
var PAGE_SIZE_NTH = 'div.akam-pagination .page-size li:nth-child';
var PAGE_SIZES= 'div.akam-pagination .page-size li';
var translationMock = {
    "components": {
        "pagination": {
            "label": {
                "results": "Results: ",
                "show-entries": "Show Entries: "
            }
        }
    }
};

describe('akam-data-table', function() {
    var compile = null;
    var scope = null;
    var self = this;
    var q = null;
    var timeout = null;
    beforeEach(function() {
        self = this;
        angular.mock.module(require('../../src/data-table').name);
        angular.mock.module(function($provide, $translateProvider, $sceProvider) {
            $provide.factory('i18nCustomLoader', function($q, $timeout) {
                return function(options) {
                    var deferred = $q.defer();
                    $timeout(function() {
                        deferred.resolve(translationMock);
                    });
                    return deferred.promise;
                };
            });
            $translateProvider.useLoader('i18nCustomLoader');
        });
        inject(function($compile, $rootScope, $q, $timeout) {
            compile = $compile;
            scope = $rootScope.$new();
            q = $q;
            timeout = $timeout;
        });
        scope.mydata = [
            {
                first : 'Oliver',
                last : 'Queen',
                id : 11,
                bu : "Justice League",
                color: "Green",
                birthday : new Date(2001,10,20),
                generic : ["seriously whats wrong with arrow cave?"]
            },
            {
                first : "Roy",
                last: "Harper",
                id : 20,
                bu : "Teen Titans",
                color:"Red",
                birthday : new Date(2002,10,20),
                generic : ["shoot em up"]
            },
            {
                first: "Dinah",
                last:"Lance",
                id: 12,
                bu:"Birds of Prey",
                color:"Black",
                birthday : new Date(2000,10,20),
                generic : ["AAAAAAAAAAAAAAAAAAA"]
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
                header : 'ID'
            },
            {
                content:"color",
                header:"Favorite Color",
                sort: function(){
                    var colorsValues = {
                        'Red' : 1,
                        'Black' : 2,
                        'Green' : 3
                    };
                    return colorsValues[this.color];
                }
            },
            {
                content: function(){
                    return this.birthday.getDate()+ " "+this.birthday.getMonth() +" "+this.birthday.getFullYear();
                },
                header:"Birthday"
            },
            {
                content:function(){
                    return this.generic.join(",");
                },
                header:"Generic Sorting"
            }
        ];
        scope.mybigdata = require('./bigTestingData/thousandUsers');
        scope.bigcolumns = [
            {
                content : function(){
                    return this.first_name + ' ' + this.last_name;
                },
                header : 'Full Name',
                className : 'column-full-name'
            },
            {
                content : 'id',
                header : 'Emp. ID',
                className : 'column-employeeid'
            }
        ];
        scope.dataObj = {data:scope.mydata};
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
    context('when rendering data table', function() {

        it('should show progress bar until fully rendered', function(){
            var deferred = q.defer();
            scope.delayeddata = deferred.promise;
            timeout(function(){
                deferred.resolve(scope.mydata);
            }, 2000);
            var markup = '<akam-data-table data="delayeddata" schema="columns">'+
                '<akam-menu-button icon="luna-gear" position="right">'+
                '<akam-menu-button-item text="PDF" ng-click="process('+"'PDF'"+')"></akam-menu-button-item>'+
                '</akam-menu-button></akam-data-table>';
            addElement(markup);

            expect(document.querySelector('akam-indeterminate-progress').getAttribute('completed')).to.match(/false/);
            timeout.flush();
            var allRowsLoadedInTable = document.querySelectorAll(TABLE_ROW);

            expect(document.querySelector('akam-indeterminate-progress').getAttribute('completed')).to.match(/true/);
            expect(allRowsLoadedInTable).to.have.length(scope.mydata.length);
        });
        it('should render all parts data table and pagination', function() {
            var markup = '<akam-data-table data="mydata" schema="columns">'+
                '<akam-menu-button icon="luna-gear" position="right">'+
                '<akam-menu-button-item text="PDF" ng-click="process('+"'PDF'"+')"></akam-menu-button-item>'+
                '</akam-menu-button></akam-data-table>';
            addElement(markup);

            var dataTableContainer = document.querySelector('div.akam-data-table');
            var paginationContainer = document.querySelector('div.akam-pagination');

            expect(dataTableContainer).to.not.be.null;
            expect(paginationContainer).to.not.be.null;
        });
        it('should have filter be clear', function() {
            var markup = '<akam-data-table data="mydata" schema="columns" filter-placeholder="yair"></akam-data-table>';
            addElement(markup);

            var filterBox = document.querySelector(FILTER_BOX);

            expect(filterBox.value).to.equal('');
        });
        it('should have 3 options for how many rows are displayed', function(){
            var markup = '<akam-data-table data="mydata" schema="columns" filter-placeholder="yair"></akam-data-table>';
            addElement(markup);

            var smallestPageSize = document.querySelector(PAGE_SIZE_SMALLEST);
            var mediumPageSize = document.querySelector(PAGE_SIZE_NTH+'(2)');
            var largestPageSize = document.querySelector(PAGE_SIZE_LARGEST);

            expect(smallestPageSize.textContent).to.match(/10/);
            expect(mediumPageSize.textContent).to.match(/25/);
            expect(largestPageSize.textContent).to.match(/50/);
        });

    });
    context('when data table is rendered', function(){
        it('should display the total number of results', function(){
            var markup = '<akam-data-table data="mydata" schema="columns" filter-placeholder="yair"></akam-data-table>';
            addElement(markup);

            var totalItemsSpan = document.querySelector(TOTAL_ITEMS_SPAN);

            expect(totalItemsSpan.textContent).to.contain('3');
        });
    });
    context('when rendered with checkboxes', function(){
        beforeEach(function(){
            var markup = '<akam-data-table data="mybigdata" schema="bigcolumns" show-checkboxes="true"></akam-data-table>';
            addElement(markup);
        });
        it('should show checkboxes for each row', function(){
            expect(document.querySelectorAll(TABLE_ROW).length).to.equal(10);
        });
        it('should add checkboxes for each row when page size changes', function(){
            var largestPageSize = document.querySelector(PAGE_SIZE_LARGEST).querySelector('a');
            utilities.click(largestPageSize);
            scope.$digest();
            expect(document.querySelectorAll(TABLE_ROW).length).to.equal(50);
        });
        it('should be able to select items', function(){
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            utilities.click(rowOneColumnTwo);
            scope.$digest();

            expect(scope.$$childTail.selectedItems.length).to.equal(1);
        });
        it('should be able to deselect items', function(){
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            utilities.click(rowOneColumnTwo);
            scope.$digest();
            utilities.click(rowOneColumnTwo);

            expect(scope.$$childTail.selectedItems.length).to.equal(0); 
        });
        it('should be able to view selected only items', function(){
            //CURRENTY NOT ACTUALLY IMPLEMENTED ACCESSING FIELD DIRECTLY TO TEST 
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            var rowThreeColumnOne = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[0];
            utilities.click(rowOneColumnTwo);
            utilities.click(rowThreeColumnOne);

            scope.$$childTail.state.viewSelectedOnly = true;
            scope.$$childTail.updateSearchFilter();
            scope.$digest();
            
            expect(document.querySelectorAll(TABLE_ROW).length).to.equal(2);
        });
        it('should be able to select all items', function(){
            //CURRENTY NOT ACTUALLY IMPLEMENTED ACCESSING FIELD DIRECTLY TO TEST 
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            var rowThreeColumnOne = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[0];
            var largestPageSize = document.querySelector(PAGE_SIZE_LARGEST).querySelector('a');
            utilities.click(rowOneColumnTwo);
            utilities.click(rowThreeColumnOne);

            scope.$$childTail.state.allSelected = true;
            scope.$$childTail.updateSearchFilter();
            scope.$digest();
            var checkedCheckboxes = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);

            expect(checkedCheckboxes.length).to.equal(11);

            utilities.click(largestPageSize);
            scope.$digest();
            checkedCheckboxes = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);

            expect(checkedCheckboxes.length).to.equal(51);

        });
    });
    context('when interacting with sort options', function(){
        beforeEach(function(){
            var markup = '<akam-data-table data="mydata" schema="columns"></akam-data-table>';
            addElement(markup);
        });
        it('should be able to sort alphabetically', function() {
            var sortByColumnOneAlphabectically = document.querySelectorAll(TABLE_COLUMN_HEADER)[0];
            utilities.click(sortByColumnOneAlphabectically);
            utilities.click(sortByColumnOneAlphabectically);

            var rowOneColumnOne = document.querySelector(TABLE_ROW).querySelectorAll('td')[0];
            var rowThreeColumnOne = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[0];


            expect(rowOneColumnOne.textContent).to.match(/Dinah Lance/);
            expect(rowThreeColumnOne.textContent).to.match(/Roy Harper/);
        });
        it('should be able to sort reverse-alphabetically', function() {
            var sortByColumnOneAlphabectically = document.querySelectorAll(TABLE_COLUMN_HEADER)[0];
            utilities.click(sortByColumnOneAlphabectically);

            var rowOneColumnOne = document.querySelector(TABLE_ROW).querySelectorAll('td')[0];
            var rowThreeColumnOne = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[0];

            expect(rowOneColumnOne.textContent).to.match(/Roy Harper/);
            expect(rowThreeColumnOne.textContent).to.match(/Dinah Lance/);
        });
        it('should be able to sort numerically', function(){
            var sortByColumnTwoNumerically = document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
            utilities.click(sortByColumnTwoNumerically);

            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            var rowThreeColumnTwo = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/11/);
            expect(rowThreeColumnTwo.textContent).to.match(/20/);
        });
        it('should be able to sort reverse-numerically', function(){
            var sortByColumnTwoNumerically = document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
            utilities.click(sortByColumnTwoNumerically);
            utilities.click(sortByColumnTwoNumerically);

            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            var rowThreeColumnTwo = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/20/);
            expect(rowThreeColumnTwo.textContent).to.match(/11/);
        });
        it('should be able to sort by custom function', function(){
            var sortByColumnThreeCustom = document.querySelectorAll(TABLE_COLUMN_HEADER)[2];
            utilities.click(sortByColumnThreeCustom);

            var rowOneColumnThree = document.querySelector(TABLE_ROW).querySelectorAll('td')[2];
            var rowThreeColumnThree = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[2];

            expect(rowOneColumnThree.textContent).to.match(/Red/);
            expect(rowThreeColumnThree.textContent).to.match(/Green/);
        });
        it('should be able to sort by reverse custom function', function(){
            var sortByColumnThreeCustom = document.querySelectorAll(TABLE_COLUMN_HEADER)[2];
            utilities.click(sortByColumnThreeCustom);
            utilities.click(sortByColumnThreeCustom);

            var rowOneColumnThree = document.querySelector(TABLE_ROW).querySelectorAll('td')[2];
            var rowThreeColumnThree = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[2];

            expect(rowOneColumnThree.textContent).to.match(/Green/);
            expect(rowThreeColumnThree.textContent).to.match(/Red/);
        });
        it('should be able to sort generically', function(){
            var sortByColumnFiveGeneric = document.querySelectorAll(TABLE_COLUMN_HEADER)[4];
            utilities.click(sortByColumnFiveGeneric);

            var rowOneColumnFive = document.querySelector(TABLE_ROW).querySelectorAll('td')[4];
            var rowThreeColumnFive = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[4];

            expect(rowOneColumnFive.textContent).to.contain('AAAAAAAAAAAAAAAAAAA');
            expect(rowThreeColumnFive.textContent).to.contain('shoot em up');
        });
        it('should be able to sort reverse generically', function(){
            var sortByColumnFiveGeneric = document.querySelectorAll(TABLE_COLUMN_HEADER)[4];
            utilities.click(sortByColumnFiveGeneric);
            utilities.click(sortByColumnFiveGeneric);

            var rowOneColumnFive = document.querySelector(TABLE_ROW).querySelectorAll('td')[4];
            var rowThreeColumnFive = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[4];

            expect(rowOneColumnFive.textContent).to.contain('shoot em up');
            expect(rowThreeColumnFive.textContent).to.contain('AAAAAAAAAAAAAAAAAAA');
        });
        it('should sort entire rows', function(){

            var firstRowColumnOne = document.querySelector(TABLE_ROW).querySelectorAll('td')[0];
            var firstRowColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            var firstRowColumnThree = document.querySelector(TABLE_ROW).querySelectorAll('td')[2];

            expect(firstRowColumnOne.textContent).to.match(/Dinah Lance/);
            expect(firstRowColumnTwo.textContent).to.match(/12/);
            expect(firstRowColumnThree.textContent).to.match(/Black/);
        });
    });
    context('when using unique sort cases', function(){
        it('should not bother sorting one row', function(){
            scope.basicdata = [
                {'name' : "Kevin"}
            ];
            scope.basiccolumns = [
                {content : 'name', 
                header : 'Name'}
            ];
            var markup = '<akam-data-table data="basicdata" schema="basiccolumns" show-checkboxes="true"></akam-data-table>';
            addElement(markup);

            var sortByColumnTwo =document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
            utilities.click(sortByColumnTwo);
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            
            expect(rowOneColumnTwo.textContent).to.contain('Kevin');
        });
        it('should be able to turn off sorting', function(){
            scope.mydata = [
                {'name' : "Kevin"},
                {'name' : "Alejandro"}
            ];
            scope.columns = [
                {content : 'name', 
                header : 'Name',
                sort:false}
            ];
            var markup = '<akam-data-table data="mydata" schema="columns" show-checkboxes="true"></akam-data-table>';
            addElement(markup);

            var sortByColumnTwo =document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
            utilities.click(sortByColumnTwo);
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/Kevin/);
        });
        it('should be able to sort on different field', function(){
            scope.mydata = [{'name' : "Kevin",'id':5},{'name' : "Alejandro",'id':8}];
            scope.columns = [{content : 'name', header : 'Name',sort:'id'}];
            var markup = '<akam-data-table data="mydata" schema="columns" show-checkboxes="true"></akam-data-table>';
            addElement(markup);

            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/Kevin/);
        });
        it('should default sort by second column if first column is unsortable', function(){
            scope.mydata = [
                {'name' : "Kevin", 'id':25},
                {'name' : "Alejandro", 'id':17}
            ];
            scope.columns = [
                {content : 'name', header : 'Name',sort:false},
                {content:"id",header:"Id"}
            ];
            var markup = '<akam-data-table data="mydata" schema="columns" show-checkboxes="true"></akam-data-table>';
            addElement(markup);
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/Alejandro/);
        });
        it('should not default if all columns are unsortable', function(){
            scope.mydata = [
                {'name' : "Oliver", 'id':25},
                {'name' : "Barry", 'id':17}
            ];
            scope.columns = [
                {content : 'name', header : 'Name',sort:false},
                {content:"id",header:"Id",sort:false}
            ];
            var markup = '<akam-data-table data="mydata" schema="columns" show-checkboxes="true"></akam-data-table>';
            addElement(markup);
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/Oliver/);
        });
        it('should default sort based upon custom function if provided', function(){
            scope.mydata = [
                {'name' : "Roy Harper", 'id':25,color:'Yellow'},
                {'name' : "Dinah Laurel Lance", 'id':17, color:'Green'},
                {'name' : "Oliver Queen", 'id':17, color:'Red'}
            ];
            scope.columns = [
                {content : 'name', header : 'Name',sort:false},
                {content:"id",header:"Id",sort:false},
                {content:"color",header:"Favorite Color",sort: function(){
                    var colorsValues = {
                        'Red' : 1,
                        'Yellow' : 2,
                        'Green' : 3
                    };
                    return colorsValues[this.color];
                }}
            ];
            var markup = '<akam-data-table data="mydata" schema="columns" show-checkboxes="true"></akam-data-table>';
            addElement(markup);
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/Oliver Queen/);
        });
        it('should be able to sort on different field', function(){
            scope.mydata = [{'name' : "Kevin",'id':5},{'name' : "Alejandro",'id':8}];
            scope.columns = [{content : 'name', header : 'Name',sort:'id'}];
            var markup = '<akam-data-table data="mydata" schema="columns" show-checkboxes="true">></akam-data-table>';
            addElement(markup);

            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/Kevin/);
        });
    });
    context('when navigating the data table', function(){
        beforeEach(function(){
            var markup = '<akam-data-table data="mybigdata" schema="bigcolumns"></akam-data-table>';
            addElement(markup);
        });
        it('should highlight the clicked page', function() {
            var fourthClickablePaginationIndex = this.element.querySelector(PAGINATION_INDEX_NTH+'(4)');

            expect(fourthClickablePaginationIndex.classList.contains('active')).to.be.false;

            utilities.click(fourthClickablePaginationIndex.querySelector('a'));
            scope.$digest();

            fourthClickablePaginationIndex = this.element.querySelector(PAGINATION_INDEX_NTH+'(4)');
            expect(fourthClickablePaginationIndex.classList.contains('active')).to.be.true;
        });
        it('should change dislayed data appropriately', function(){
            var fourthClickablePaginationIndex = this.element.querySelector(PAGINATION_INDEX_NTH+'(4)');

            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[0];
            expect(rowOneColumnTwo.textContent).to.match(/Aaron Miller/);

            utilities.click(fourthClickablePaginationIndex.querySelector('a'));
            scope.$digest();

            rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[0];
            expect(rowOneColumnTwo.textContent).to.match(/Amanda Lewis/);
        });
    });
    context('when interacting with the filter bar', function(){
        beforeEach(function(){
            var markup = '<akam-data-table data="mybigdata" schema="bigcolumns"></akam-data-table>';
            addElement(markup);
        });
        it('should filter based on input beginning-middle-end matches', function(){
            scope.$$childHead.state.filter = "Kevin";
            scope.$$childHead.updateSearchFilter();
            scope.$digest(); 
            expect(document.querySelectorAll(TABLE_ROW).length).to.equal(8);

        });
        //it('should change text color of matching input', function(){});
        it('should revert to pagination index 1', function(){
            scope.$$childHead.state.filter = "Kev";
            scope.$$childHead.updateSearchFilter();
            scope.$digest(); 
            var pageOneIndex = document.querySelector(PAGINATION_INDEX_NTH+'(2)');
            var previousArrow = document.querySelector(PREVIOUS_BUTTON);
            var nextArrow = document.querySelector(NEXT_BUTTON);

            expect(pageOneIndex.classList.contains('active')).to.be.true;
            expect(previousArrow.classList.contains('disabled')).to.be.true;
            expect(nextArrow.classList.contains('disabled')).to.be.true;
        });
    });
    context('when rendered with action buttons', function(){
        beforeEach(function(){
            var markup = '<akam-data-table data="mydata" schema="columns">'+
                '<akam-menu-button icon="luna-gear" position="right">'+
                '<akam-menu-button-item text="PDF" ng-click="process('+"'PDF'"+')"></akam-menu-button-item>'+
                '<akam-menu-button-item text="XML" ng-click="process('+"'XML'"+')"></akam-menu-button-item>'+
                '</akam-menu-button></akam-data-table>';
            addElement(markup);
            timeout.flush();
        });
        it('should display all actions closed to start', function(){
            var menuDiv = document.querySelector(TABLE_ROW).querySelector('.akam-menu-button');
            var menuButton = menuDiv.querySelector('button');

            menuDiv = document.querySelector(TABLE_ROW).querySelector('.akam-menu-button');
            menuButton = menuDiv.querySelector('button');
            var options = menuDiv.querySelectorAll('.dropdown-menu li');

            expect(menuDiv.classList.contains('open')).to.be.false;
            expect(menuButton.getAttribute('aria-expanded')).to.equal('false');
        });  
        it('should display all actions that can be taken', function(){
            var menuDiv = document.querySelector(TABLE_ROW).querySelector('.akam-menu-button');
            var menuButton = menuDiv.querySelector('button');
            
            utilities.click(menuButton);
            scope.$digest();

            menuDiv = document.querySelector(TABLE_ROW).querySelector('.akam-menu-button');
            menuButton = menuDiv.querySelector('button');
            var options = menuDiv.querySelectorAll('.dropdown-menu li');
            
            expect(menuDiv.classList.contains('open')).to.be.true;
            expect(menuButton.getAttribute('aria-expanded')).to.equal('true');
            expect(options).to.have.length(2);
            expect(options[0].textContent).to.match(/PDF/);
            expect(options[1].textContent).to.match(/XML/);
        });        
        it('should be able to be closed and no action taken', function(){
            scope.process = sinon.spy();
            var menuDiv = document.querySelector(TABLE_ROW).querySelector('.akam-menu-button')
            var menuButton = menuDiv.querySelector('button');
            
            utilities.click(menuButton);
            scope.$digest();
            utilities.click(menuButton);
            scope.$digest();
            
            expect(menuDiv.classList.contains('open')).to.be.false;
            expect(menuButton.getAttribute('aria-expanded')).to.equal('false');
            expect(scope.process).to.not.have.been.called;
        });
        it('should perform an action on that row if pressed', function(){
            scope.process = sinon.spy();
            var menuDiv = document.querySelector(TABLE_ROW).querySelector('.akam-menu-button')
            var menuButton = menuDiv.querySelector('button');
           
            utilities.click(menuButton);
            scope.$digest();

            var options = menuDiv.querySelectorAll('.dropdown-menu li a');
            utilities.click(options[0]);
            scope.$digest();

            expect(scope.process).calledWith("PDF");
            expect(menuDiv.classList.contains('open')).to.be.false;
        });
    });
    context('when data gets messed up', function(){
        it('should recognize null content when redenring', function(){
            scope.baddata = [
                {first : "Nick"},
                {first: "Kevin"}];
            scope.columns = [
                {content : function(){
                    return null;
                }, 
                header : 'Full Name'}
            ];
            var markup = '<akam-data-table data="baddata" schema="columns" show-checkboxes="true"></akam-data-table>';
            addElement(markup);

            utilities.click(document.querySelectorAll(TABLE_COLUMN_HEADER)[1]);

            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            var allVisibleRows = document.querySelectorAll(TABLE_ROW);

            expect(rowOneColumnTwo.textContent).to.equal('');
            expect(allVisibleRows.length).to.equal(2);
        });
        it('should recognize content not matching', function(){
            scope.baddata = [
                {first : "Nick"},
                {first: "Kevin"}];
            scope.columns = [
                {content : "no-matches", 
                header : 'Full Name'}
            ];
            var markup = '<akam-data-table data="baddata" schema="columns" show-checkboxes="true"></akam-data-table>';
            addElement(markup);

            utilities.click(document.querySelectorAll(TABLE_COLUMN_HEADER)[1]);

            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            var allVisibleRows = document.querySelectorAll(TABLE_ROW);

            expect(rowOneColumnTwo.textContent).to.equal('');
            expect(allVisibleRows.length).to.equal(2);
        });
        it('should recognize null content when sorting name', function(){
            scope.baddata = [
                {name : null},
                {name : null},
                {name : "Kevin"},
                {name : null},
                {name: "James"}];
            scope.columns = [
                {content : "name", 
                header : 'Name'}
            ];
            var markup = '<akam-data-table data="baddata" schema="columns" show-checkboxes="true"></akam-data-table>';
            addElement(markup);
            
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            var rowTwoColumnTwo = document.querySelectorAll(TABLE_ROW)[1].querySelectorAll('td')[1];
            var rowFourColumnTwo = document.querySelectorAll(TABLE_ROW)[3].querySelectorAll('td')[1];
            var rowFiveColumnTwo = document.querySelectorAll(TABLE_ROW)[4].querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.equal('');
            expect(rowTwoColumnTwo.textContent).to.equal('');
            expect(rowFourColumnTwo.textContent).to.contain('James');
            expect(rowFiveColumnTwo.textContent).to.contain('Kevin');
        });

        it('should be able to handle data object for data', function(){
            var markup = '<akam-data-table data="dataObj" schema="columns" filter-placeholder="placeholder"></akam-data-table>'
            addElement(markup);

            var rowOneColumnOne = document.querySelector(TABLE_ROW).querySelectorAll('td')[0];
            var rowTwoColumnOne = document.querySelectorAll(TABLE_ROW)[1].querySelectorAll('td')[0];
            var rowThreeColumnOne = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[0];

            expect(rowOneColumnOne.textContent).to.match(/Dinah Lance/);
            expect(rowTwoColumnOne.textContent).to.match(/Oliver Queen/);
            expect(rowThreeColumnOne.textContent).to.match(/Roy Harper/);
        });/*
        it('should present message when no data is available', function(){
            scope.baddata = [];
            scope.columns = [
                {content : "name", 
                header : 'Name'}
            ];
            var markup = '<akam-data-table data="baddata" schema="columns" show-checkboxes="true"></akam-data-table>';
            addElement(markup);
            
            var dataTable = document.querySelector('tbody');

            expect(dataTable.textContent).to.match(/Not results found at all hahahah/);
            
        });*/
    });
    context('when errors are thrown', function(){
        it('should throw error when schema is not an array', function(){
            scope.messedupcolumns = {};
            var markup = '<akam-data-table data="mydata" schema="messedupcolumns"></akam-data-table>';
            try{
                addElement(markup);
            } catch (e){
                expect(e).to.equal("Schema must be an array");
            }
        });
        it('should throw error when data is not an array', function(){
            scope.messedupdata = {};
            var markup = '<akam-data-table data="messedupdata" schema="columns"></akam-data-table>';
            try{
                addElement(markup);
            } catch (e){
                expect(e).to.equal("Data must be an array");
            }
        });
        it('should throw error when column content is not a string or function', function(){
            scope.badcontent = [
            {content: {}}
            ];
            var markup = '<akam-data-table data="mydata" schema="badcontent"></akam-data-table>';
            try{
                addElement(markup);
            } catch (e){
                expect(e).to.equal("The column content field is using an unknown type.  Content field may only be String or Function type");
            }
        });
         it('should throw error when sort column is null', function(){
            scope.mydata = [
                {'name' : "Kevin"},
                {'name' : "Alejandro"}
            ];
            scope.columns = [
                {content : 'name', 
                header : 'Name',
                sort:null}
            ];
            var markup = '<akam-data-table data="mydata" schema="columns"></akam-data-table>';
            addElement(markup);
            try{
                scope.$$childHead.sortColumn(undefined);
            } catch (e){
                expect(e).to.equal("Column may not be null/undefined");
            }
        });
    });
});