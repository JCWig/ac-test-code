'use strict';
var utilities = require('../utilities');

var PANEL_HEADER = 'h3.panel-title';
var PANEL_HEADER_ICON = 'h3.panel-title i.toggle-icon';
var PANEL_CONTENT_WRAPPER = 'div.panel-collapse';
var ALL_PANEL_CONTENT = 'div.panel-body div.content-wrapper div.ng-scope';

describe.only('akam-content-panel', function() {
    var compile = null;
    var scope = null;
    var self = this;
    var q = null;
    var timeout = null;
    beforeEach(function() {
        self = this;
        angular.mock.module(require('../../src/content-panel').name);
        inject(function($compile, $rootScope, $q, $timeout) {
            compile = $compile;
            scope = $rootScope.$new();
            q = $q;
            timeout = $timeout;
        });
    });
    afterEach(function() {
        if(self.element){
            document.body.removeChild(self.element);
            self.element = null;
        }
    });
    function addElement(markup) {
        self.el = compile(markup)(scope);
        scope.$digest();
        self.element = document.body.appendChild(self.el[0]);
    };
    context('when rendering', function(){
        it('should render all parts', function(){
            scope.isCollapsed1 = false;
            var markup = '<akam-content-panel is-collapsed="isCollapsed1" on-toggle="process()" header="Header 1">'+
                        '<div>Gandalf the Grey</div><div>Gandalf the White</div>'+
                        '</akam-content-panel>'
            addElement(markup);

            var headerDiv = document.querySelector(PANEL_HEADER);
            var content = document.querySelectorAll(ALL_PANEL_CONTENT);
            var headerIcon = document.querySelector(PANEL_HEADER_ICON);

            expect(headerDiv.textContent).to.match(/Header 1/);
            expect(headerIcon).to.not.be.null;
            expect(headerIcon.classList.contains('luna-collapse')).to.be.true;
            expect(headerIcon.classList.contains('luna-expand')).to.be.false;
            expect(content.length).to.equal(2);
            expect(content[0].textContent).to.match(/Gandalf the Grey/);
            expect(content[1].textContent).to.match(/Gandalf the White/);
        });
        it('should be able to render collpased', function(){
            scope.isCollapsed1 = true;
            var markup = '<akam-content-panel is-collapsed="isCollapsed1" on-toggle="process()" header="Header 1">'+
                        '<div>Gandalf the Grey</div><div>Gandalf the White</div>'+
                        '</akam-content-panel>'
            addElement(markup);

            var headerDiv = document.querySelector(PANEL_HEADER);
            var content = document.querySelectorAll(ALL_PANEL_CONTENT);
            var headerIcon = document.querySelector(PANEL_HEADER_ICON);

            expect(headerDiv.textContent).to.match(/Header 1/);
            expect(headerIcon).to.not.be.null;
            expect(headerIcon.classList.contains('luna-expand')).to.be.true;
            expect(headerIcon.classList.contains('luna-collapse')).to.be.false;
            expect(content.length).to.equal(2);
            expect(content[0].textContent).to.match(/Gandalf the Grey/);
            expect(content[1].textContent).to.match(/Gandalf the White/);
        });
    });
    context('when rendered', function(){
        it('should be able to toggle visibility of content', function(){
            scope.isCollapsed1 = false;
            var markup = '<akam-content-panel is-collapsed="isCollapsed1" on-toggle="process()" header="Header 1">'+
                        '<div>Gandalf the Grey</div><div>Gandalf the White</div>'+
                        '</akam-content-panel>'
            addElement(markup);

            var headerDiv = document.querySelector(PANEL_HEADER);
            var headerContent = document.querySelectorAll(ALL_PANEL_CONTENT);
            var contentWrapper = document.querySelector(PANEL_CONTENT_WRAPPER);
            var headerIcon = document.querySelector(PANEL_HEADER_ICON);

            utilities.click(headerIcon);
            scope.$digest();
            timeout.flush();

            expect(contentWrapper.classList.contains('in')).to.be.false;
            expect(headerIcon.classList.contains('luna-expand')).to.be.true;
            expect(headerIcon.classList.contains('luna-collapse')).to.be.false;
            expect(contentWrapper.getAttribute('style')).to.contain('height: 0px');
            
            utilities.click(headerDiv);
            scope.$digest();
            timeout.flush();

            expect(contentWrapper.classList.contains('collapsing')).to.be.true;
            expect(contentWrapper.getAttribute('style')).to.not.contain('height: 0px');
            expect(headerIcon.classList.contains('luna-expand')).to.be.false;
            expect(headerIcon.classList.contains('luna-collapse')).to.be.true;
        });
    });
});