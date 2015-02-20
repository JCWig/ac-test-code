'use strict';
var utilities = require('../utilities');
describe('akam-list-box', function() {
    var compile = null;
    var scope = null;
    var self = this;

    beforeEach(function() {
        self = this;
        angular.mock.module(require('../../src/list-box').name);
        inject(function($compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();
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
                content : function(obj){
                    return obj.first + ' ' + obj.last;
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
                sort: function(objA, objB){
                    var COLORS = {
                        Red : 0,
                        Yellow: 1,
                        Green : 2
                    };
                    //convert ENUM values into numbers
                    var valA = COLORS[objA.color];
                    var valB = COLORS[objB.color];
                    return valA - valB;
                }
            },
            {
                content:"birthday",/*function(obj){
                    return (obj.getMonth()+1) + "/"+ obj.getDate() +"/" + obj.getFullYear(); 
                },*/
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
    context('when rendering multiselect-list-box', function() {
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        it('should render all parts', function() {
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            var columnNumber = document.querySelectorAll('.akam-list-box thead tr th');
            expect(columnNumber).to.have.length(scope.columns.length+1);
            var columnOneObject = document.querySelectorAll('.akam-list-box thead tr th')[0].querySelector('input');
            var columntwoObject = document.querySelectorAll('.akam-list-box thead tr th')[1];
            var columnThreeObject = document.querySelectorAll('.akam-list-box thead tr th')[2];
            var columnFourObject = document.querySelectorAll('.akam-list-box thead tr th')[3];
            var columnFiveObject = document.querySelectorAll('.akam-list-box thead tr th')[4];
            var columnSixObject = document.querySelectorAll('.akam-list-box thead tr th')[5];
            expect(columnOneObject.getAttribute('type')).to.match(/checkbox/);
            expect(columntwoObject.textContent).to.match(/Full Name/);
            expect(columnThreeObject.textContent).to.match(/Employee ID/);
            expect(columnFourObject.textContent).to.match(/Favorite Color/);
            expect(columnFiveObject.textContent).to.match(/Birthday/);
            expect(columnSixObject.textContent).to.match(/Generic Sorting/);

        });
        it('should not have anything selected', function() {
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            var checkboxes = document.querySelectorAll('checkbox:checked');
            expect(checkboxes).to.have.length(0);
            expect(document.querySelector('tfoot div.ng-binding').textContent).to.equal('Selected Items: []');
        });
        it('should load default values if none are given', function(){
            scope.mydata = [
                {hello : new Date(2000, 10, 12)},
                {date: new Date(1993, 2, 7)}];
            scope.columns = [
                {content : "date", 
                header : 'Date'},
            ];
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>';
            addElement(markup)
            expect(document.querySelector('tbody tr').querySelectorAll('td')[1].textContent).to.not.contain('2000');
            expect(document.querySelectorAll('tbody tr')[1].querySelectorAll('td')[1].textContent).to.contain('1993');
        });
        //it('should have filter be clear', function() {});
    });
    context('when nothing is selected', function(){
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        /*it('should hide view selected only checkbox', function() {

        });*/
        it('should have selected field equal 0', function() {
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            expect(document.querySelector('tfoot div.ng-binding').textContent).to.equal('Selected Items: []');
        });
    });/*
    context('when under 10 items exist', function(){
        it('should not have a scroll bar', function() {});
    });
    context('when over 10 items exist', function(){
        it('should have a scroll bar', function() {});
        it('should be able to scroll', function() {});
    });*/
    context('when interacting with top bar', function(){
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        it('should be able to select all items at once', function() {
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            var selectAllCheckbox = document.querySelectorAll('.akam-list-box thead tr th')[0].querySelector('input');
            utilities.click(selectAllCheckbox);
            var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
            expect(checkboxes).to.have.length(scope.mydata.length+1); //Additional One for the overall checkbox
            //NEED A TEST WHEN SELECTED ITEMS IS UPDATED TO JUST BE A NUMBER LIKE IN UXD SPECIFICATIONS
        });
        it('should be able to deselect all items at once', function() {
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            var selectAllCheckbox = document.querySelectorAll('.akam-list-box thead tr th')[0].querySelector('input');
            utilities.click(selectAllCheckbox);
            utilities.click(selectAllCheckbox);
            var checkboxes = document.querySelectorAll('checkbox:checked');
            expect(checkboxes).to.have.length(0);
        });
        it('should be able to sort alphabetically', function() {
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            var sortByColumnTwoAlphabectically = document.querySelectorAll('.akam-list-box thead tr th')[1];
            utilities.click(sortByColumnTwoAlphabectically)
            expect(document.querySelector('tbody tr').querySelectorAll('td')[1].textContent).to.match(/K-Slice McYoungPerson/);
            expect(document.querySelectorAll('tbody tr')[2].querySelectorAll('td')[1].textContent).to.match(/Yair Leviel/);
        });
        it('should be able to sort reverse-alphabetically', function() {
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            var sortByColumnTwoAlphabectically = document.querySelectorAll('.akam-list-box thead tr th')[1];
            utilities.click(sortByColumnTwoAlphabectically)
            utilities.click(sortByColumnTwoAlphabectically)
            expect(document.querySelector('tbody tr').querySelectorAll('td')[1].textContent).to.match(/Yair Leviel/);
            expect(document.querySelectorAll('tbody tr')[2].querySelectorAll('td')[1].textContent).to.match(/K-Slice McYoungPerson/);
        });
        it('should be able to sort numerically', function(){
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            var sortByColumnThreeNumerically = document.querySelectorAll('.akam-list-box thead tr th')[2];
            utilities.click(sortByColumnThreeNumerically);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[2].textContent).to.match(/1234/);
            expect(document.querySelectorAll('tbody tr')[2].querySelectorAll('td')[2].textContent).to.match(/3141592653/);
        });
        it('should be able to sort reverse-numerically', function(){
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            var sortByColumnThreeNumerically = document.querySelectorAll('.akam-list-box thead tr th')[2];
            utilities.click(sortByColumnThreeNumerically);
            utilities.click(sortByColumnThreeNumerically);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[2].textContent).to.match(/3141592653/);
            expect(document.querySelectorAll('tbody tr')[2].querySelectorAll('td')[2].textContent).to.match(/1234/);
        });
        it('should be able to sort by custom function', function(){
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            var sortByColumnFourCustom = document.querySelectorAll('.akam-list-box thead tr th')[3];
            utilities.click(sortByColumnFourCustom);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[3].textContent).to.match(/Red/);
            expect(document.querySelectorAll('tbody tr')[2].querySelectorAll('td')[3].textContent).to.match(/Green/);
        });
        it('should be able to sort by reverse custom function', function(){
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            var sortByColumnFourCustom = document.querySelectorAll('.akam-list-box thead tr th')[3];
            utilities.click(sortByColumnFourCustom);
            utilities.click(sortByColumnFourCustom);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[3].textContent).to.match(/Green/);
            expect(document.querySelectorAll('tbody tr')[2].querySelectorAll('td')[3].textContent).to.match(/Red/);
        });
        it('should be able to sort by date', function(){
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            var sortByColumnFiveDate = document.querySelectorAll('.akam-list-box thead tr th')[4];
            utilities.click(sortByColumnFiveDate);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[4].textContent).to.contain('2000-11-20');
            expect(document.querySelectorAll('tbody tr')[2].querySelectorAll('td')[4].textContent).to.contain('2002-11-20');
        });
        it('should be able to reverse sort by date', function(){
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            var sortByColumnFiveDate = document.querySelectorAll('.akam-list-box thead tr th')[4];
            utilities.click(sortByColumnFiveDate);
            utilities.click(sortByColumnFiveDate);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[4].textContent).to.contain('2002-11-20');
            expect(document.querySelectorAll('tbody tr')[2].querySelectorAll('td')[4].textContent).to.contain('2000-11-20');
        });
        it('should be able to generic sort', function(){
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            var sortByColumnSixDate = document.querySelectorAll('.akam-list-box thead tr th')[5];
            utilities.click(sortByColumnSixDate);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[5].textContent).to.contain('["goodbye"]');
            expect(document.querySelectorAll('tbody tr')[2].querySelectorAll('td')[5].textContent).to.contain('["shake it off"]');
        });
        it('should sort entire rows', function(){
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            var sortByColumnTwoAlphabectically = document.querySelectorAll('.akam-list-box thead tr th')[1];
            utilities.click(sortByColumnTwoAlphabectically)
            expect(document.querySelector('tbody tr').querySelectorAll('td')[1].textContent).to.match(/K-Slice McYoungPerson/);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[2].textContent).to.match(/3141592653/);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[3].textContent).to.match(/Yellow/);
        });
    });
    context('when selecting an item', function(){
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        it('should be able to select an item', function(){
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            utilities.click(document.querySelector('tbody tr').querySelectorAll('td')[0].querySelector('input'));
            var checkedCheckbox = document.querySelectorAll('input[type="checkbox"]:checked');
            expect(checkedCheckbox).to.have.length(1);
        });
        it('should update total selected field', function(){
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            utilities.click(document.querySelector('tbody tr').querySelectorAll('td')[0].querySelector('input')); 
            expect(document.querySelector('tfoot div.ng-binding').textContent).to.not.equal('Selected Items: []');
            //NEED ANOTHER TEST CASE HERE FOR THE ACTUAL NUMBER WHEN UXD DESIGNS ARE MET
        });
        //it('should make view selected only box visible', function(){});
        it('should change background color of selected items', function(){
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            var checkbox = document.querySelector('tbody tr').querySelectorAll('td')[0].querySelector('input');
            utilities.click(checkbox);
            expect(checkbox.parentNode.parentNode.classList.contains('row-selected')).to.be.true();
        });
    });
    context('when deselecting an item', function(){
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        it('should be able to deselect an item', function(){
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            var checkbox = document.querySelector('tbody tr').querySelectorAll('td')[0].querySelector('input')
            utilities.click(checkbox); 
            utilities.click(checkbox);
            var checkedCheckbox = document.querySelectorAll('input[type="checkbox"]:checked');
            expect(checkedCheckbox).to.have.length(0);
        });
        it('should updated total selected field', function(){
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            var checkbox = document.querySelector('tbody tr').querySelectorAll('td')[0].querySelector('input')
            utilities.click(checkbox); 
            utilities.click(checkbox);
            expect(document.querySelector('tfoot div.ng-binding').textContent).to.equal('Selected Items: []');
        });
        //it('should maintain invisibility of view selected only when 0 selected', function(){});
        it('should change background color of deselected items', function(){
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            var checkbox = document.querySelector('tbody tr').querySelectorAll('td')[0].querySelector('input')
            utilities.click(checkbox); 
            utilities.click(checkbox);
            expect(checkbox.parentNode.parentNode.classList.contains('row-selected')).to.be.false();
        });
        //it('should keep view selected only visible when options remain', function(){});
    });/*
    context('when activating view selected only option', function(){
        it('should hide unselected items when "view selected only" pressed', function(){});
        it('should activate selectall checkbox', function(){});
        it('should remove item from view if deselected', function(){});
        it('should show unselected items when "view selected only" re-pressed', function(){});
        it('should deactivate selectall checkbox', function(){});
    });
    context('when interacting with filter bar', function(){
        it('should filter based on input beginning-middle-end matches', function(){});
        it('should filter only selected items when view selected only selected', function(){});
        it('should not change selected value', function(){});
        it('should be able to clear filter text', function(){});
        it('should alert when no matches found', function(){});
        it('should offer suggestions when no matches found', function(){});
        it('should be able to select off of suggestions', function(){});
    });
    context('when items are filtered', function(){
        it('should only apply select all to the filtered items', function(){});
        it('should only apply deselect all to the filtered items', function(){});
    });
    context('when mouse interacting with multiselect-list-box', function(){
        it('should change color on mouse hover', function(){});
        it('should change back color on mouse leave', function(){});
    });
    context('when navigating away and back', function(){
        it('shoudl close when clicking away from box', function(){});
        it('should maintain state so when reopened those selected are still selected.', function(){});
    });
    context('when  no options to choose from', function(){
    });*/
    context('when fucking up developing', function(){
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        it('should recognize null content when sorting generic', function(){
            scope.mydata = [
                {first : null},
                {first : "Nick"},
                {first: null}];
            scope.columns = [
                {content : "first", 
                header : 'Full Name'}
            ];
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            utilities.click(document.querySelectorAll('.akam-list-box thead tr th')[1]);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[1].textContent).to.match(/ /);
            expect(document.querySelectorAll('tbody tr')[2].querySelectorAll('td')[1].textContent).to.match(/Nick/);
        });
        it('should recognize null content when sorting dates', function(){
            scope.mydata = [
                {date : new Date(2000, 10, 12)},
                {date : null},
                {date : null},
                {date: new Date(1993, 2, 7)}];
            scope.columns = [
                {content : "date", 
                header : 'Date'}
            ];
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            utilities.click(document.querySelectorAll('.akam-list-box thead tr th')[1]);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[1].textContent).to.contain('');
            expect(document.querySelectorAll('tbody tr')[2].querySelectorAll('td')[1].textContent).to.contain('1993')
            expect(document.querySelectorAll('tbody tr')[3].querySelectorAll('td')[1].textContent).to.contain('2000')
        });
        it('should not bother sorting one row', function(){
            scope.mydata = [
                {date : new Date(2000, 10, 12)}
            ]
            scope.columns = [
                {content : "date", 
                header : 'Date'}
            ];
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            utilities.click(document.querySelectorAll('.akam-list-box thead tr th')[1]);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[1].textContent).to.contain('2000');
        });
        it('should be able to turn off sorting', function(){
            scope.mydata = [
                {date : new Date(2000, 10, 12)}
            ]
            scope.columns = [
                {content : "date", 
                header : 'Date',
                sort: false}
            ];
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>'
            addElement(markup);
            utilities.click(document.querySelectorAll('.akam-list-box thead tr th')[1]);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[1].textContent).to.contain('2000');
        });
    });
    context('when errors are thrown', function(){
        it('should throw error when column content is null', function(){
            scope.mydata = [
                {date : new Date(2000, 10, 12)},
                {date : null},
                {date : null},
                {date: new Date(1993, 2, 7)}];
            scope.columns = [
                {content : null, 
                header : 'Date'},
            ];
            var markup = '<akam-list-box mydata="mydata" mycolumns="columns"></akam-list-box>';
            try{
                addElement(markup)
            } catch (e){
                expect(e).to.equal("The column content field is using an unknown type.  Content field may only be String or Function type");
            }
        });
    });
});