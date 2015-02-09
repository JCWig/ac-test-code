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
    describe('when rendering', function() {
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
            click(document.querySelector('button.button'));
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: block'); 
        });
    });
    describe('when date picker is loaded', function(){
        beforeEach(function(){
            var markup = '<div id="parent-element"><akam-date-picker></akam-date-picker></div>';
            addElement(markup);
            click(document.querySelector('button.button')); 
        });
        it('should hide the date-picker upon click away', function() {
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: block'); 
            clickAwayCreationAndClick('div')
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });
        it('should hide the date-picker when close button clicked', function() {
            click(document.querySelector('button.btn-success'));
            scope.$digest();
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });
        /*it('should hide the date-picker when clear button clicked', function() {
            click(document.querySelector('button.btn-danger'));
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });
        it('should hide the date-picker when today button clicked', function() {
            click(document.querySelector('button.btn-info'));
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });*/
        it('should start on todays month', function(){
            var month = getMonthInEnglish();
            var year = getTodaysYear();
            var todaysDate = month + " "+ year;
            expect(document.querySelector('button strong.ng-binding').textContent).to.equal(todaysDate);
        });
    });
    describe('when interacting with the date picker', function(){
        beforeEach(function(){
            var markup = '<div id="parent-element"><akam-date-picker></akam-date-picker></div>';
            addElement(markup);
            click(document.querySelector('button.button'));
        });
        it('should change month left when prompted',function(){
            click(document.querySelector('button.pull-left')); 
            var month = getMonthInEnglish(getTodaysMonth()-1);
            var year = getTodaysYear();
            var todaysDate = month + " "+ year;
            expect(document.querySelector('button strong.ng-binding').textContent).to.equal(todaysDate);
        });
        it('should change month right when prompted',function(){
            click(document.querySelector('button.pull-right')); 
            var month = getMonthInEnglish(getTodaysMonth()+1);
            var year = getTodaysYear();
            var todaysDate = month + " "+ year;
            expect(document.querySelector('button strong.ng-binding').textContent).to.equal(todaysDate);
        });
        it('should load up month screen of current year when prompted', function(){
            expect(document.querySelector('table').getAttribute('ng-switch-when')).to.equal("day");
            click(document.querySelector('button strong.ng-binding').parentNode);
            expect(document.querySelector('table').getAttribute('ng-switch-when')).to.equal("month");  
            var year = getTodaysYear();
            expect(document.querySelector('button strong.ng-binding').textContent).to.equal(String(year));
        });
        /*it('should close and save date when date is chosen', function(){
            console.log(document.querySelector('td.ng-scope button.btn-default'));
            click(document.querySelector('td.ng-scope button.btn-default'));
            scope.$digest();
            console.log(scope.value);
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });*/
    });
    describe('when interacting with the month picker', function(){
        beforeEach(function(){
            var markup = '<div id="parent-element"><akam-date-picker></akam-date-picker></div>';
            addElement(markup);
            click(document.querySelector('button.button')); 
            click(document.querySelector('button strong.ng-binding').parentNode);
        });
        it('should change year left when prompted', function(){
            click(document.querySelector('button.pull-left')); 
            var year = String(getTodaysYear()-1);
            expect(document.querySelector('button strong.ng-binding').textContent).to.equal(year);
        });
        it('should change year rights when prompted', function(){
            click(document.querySelector('button.pull-right')); 
            var year = String(getTodaysYear()+1);
            expect(document.querySelector('button strong.ng-binding').textContent).to.equal(year);
        });
        it('should load date picker of chosen month when prompted', function(){
            click(document.querySelector('td.ng-scope button.btn-default'));
            expect(document.querySelector('button strong.ng-binding').textContent).to.match(/January/); 
        });
        it('should load year picker when prompted', function(){
            expect(document.querySelector('table').getAttribute('ng-switch-when')).to.equal("month");
            click(document.querySelector('button strong.ng-binding').parentNode);
            expect(document.querySelector('table').getAttribute('ng-switch-when')).to.equal("year");  
        });
    });
    describe('when interacting with the year picker', function(){
        beforeEach(function(){
            var markup = '<div id="parent-element"><akam-date-picker></akam-date-picker></div>';
            addElement(markup);
            click(document.querySelector('button.button')); 
            click(document.querySelector('button strong.ng-binding').parentNode);
            click(document.querySelector('button strong.ng-binding').parentNode);
        });
        it('should change decades right when prompted', function(){
            expect(document.querySelector('button strong.ng-binding').textContent).to.match(/2001 - 2020/);
            click(document.querySelector('button.pull-right')); 
            expect(document.querySelector('button strong.ng-binding').textContent).to.match(/2021 - 2040/);
        });
        it('should change decades left when prompted', function(){
            expect(document.querySelector('button strong.ng-binding').textContent).to.match(/2001 - 2020/);
            click(document.querySelector('button.pull-left')); 
            expect(document.querySelector('button strong.ng-binding').textContent).to.match(/1981 - 2000/);
        });
        it('should load month picker of chosen year when prompted', function(){
            click(document.querySelector('td.ng-scope button.btn-default'));
            expect(document.querySelector('button strong.ng-binding').textContent).to.match(/2001/); 
        });
    });
});