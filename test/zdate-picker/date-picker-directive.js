'use strict';
var utilities = require('../utilities');
var findDayOfMonth = function(dayNum){
    var days = document.querySelectorAll('td.ng-scope');
    for (var i = 0; i < days.length; i++){
        if(days[i].textContent.indexOf(dayNum)>=0){
            return days[i]
        }
    }
    return null;
};
var findMonthOfYear = function(month){
    var months = document.querySelectorAll('td.ng-scope');
    for (var i = 0; i < months.length; i++){
        if(months[i].textContent.indexOf(month)>=0){
            return months[i]
        }
    }
    return null;
};
describe('zakam-date-picker', function() {
    var compile = null;
    var scope = null;
    var self = this;
    
    beforeEach(function() {
        self = this;
        angular.mock.module(require('../../src/date-picker').name);
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
    describe('when rendering date picker', function() {
        it('should render all parts', function() {
            var markup = '<div id="parent-element"><akam-date-picker></akam-date-picker></div>';
            addElement(markup);
            expect(document.querySelector('input')).to.not.be.null;
            expect(document.querySelector('button.button')).to.not.be.null;
            expect(document.querySelector('ul.dropdown-menu')).to.not.be.null;
        });
        it('should default hide the picker', function(){
            var markup = '<div id="parent-element"><akam-date-picker></akam-date-picker></div>';
            addElement(markup);
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });
    });
    describe('when pressing the open button', function(){
        it('should display the date-picker', function() {
            var markup = '<div id="parent-element"><akam-date-picker></akam-date-picker></div>';
            addElement(markup);
            utilities.click(document.querySelector('button.button'));
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: block'); 
        });
    });
    describe('when date picker is loaded', function(){
        beforeEach(function(){
            var markup = '<div id="parent-element"><akam-date-picker></akam-date-picker></div>';
            addElement(markup);
            utilities.click(document.querySelector('button.button')); 
        });
        it('should hide the date-picker upon click away', function() {
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: block'); 
            utilities.clickAwayCreationAndClick('div')
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });
        it('should hide the date-picker when close button clicked', function() {
            utilities.click(document.querySelector('button.btn-success'));
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });/*
        it('should hide the date-picker when clear button clicked', function() {
            utilities.click(document.querySelector('button.btn-danger'));
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });*/
        it('should hide the date-picker when today button clicked', function() {
            utilities.click(document.querySelector('button.btn-info'));
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });
        it('should start on todays month', function(){
            var month = utilities.getMonthInEnglish();
            var year = utilities.getTodaysYear();
            var todaysDate = month + " "+ year;
            expect(document.querySelector('button strong.ng-binding').textContent).to.equal(todaysDate);
        });
    });
    describe('when interacting with the date picker', function(){
        beforeEach(function(){
            var markup = '<div id="parent-element"><akam-date-picker></akam-date-picker></div>';
            addElement(markup);
            utilities.click(document.querySelector('button.button'));
        });
        it('should change month left when prompted',function(){
            utilities.click(document.querySelector('button.pull-left')); 
            var month = utilities.getMonthInEnglish(utilities.getTodaysMonth()-1);
            var year = utilities.getTodaysYear();
            var todaysDate = month + " "+ year;
            expect(document.querySelector('button strong.ng-binding').textContent).to.equal(todaysDate);
        });
        it('should change month right when prompted',function(){
            utilities.click(document.querySelector('button.pull-right')); 
            var month = utilities.getMonthInEnglish(utilities.getTodaysMonth()+1);
            var year = utilities.getTodaysYear();
            var todaysDate = month + " "+ year;
            expect(document.querySelector('button strong.ng-binding').textContent).to.equal(todaysDate);
        });
        it('should load up month screen of current year when prompted', function(){
            expect(document.querySelector('table').getAttribute('ng-switch-when')).to.equal("day");
            utilities.click(document.querySelector('button strong.ng-binding').parentNode);
            expect(document.querySelector('table').getAttribute('ng-switch-when')).to.equal("month");  
            var year = utilities.getTodaysYear();
            expect(document.querySelector('button strong.ng-binding').textContent).to.equal(String(year));
        });
        it('should close and save date when date is chosen', function(){
            var day = findDayOfMonth("01");
            utilities.click(day.querySelector('button'));
            scope.$digest();
            var firstOfThisMonth = utilities.getTodaysYear()+"-"+utilities.formatInteger(2,String(utilities.getTodaysMonth()+1))+"-01";
            expect(document.querySelector('input.ng-valid-date').value).to.equal(firstOfThisMonth);
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });
        it('should be able to open and change date', function(){
            var day = findDayOfMonth("01");
            utilities.click(day.querySelector('button'));
            scope.$digest();
            utilities.click(document.querySelector('button.button'));
            var day2 = findDayOfMonth("02");
            utilities.click(day2.querySelector('button'));
            scope.$digest();
            var firstOfThisMonth = utilities.getTodaysYear()+"-"+utilities.formatInteger(2,String(utilities.getTodaysMonth()+1))+"-02";
            expect(document.querySelector('input.ng-valid-date').value).to.equal(firstOfThisMonth);
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });
    });
    describe('when interacting with the month picker via date picker', function(){
        beforeEach(function(){
            var markup = '<div id="parent-element"><akam-date-picker></akam-date-picker></div>';
            addElement(markup);
            utilities.click(document.querySelector('button.button')); 
            utilities.click(document.querySelector('button strong.ng-binding').parentNode);
        });
        it('should change year left when prompted', function(){
            utilities.click(document.querySelector('button.pull-left')); 
            var year = String(utilities.getTodaysYear()-1);
            expect(document.querySelector('button strong.ng-binding').textContent).to.equal(year);
        });
        it('should change year rights when prompted', function(){
            utilities.click(document.querySelector('button.pull-right')); 
            var year = String(utilities.getTodaysYear()+1);
            expect(document.querySelector('button strong.ng-binding').textContent).to.equal(year);
        });
        it('should load date picker of chosen month when prompted', function(){
            utilities.click(document.querySelector('td.ng-scope button.btn-default'));
            expect(document.querySelector('button strong.ng-binding').textContent).to.match(/January/); 
        });
        it('should load year picker when prompted', function(){
            expect(document.querySelector('table').getAttribute('ng-switch-when')).to.equal("month");
            utilities.click(document.querySelector('button strong.ng-binding').parentNode);
            expect(document.querySelector('table').getAttribute('ng-switch-when')).to.equal("year");  
        });
    });
    describe('when interacting with the year picker', function(){
        beforeEach(function(){
            var markup = '<div id="parent-element"><akam-date-picker></akam-date-picker></div>';
            addElement(markup);
            utilities.click(document.querySelector('button.button')); 
            utilities.click(document.querySelector('button strong.ng-binding').parentNode);
            utilities.click(document.querySelector('button strong.ng-binding').parentNode);
        });
        it('should change decades right when prompted', function(){
            expect(document.querySelector('button strong.ng-binding').textContent).to.match(/2001 - 2020/);
            utilities.click(document.querySelector('button.pull-right')); 
            expect(document.querySelector('button strong.ng-binding').textContent).to.match(/2021 - 2040/);
        });
        it('should change decades left when prompted', function(){
            expect(document.querySelector('button strong.ng-binding').textContent).to.match(/2001 - 2020/);
            utilities.click(document.querySelector('button.pull-left')); 
            expect(document.querySelector('button strong.ng-binding').textContent).to.match(/1981 - 2000/);
        });
        it('should load month picker of chosen year when prompted', function(){
            utilities.click(document.querySelector('td.ng-scope button.btn-default'));
            expect(document.querySelector('button strong.ng-binding').textContent).to.match(/2001/); 
        });
    });
    describe('when rendering month picker', function(){
        beforeEach(function(){
            var markup = '<div id="parent-element"><akam-date-picker mode="month"></akam-date-picker></div>';
            addElement(markup);
        });
        it('should render all parts', function(){
            expect(document.querySelector('input')).to.not.be.null;
            expect(document.querySelector('button.button')).to.not.be.null;
            expect(document.querySelector('ul.dropdown-menu')).to.not.be.null;
        });
        it('should default hide the picker',function(){
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        })
    });
    describe('when interacting with only month picker', function(){
        beforeEach(function(){
            var markup = '<div id="parent-element"><akam-date-picker mode="month"></akam-date-picker></div>';
            addElement(markup);
            utilities.click(document.querySelector('button.button')); 
        });
        it('should change year left when prompted', function(){
            utilities.click(document.querySelector('button.pull-left')); 
            var year = String(utilities.getTodaysYear()-1);
            expect(document.querySelector('button strong.ng-binding').textContent).to.equal(year);
        });
        it('should change year rights when prompted', function(){
            utilities.click(document.querySelector('button.pull-right')); 
            var year = String(utilities.getTodaysYear()+1);
            expect(document.querySelector('button strong.ng-binding').textContent).to.equal(year);
        });
        it('should load year picker when prompted', function(){
            expect(document.querySelector('table').getAttribute('ng-switch-when')).to.equal("month");
            utilities.click(document.querySelector('button strong.ng-binding').parentNode);
            expect(document.querySelector('table').getAttribute('ng-switch-when')).to.equal("year");  
        });
        it('should close and save month when month is chosen', function(){
            var month = findMonthOfYear("January");
            utilities.click(month.querySelector('button'));
            scope.$digest();
            var firstOfThisMonth = utilities.getTodaysYear()+"-01";
            expect(document.querySelector('input.ng-valid-date').value).to.equal(firstOfThisMonth);
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });
        it('should be able to open and change month', function(){
            var month = findMonthOfYear("January");
            utilities.click(month.querySelector('button'));
            scope.$digest();
            utilities.click(document.querySelector('button.button')); 
            var month2 = findMonthOfYear("February");
            utilities.click(month2.querySelector('button'));
            var firstOfThisMonth = utilities.getTodaysYear()+"-02";
            expect(document.querySelector('input.ng-valid-date').value).to.equal(firstOfThisMonth);
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });
    });
});