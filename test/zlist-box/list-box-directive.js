'use strict';
var utilities = require('../utilities');
describe('akam-list-box', function() {
    var compile = null;
    var scope = null;
    var self = this;
    var timeout = null
    var q = null
    beforeEach(function() {
        self = this;
        angular.mock.module(require('../../src/list-box').name);
        inject(function($compile, $rootScope, $timeout, $q) {
            compile = $compile;
            scope = $rootScope.$new();
            timeout = $timeout;
            q = $q;
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
                sort: function(objA, objB){
                    var COLORS = {
                        Red : 0,
                        Yellow: 1,
                        Green : 2
                    };
                    //convert ENUM values into numbers
                    console.log(objA);
                    var valA = COLORS[objA.item.color];
                    var valB = COLORS[objB.item.color];
                    return valA - valB;
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
    context('when rendering multiselect-list-box', function() {
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        it('should render all parts', function() {
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
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
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            var checkboxes = document.querySelectorAll('checkbox:checked');
            expect(checkboxes).to.have.length(0);
            expect(document.querySelector('div.list-box-footer span.ng-binding').textContent).to.match(/Selected: 0/);
        });
        it('should load default values if none are given', function(){
            scope.mydata = [
                {name : "hello"},
                {date:"02/07/1993"}];
            scope.columns = [
                {content : 'date', 
                header : 'Date'},
            ];
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            addElement(markup)
            expect(document.querySelector('div.list-box-data tbody tr').querySelectorAll('td')[1].textContent).to.not.contain('2000');
            expect(document.querySelectorAll('div.list-box-data tbody tr')[1].querySelectorAll('td')[1].textContent).to.contain('1993');
        });
        it('should have filter be clear', function() {
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            addElement(markup)
            expect(document.querySelector('div.list-box-filter input[type="text"]').value).to.equal('');
        });
        it('should display indeterminate progress when loading', function() {
            var deferred = q.defer();
            scope.delayeddata = deferred.promise;
            timeout(function(){
                deferred.resolve(scope.mydata);
            }, 2000);
            var markup = '<akam-list-box data="delayeddata" schema="columns"></akam-list-box>';
            addElement(markup)
            expect(document.querySelector('akam-indeterminate-progress').getAttribute('completed')).to.match(/false/);
            timeout.flush();
            expect(document.querySelector('akam-indeterminate-progress').getAttribute('completed')).to.match(/true/);
            expect(document.querySelectorAll('tbody tr')).to.have.length(scope.mydata.length);
        });
    });
    context('when nothing is selected', function(){
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        //it('should hide view selected only checkbox', function() {

        //});
        it('should have selected field equal 0', function() {
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            expect(document.querySelector('div.list-box-footer span.ng-binding').textContent).to.match(/Selected: 0/);
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
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            var selectAllCheckbox = document.querySelectorAll('.akam-list-box thead tr th')[0].querySelector('input');
            utilities.click(selectAllCheckbox);
            var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
            expect(checkboxes).to.have.length(scope.mydata.length+1); //Additional One for the overall checkbox
            
        });
        it('should be able to deselect all items at once', function() {
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            var selectAllCheckbox = document.querySelectorAll('.akam-list-box thead tr th')[0].querySelector('input');
            utilities.click(selectAllCheckbox);
            utilities.click(selectAllCheckbox);
            var checkboxes = document.querySelectorAll('checkbox:checked');
            expect(checkboxes).to.have.length(0);
        });
        it('should be able to sort alphabetically', function() {
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            var sortByColumnTwoAlphabectically = document.querySelectorAll('.akam-list-box thead tr th')[1];
            utilities.click(sortByColumnTwoAlphabectically)
            expect(document.querySelector('tbody tr').querySelectorAll('td')[1].textContent).to.match(/K-Slice McYoungPerson/);
            expect(document.querySelectorAll('tbody tr')[2].querySelectorAll('td')[1].textContent).to.match(/Yair Leviel/);
        });
        it('should be able to sort reverse-alphabetically', function() {
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            var sortByColumnTwoAlphabectically = document.querySelectorAll('.akam-list-box thead tr th')[1];
            utilities.click(sortByColumnTwoAlphabectically)
            utilities.click(sortByColumnTwoAlphabectically)
            expect(document.querySelector('tbody tr').querySelectorAll('td')[1].textContent).to.match(/Yair Leviel/);
            expect(document.querySelectorAll('tbody tr')[2].querySelectorAll('td')[1].textContent).to.match(/K-Slice McYoungPerson/);
        });
        it('should be able to sort numerically', function(){
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            var sortByColumnThreeNumerically = document.querySelectorAll('.akam-list-box thead tr th')[2];
            utilities.click(sortByColumnThreeNumerically);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[2].textContent).to.match(/1234/);
            expect(document.querySelectorAll('tbody tr')[2].querySelectorAll('td')[2].textContent).to.match(/3141592653/);
        });
        it('should be able to sort reverse-numerically', function(){
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            var sortByColumnThreeNumerically = document.querySelectorAll('.akam-list-box thead tr th')[2];
            utilities.click(sortByColumnThreeNumerically);
            utilities.click(sortByColumnThreeNumerically);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[2].textContent).to.match(/3141592653/);
            expect(document.querySelectorAll('tbody tr')[2].querySelectorAll('td')[2].textContent).to.match(/1234/);
        });
        it('should be able to sort by custom function', function(){
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            var sortByColumnFourCustom = document.querySelectorAll('.akam-list-box thead tr th')[3];
            utilities.click(sortByColumnFourCustom);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[3].textContent).to.match(/Red/);
            expect(document.querySelectorAll('tbody tr')[2].querySelectorAll('td')[3].textContent).to.match(/Green/);
        });
        it('should be able to sort by reverse custom function', function(){
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            var sortByColumnFourCustom = document.querySelectorAll('.akam-list-box thead tr th')[3];
            utilities.click(sortByColumnFourCustom);
            utilities.click(sortByColumnFourCustom);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[3].textContent).to.match(/Green/);
            expect(document.querySelectorAll('tbody tr')[2].querySelectorAll('td')[3].textContent).to.match(/Red/);
        });
        it('should be able to generic sort', function(){
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            var sortByColumnSixDate = document.querySelectorAll('.akam-list-box thead tr th')[5];
            utilities.click(sortByColumnSixDate);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[5].textContent).to.contain('["goodbye"]');
            expect(document.querySelectorAll('tbody tr')[2].querySelectorAll('td')[5].textContent).to.contain('["shake it off"]');
        });
        it('should sort entire rows', function(){
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
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
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            utilities.click(document.querySelector('tbody tr').querySelectorAll('td')[0].querySelector('input'));
            var checkedCheckbox = document.querySelectorAll('input[type="checkbox"]:checked');
            expect(checkedCheckbox).to.have.length(1);
        });
        it('should update total selected field', function(){
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            utilities.click(document.querySelector('tbody tr').querySelectorAll('td')[0].querySelector('input')); 
            expect(document.querySelector('div.list-box-footer span.ng-binding').textContent).to.match(/Selected: 1/);
        });
        //it('should make view selected only box visible', function(){});
        it('should change background color of selected items', function(){
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
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
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            var checkbox = document.querySelector('tbody tr').querySelectorAll('td')[0].querySelector('input')
            utilities.click(checkbox); 
            utilities.click(checkbox);
            var checkedCheckbox = document.querySelectorAll('input[type="checkbox"]:checked');
            expect(checkedCheckbox).to.have.length(0);
        });
        it('should updated total selected field', function(){
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            var checkbox = document.querySelector('tbody tr').querySelectorAll('td')[0].querySelector('input')
            utilities.click(checkbox); 
            utilities.click(checkbox);
            expect(document.querySelector('div.list-box-footer span.ng-binding').textContent).to.match(/Selected: 0/);
        });
        //it('should maintain invisibility of view selected only when 0 selected', function(){});
        it('should change background color of deselected items', function(){
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            var checkbox = document.querySelector('tbody tr').querySelectorAll('td')[0].querySelector('input')
            utilities.click(checkbox); 
            utilities.click(checkbox);
            expect(checkbox.parentNode.parentNode.classList.contains('row-selected')).to.be.false();
        });
        //it('should keep view selected only visible when options remain', function(){});
    });
    context('when activating view selected only option', function(){
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        it('should hide unselected items when "view selected only" pressed', function(){
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            var checkbox = document.querySelector('tbody tr').querySelectorAll('td')[0].querySelector('input')
            utilities.click(checkbox);
            utilities.click(document.querySelector('div.list-box-footer span.util-pull-right input[type="checkbox"]'));
            expect(document.querySelectorAll('tbody tr')).to.have.length(1);
        });
        it('should remove item from view if deselected', function(){
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            var checkbox = document.querySelector('tbody tr').querySelectorAll('td')[0].querySelector('input')
            utilities.click(checkbox);
            utilities.click(document.querySelector('div.list-box-footer span.util-pull-right input'));
            utilities.click(checkbox);
            expect(document.querySelectorAll('tbody tr').length).to.equal(0);
        });
        it('should show unselected items when "view selected only" re-pressed', function(){
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            var checkbox = document.querySelector('tbody tr').querySelectorAll('td')[0].querySelector('input')
            utilities.click(checkbox);
            utilities.click(document.querySelector('div.list-box-footer span.util-pull-right input'));
            utilities.click(document.querySelector('div.list-box-footer span.util-pull-right input'));
            expect(document.querySelectorAll('tbody tr')).to.have.length(scope.mydata.length);
        });
        it('should deactivate selectall checkbox', function(){
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            var checkbox = document.querySelector('tbody tr').querySelectorAll('td')[0].querySelector('input')
            utilities.click(checkbox);
            utilities.click(document.querySelector('div.list-box-footer span.util-pull-right input[type="checkbox"]'));
            utilities.click(document.querySelector('div.list-box-footer span.util-pull-right input[type="checkbox"]'));
            expect(document.querySelectorAll('div.list-box-data thead th.column-checkbox input[type="checkbox"]:checked')).to.have.length(0);
        });
        /*it('should activate selectall checkbox', function(){
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            var checkbox = document.querySelector('tbody tr').querySelectorAll('td')[0].querySelector('input')
            utilities.click(checkbox);
            expect(document.querySelector('div.list-box-footer span.util-pull-right input[type="checkbox"]')).to.not.be(null);
        });*/
    });
    context('when interacting with filter bar', function(){
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        beforeEach(function(){
            scope.mydata = [{name:"iiiKeviii"},{name:"Keviiiiii"},{name:"iiiiiiKev"},{name:"iiiiiijohn"},{name:"iiijohniii"}];
            scope.columns = [{content : "name",header : 'Name'}];
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
        });
        it('should filter based on input beginning-middle-end matches', function(){
            document.querySelector('div.list-box-filter input[type="text"]').value= "Kev";
            scope.$$childHead.state.filter = "Kev";
            scope.$$childHead.updateSearchFilter();
            scope.$digest(); 
            expect(document.querySelectorAll('tbody tr').length).to.equal(3);
            
            //CURRENTLY IN A FAILING CASE FILTER DOES NOT REORDER BASED UPON ACCURACY
            //expect(document.querySelectorAll('tbody tr')[0].querySelectorAll('td')[1].textContent).to.contain('Keviiiiii');
            //expect(document.querySelectorAll('tbody tr')[1].querySelectorAll('td')[1].textContent).to.contain('iiiKeviii');
            //expect(document.querySelectorAll('tbody tr')[2].querySelectorAll('td')[1].textContent).to.contain('iiiiiiKev');
        });
        it('should filter only selected items when view selected only selected', function(){
            var checkbox = document.querySelector('tbody tr').querySelectorAll('td')[0].querySelector('input')
            utilities.click(checkbox);
            utilities.click(document.querySelector('div.list-box-footer span.util-pull-right input[type="checkbox"]'));
            scope.$$childHead.state.filter = "Kev";
            scope.$$childHead.updateSearchFilter();
            scope.$digest(); 
            expect(document.querySelectorAll('tbody tr').length).to.equal(1); 
        });
        it('should not change selected value', function(){
            scope.$$childHead.state.filter = "Kev";
            scope.$$childHead.updateSearchFilter();
            scope.$digest();
            expect(document.querySelector('div.list-box-footer span.ng-binding').textContent).to.match(/Selected: 0/);
        });
        it('should be able to clear filter text', function(){
            scope.$$childHead.state.filter = "Kev";
            scope.$$childHead.updateSearchFilter();
            scope.$digest();
            expect(document.querySelectorAll('tbody tr').length).to.equal(3);
            scope.$$childHead.state.filter = "";
            scope.$$childHead.updateSearchFilter();
            scope.$digest();
            expect(document.querySelectorAll('tbody tr').length).to.equal(scope.mydata.length);
        });
        /*it('should alert when no matches found', function(){

        });
        it('should offer suggestions when no matches found', function(){

        });
        it('should be able to select off of suggestions', function(){

        });*/
    });/*
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
    context('when messing up developing', function(){
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        /*it('should recognize null content when sorting generic', function(){
            scope.baddata = [
                {first : null},
                {first : "Nick"},
                {first: null}];
            scope.columns = [
                {content : "first", 
                header : 'Full Name'}
            ];
            var markup = '<akam-list-box data="baddata" schema="columns"></akam-list-box>'
            addElement(markup);
            utilities.click(document.querySelectorAll('.akam-list-box thead tr th')[1]);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[1].textContent).to.match(/ /);
            expect(document.querySelectorAll('tbody tr')[2].querySelectorAll('td')[1].textContent).to.match(/Nick/);
        });*/
        it('should recognize null content when sorting name', function(){
            scope.baddata = [
                {name : null},
                {name : null},
                {'name' : "Kevin"},
                {name : null},
                {name: "James"}];
            scope.columns = [
                {content : "name", 
                header : 'Name'}
            ];
            var markup = '<akam-list-box data="baddata" schema="columns"></akam-list-box>'
            addElement(markup);
            utilities.click(document.querySelectorAll('.akam-list-box thead tr th')[1]);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[1].textContent).to.contain('');
            expect(document.querySelectorAll('tbody tr')[3].querySelectorAll('td')[1].textContent).to.contain('James')
            expect(document.querySelectorAll('tbody tr')[4].querySelectorAll('td')[1].textContent).to.contain('Kevin')
        });
        it('should not bother sorting one row', function(){
            scope.mydata = [
                {'name' : "Kevin"}
            ]
            scope.columns = [
                {content : 'name', 
                header : 'Name'}
            ];
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            utilities.click(document.querySelectorAll('.akam-list-box thead tr th')[1]);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[1].textContent).to.match(/Kevin/);
        });
        it('should be able to turn off sorting', function(){
            scope.mydata = [
                {'name' : "Kevin"}
            ]
            scope.columns = [
                {content : 'name', 
                header : 'Name',
                sort:false}
            ];
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'
            addElement(markup);
            utilities.click(document.querySelectorAll('.akam-list-box thead tr th')[1]);
            expect(document.querySelector('tbody tr').querySelectorAll('td')[1].textContent).to.match(/Kevin/);
        });
    });
    context('when errors are thrown', function(){
        it('should throw error when column content is null', function(){
            scope.mydata = [
                {name : "Bob"},
                {name : null},
                {name : null},
                {name : "James"}
            ]
            scope.columns = [
                {content : null, 
                header : 'Name'},
            ];
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            try{
                addElement(markup)
            } catch (e){
                expect(e).to.equal("The column content field is using an unknown type.  Content field may only be String or Function type");
            }
        });
        it('should throw error when data is not an array', function(){
            scope.mydata = null
            scope.columns = [
                {content : null, 
                header : 'Name'},
            ];
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            try{
                addElement(markup)
            } catch (e){
                expect(e).to.equal("Data must be an array");
            }
        });
        it('should throw error when schema is not an array', function(){
            scope.mydata = [];
            scope.columns = null;
            var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
            try{
                addElement(markup)
            } catch (e){
                expect(e).to.equal("Schema must be an array");
            }
        });
    });
});