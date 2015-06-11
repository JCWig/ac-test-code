'use strict';
var utilities = require('../utilities');

var POPOVER = '.popover';
var POPOVER_HEADER = '.popover .popover-contents .popover-header';
var POPOVER_CONTENT = '.popover .popover-contents .popover-middle-content';
var POPOVER_LINK = '.popover .popover-contents .popover-link-content a';
var POPOVER_BUTTON = '.popover .popover-contents .popover-button-content button';
var POPOVER_CLOSE_ICON = '.popover .popover-contents .luna-small_close';

describe('akamai.components.popover', function() {
  var scope, timeout, compile, sce;
  beforeEach(function() {
    inject.strictDi(true);
    var self = this;
    angular.mock.module(require('../../src/popover').name);
    inject(function($compile, $rootScope, $timeout, $sce) {
      scope = $rootScope.$new();
      timeout = $timeout;
      compile = $compile;
      sce = $sce;
    });
  });
  afterEach(function() {
    if (self.element) {
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
  describe('when rendering', function() {
    it('should render all parts', function() {
      var markup = '<span class="pull-right" akam-popover position="bottom"' +
        'header="Simple Header" popover-content="tool tip content"' +
        'trigger="click" link-text="link text" link-url="www.example.com" ' +
        'button-text="button text" button-function="btnFunction">' +
        'Clicky for Bottom Right Side</span>';
      addElement(markup);
      timeout.flush();
      var popoverHeader = document.querySelector(POPOVER_HEADER);
      var popoverContent = document.querySelector(POPOVER_CONTENT);
      var popoverLink = document.querySelector(POPOVER_LINK);
      var popoverButton = document.querySelector(POPOVER_BUTTON);
      var popoverCloseIcon = document.querySelector(POPOVER_CLOSE_ICON);

      expect(popoverHeader.textContent).toContain('Simple Header');
      expect(popoverContent.textContent).toContain('tool tip content');
      expect(popoverLink.textContent).toContain('link text');
      expect(popoverButton.textContent).toContain('button text');
      expect(popoverCloseIcon).not.toBe(null);
    });
    it('should be able to render without header', function() {
      var markup = '<span class="pull-right" akam-popover position="bottom"' +
        'popover-content="tool tip content" trigger="click" link-text="link text"' +
        'link-url="www.example.com" button-text="button text" ' +
        'button-function="btnFunction">Clicky for Bottom Right Side</span>';
      addElement(markup);
      timeout.flush();
      var popoverHeader = document.querySelector(POPOVER_HEADER);
      var popoverContent = document.querySelector(POPOVER_CONTENT);
      var popoverLink = document.querySelector(POPOVER_LINK);
      var popoverButton = document.querySelector(POPOVER_BUTTON);
      var popoverCloseIcon = document.querySelector(POPOVER_CLOSE_ICON);

      expect(popoverHeader).toBe(null);
      expect(popoverContent.textContent).toContain('tool tip content');
      expect(popoverLink.textContent).toContain('link text');
      expect(popoverButton.textContent).toContain('button text');
      expect(popoverCloseIcon).not.toBe(null);
    });
    it('should be able to be rendered without link', function() {
      var markup = '<span class="pull-right" akam-popover position="bottom"' +
        ' header="Simple Header" popover-content="tool tip content" ' +
        'trigger="click" button-text="button text" button-function="btnFunction">' +
        'Clicky for Bottom Right Side</span>';
      addElement(markup);
      timeout.flush();
      var popoverHeader = document.querySelector(POPOVER_HEADER);
      var popoverContent = document.querySelector(POPOVER_CONTENT);
      var popoverLink = document.querySelector(POPOVER_LINK);
      var popoverButton = document.querySelector(POPOVER_BUTTON);
      var popoverCloseIcon = document.querySelector(POPOVER_CLOSE_ICON);

      expect(popoverHeader.textContent).toContain('Simple Header');
      expect(popoverContent.textContent).toContain('tool tip content');
      expect(popoverLink).toBe(null);
      expect(popoverButton.textContent).toContain('button text');
      expect(popoverCloseIcon).not.toBe(null);
    });
    it('should be able to be rendered without button', function() {
      var markup = '<span class="pull-right" akam-popover position="bottom"' +
        'header="Simple Header" popover-content="tool tip content" trigger="click"' +
        'link-text="link text"link-url="www.example.com">Clicky for Bottom Right Side</span>';
      addElement(markup);
      timeout.flush();
      var popoverHeader = document.querySelector(POPOVER_HEADER);
      var popoverContent = document.querySelector(POPOVER_CONTENT);
      var popoverLink = document.querySelector(POPOVER_LINK);
      var popoverButton = document.querySelector(POPOVER_BUTTON);
      var popoverCloseIcon = document.querySelector(POPOVER_CLOSE_ICON);

      expect(popoverHeader.textContent).toContain('Simple Header');
      expect(popoverContent.textContent).toContain('tool tip content');
      expect(popoverLink.textContent).toContain('link text');
      expect(popoverButton).toBe(null);
      expect(popoverCloseIcon).not.toBe(null);
    });
    it('should render without close icon, link or button when trigger = hover', function() {
      var markup = '<span class="pull-right" akam-popover position="bottom"' +
        ' header="Simple Header" popover-content="tool tip content" ' +
        'trigger="hover" link-text="link text" link-url="www.example.com" ' +
        'button-text="button text" button-function="btnFunction">' +
        'Clicky for Bottom Right Side</span>';
      addElement(markup);
      timeout.flush();
      var popoverHeader = document.querySelector(POPOVER_HEADER);
      var popoverContent = document.querySelector(POPOVER_CONTENT);
      var popoverLink = document.querySelector(POPOVER_LINK);
      var popoverButton = document.querySelector(POPOVER_BUTTON);
      var popoverCloseIcon = document.querySelector(POPOVER_CLOSE_ICON);

      expect(popoverHeader.textContent).toContain('Simple Header');
      expect(popoverContent.textContent).toContain('tool tip content');
      expect(popoverLink).toBe(null);
      expect(popoverButton).toBe(null);
      expect(popoverCloseIcon).toBe(null);
    });
    it('should be able to render custom html', function() {
      scope.customData = {
        text : 'Here is some text',
        btnFunction: function(){}
      };
      spyOn(scope.customData,"btnFunction");
      var markup = '<span class="pull-right" akam-popover position="bottom" trigger="click"' +
        'custom-content="templateId.html">Clicky for Bottom Right Side</span>'+
        '<script type="text/ng-template" id="templateId.html">'+
          '<div><span id="random-span1">{{customData.text}}</span>' +
          '<button id="random-button1">Click this to do something</button><br>' +
          '<button id="random-button2" ng-click="customData.btnFunction()">Click this to do something else </button></div>';
        '</script>';
      addElement(markup);
      scope.$digest();
      timeout.flush();

      utilities.click(document.querySelector('#random-button2'));
      expect(scope.customData.btnFunction).toHaveBeenCalled();
      expect(document.querySelector('#random-span1')).not.toBe(null);
      expect(document.querySelector('#random-button1')).not.toBe(null);
      expect(document.querySelector('#random-button2')).not.toBe(null);
      expect(document.querySelector('#random-span1').textContent).toContain(scope.customData.text);
    });
    it('should be able to render on the top', function() {
      var markup = '<span class="pull-right" akam-popover position="top" ' +
        'header="Simple Header" popover-content="tool tip content" ' +
        'trigger="click">Clicky for Bottom Right Side</span>';
      addElement(markup);
      timeout.flush();

      var popover = document.querySelector(POPOVER);

      expect(popover.classList).toContain('top');
    });
    it('should be able to render on the left', function() {
      var markup = '<span class="pull-right" akam-popover position="left" ' +
        'header="Simple Header" popover-content="tool tip content" ' +
        'trigger="click">Clicky for Bottom Right Side</span>';
      addElement(markup);
      timeout.flush();

      var popover = document.querySelector(POPOVER);

      expect(popover.classList).toContain('left');
    });
    it('should be able to render on the right ', function() {
      var markup = '<span class="pull-right" akam-popover position="right" ' +
        'header="Simple Header" popover-content="tool tip content" ' +
        'trigger="click">Clicky for Bottom Right Side</span>';
      addElement(markup);
      timeout.flush();

      var popover = document.querySelector(POPOVER);

      expect(popover.classList).toContain('right');
    });
    it('should be able to render on the bottom', function() {
      var markup = '<span class="pull-right" akam-popover position="bottom" ' +
        'header="Simple Header" popover-content="tool tip content" ' +
        'trigger="click">Clicky for Bottom Right Side</span>';
      addElement(markup);
      timeout.flush();

      var popover = document.querySelector(POPOVER);

      expect(popover.classList).toContain('bottom');
    });
  });
  describe('when rendered', function() {
    it('should be able to click button', function() {
      scope.btnFunction = function(){};
      spyOn(scope,'btnFunction');
      var markup = '<span class="pull-right" akam-popover position="bottom"' +
        'popover-content="tool tip content" trigger="click"' +
        'button-text="button text" button-function="btnFunction()">Clicky for Bottom Right Side</span>';
      addElement(markup);
      timeout.flush();

      utilities.click(POPOVER_BUTTON);
      scope.$digest();

      expect(scope.btnFunction).toHaveBeenCalled();
    });
    it('should be able to toggle in and out (click)', function() {
      var markup = '<span id="trigger-element" class="pull-right" akam-popover position="bottom"' +
        'popover-content="tool tip content" trigger="click"' +
        'button-text="button text" button-function="btnFunction">Clicky for Bottom Right Side</span>';
      addElement(markup);
      timeout.flush();

      utilities.click('#trigger-element');
      scope.$digest();
      timeout.flush();

      var popover = document.querySelector(POPOVER);

      expect(popover.classList).toContain("fade");

      utilities.click('#trigger-element');
      scope.$digest();
      timeout.flush();

      expect(popover.classList).not.toContain("fade");
    });
    it('should be able to toggle in and out (click icon)', function() {
      var markup = '<span id="trigger-element" class="pull-right" akam-popover position="bottom"' +
        'popover-content="tool tip content" trigger="click"' +
        'button-text="button text" button-function="btnFunction">Clicky for Bottom Right Side</span>';
      addElement(markup);
      timeout.flush();

      utilities.click('#trigger-element');
      scope.$digest();
      timeout.flush();

      var popover = document.querySelector(POPOVER);

      expect(popover.classList).toContain("fade");

      utilities.click(POPOVER_CLOSE_ICON);
      scope.$digest();
      timeout.flush();

      expect(popover.classList).not.toContain("fade");
    });
    it('should be able to toggle (hover)', function() {
      var markup = '<span id="trigger-element" class="pull-right" akam-popover position="bottom"' +
        'popover-content="tool tip content" trigger="hover"' +
        'button-text="button text" button-function="btnFunction">Clicky for Bottom Right Side' +
        '</span><button id="butttton"></button>';
      addElement(markup);
      timeout.flush();

      utilities.mouseHover('#trigger-element');
      timeout.flush();

      var popover = document.querySelector(POPOVER);

      expect(popover.classList).toContain("fade");

      utilities.mouseLeave('#trigger-element');
      timeout.flush();

      expect(popover.classList).not.toContain("fade");
    });
  });
  describe('when rendering on left side of page', function() {
    it('should render bottom arrow and popover in different format', function() {
      var midPoint = document.body.clientWidth / 2;
      var markup = '<span style="margin-right: ' + (midPoint + 5) + 'px" id="trigger-element" class="pull-right" akam-popover position="bottom"' +
        'popover-content="tool tip content" trigger="hover"' +
        'button-text="button text" button-function="btnFunction">Clicky for Bottom Right Side' +
        '</span><button id="butttton"></button>';
      addElement(markup);
      timeout.flush();

      var offsetLeft = scope.$$childHead.popoverLeft.substring(0, scope.$$childHead.popoverLeft.length - 2);
      expect(parseInt(offsetLeft) < midPoint).toBe(true);

    });
    it('should render top arrow and popover in different format', function() {
      var midPoint = document.body.clientWidth / 2;
      var markup = '<span style="margin-right: ' + (midPoint + 5) + 'px" id="trigger-element" class="pull-right" akam-popover position="top"' +
        'popover-content="tool tip content" trigger="hover"' +
        'button-text="button text" button-function="btnFunction">Clicky for Bottom Right Side' +
        '</span><button id="butttton"></button>';
      addElement(markup);
      timeout.flush();

      var offsetLeft = scope.$$childHead.popoverLeft.substring(0, scope.$$childHead.popoverLeft.length - 2);
      expect(parseInt(offsetLeft) < midPoint).toBe(true);
    });
  });
  describe('when passing bad data', function() {
    it('should not render when position is invalid', function() {
      var midPoint = document.body.clientWidth / 2;
      var markup = '<span id="trigger-element" class="pull-right" akam-popover position="nothing"' +
        'popover-content="tool tip content" trigger="hover"' +
        'button-text="button text" button-function="btnFunction">Clicky for Bottom Right Side' +
        '</span><button id="butttton"></button>';
      addElement(markup);

      var popover = document.querySelector(POPOVER);
      expect(popover).toBe(null);
    });
    it('should not render when position is not provided', function() {
      var midPoint = document.body.clientWidth / 2;
      var markup = '<span id="trigger-element" class="pull-right" akam-popover' +
        'popover-content="tool tip content" trigger="hover"' +
        'button-text="button text" button-function="btnFunction">Clicky for Bottom Right Side' +
        '</span><button id="butttton"></button>';
      addElement(markup);

      var popover = document.querySelector(POPOVER);
      expect(popover).toBe(null);
    });
  });
  describe('when passing bad data', function() {
    it('should not render when position is invalid', function() {
      var midPoint = document.body.clientWidth / 2;
      var markup = '<span id="trigger-element" class="pull-right" akam-popover position="nothing"' +
        'popover-content="tool tip content" trigger="hover"' +
        'button-text="button text" button-function="btnFunction">Clicky for Bottom Right Side' +
        '</span><button id="butttton"></button>';
      addElement(markup);

      var popover = document.querySelector(POPOVER);
      expect(popover).toBe(null);
    });
    it('should not render when position is not provided', function() {
      var midPoint = document.body.clientWidth / 2;
      var markup = '<span id="trigger-element" class="pull-right" akam-popover' +
        'popover-content="tool tip content" trigger="hover"' +
        'button-text="button text" button-function="btnFunction">Clicky for Bottom Right Side' +
        '</span><button id="butttton"></button>';
      addElement(markup);

      var popover = document.querySelector(POPOVER);
      expect(popover).toBe(null);
    });
  });
});
