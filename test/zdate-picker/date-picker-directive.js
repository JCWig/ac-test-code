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
            console.log(document.querySelector('button.btn-clear'));
            click(document.querySelector('button.btn-clear'));
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });
        it('should hide the date-picker when today button clicked', function() {
            console.log(document.querySelector('button.btn-info'));
            click(document.querySelector('button.btn-info'));
            expect(document.querySelector('ul.dropdown-menu').getAttribute('style')).to.contain('display: none'); 
        });*/
        it('should start on todays month', function(){
            var date = new Date();
            var month = getMonthInEnglish(date.getMonth());
            var year = date.getFullYear();
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
        it('should change month when prompted',function(){

        });
        it('should load up month screen when prompted', function(){

        });
        it('should close and save date when date is chosen', function(){

        });
        it('should load up month screen when prompted', function(){

        });
    });
    describe('when interacting with the month picker', function(){
        beforeEach(function(){
            var markup = '<div id="parent-element"><akam-date-picker></akam-date-picker></div>';
            addElement(markup);
            click(document.querySelector('button.button')); 
        });
        it('should change year when prompted', function(){

        });
        it('should load date picker of chosen month when prompted', function(){
            
        });
        it('should load year picker when prompted', function(){
            
        });
    });
    describe('when interacting with the year picker', function(){
        beforeEach(function(){
            var markup = '<div id="parent-element"><akam-date-picker></akam-date-picker></div>';
            addElement(markup);
            click(document.querySelector('button.button')); 
        });
        it('should change decades when prompted', function(){

        });
        it('should load month picker of chosen year when prompted', function(){
            
        });
    });
});