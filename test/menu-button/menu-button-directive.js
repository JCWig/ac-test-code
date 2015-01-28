'use strict';

function click(el) {
    var ev = document.createEvent('MouseEvent');
    ev.initMouseEvent('click', true);
    el.dispatchEvent(ev);
};

function clickOnMenuButton(self){
    var button = self.element.querySelector('.akam-menu-button > button');
    click(button);
    self.scope.$digest();
};

function testUnopenedConditions(ele){
    expect(ele.classList.contains('open')).to.be.false();
    expect(ele.querySelector('button.dropdown-toggle').getAttribute('aria-expanded')).to.equal('false');
    expect(getComputedStyle(document.querySelector('.dropdown-menu')).display).to.equal('none');
};

describe('akam-menu-button', function() {
    beforeEach(function() {
        var self = this;

        angular.mock.module(require('../../src/menu-button').name);
        inject(function($compile, $rootScope) {
            var markup = '<akam-menu-button label="Test">' +
                '<akam-menu-button-item text="Action" ng-click="process()">' +
                '</akam-menu-button-item>' +
                '<akam-menu-button-item text="Action"></akam-menu-button-item>' +
                '</akam-menu-button>';

            self.scope = $rootScope.$new();
            self.scope.process = sinon.spy();
            self.element = $compile(markup)(self.scope)[0];
            self.scope.$digest();
            document.body.appendChild(self.element);
        });
    });
    afterEach(function() {
        document.body.removeChild(this.element);
    });
    describe('when rendering', function() {
        it('should display a button with a label', function() {
            var button = this.element.querySelector('.akam-menu-button > button');
            expect(button.textContent).to.match(/Test/);
        });

        it('should hide the menu', function() {
            var div = this.element.querySelector('.akam-menu-button');
            expect(div.classList.contains('open')).to.be.false();
        });
    });
    describe('when clicking the menu button', function() {
        beforeEach(function() {
            clickOnMenuButton(this);
        });
        it('should display the menu', function() {
            var div = this.element.querySelector('.akam-menu-button');
            expect(div.classList.contains('open')).to.be.true();
            expect(div.querySelector('button.dropdown-toggle').getAttribute('aria-expanded')).to.equal('true');
            expect(getComputedStyle(document.querySelector('.dropdown-menu')).display).to.equal('block');
        });
        it('should display the menu items', function() {
            var items = this.element.querySelectorAll('.dropdown-menu > li');
            expect(items).to.have.length(2);
            expect(items[0].textContent).to.match(/Action/);
        });
    });
    describe('when clicking a menu item', function() {
        beforeEach(function() {
            var button = this.element.querySelector('.akam-menu-button > button');
            var items = this.element.querySelectorAll('.dropdown-menu > li');

            click(button);
            this.scope.$digest();
            click(items[0].firstChild);
            this.scope.$digest();
        });

        it('should trigger the menu item action', function() {
            expect(this.scope.process).to.have.been.called;
        });

        it('should hide the menu', function() {
            var div = this.element.querySelector('.akam-menu-button');
            testUnopenedConditions(div);
        });
    });
    describe('when re-clicking the menu button', function(){
        beforeEach(function() {
            clickOnMenuButton(this);
        });
        it('clicking menu button should hide dropdown', function() {
            var div = this.element.querySelector('.akam-menu-button');
            expect(div.classList.contains('open')).to.be.true();
            clickOnMenuButton(this);
            testUnopenedConditions(div);
        });
    });
    describe('when clicking away from open dropdown', function(){
        var clickAwayCreationAndClick = function(ele){
            var clickAwayArea = document.createElement(ele);
            clickAwayArea.setAttribute("id", "click-away");
            document.body.appendChild(clickAwayArea);
            var clickAwayButton = document.querySelector('#click-away');
            click(clickAwayButton);
            document.body.removeChild(clickAwayArea);
        };
        it('click -button- shoud hide dropdown',function(){
            var ele = document.querySelector('.akam-menu-button');
            clickAwayCreationAndClick('button');
            testUnopenedConditions(ele);
        });
        it('click -div- shoud hide dropdown',function(){
            var ele = document.querySelector('.akam-menu-button');
            clickAwayCreationAndClick('div');
            testUnopenedConditions(ele);
        });
    });
});
