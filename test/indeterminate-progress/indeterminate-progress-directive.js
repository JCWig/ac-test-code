'use strict';

describe('akam-indeterminate-progress', function() {
    var compile = null;
    var scope = null;
    var self = this;
    
    beforeEach(function() {
        self = this;
        angular.mock.module(require('../../src/indeterminate-progress').name);
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
        it('should have the correct class names', function() {
            var markup = '<div id="parent-element"><akam-indeterminate-progress></akam-indeterminate-progress></div>';
            addElement(markup);
            
            var items = this.element.querySelectorAll('.indeterminate-progress-wrapper');
            expect(items).to.have.length(1);
            expect(this.element.classList.contains('indeterminate-progress')).to.be.true();
            expect(items[0].classList.contains('normal')).to.be.true();
        });
        
        it('should have the correct class names for small size', function() {
            var markup = '<div id="parent-element"><akam-indeterminate-progress size="small"></akam-indeterminate-progress></div>';
            addElement(markup);

            // then
            var items = this.element.querySelectorAll('.indeterminate-progress-wrapper');
            expect(items).to.have.length(1);
            expect(items[0].classList.contains('small')).to.be.true();
        });
        
        it('should have the correct class names for large size', function() {
            var markup = '<div id="parent-element"><akam-indeterminate-progress size="large"></akam-indeterminate-progress></div>';
            addElement(markup);

            // then
            var items = this.element.querySelectorAll('.indeterminate-progress-wrapper');
            expect(items).to.have.length(1);
            expect(items[0].classList.contains('large')).to.be.true();
            
            expect(self.el.find('akam-indeterminate-progress').isolateScope().state()).to.be.eql('started');
        });
        
        it('should render indeterminate progress with new scope values - yet marked failed because failed="true"', function() {
            var markup = '<div id="parent-element"><akam-indeterminate-progress failed="true" label="Static Label"></akam-indeterminate-progress></div>';
            addElement(markup);

            // then
            var items = this.element.querySelectorAll('.indeterminate-progress-wrapper');
            expect(items).to.have.length(1);
            
            var label = this.element.querySelector('.indeterminate-progress-wrapper label');
            expect(label.textContent).to.match(/Static Label/);

            //make sure the "failed" marker is assigned to the element
            expect(items[0].classList.contains('failed')).to.be.true();
            expect(this.element.classList.contains('indeterminate-progress')).to.be.true();
            
            expect(self.el.find('akam-indeterminate-progress').isolateScope().state()).to.be.eql('failed');
        });
        
        it('should render indeterminate progress with completed state', function() {
            var markup = '<div id="parent-element"><akam-indeterminate-progress completed="true" label=""></akam-indeterminate-progress></div>';
            addElement(markup);

            expect(this.element.classList.contains('indeterminate-progress')).to.be.false();

            expect(self.el.find('akam-indeterminate-progress').isolateScope().state()).to.be.eql('completed');
        });
        
        it('should render without any label present when label is empty', function() {
            var markup = '<div id="parent-element"><akam-indeterminate-progress label=""></akam-indeterminate-progress></div>';
            addElement(markup);

            expect(this.element.classList.contains('indeterminate-progress')).to.be.true();
            
            //make sure label is not shown when label===""
            var items = this.element.querySelectorAll('.indeterminate-progress-wrapper label');
            expect(items).to.have.length(0);
        });
        
        it('should render with exact label present when label is not empty', function() {
            var markup = '<div id="parent-element"><akam-indeterminate-progress label="Hello"></akam-indeterminate-progress></div>';
            addElement(markup);

            expect(this.element.classList.contains('indeterminate-progress')).to.be.true();
            
            //make sure label is shown when label!==""
            var items = this.element.querySelectorAll('.indeterminate-progress-wrapper label');
            expect(items).to.have.length(1);
            
            var label = this.element.querySelector('.indeterminate-progress-wrapper label');
            expect(label.textContent).to.be.eql("Hello");
        });
    });
    
    
    describe('when destroyed/removed', function(){
        it('should render no longer contain parent element class name', function() {
            var markup = '<div id="parent-element"><akam-indeterminate-progress label="Hello"></akam-indeterminate-progress></div>';
            addElement(markup);

            expect(this.element.classList.contains('indeterminate-progress')).to.be.true();
            
            // now forcefully remove the element
            self.el.find('akam-indeterminate-progress').remove();
            
            expect(this.element.classList.contains('indeterminate-progress')).to.be.false();
        });    
    });

    describe('when something changes completed status', function(){
        beforeEach(function(){
            var markup = ('<div><div id="parent-element" class="">'+
                          '<akam-indeterminate-progress completed="{{completed}}">'+
                          '</akam-indeterminate-progress> </div>'+
                          '<button id="change-completed"></button></div>');
            addElement(markup);
            document.querySelector('#change-completed').addEventListener("click",function(){
                if(scope.completed){
                    scope.completed = false;
                } else {
                    scope.completed = true;
                }
            });
        });
        it('should appear when changed to false', function(){
            scope.completed = true;
            scope.$digest();
            expect(this.element.querySelector('#parent-element').classList.contains('indeterminate-progress')).to.be.false();
            click(document.querySelector('#change-completed'));
            scope.$digest();
            expect(this.element.querySelector('#parent-element').classList.contains('indeterminate-progress')).to.be.true();
        });
        it('should disappear when changed to true', function(){
            scope.completed = false;
            scope.$digest();
            expect(this.element.querySelector('#parent-element').classList.contains('indeterminate-progress')).to.be.true();
            click(document.querySelector('#change-completed'));
            scope.$digest();
            expect(this.element.querySelector('#parent-element').classList.contains('indeterminate-progress')).to.be.false(); 
        })
    });
});
