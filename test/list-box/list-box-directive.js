'use strict';
var utilities = require('../utilities');

//CSS Selector variables
var FILTER_BOX = 'div.filter input[type="search"]';
var ALL_CHECKED_CHECKBOXES = 'input[type="checkbox"]:checked';
var TABLE_COLUMN_HEADER = '.akam-list-box thead tr th';
var TABLE_ROW = 'div.list-box-data tbody tr';
var SELECTED_SPAN = 'div.list-box-footer span.ng-binding';
var VIEW_SELECTED_ONLY_CHECKBOX = 'div.list-box-footer span.util-pull-right input[type=checkbox]';
var LIBRARY_PATH = '/libs/akamai-components/0.0.1/locales/en_US.json';
var CONFIG_PATH = '/apps/appName/locales/en_US.json';
var enUsMessagesResponse = require("../i18n/i18n_responses/messages_en_US.json");
var enUsResponse = require ("../i18n/i18n_responses/en_US.json");

describe('akam-list-box', function() {
    var compile = null;
    var scope = null;
    var self = this;
    var timeout = null;
    var q = null;
    var $http = null;
    var httpBackend = null;
    beforeEach(function() {
        self = this;
        angular.mock.module(require('../../src/list-box').name);
        angular.mock.module(function($provide) {
            $provide.decorator ('$http', function ($delegate) {
                $http = $delegate;
                return $delegate;
            });
        });
        inject(function($compile, $rootScope, $timeout, $q, $httpBackend) {
            compile = $compile;
            scope = $rootScope.$new();
            timeout = $timeout;
            q = $q;
            httpBackend = $httpBackend;
            httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
            httpBackend.when('GET', CONFIG_PATH).respond(enUsResponse);
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
    }
    context('when rendering multiselect-list-box', function() {
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        it('should render all parts', function() {
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            addElement(markup);

            var columnNumber = document.querySelectorAll(TABLE_COLUMN_HEADER);
            var columnOneHeaderObject = document.querySelectorAll(TABLE_COLUMN_HEADER)[0].querySelector('input');
            var columntwoHeaderObject = document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
            var columnThreeHeaderObject = document.querySelectorAll(TABLE_COLUMN_HEADER)[2];
            var columnFourHeaderObject = document.querySelectorAll(TABLE_COLUMN_HEADER)[3];
            var columnFiveHeaderObject = document.querySelectorAll(TABLE_COLUMN_HEADER)[4];
            var columnSixHeaderObject = document.querySelectorAll(TABLE_COLUMN_HEADER)[5];

            expect(columnNumber).to.have.length(scope.columns.length+1);
            expect(columnOneHeaderObject.getAttribute('type')).to.match(/checkbox/);
            expect(columntwoHeaderObject.textContent).to.match(/Full Name/);
            expect(columnThreeHeaderObject.textContent).to.match(/Employee ID/);
            expect(columnFourHeaderObject.textContent).to.match(/Favorite Color/);
            expect(columnFiveHeaderObject.textContent).to.match(/Birthday/);
            expect(columnSixHeaderObject.textContent).to.match(/Generic Sorting/);

        });
        it('should not have anything selected', function() {
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            addElement(markup);

            var allCheckedCheckboxes = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);
            var numberSelectedSpan = document.querySelector(SELECTED_SPAN);

            expect(allCheckedCheckboxes).to.have.length(0);
            expect(numberSelectedSpan.textContent).to.match(/0/);
        });
        it('should load default values if none are given', function(){
            scope.mydata = [{name : "hello"},{date:"02/07/1993"}];
            scope.columns = [{content : 'date', header : 'Date'}];
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            addElement(markup);

            var firstRowColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            var secondRowColumnTwo = document.querySelectorAll(TABLE_ROW)[1].querySelectorAll('td')[1];

            expect(firstRowColumnTwo.textContent).to.contain('1993');
            expect(secondRowColumnTwo.textContent).to.not.contain('2000');
        });
        it('should have filter be clear', function() {
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            addElement(markup);

            var filterBox = document.querySelector(FILTER_BOX);

            expect(filterBox.textContent).to.equal('');
        });
        it('should can have filter loaded with placeholder', function() {
            var markup = '<akam-list-box data="mydata" schema="columns" filter-placeholder="placeholder"></akam-list-box>';
            addElement(markup);

            var filterBox = document.querySelector(FILTER_BOX);

            expect(filterBox.textContent).to.equal('');
            expect(filterBox.placeholder).to.equal('placeholder');
        });
        it('should display indeterminate progress when loading', function() {
            var deferred = q.defer();
            scope.delayeddata = deferred.promise;
            timeout(function(){
                deferred.resolve(scope.mydata);
            }, 2000);
            var markup = '<akam-list-box data="delayeddata" schema="columns"></akam-list-box>';
            addElement(markup);

            expect(document.querySelector('akam-indeterminate-progress').getAttribute('completed')).to.match(/false/);
            timeout.flush();
            var allRowsLoadedInTable = document.querySelectorAll(TABLE_ROW);

            expect(document.querySelector('akam-indeterminate-progress').getAttribute('completed')).to.match(/true/);
            expect(allRowsLoadedInTable).to.have.length(scope.mydata.length);
        });
        it('should display indeterminate progress and load data on http get', function() {
            var dataPath = '/get/json/data';
            var jsonData = require('./http-data/list-box-data.json');
            scope.jsonColumns = [
                {content : function(){return this.first + ' ' + this.last;},header : 'Full Name',className : 'column-full-name'},
                {content : 'id', header : 'Emp. ID', className : 'column-employeeid'}
            ];
            var dataLength= Object.keys(jsonData).length;

            httpBackend.when('GET', dataPath).respond(jsonData);

            scope.jsonFromHttpGet = $http.get(dataPath);
            var markup = '<akam-list-box data="jsonFromHttpGet" schema="jsonColumns"></akam-list-box>';
            addElement(markup);

            expect(document.querySelector('akam-indeterminate-progress').getAttribute('completed')).to.match(/false/);
            httpBackend.flush();

            var allRowsLoadedInTable = document.querySelectorAll(TABLE_ROW);
            expect(document.querySelector('akam-indeterminate-progress').getAttribute('completed')).to.match(/true/);
            expect(allRowsLoadedInTable).to.have.length(dataLength);
        });
        it('should be able to use default sorting method on first column', function(){
            scope.mydata = [
                {'name' : "Kevin"},
                {'name' : "Alejandro"}
            ];
            scope.columns = [
                {content : 'name',
                header : 'Name',
                sort:null}
            ];
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            addElement(markup);

            var sortByColumnTwo =document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
            utilities.click(sortByColumnTwo);
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/Kevin/);
        });
    });
    context('when nothing is selected', function(){
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        it('should have selected field equal 0', function() {
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            addElement(markup);

            var numberSelectedSpan = document.querySelector(SELECTED_SPAN);

            expect(numberSelectedSpan.textContent).to.match(/0/);
        });
    });
    context('when interacting with sort options', function(){
        beforeEach(function(){
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            addElement(markup);
        });
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        it('should be able to select all items at once', function() {
            var selectAllCheckbox = document.querySelectorAll(TABLE_COLUMN_HEADER)[0].querySelector('input');
            utilities.click(selectAllCheckbox);
            var allCheckedCheckboxes = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);

            expect(allCheckedCheckboxes).to.have.length(scope.mydata.length+1); //Additional One for the overall checkbox
        });
        it('should be able to deselect all items at once', function() {
            var selectAllCheckbox = document.querySelectorAll(TABLE_COLUMN_HEADER)[0].querySelector('input');
            utilities.click(selectAllCheckbox);
            utilities.click(selectAllCheckbox);
            var allCheckedCheckboxes = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);

            expect(allCheckedCheckboxes).to.have.length(0);
        });
        it('should be able to sort alphabetically', function() {
            var sortByColumnTwoAlphabectically = document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
            utilities.click(sortByColumnTwoAlphabectically);
            utilities.click(sortByColumnTwoAlphabectically);

            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            var rowThreeColumnTwo = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/K-Slice McYoungPerson/);
            expect(rowThreeColumnTwo.textContent).to.match(/Yair Leviel/);
        });
        it('should be able to sort reverse-alphabetically', function() {
            var sortByColumnTwoAlphabectically = document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
            utilities.click(sortByColumnTwoAlphabectically);

            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            var rowThreeColumnTwo = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/Yair Leviel/);
            expect(rowThreeColumnTwo.textContent).to.match(/K-Slice McYoungPerson/);
        });
        it('should be able to sort numerically', function(){
            var sortByColumnThreeNumerically = document.querySelectorAll(TABLE_COLUMN_HEADER)[2];
            utilities.click(sortByColumnThreeNumerically);

            var rowOneColumnThree = document.querySelector(TABLE_ROW).querySelectorAll('td')[2];
            var rowThreeColumnThree = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[2];

            expect(rowOneColumnThree.textContent).to.match(/1234/);
            expect(rowThreeColumnThree.textContent).to.match(/3141592653/);
        });
        it('should be able to sort reverse-numerically', function(){
            var sortByColumnThreeNumerically = document.querySelectorAll(TABLE_COLUMN_HEADER)[2];
            utilities.click(sortByColumnThreeNumerically);
            utilities.click(sortByColumnThreeNumerically);

            var rowOneColumnThree = document.querySelector(TABLE_ROW).querySelectorAll('td')[2];
            var rowThreeColumnThree = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[2];

            expect(rowOneColumnThree.textContent).to.match(/3141592653/);
            expect(rowThreeColumnThree.textContent).to.match(/1234/);
        });
        it('should be able to sort by custom function', function(){
            var sortByColumnFourCustom = document.querySelectorAll(TABLE_COLUMN_HEADER)[3];
            utilities.click(sortByColumnFourCustom);

            var rowOneColumnFour = document.querySelector(TABLE_ROW).querySelectorAll('td')[3];
            var rowThreeColumnFour = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[3];

            expect(rowOneColumnFour.textContent).to.match(/Red/);
            expect(rowThreeColumnFour.textContent).to.match(/Green/);
        });
        it('should be able to sort by reverse custom function', function(){
            var sortByColumnFourCustom = document.querySelectorAll(TABLE_COLUMN_HEADER)[3];
            utilities.click(sortByColumnFourCustom);
            utilities.click(sortByColumnFourCustom);

            var rowOneColumnFour = document.querySelector(TABLE_ROW).querySelectorAll('td')[3];
            var rowThreeColumnFour = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[3];

            expect(rowOneColumnFour.textContent).to.match(/Green/);
            expect(rowThreeColumnFour.textContent).to.match(/Red/);
        });
        it('should be able to sort generically', function(){
            var sortByColumnSixGeneric = document.querySelectorAll(TABLE_COLUMN_HEADER)[5];
            utilities.click(sortByColumnSixGeneric);

            var rowOneColumnSix = document.querySelector(TABLE_ROW).querySelectorAll('td')[5];
            var rowThreeColumnSix = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[5];

            expect(rowOneColumnSix.textContent).to.contain('["goodbye"]');
            expect(rowThreeColumnSix.textContent).to.contain('["shake it off"]');
        });
        it('should be able to sort reverse generically', function(){
            var sortByColumnSixGeneric = document.querySelectorAll(TABLE_COLUMN_HEADER)[5];
            utilities.click(sortByColumnSixGeneric);
            utilities.click(sortByColumnSixGeneric);

            var rowOneColumnSix = document.querySelector(TABLE_ROW).querySelectorAll('td')[5];
            var rowThreeColumnSix = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[5];

            expect(rowOneColumnSix.textContent).to.contain('["shake it off"]');
            expect(rowThreeColumnSix.textContent).to.contain('["goodbye"]');
        });
        it('should sort entire rows', function(){
            var sortByColumnTwoAlphabectically = document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
            utilities.click(sortByColumnTwoAlphabectically);

            var firstRowColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            var firstRowColumnThree = document.querySelector(TABLE_ROW).querySelectorAll('td')[2];
            var firstRowColumnFour = document.querySelector(TABLE_ROW).querySelectorAll('td')[3];

            expect(firstRowColumnTwo.textContent).to.match(/Yair Leviel/);
            expect(firstRowColumnThree.textContent).to.match(/1234/);
            expect(firstRowColumnFour.textContent).to.match(/Green/);
        });
    });

    context('when using unique sort cases', function(){
        afterEach(function(){
            document.body.removeChild(this.element);
        });
        it('should not bother sorting one row', function(){
            scope.mydata = [
                {'name' : "Kevin"}
            ];
            scope.columns = [
                {content : 'name',
                header : 'Name'}
            ];
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
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
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            addElement(markup);

            var sortByColumnTwo =document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
            utilities.click(sortByColumnTwo);
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/Kevin/);
        });
        it('should be able to sort on different field', function(){
            scope.mydata = [{'name' : "Kevin",'id':5},{'name' : "Alejandro",'id':8}];
            scope.columns = [{content : 'name', header : 'Name',sort:'id'}];
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
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
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            addElement(markup);
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/Alejandro/);
        });
        it('should not default if all columns are unsortable', function(){
            scope.mydata = [
                {'name' : "Kevin", 'id':25},
                {'name' : "Alejandro", 'id':17}
            ];
            scope.columns = [
                {content : 'name', header : 'Name',sort:false},
                {content:"id",header:"Id",sort:false}
            ];
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            addElement(markup);
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/Kevin/);
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
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            addElement(markup);
            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/Oliver Queen/);
        });
        it('should be able to sort on different field', function(){
            scope.mydata = [{'name' : "Kevin",'id':5},{'name' : "Alejandro",'id':8}];
            scope.columns = [{content : 'name', header : 'Name',sort:'id'}];
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            addElement(markup);

            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/Kevin/);
        });
    });
    context('when selecting an item', function(){
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        it('should be able to select an item with on-change', function(){
            scope.mychange = sinon.spy();

            var markup = '<akam-list-box data="mydata" schema="columns" on-change="mychange(value)"></akam-list-box>';
            addElement(markup);

            var spyOnChange = sinon.spy(scope.$$childTail, "updateChanged");
            var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
            utilities.click(firstRowCheckbox);
            var checkedCheckbox = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);

            expect(checkedCheckbox).to.have.length(1);
            expect(scope.mychange).to.have.been.called;
            expect(spyOnChange).calledOnce;
        });
        it('should be able to select an item without on-change', function(){
            scope.mychange = sinon.spy();
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            addElement(markup);

            var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
            utilities.click(firstRowCheckbox);

            var checkedCheckbox = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);

            expect(checkedCheckbox).to.have.length(1);
            expect(scope.mychange).to.not.have.been.called;
        });
        it('should update total selected field', function(){
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            addElement(markup);

            var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
            utilities.click(firstRowCheckbox);

            var numberSelectedSpan = document.querySelector(SELECTED_SPAN);

            expect(numberSelectedSpan.textContent).to.match(/1/);
        });
        it('should change background color of selected items', function(){
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            addElement(markup);

            var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
            utilities.click(firstRowCheckbox);

            expect(firstRowCheckbox.parentNode.parentNode.classList.contains('row-selected')).to.be.true();
        });
    });
    context('when deselecting an item', function(){
        beforeEach(function(){
            var markup = '<akam-list-box data="mydata" schema="columns" ></akam-list-box>';
            addElement(markup);
        });
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        it('should be able to deselect an item', function(){
            var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
            utilities.click(firstRowCheckbox);
            utilities.click(firstRowCheckbox);

            var allCheckedCheckboxes = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);

            expect(allCheckedCheckboxes).to.have.length(0);
        });
        it('should updated total selected field', function(){
            var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
            utilities.click(firstRowCheckbox);
            utilities.click(firstRowCheckbox);

            var numberSelectedSpan = document.querySelector(SELECTED_SPAN);

            expect(numberSelectedSpan.textContent).to.match(/0/);
        });
        it('should change background color of deselected items', function(){
            var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
            utilities.click(firstRowCheckbox);
            utilities.click(firstRowCheckbox);

            expect(firstRowCheckbox.parentNode.parentNode.classList.contains('row-selected')).to.be.false();
        });
        it('should be able to deselet a row by clicking a row', function(){
            var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelectorAll('td')[4];
            utilities.click(firstRowCheckbox);
            utilities.click(firstRowCheckbox);

            expect(firstRowCheckbox.parentNode.classList.contains('row-selected')).to.be.false();
        });
        it('should only trigger updateChanged twice one on, one off', function(){
            var spyOnChange = sinon.spy(scope.$$childTail, "updateChanged");

            var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
            utilities.click(firstRowCheckbox);
            scope.$digest();
            utilities.click(firstRowCheckbox);
            scope.$digest();

            expect(spyOnChange).calledTwice;
        });
    });
    context('when activating view selected only option', function(){
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        beforeEach(function(){
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            addElement(markup);
        });
        it('should hide unselected items when "view selected only" pressed', function(){
            var viewSelectOnlyCheckbox = document.querySelector(VIEW_SELECTED_ONLY_CHECKBOX);
            var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
            utilities.click(firstRowCheckbox);
            scope.$digest();
            utilities.click(viewSelectOnlyCheckbox);
            scope.$digest();

            var allVisibleRows = document.querySelectorAll(TABLE_ROW);

            expect(allVisibleRows).to.have.length(1);
        });
        it('should remove item from view if deselected', function(){
            var viewSelectOnlyCheckbox = document.querySelector(VIEW_SELECTED_ONLY_CHECKBOX);
            var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
            utilities.click(firstRowCheckbox);
            scope.$digest();
            utilities.click(viewSelectOnlyCheckbox);
            scope.$digest();
            utilities.click(firstRowCheckbox);
            scope.$digest();

            var allVisibleRows = document.querySelectorAll(TABLE_ROW);

            expect(allVisibleRows).to.have.length(0);
        });
        it('should show unselected items when "view selected only" re-pressed', function(){
            var viewSelectOnlyCheckbox = document.querySelector(VIEW_SELECTED_ONLY_CHECKBOX);
            var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
            utilities.click(firstRowCheckbox);
            scope.$digest();
            utilities.click(viewSelectOnlyCheckbox);
            scope.$digest();
            utilities.click(viewSelectOnlyCheckbox);
            scope.$digest();

            var allVisibleRows = document.querySelectorAll(TABLE_ROW);

            expect(allVisibleRows).to.have.length(scope.mydata.length);
        });
        it('should deactivate selectall checkbox', function(){
            var viewSelectOnlyCheckbox = document.querySelector(VIEW_SELECTED_ONLY_CHECKBOX);
            var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
            utilities.click(firstRowCheckbox);
            utilities.click(viewSelectOnlyCheckbox);
            utilities.click(viewSelectOnlyCheckbox);

            var viewSelectedOnlyCheckboxIfItsChecked = document.querySelectorAll(VIEW_SELECTED_ONLY_CHECKBOX + ":checked");

            expect(viewSelectedOnlyCheckboxIfItsChecked).to.have.length(0);
        });
    });
    context('when interacting with filter bar', function(){
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        beforeEach(function(){
            scope.mydata = [{name:"iiiKeviii"},{name:"Keviiiiii"},{name:"iiiiiiKev"},{name:"iiiiiijohn"},{name:"iiijohniii"}];
            scope.columns = [{content : "name",header : 'Name', sort:false}];
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            addElement(markup);
        });
        it('should be not be redenered with clear icon', function(){
            var clearFilterTextIcon = document.querySelector('div.list-box-filter i.clear-filter');
            expect(clearFilterTextIcon).to.be.null;
        });
        it('should filter based on input beginning-middle-end matches', function(){
            scope.$$childHead.state.filter = "Kev";
            scope.$$childHead.updateSearchFilter();
            scope.$digest();
            expect(document.querySelectorAll(TABLE_ROW).length).to.equal(3);
        });
        it('should filter only selected items when view selected only selected', function(){
            var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
            utilities.click(firstRowCheckbox);
            utilities.click(document.querySelector(VIEW_SELECTED_ONLY_CHECKBOX));
            scope.$$childHead.state.filter = "Kev";
            scope.$$childHead.updateSearchFilter();
            scope.$digest();
            var allVisibleRows = document.querySelectorAll(TABLE_ROW);
            expect(allVisibleRows).to.have.length(1);
        });
        it('should not change selected value', function(){
            scope.$$childHead.state.filter = "Kev";
            scope.$$childHead.updateSearchFilter();
            scope.$digest();
            var numberSelectedSpan = document.querySelector(SELECTED_SPAN);
            expect(numberSelectedSpan.textContent).to.match(/0/);
        });
        it('should be able to clear filter text', function(){
            scope.$$childHead.state.filter = "Kev";
            scope.$$childHead.updateSearchFilter();
            scope.$digest();

            var allVisibleRows = document.querySelectorAll(TABLE_ROW);
            expect(allVisibleRows).to.have.length(3);

            var clearFilterTextIcon = document.querySelector('div.filter i');
            utilities.click(clearFilterTextIcon);
            scope.$digest();

            allVisibleRows = document.querySelectorAll(TABLE_ROW);
            expect(allVisibleRows).to.have.length(scope.mydata.length);
        });
    });
    context('when data messes up', function(){
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        it('should recognize null content when rendering', function(){
            scope.baddata = [
                {first : "Nick"},
                {first: "Kevin"}];
            scope.columns = [
                {content : function(){
                    return null;
                },
                header : 'Full Name'}
            ];
            var markup = '<akam-list-box data="baddata" schema="columns"></akam-list-box>';
            addElement(markup);

            utilities.click(document.querySelectorAll(TABLE_COLUMN_HEADER)[1]);

            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            var allVisibleRows = document.querySelectorAll(TABLE_ROW);

            expect(rowOneColumnTwo.textContent).to.match(/ /);
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
            var markup = '<akam-list-box data="baddata" schema="columns"></akam-list-box>';
            addElement(markup);

            var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
            var rowTwoColumnTwo = document.querySelectorAll(TABLE_ROW)[1].querySelectorAll('td')[1];
            var rowFourColumnTwo = document.querySelectorAll(TABLE_ROW)[3].querySelectorAll('td')[1];
            var rowFiveColumnTwo = document.querySelectorAll(TABLE_ROW)[4].querySelectorAll('td')[1];

            expect(rowOneColumnTwo.textContent).to.match(/ /);
            expect(rowTwoColumnTwo.textContent).to.match(/ /);
            expect(rowFourColumnTwo.textContent).to.contain('James');
            expect(rowFiveColumnTwo.textContent).to.contain('Kevin');
        });
    });
    context('when errors are thrown', function(){
        it('should throw error when column content is null', function(){
            scope.mydata = [
                {name : "Bob"},
                {name : null},
                {name : null},
                {name : "James"}
            ];
            scope.columns = [
                {content : null,
                header : 'Name'},
            ];
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            try{
                addElement(markup);
            } catch (e){
                expect(e).to.equal("The column content field is using an unknown type.  Content field may only be String or Function type");
            }
        });
        it('should throw error when data is not an array', function(){
            scope.mydata = null;
            scope.columns = [
                {content : null,
                header : 'Name'},
            ];
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            try{
                addElement(markup);
            } catch (e){
                expect(e).to.equal("Data must be an array");
            }
        });
        it('should throw error when schema is not an array', function(){
            scope.mydata = [];
            scope.columns = null;
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            try{
                addElement(markup);
            } catch (e){
                expect(e).to.equal("Schema must be an array");
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
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            addElement(markup);
            try{
                scope.$$childHead.sortColumn(undefined);
            } catch (e){
                expect(e).to.equal("Column may not be null/undefined");
            }
            document.body.removeChild(this.element);
        });
    });
});