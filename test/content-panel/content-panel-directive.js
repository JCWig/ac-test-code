'use strict';
var utilities = require('../utilities');

var PANEL_HEADER = 'h3.panel-title';
var PANEL_HEADER_ICON = 'h3.panel-title i.toggle-icon';
var PANEL_CONTENT_WRAPPER = 'div.panel-collapse';
var ALL_PANEL_CONTENT = 'div.panel-body div.content-wrapper div.ng-scope';

describe('akam-content-panel', function() {
    var compile = null;
    var scope = null;
    var self = this;
    var timeout = null;
    beforeEach(function() {
        self = this;
        angular.mock.module(require('../../src/content-panel').name);
        inject(function($compile, $rootScope,$timeout) {
            compile = $compile;
            scope = $rootScope.$new();
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
            scope.isCollapsed = false;
            var markup = '<akam-content-panel is-collapsed="isCollapsed" on-toggle="process()" header="Header 1">'+
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
            scope.isCollapsed = true;
            var markup = '<akam-content-panel is-collapsed="isCollapsed" on-toggle="process()" header="Header 1">'+
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
        it('should be able to render without a header', function(){
            scope.isCollapsed = true;
            var markup = '<akam-content-panel is-collapsed="isCollapsed" on-toggle="process()">'+
                        '<div>Gandalf the Grey</div><div>Gandalf the White</div>'+
                        '</akam-content-panel>'
            addElement(markup);

            var headerDiv = document.querySelector(PANEL_HEADER);
            var content = document.querySelectorAll(ALL_PANEL_CONTENT);
            var headerIcon = document.querySelector(PANEL_HEADER_ICON);

            expect(headerDiv.textContent).to.match(/ /);
            expect(headerIcon).to.not.be.null;
            expect(content.length).to.equal(2);
            expect(content[0].textContent).to.match(/Gandalf the Grey/);
            expect(content[1].textContent).to.match(/Gandalf the White/);
        });
        it('should be able to render without content', function(){
            scope.isCollapsed = true;
            var markup = '<akam-content-panel is-collapsed="isCollapsed" on-toggle="process()" header="Header 1">'+
                        '</akam-content-panel>'
            addElement(markup);

            var headerDiv = document.querySelector(PANEL_HEADER);
            var content = document.querySelectorAll(ALL_PANEL_CONTENT);
            var headerIcon = document.querySelector(PANEL_HEADER_ICON);

            expect(headerDiv.textContent).to.match(/Header 1/);
            expect(headerIcon).to.not.be.null;
            expect(content.length).to.equal(0);
        });
        it('should be able to render without content or header', function(){
            scope.isCollapsed = true;
            var markup = '<akam-content-panel is-collapsed="isCollapsed" on-toggle="process()">'+
                        '</akam-content-panel>'
            addElement(markup);

            var headerDiv = document.querySelector(PANEL_HEADER);
            var content = document.querySelectorAll(ALL_PANEL_CONTENT);
            var headerIcon = document.querySelector(PANEL_HEADER_ICON);

            expect(headerDiv.textContent).to.match(/ /);
            expect(headerIcon).to.not.be.null;
            expect(content.length).to.equal(0);
        });
        it('should be able to render multiple content panels', function(){
            scope.panels = [
                {header : 'Header 1',collapsed: false},
                {header : 'Header 2',collapsed: true},
                {header : 'Header 3',collapsed: false}
            ];
            var markup = '<div class ="panel-group"><akam-content-panel ng-repeat="panel in panels" header="{{panel.header}}" is-collapsed="panel.collapsed">'+
                        '<div>Gandalf the Grey</div><div>Gandalf the White</div>'+
                        '</akam-content-panel></div>'
            addElement(markup);

            var headerDivs = document.querySelectorAll(PANEL_HEADER);
            var contents = document.querySelectorAll(ALL_PANEL_CONTENT);
            var contentWrappers = document.querySelectorAll(PANEL_CONTENT_WRAPPER);
            var headerIcons = document.querySelectorAll(PANEL_HEADER_ICON);

            var headerIcon1 = headerIcons[0];
            var headerIcon2 = headerIcons[1];
            var headerIcon3 = headerIcons[2];

            var header1 = headerDivs[0].textContent;
            var header2 = headerDivs[1].textContent;
            var header3 = headerDivs[2].textContent;


            expect(headerDivs.length).to.equal(3);
            expect(contents.length).to.equal(6);//2 divs in each content-panel
            expect(contentWrappers.length).to.equal(3);
            expect(headerIcons.length).to.equal(3);

            expect(headerIcon1.classList.contains('luna-expand')).to.be.false;
            expect(headerIcon2.classList.contains('luna-expand')).to.be.true;
            expect(headerIcon3.classList.contains('luna-expand')).to.be.false;

            expect(header1).to.match(/Header 1/);
            expect(header2).to.match(/Header 2/);
            expect(header3).to.match(/Header 3/);
        });
    });
    context('when rendered', function(){
        it('should be able to toggle visibility of content', function(){
            scope.isCollapsed = false;
            var markup = '<akam-content-panel is-collapsed="isCollapsed" on-toggle="process()" header="Header 1">'+
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

            expect(headerIcon.classList.contains('luna-expand')).to.be.true;
            expect(headerIcon.classList.contains('luna-collapse')).to.be.false;
            expect(contentWrapper.getAttribute('style')).to.contain('height: 0px');
            
            utilities.click(headerDiv);
            scope.$digest();
            timeout.flush();

            expect(contentWrapper.getAttribute('style')).to.not.contain('height: 0px');
            expect(headerIcon.classList.contains('luna-expand')).to.be.false;
            expect(headerIcon.classList.contains('luna-collapse')).to.be.true;
        });
    });
});