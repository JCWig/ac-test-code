'use strict';
var utilities = require('../utilities');
var MENU_BUTTON_WRAPPER = '.akam-menu-button';
var MENU_BUTTON_BUTTON = '.akam-menu-button button';
var MENU_BUTTON_ITEMS = '.akam-menu-button li';
var DROP_DOWN_MENU = '.dropdown-menu';


function clickOnMenuButton(self){
    var menuButton = self.element.querySelector(MENU_BUTTON_BUTTON);
    utilities.click(menuButton);
    self.scope.$digest();
};

describe('akam-menu-button', function() {
    beforeEach(function() {
        var self = this;
        angular.mock.module(require('../../src/menu-button').name);
        inject(function($compile, $rootScope) {
            var markup = '<div><akam-menu-button label="Test">' +
                '<akam-menu-button-item text="Action" ng-click="process()">' +
                '</akam-menu-button-item>' +
                '<akam-menu-button-item text="Action"></akam-menu-button-item>' +
                '</akam-menu-button></div>';

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
    context('when rendering', function() {
        it('should display a button with a label', function() {
            var menuButton = this.element.querySelector(MENU_BUTTON_BUTTON);
            expect(menuButton.textContent).to.match(/Test/);
        });

        it('should hide the menu', function() {
            var menuButtonWrapper = this.element.querySelector(MENU_BUTTON_WRAPPER);
            expect(menuButtonWrapper.classList.contains('open')).to.be.false();
        });
    });
    context('when clicking the menu button', function() {
        beforeEach(function() {
            clickOnMenuButton(this);
        });
        it('should display the menu', function() {
            var menuButtonWrapper = this.element.querySelector(MENU_BUTTON_WRAPPER);
            expect(menuButtonWrapper.classList.contains('open')).to.be.true();
            expect(menuButtonWrapper.querySelector('button.dropdown-toggle').getAttribute('aria-expanded')).to.equal('true');

            var dropDownMenu = document.querySelector(DROP_DOWN_MENU);

            expect(getComputedStyle(dropDownMenu).display).to.equal('block');
        });
        it('should display the menu items', function() {
            var menuButtonItems = this.element.querySelectorAll(MENU_BUTTON_ITEMS);
            expect(menuButtonItems).to.have.length(2);
            expect(menuButtonItems[0].textContent).to.match(/Action/);
        });
    });
    context('when clicking a menu item', function() {
        beforeEach(function() {
            clickOnMenuButton(this);
            var menuButtonItems = this.element.querySelectorAll(MENU_BUTTON_ITEMS);
            var firstItemInDropDown = menuButtonItems[0].firstChild
            utilities.click(firstItemInDropDown);
            this.scope.$digest();
        });
        it('should trigger the menu item action', function() {
            expect(this.scope.process).to.have.been.called;
        });
        it('should hide the menu', function() {
            var menuButtonWrapper = this.element.querySelector(MENU_BUTTON_WRAPPER);
            var menuButton = this.element.querySelector(MENU_BUTTON_BUTTON)
            var dropDownMenu = this.element.querySelector(DROP_DOWN_MENU);

            expect(menuButtonWrapper.classList.contains('open')).to.be.false();
            expect(menuButton.getAttribute('aria-expanded')).to.equal('false');
            expect(getComputedStyle(dropDownMenu).display).to.equal('none');
        });
    });
    context('when re-clicking the menu button', function(){
        beforeEach(function() {
            clickOnMenuButton(this);
        });
        it('clicking menu button should hide dropdown', function() {
            var menuButtonWrapper = this.element.querySelector(MENU_BUTTON_WRAPPER);
            expect(menuButtonWrapper.classList.contains('open')).to.be.true();
            clickOnMenuButton(this);
            var menuButton = this.element.querySelector(MENU_BUTTON_BUTTON)
            var dropDownMenu = this.element.querySelector(DROP_DOWN_MENU);

            expect(menuButtonWrapper.classList.contains('open')).to.be.false();
            expect(menuButton.getAttribute('aria-expanded')).to.equal('false');
            expect(getComputedStyle(dropDownMenu).display).to.equal('none');
        });
    });
    context('when clicking away from open dropdown', function(){
        it('click -button- shoud hide dropdown',function(){
            var menuButtonWrapper = this.element.querySelector(MENU_BUTTON_WRAPPER);
            utilities.clickAwayCreationAndClick('button', this);
            var menuButton = this.element.querySelector(MENU_BUTTON_BUTTON)
            var dropDownMenu = this.element.querySelector(DROP_DOWN_MENU);

            expect(menuButtonWrapper.classList.contains('open')).to.be.false();
            expect(menuButton.getAttribute('aria-expanded')).to.equal('false');
            expect(getComputedStyle(dropDownMenu).display).to.equal('none');
        });
        it('click -div- shoud hide dropdown',function(){
            var menuButtonWrapper = this.element.querySelector(MENU_BUTTON_WRAPPER);
            utilities.clickAwayCreationAndClick('div', this);
            var menuButton = this.element.querySelector(MENU_BUTTON_BUTTON)
            var dropDownMenu = this.element.querySelector(DROP_DOWN_MENU);

            expect(menuButtonWrapper.classList.contains('open')).to.be.false();
            expect(menuButton.getAttribute('aria-expanded')).to.equal('false');
            expect(getComputedStyle(dropDownMenu).display).to.equal('none');
        });
    });
    /*context('when pressing escape', function(){
        beforeEach(function() {
            clickOnMenuButton(this);
        });
        it('should hide dropdown',function(){
            var evt = document.createEvent("KeyboardEvent");
            evt.initEvent("keydown", true, true);
            evt.view = window;
            evt.altKey = false;
            evt.ctrlKey = false;
            evt.shiftKey = false;
            evt.metaKey = false;
            evt.keyCode = 27;
            evt.charCode = 0;
            document.dispatchEvent(evt);

            testUnopenedConditions(document.querySelector('.akam-menu-button'));
        });
    });*/
});
