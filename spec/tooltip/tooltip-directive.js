'use strict';
var utilities = require('../utilities');

var TOOLTIP = '.tooltip';
var TOOLTIP_HEADER = '.tooltip .tooltip-contents .tooltip-header';
var TOOLTIP_CONTENT = '.tooltip .tooltip-contents .tooltip-middle-content';
var TOOLTIP_LINK = '.tooltip .tooltip-contents .tooltip-link-content a';
var TOOLTIP_BUTTON = '.tooltip .tooltip-contents .tooltip-button-content button';
var TOOLTIP_CLOSE_ICON = '.tooltip .tooltip-contents .luna-close';

describe('akamai.components.tooltip', function() {
    var scope, timeout, compile, sce;
    beforeEach(function() {
        var self = this;
        angular.mock.module(require('../../src/tool-tip').name);
        inject(function($compile, $rootScope, $timeout, $sce) {
            scope = $rootScope.$new();
            timeout = $timeout;
            compile = $compile;
            sce = $sce;
        });
    });
    afterEach(function() {
        if(self.element){
            document.body.removeChild(self.element);
            self.element = null;
        }
    });
    function addElement(markup) {
        self.element = document.createElement('div');
        self.element.innerHTML = markup;
        document.body.appendChild(self.element);
        compile(document.body)(scope);
        scope.$digest();
    };
    describe('when rendering', function(){
        it('should render all parts', function(){
            var markup = '<span class="pull-right" akam-tooltip position="bottom"'+
                'header="Simple Header" tooltip-content="tool tip content"'+
                'trigger="click" link-text="link text" link-url="www.example.com" '+
                'button-text="button text" button-function="btnFunction">'+
                'Clicky for Bottom Right Side</span>';
            addElement(markup);
            timeout.flush();
            var tooltipHeader = document.querySelector(TOOLTIP_HEADER);
            var tooltipContent = document.querySelector(TOOLTIP_CONTENT);
            var tooltipLink = document.querySelector(TOOLTIP_LINK);
            var tooltipButton = document.querySelector(TOOLTIP_BUTTON);
            var tooltipCloseIcon = document.querySelector(TOOLTIP_CLOSE_ICON);


            expect(tooltipHeader.textContent).toContain('Simple Header');
            expect(tooltipContent.textContent).toContain('tool tip content');
            expect(tooltipLink.textContent).toContain('link text');
            expect(tooltipButton.textContent).toContain('button text');
            expect(tooltipCloseIcon).not.toBe(null);
        });
        it('should be able to render without header', function(){
           var markup = '<span class="pull-right" akam-tooltip position="bottom"'+
                'tooltip-content="tool tip content" trigger="click" link-text="link text"'+
                'link-url="www.example.com" button-text="button text" '+
                'button-function="btnFunction">Clicky for Bottom Right Side</span>';
            addElement(markup);
            timeout.flush();
            var tooltipHeader = document.querySelector(TOOLTIP_HEADER);
            var tooltipContent = document.querySelector(TOOLTIP_CONTENT);
            var tooltipLink = document.querySelector(TOOLTIP_LINK);
            var tooltipButton = document.querySelector(TOOLTIP_BUTTON);
            var tooltipCloseIcon = document.querySelector(TOOLTIP_CLOSE_ICON);

            expect(tooltipHeader).toBe(null);
            expect(tooltipContent.textContent).toContain('tool tip content');
            expect(tooltipLink.textContent).toContain('link text');
            expect(tooltipButton.textContent).toContain('button text');
            expect(tooltipCloseIcon).not.toBe(null); 
        });
        it('should be able to be rendered without link', function(){
            var markup = '<span class="pull-right" akam-tooltip position="bottom"'+
                ' header="Simple Header" tooltip-content="tool tip content" '+
                'trigger="click" button-text="button text" button-function="btnFunction">'+
                'Clicky for Bottom Right Side</span>';
            addElement(markup);
            timeout.flush();
            var tooltipHeader = document.querySelector(TOOLTIP_HEADER);
            var tooltipContent = document.querySelector(TOOLTIP_CONTENT);
            var tooltipLink = document.querySelector(TOOLTIP_LINK);
            var tooltipButton = document.querySelector(TOOLTIP_BUTTON);
            var tooltipCloseIcon = document.querySelector(TOOLTIP_CLOSE_ICON);

            expect(tooltipHeader.textContent).toContain('Simple Header');
            expect(tooltipContent.textContent).toContain('tool tip content');
            expect(tooltipLink).toBe(null);
            expect(tooltipButton.textContent).toContain('button text');
            expect(tooltipCloseIcon).not.toBe(null);
        });
        it('should be able to be rendered without button', function(){
            var markup = '<span class="pull-right" akam-tooltip position="bottom"'+
                'header="Simple Header" tooltip-content="tool tip content" trigger="click"'+
                'link-text="link text"link-url="www.example.com">Clicky for Bottom Right Side</span>';
            addElement(markup);
            timeout.flush();
            var tooltipHeader = document.querySelector(TOOLTIP_HEADER);
            var tooltipContent = document.querySelector(TOOLTIP_CONTENT);
            var tooltipLink = document.querySelector(TOOLTIP_LINK);
            var tooltipButton = document.querySelector(TOOLTIP_BUTTON);
            var tooltipCloseIcon = document.querySelector(TOOLTIP_CLOSE_ICON);

            expect(tooltipHeader.textContent).toContain('Simple Header');
            expect(tooltipContent.textContent).toContain('tool tip content');
            expect(tooltipLink.textContent).toContain('link text');
            expect(tooltipButton).toBe(null);
            expect(tooltipCloseIcon).not.toBe(null);
        });
        it('should render without close icon, link or button when trigger = hover', function(){
            var markup = '<span class="pull-right" akam-tooltip position="bottom"'+
                ' header="Simple Header" tooltip-content="tool tip content" '+
                'trigger="hover" link-text="link text" link-url="www.example.com" '+
                'button-text="button text" button-function="btnFunction">'+
                'Clicky for Bottom Right Side</span>';
            addElement(markup);
            timeout.flush();
            var tooltipHeader = document.querySelector(TOOLTIP_HEADER);
            var tooltipContent = document.querySelector(TOOLTIP_CONTENT);
            var tooltipLink = document.querySelector(TOOLTIP_LINK);
            var tooltipButton = document.querySelector(TOOLTIP_BUTTON);
            var tooltipCloseIcon = document.querySelector(TOOLTIP_CLOSE_ICON);

            expect(tooltipHeader.textContent).toContain('Simple Header');
            expect(tooltipContent.textContent).toContain('tool tip content');
            expect(tooltipLink).toBe(null);
            expect(tooltipButton).toBe(null);
            expect(tooltipCloseIcon).toBe(null);
        }); 
        it('should be able to render custom html', function(){
            var markup = '<span class="pull-right" akam-tooltip position="bottom" trigger="click"'+
                    'custom-content="customContent">Clicky for Bottom Right Side</span>';
            scope.customContent = sce.trustAsHtml('<div><span id="random-span1">Here is a little bit of text</span>'+
                '<button id="random-button1">Click this to do something</button><br>'+
                '<button id="random-button2" ng-click="btnFunction()">Click this to do something else </button>');
            addElement(markup);
            timeout.flush();
            expect(document.querySelector('#random-span1')).not.toBe(null);
            expect(document.querySelector('#random-button1')).not.toBe(null);
            expect(document.querySelector('#random-button2')).not.toBe(null);
        });  
        it('should be able to render on the top', function(){
            var markup = '<span class="pull-right" akam-tooltip position="top" '+
                'header="Simple Header" tooltip-content="tool tip content" '+
                'trigger="click">Clicky for Bottom Right Side</span>';
            addElement(markup);
            timeout.flush();
            
            var tooltip = document.querySelector(TOOLTIP);

            expect(tooltip.classList).toContain('top');
        }); 
        it('should be able to render on the left', function(){
            var markup = '<span class="pull-right" akam-tooltip position="left" '+
                'header="Simple Header" tooltip-content="tool tip content" '+
                'trigger="click">Clicky for Bottom Right Side</span>';
            addElement(markup);
            timeout.flush();

            var tooltip = document.querySelector(TOOLTIP);

            expect(tooltip.classList).toContain('left');
        }); 
        it('should be able to render on the right ', function(){
            var markup = '<span class="pull-right" akam-tooltip position="right" '+
                'header="Simple Header" tooltip-content="tool tip content" '+
                'trigger="click">Clicky for Bottom Right Side</span>';
            addElement(markup);
            timeout.flush();
            
            var tooltip = document.querySelector(TOOLTIP);

            expect(tooltip.classList).toContain('right');
        });
        it('should be able to render on the bottom', function(){
            var markup = '<span class="pull-right" akam-tooltip position="bottom" '+
                'header="Simple Header" tooltip-content="tool tip content" '+
                'trigger="click">Clicky for Bottom Right Side</span>';
            addElement(markup);
            timeout.flush();
            
            var tooltip = document.querySelector(TOOLTIP);

            expect(tooltip.classList).toContain('bottom');
        }); 
    });
    describe('when rendered', function(){
        it('should be able to click button', function(){
            var markup = '<span class="pull-right" akam-tooltip position="bottom"'+
                'tooltip-content="tool tip content" trigger="click"'+
                'button-text="button text" button-function="btnFunction">Clicky for Bottom Right Side</span>';
            scope.btnFunction = jasmine.createSpy('spy');
            addElement(markup);
            timeout.flush();
                
            utilities.click(TOOLTIP_BUTTON);
            scope.$digest();

            expect(scope.btnFunction).toHaveBeenCalled();
        });
        it('should be able to toggle in and out (click)', function(){
            var markup = '<span id="trigger-element" class="pull-right" akam-tooltip position="bottom"'+
                'tooltip-content="tool tip content" trigger="click"'+
                'button-text="button text" button-function="btnFunction">Clicky for Bottom Right Side</span>';
            addElement(markup);
            timeout.flush();
                
            utilities.click('#trigger-element');
            scope.$digest();
            timeout.flush();
            
            var tooltip = document.querySelector(TOOLTIP);

            expect(tooltip.classList).toContain("in");

            utilities.click('#trigger-element');
            scope.$digest();
            timeout.flush();

            expect(tooltip.classList).not.toContain("in");
        });
        it('should be able to toggle in and out (click icon)', function(){
            var markup = '<span id="trigger-element" class="pull-right" akam-tooltip position="bottom"'+
                'tooltip-content="tool tip content" trigger="click"'+
                'button-text="button text" button-function="btnFunction">Clicky for Bottom Right Side</span>';
            addElement(markup);
            timeout.flush();
                
            utilities.click('#trigger-element');
            scope.$digest();
            timeout.flush();
            
            var tooltip = document.querySelector(TOOLTIP);

            expect(tooltip.classList).toContain("in");

            utilities.click(TOOLTIP_CLOSE_ICON);
            scope.$digest();
            timeout.flush();

            expect(tooltip.classList).not.toContain("in");
        });
        it('should be able to toggle (hover)', function(){
            var markup = '<span id="trigger-element" class="pull-right" akam-tooltip position="bottom"'+
                'tooltip-content="tool tip content" trigger="hover"'+
                'button-text="button text" button-function="btnFunction">Clicky for Bottom Right Side'+
                '</span><button id="butttton"></button>';
            addElement(markup);
            timeout.flush();
                
            utilities.mouseHover('#trigger-element');
            timeout.flush();
            
            var tooltip = document.querySelector(TOOLTIP);

            expect(tooltip.classList).toContain("in");

            utilities.mouseLeave('#trigger-element');
            timeout.flush();

            expect(tooltip.classList).not.toContain("in");

        });
    });
    describe('when rendering on left side of page', function(){
        it('should render bottom arrow and tooltip in different format', function(){
            var midPoint = document.body.clientWidth / 2;
            var markup = '<span style="margin-right: '+(midPoint+5)+'px" id="trigger-element" class="pull-right" akam-tooltip position="bottom"'+
                'tooltip-content="tool tip content" trigger="hover"'+
                'button-text="button text" button-function="btnFunction">Clicky for Bottom Right Side'+
                '</span><button id="butttton"></button>';
            addElement(markup);
            timeout.flush();

            var offsetLeft = scope.$$childHead.toolTipLeft.substring(0, scope.$$childHead.toolTipLeft.length-2); 
            expect(parseInt(offsetLeft) < midPoint).toBe(true);

        });
        it('should render top arrow and tooltip in different format', function(){
            var midPoint = document.body.clientWidth / 2;
            var markup = '<span style="margin-right: '+(midPoint+5)+'px" id="trigger-element" class="pull-right" akam-tooltip position="top"'+
                'tooltip-content="tool tip content" trigger="hover"'+
                'button-text="button text" button-function="btnFunction">Clicky for Bottom Right Side'+
                '</span><button id="butttton"></button>';
            addElement(markup);
            timeout.flush();
            
            var offsetLeft = scope.$$childHead.toolTipLeft.substring(0, scope.$$childHead.toolTipLeft.length-2); 
            expect(parseInt(offsetLeft) < midPoint).toBe(true);
        });
    });
    describe('when passing bad data', function(){
        it('should not render when position is invalid', function(){
            var midPoint = document.body.clientWidth / 2;
            var markup = '<span id="trigger-element" class="pull-right" akam-tooltip position="nothing"'+
                'tooltip-content="tool tip content" trigger="hover"'+
                'button-text="button text" button-function="btnFunction">Clicky for Bottom Right Side'+
                '</span><button id="butttton"></button>';
            addElement(markup);

            var tooltip = document.querySelector(TOOLTIP);
            expect(tooltip).toBe(null);
        });
        it('should not render when position is not provided', function(){
            var midPoint = document.body.clientWidth / 2;
            var markup = '<span id="trigger-element" class="pull-right" akam-tooltip'+
                'tooltip-content="tool tip content" trigger="hover"'+
                'button-text="button text" button-function="btnFunction">Clicky for Bottom Right Side'+
                '</span><button id="butttton"></button>';
            addElement(markup);

            var tooltip = document.querySelector(TOOLTIP);
            expect(tooltip).toBe(null);
        });
    });
    describe('when passing bad data', function(){
        it('should not render when position is invalid', function(){
            var midPoint = document.body.clientWidth / 2;
            var markup = '<span id="trigger-element" class="pull-right" akam-tooltip position="nothing"'+
                'tooltip-content="tool tip content" trigger="hover"'+
                'button-text="button text" button-function="btnFunction">Clicky for Bottom Right Side'+
                '</span><button id="butttton"></button>';
            addElement(markup);

            var tooltip = document.querySelector(TOOLTIP);
            expect(tooltip).toBe(null);
        });
        it('should not render when position is not provided', function(){
            var midPoint = document.body.clientWidth / 2;
            var markup = '<span id="trigger-element" class="pull-right" akam-tooltip'+
                'tooltip-content="tool tip content" trigger="hover"'+
                'button-text="button text" button-function="btnFunction">Clicky for Bottom Right Side'+
                '</span><button id="butttton"></button>';
            addElement(markup);

            var tooltip = document.querySelector(TOOLTIP);
            expect(tooltip).toBe(null);
        });
    });
});
