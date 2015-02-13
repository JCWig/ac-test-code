'use strict';
var utilities = require('../utilities');
var findCertainButton = function(buttonKey){
    var calendar = document.querySelectorAll('td.ng-scope');
    for (var i = 0; i < calendar.length; i++){
        if(calendar[i].textContent.indexOf(buttonKey)>=0){
            return calendar[i]
        }
    }
    return null;
};
describe('akam-date-picker', function() {
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
            var markup = '<div id="parent-element"><akam-date-picker placeholder="placeholder"></akam-date-picker></div>';
            addElement(markup);
            expect(document.querySelector('input')).to.not.be.null;
            expect(document.querySelector('button.button')).to.not.be.null;
            expect(document.querySelector('ul.dropdown-menu')).to.not.be.null;
            expect(document.querySelector('input.ng-valid').placeholder).to.equal("placeholder");
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
            var markup = '<div id="parent-element"><akam-date-picker mode="day" value="picked1" onchange="mychange(value)"></akam-date-picker></div>';
            addElement(markup);
            utilities.click(document.querySelector('button.button')); 
        });
        it('should hide the date-picker upon click away', function() {
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: block'); 
            utilities.clickAwayCreationAndClick('div')
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });
        it('should start on todays month', function(){
            var todaysDate = utilities.getMonthInEnglish() + " "+ utilities.getTodaysYear();
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: block'); 
            expect(document.querySelector('button.btn strong.ng-binding').textContent).to.equal(todaysDate);
        });
    });
    describe('when interacting with the date picker', function(){
        beforeEach(function(){
            var markup = '<div id="parent-element"><akam-date-picker mode="day" value="picked1" onchange="mychange(value)"></akam-date-picker></div>';
            scope.mychange = sinon.spy();
            addElement(markup);
            utilities.click(document.querySelector('button.button')); 
        });
        it('should change month left when prompted',function(){
            utilities.click(document.querySelector('button.pull-left')); 
            var month = utilities.getMonthInEnglish(utilities.getTodaysMonth()-1);
            var year = utilities.getTodaysYear();
            var last_month = month + " "+ year;
            expect(document.querySelector('button strong.ng-binding').textContent).to.equal(last_month);
        });
        it('should change month right when prompted',function(){
            utilities.click(document.querySelector('button.pull-right')); 
            var month = utilities.getMonthInEnglish(utilities.getTodaysMonth()+1);
            var year = utilities.getTodaysYear();
            var next_month = month + " "+ year;
            expect(document.querySelector('button strong.ng-binding').textContent).to.equal(next_month);
        });
        it('should close and save date when date is chosen', function(){
            var day = findCertainButton("01");
            utilities.click(day.querySelector('button'));
            scope.$digest();
            var firstOfThisMonth = utilities.getTodaysYear()+"-"+utilities.formatInteger(2,String(utilities.getTodaysMonth()+1))+"-01";
            expect(document.querySelector('input.ng-valid-date').value).to.equal(firstOfThisMonth);
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });
        it('should be able to open and change date', function(){
            var day = findCertainButton("01");
            expect(scope.mychange).to.not.have.been.called;
            utilities.click(day.querySelector('button'));
            expect(scope.mychange).to.have.been.called;
            scope.$digest();
            utilities.click(document.querySelector('button.button'));
            var day2 = findCertainButton("02");
            utilities.click(day2.querySelector('button'));
            scope.$digest();
            var firstOfThisMonth = utilities.getTodaysYear()+"-"+utilities.formatInteger(2,String(utilities.getTodaysMonth()+1))+"-02";
            expect(document.querySelector('input.ng-valid-date').value).to.equal(firstOfThisMonth);
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });
    });
    describe('when rendering month picker', function(){
        beforeEach(function(){
            var markup = '<div id="parent-element"><akam-date-picker mode="month" value="picked1"></akam-date-picker></div>';
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
            var markup = '<div id="parent-element"><akam-date-picker mode="month" onchange="mychange(value)" value="picked1"></akam-date-picker></div>';
            scope.mychange = sinon.spy();
            addElement(markup);
            utilities.click(document.querySelector('button.button')); 
        });
        it('should change year left when prompted', function(){
            utilities.click(document.querySelector('button.pull-left')); 
            var last_year = String(utilities.getTodaysYear()-1);
            expect(document.querySelector('button strong.ng-binding').textContent).to.equal(last_year);
        });
        it('should change year rights when prompted', function(){
            utilities.click(document.querySelector('button.pull-right')); 
            var next_year = String(utilities.getTodaysYear()+1);
            expect(document.querySelector('button strong.ng-binding').textContent).to.equal(next_year);
        });
        it('should close and save month when month is chosen', function(){
            var month = findCertainButton("Jan");
            utilities.click(month.querySelector('button'));
            scope.$digest();
            var firstOfThisMonth = utilities.getTodaysYear()+"-01";
            expect(document.querySelector('input.ng-valid-date').value).to.equal(firstOfThisMonth);
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });
        it('should be able to open and change month', function(){
            var month = findCertainButton("Jan");
            expect(scope.mychange).to.not.have.been.called;
            utilities.click(month.querySelector('button'));
            scope.$digest();
            utilities.click(document.querySelector('button.button')); 
            var month2 = findCertainButton("Feb");
            utilities.click(month2.querySelector('button'));
            scope.$digest();
            expect(scope.mychange).to.have.been.called
            var firstOfThisMonth = utilities.getTodaysYear()+"-02";
            expect(document.querySelector('input.ng-valid-date').value).to.equal(firstOfThisMonth);
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });
    });
    describe('when interacting with min and max date dat picker', function(){
        beforeEach(function(){
            var markup = '<div id="parent-element"><akam-date-picker min={{min}} max="{{max}}" mode="day" onchange="mychange(value)" value="picked1"></akam-date-picker></div>';
            scope.min = new Date(utilities.getTodaysYear(), utilities.getTodaysMonth(), 5);
            scope.max = new Date(utilities.getTodaysYear(), utilities.getTodaysMonth(), 15);
            scope.mychange = sinon.spy();
            addElement(markup);
            utilities.click(document.querySelector('button.button')); 
        });
        it('should be unable to choose day above maximum', function(){
            var dayAboveMax = findCertainButton("20");
            expect(dayAboveMax.getAttribute('aria-disabled')).to.match(/true/);
        });
        it('should be unable to choose day below minimum', function(){
            var dayBelowMin = findCertainButton("02");
            expect(dayBelowMin.getAttribute('aria-disabled')).to.match(/true/);
        });
        it('should be able to choose date within range', function(){
            var dayWithinRange = findCertainButton("09");
            expect(dayWithinRange.getAttribute('aria-disabled')).to.match(/false/);
        });
    });
    describe('when interacting with min and max date month picker', function(){
        beforeEach(function(){
            var markup = '<div id="parent-element"><akam-date-picker min={{min}} max="{{max}}" mode="month" onchange="mychange(value)" value="picked1"></akam-date-picker></div>';
            scope.min = new Date(utilities.getTodaysYear(), utilities.getTodaysMonth(), 5);
            scope.max = new Date(utilities.getTodaysYear(), utilities.getTodaysMonth(), 15);
            scope.mychange = sinon.spy();
            addElement(markup);
            utilities.click(document.querySelector('button.button')); 
        });
        it('should be unable to choose month below minimum', function(){
            utilities.click(document.querySelector('button strong.ng-binding').parentNode);
            var monthBelowMinEnglish= utilities.getMonthInEnglish(utilities.getTodaysMonth()-1).slice(0,3);
            if(monthBelowMinEnglish === "Dec"){
                utilities.click(document.querySelector('button.pull-left')); 
            }
            var monthBelowMin = findCertainButton(monthBelowMinEnglish);
            expect(monthBelowMin.getAttribute('aria-disabled')).to.match(/true/);
        });
        it('should be unable to choose month above maximum', function(){
            utilities.click(document.querySelector('button strong.ng-binding').parentNode);
            var monthAboveMaxEnglish = utilities.getMonthInEnglish(utilities.getTodaysMonth()+1).slice(0,3);
            if(monthAboveMaxEnglish === "Jan"){
                utilities.click(document.querySelector('button.pull-right')); 
            }
            var monthAboveMax = findCertainButton(monthAboveMaxEnglish);
            expect(monthAboveMax.getAttribute('aria-disabled')).to.match(/true/);
        });
        it('should be able to choose month within range', function(){
            utilities.click(document.querySelector('button strong.ng-binding').parentNode);
            var monthWithinRange = findCertainButton(utilities.getMonthInEnglish().slice(0,3));
            expect(monthWithinRange.getAttribute('aria-disabled')).to.match(/false/);
        });
    });
});