'use strict';
var utilities = require('../utilities');

var PANEL_HEADER = 'h4.panel-title';
var PANEL_HEADER_ICON = 'i.toggle-icon';
var PANEL_CONTENT_WRAPPER = 'div.panel-collapse';
var ALL_PANEL_CONTENT = 'div.panel-body div.content-wrapper .ng-scope';
var PANEL_HEADER_WRAPPER = '.panel-heading';

describe('akam-content-panel', function() {
  var compile, scope, log;
  var self = this;
  beforeEach(function() {
    inject.strictDi(true);
    self = this;
    angular.mock.module(require('../../src/content-panel').name);
    inject(function($compile, $rootScope, $log) {
      compile = $compile;
      scope = $rootScope.$new();
      log = $log;
    });
  });
  afterEach(function() {
    if (self.element) {
      document.body.removeChild(self.element);
      self.element = null;
    }
  });

  function addElement(markup) {
    self.el = compile(markup)(scope);
    scope.$digest();
    self.element = document.body.appendChild(self.el[0]);
  };
  describe('when rendering', function() {
    it('should render all parts', function() {
      scope.isCollapsed = false;
      var markup = '<akam-content-panel is-collapsed="isCollapsed" on-toggle="process()" header="Header 1">' +
        '<div>Gandalf the Grey</div><div>Gandalf the White</div>' +
        '</akam-content-panel>'
      addElement(markup);

      var headerDiv = document.querySelector(PANEL_HEADER);
      var content = document.querySelectorAll(ALL_PANEL_CONTENT);
      var headerIcon = document.querySelector(PANEL_HEADER_ICON);

      expect(headerDiv.textContent).toMatch(/Header 1/);
      expect(headerIcon).not.toBe(null);
      expect(headerIcon.classList.contains('aci-caret-right')).toBe(false);
      expect(headerIcon.classList.contains('aci-caret-bottom')).toBe(true);
      expect(content.length).toEqual(3);
      expect(content[1].textContent).toMatch(/Gandalf the Grey/);
      expect(content[2].textContent).toMatch(/Gandalf the White/);
    });
    it('should be able to render collpased', function() {
      scope.isCollapsed = true;
      var markup = '<akam-content-panel is-collapsed="isCollapsed" on-toggle="process()" header="Header 1">' +
        '<div>Gandalf the Grey</div><div>Gandalf the White</div>' +
        '</akam-content-panel>'
      addElement(markup);

      var headerDiv = document.querySelector(PANEL_HEADER);
      var content = document.querySelectorAll(ALL_PANEL_CONTENT);
      var headerIcon = document.querySelector(PANEL_HEADER_ICON);

      expect(headerDiv.textContent).toMatch(/Header 1/);
      expect(headerIcon).not.toBe(null);
      expect(headerIcon.classList.contains('aci-caret-right')).toBe(true);
      expect(headerIcon.classList.contains('aci-caret-bottom')).toBe(false);
      expect(content.length).toEqual(3);
      expect(content[1].textContent).toMatch(/Gandalf the Grey/);
      expect(content[2].textContent).toMatch(/Gandalf the White/);
    });
    it('should be able to render without a header', function() {
      scope.isCollapsed = true;
      spyOn(log, "error");
      var markup = '<akam-content-panel is-collapsed="isCollapsed" on-toggle="process()">' +
        '<div>Gandalf the Grey</div><div>Gandalf the White</div>' +
        '</akam-content-panel>'
      addElement(markup);

      expect(log.error).toHaveBeenCalled();
    });
    it('should be able to render without content', function() {
      scope.isCollapsed = true;
      var markup = '<akam-content-panel is-collapsed="isCollapsed" on-toggle="process()" header="Header 1">' +
        '</akam-content-panel>'
      addElement(markup);

      var headerDiv = document.querySelector(PANEL_HEADER);
      var content = document.querySelectorAll(ALL_PANEL_CONTENT);
      var headerIcon = document.querySelector(PANEL_HEADER_ICON);

      expect(headerDiv.textContent).toMatch(/Header 1/);
      expect(headerIcon).not.toBe(null);
      expect(content.length).toEqual(1); //header
    });
    it('should be able to render without content or header', function() {
      scope.isCollapsed = true;
      spyOn(log, "error");
      var markup = '<akam-content-panel is-collapsed="isCollapsed" on-toggle="process()">' +
        '</akam-content-panel>'
      addElement(markup);

      expect(log.error).toHaveBeenCalled();
    });
    it('should be able to render multiple content panels', function() {
      scope.panels = [{
        header: 'Header 1',
        collapsed: false
      }, {
        header: 'Header 2',
        collapsed: true
      }, {
        header: 'Header 3',
        collapsed: false
      }];
      var markup = '<div class ="panel-group"><akam-content-panel ng-repeat="panel in panels" header="{{panel.header}}">' +
        '<div>Gandalf the Grey</div><div>Gandalf the White</div>' +
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

      expect(headerDivs.length).toEqual(3);
      expect(contents.length).toEqual(9); //2 divs in each content-panel + headers
      expect(contentWrappers.length).toEqual(3);
      expect(headerIcons.length).toEqual(3);

      expect(headerIcon1.classList.contains('aci-caret-bottom')).toBe(true);
      expect(headerIcon2.classList.contains('aci-caret-bottom')).toBe(true);
      expect(headerIcon3.classList.contains('aci-caret-bottom')).toBe(true);

      expect(header1).toMatch(/Header 1/);
      expect(header2).toMatch(/Header 2/);
      expect(header3).toMatch(/Header 3/);
    });
    it('should be able to render with custom content with only text node (content)', function() {
      scope.randomText = "Here is some random text";
      var markup = '<akam-content-panel>' +
        '<akam-content-panel-header>' +
        '<i class="aci-world"></i> Custom Header' +
        '</akam-content-panel-header>' +
        '<akam-content-panel-body>' +
        '{{randomText}}' +
        '</akam-content-panel-body>' +
        '</akam-content-panel>';
      addElement(markup);

      var headerDiv = document.querySelector(PANEL_HEADER_WRAPPER);
      var uniqueIcon = document.querySelector('.aci-world');
      var content = document.querySelector('.content-wrapper');

      expect(headerDiv).not.toBe(null);
      expect(uniqueIcon).not.toBe(null);
    });
    it('should be able to render with custom content  (content)', function() {
      var markup = '<akam-content-panel>' +
        '<akam-content-panel-header>' +
        '<i class="aci-world"></i> Custom Header' +
        '</akam-content-panel-header>' +
        '<akam-content-panel-body>' +
        '<span class="uniqueContent"> Panel content </span>' +
        '</akam-content-panel-body>' +
        '</akam-content-panel>';
      addElement(markup);

      var headerDiv = document.querySelector(PANEL_HEADER_WRAPPER);
      var uniqueIcon = document.querySelector('.aci-world');
      var uniqueContent = document.querySelector('.uniqueContent');

      expect(headerDiv).not.toBe(null);
      expect(headerDiv.textContent.trim()).toBe("Custom Header");
      expect(uniqueIcon).not.toBe(null);
      expect(uniqueContent).not.toBe(null);
      expect(uniqueContent.textContent.trim()).toBe("Panel content");
    });
    it('should be able to render with custom content with multiple root nodes (content)', function() {
      var markup = '<akam-content-panel>' +
        '<akam-content-panel-header>' +
        '<i class="aci-world"></i> Custom Header' +
        '</akam-content-panel-header>' +
        '<akam-content-panel-body>' +
        '<span class="uniqueContent"> Panel content </span>' +
        '<span class="uniqueContent2"> Panel content 2 </span>' +
        '</akam-content-panel-body>' +
        '</akam-content-panel>';
      addElement(markup);

      var headerDiv = document.querySelector(PANEL_HEADER_WRAPPER);
      var uniqueIcon = document.querySelector('.aci-world');
      var uniqueContent1 = document.querySelector('.uniqueContent');
      var uniqueContent2 = document.querySelector('.uniqueContent2');

      expect(headerDiv).not.toBe(null);
      expect(uniqueIcon).not.toBe(null);
      expect(uniqueContent1).not.toBe(null);
      expect(uniqueContent1.textContent.trim()).toBe('Panel content');
      expect(uniqueContent2).not.toBe(null);
      expect(uniqueContent2.textContent.trim()).toBe('Panel content 2');
    });
    it('should be able to render with custom content with only text node (header)', function() {
      scope.randomText = 'Here is some random text';
      var markup = '<akam-content-panel>' +
        '<akam-content-panel-header>' +
        '{{randomText}}' +
        '</akam-content-panel-header>' +
        '<akam-content-panel-body>' +
        '<i class="aci-world"></i> Custom Header' +
        '</akam-content-panel-body>' +
        '</akam-content-panel>';
      addElement(markup);

      var headerDiv = document.querySelector(PANEL_HEADER_WRAPPER);
      var uniqueIcon = document.querySelector('.aci-world');
      var contents = document.querySelectorAll(ALL_PANEL_CONTENT);

      expect(headerDiv).not.toBe(null);
      expect(headerDiv.textContent.trim()).toBe(scope.randomText);
      expect(uniqueIcon).not.toBe(null);
    });
    it('should be able to render with custom content  (header)', function() {
      var markup = '<akam-content-panel>' +
        '<akam-content-panel-header>' +
        '<span class="uniqueContent"> Panel content </span>' +
        '</akam-content-panel-header>' +
        '<akam-content-panel-body>' +
        '<i class="aci-world"></i> Custom Header' +
        '</akam-content-panel-body>' +
        '</akam-content-panel>';
      addElement(markup);

      var headerDiv = document.querySelector(PANEL_HEADER_WRAPPER);
      var uniqueIcon = document.querySelector('.aci-world');
      var uniqueContent = document.querySelector('.uniqueContent');

      expect(headerDiv).not.toBe(null);
      expect(uniqueIcon).not.toBe(null);
      expect(uniqueContent).not.toBe(null);
    });
    it('should be able to render with custom content with multiple root nodes (header)', function() {
      var markup = '<akam-content-panel>' +
        '<akam-content-panel-header>' +
        '<span class="uniqueContent"> Panel content </span>' +
        '<span class="uniqueContent2"> Panel content 2 </span>' +
        '</akam-content-panel-header>' +
        '<akam-content-panel-body>' +
        '<i class="aci-world"></i> Custom Header' +
        '</akam-content-panel-body>' +
        '</akam-content-panel>';
      addElement(markup);

      var headerDiv = document.querySelector(PANEL_HEADER_WRAPPER);
      var uniqueIcon = document.querySelector('.aci-world');
      var uniqueContent1 = document.querySelector('.uniqueContent');
      var uniqueContent2 = document.querySelector('.uniqueContent2');

      expect(headerDiv).not.toBe(null);
      expect(uniqueIcon).not.toBe(null);
      expect(uniqueContent1).not.toBe(null);
      expect(uniqueContent2).not.toBe(null);
    });
  });
  it('should be able to render with custom header and body content and can be expanded and collapsable', function() {
    var markup = '<akam-content-panel>' +
      '<akam-content-panel-header>' +
      '<span class="uniqueContent"> Custom Header </span>' +
      '</akam-content-panel-header>' +
      '<akam-content-panel-body>' +
      '<i class="aci-world"></i> Panel content' +
      '</akam-content-panel-body>' +
      '</akam-content-panel>';
    addElement(markup);

    var headerDiv = document.querySelector(PANEL_HEADER_WRAPPER);
    var contentWrapper = document.querySelector(PANEL_CONTENT_WRAPPER);
    var headerContent = document.querySelector(PANEL_HEADER_WRAPPER);
    var headerIcon = document.querySelector(PANEL_HEADER_ICON);

    expect(contentWrapper.textContent.trim()).toBe('Panel content');
    expect(headerContent.textContent.trim()).toBe('Custom Header');
    expect(headerIcon.classList.contains('aci-caret-right')).toBe(false);

    utilities.click(headerIcon);
    scope.$digest();

    expect(headerIcon.classList.contains('aci-caret-right')).toBe(true);
  });

  it('should be able to render with custom header and body content with not-collapsable', function() {
    var markup = '<akam-content-panel not-collapsable>' +
      '<akam-content-panel-header>' +
      '<span class="uniqueContent"> Custom Header </span>' +
      '</akam-content-panel-header>' +
      '<akam-content-panel-body>' +
      '<i class="aci-world"></i> Panel content' +
      '</akam-content-panel-body>' +
      '</akam-content-panel>';
    addElement(markup);

    var headerIcon = document.querySelector(PANEL_HEADER_ICON);

    expect(headerIcon.classList.contains('ng-hide')).toBe(true);

    utilities.click(headerIcon);
    scope.$digest();

    expect(headerIcon.classList.contains('ng-hide')).toBe(true);
  });
  it('should verify new isolated scope using custom content when compile its elements', function() {
    var markup = '<akam-content-panel>' +
      '<akam-content-panel-header>' +
      '<span class="uniqueContent"> Custom Header </span>' +
      '</akam-content-panel-header>' +
      '<akam-content-panel-body>' +
      '<i class="aci-world"></i> Panel content' +
      '</akam-content-panel-body>' +
      '</akam-content-panel>';
    addElement(markup);

    var headerIcon = document.querySelector(PANEL_HEADER_ICON);
    var ctrl = self.el.isolateScope().contentPanel;

    utilities.click(headerIcon);
    scope.$digest();

    expect(ctrl.collapsable).toBe(true);
    expect(ctrl.isCollapsed).toBe(true);
    expect(typeof ctrl.headerClick).toBe('function');
  });
  it('should verify new isolated scope using not-collapsable', function() {
    var markup = '<akam-content-panel not-collapsable>' +
      '<akam-content-panel-header>' +
      '<span class="uniqueContent"> Custom Header </span>' +
      '</akam-content-panel-header>' +
      '<akam-content-panel-body>' +
      '<i class="aci-world"></i> Panel content' +
      '</akam-content-panel-body>' +
      '</akam-content-panel>';
    addElement(markup);

    var headerIcon = document.querySelector(PANEL_HEADER_ICON);

    utilities.click(headerIcon);
    scope.$digest();

    expect(self.el.isolateScope().contentPanel.collapsable).toBe(false);
  });
  describe('when rendered', function() {
    it('should be able to toggle visibility of content', function() {
      scope.isCollapsed = false;
      scope.process = jasmine.createSpy('spy');
      var markup = '<akam-content-panel is-collapsed="isCollapsed" on-toggle="process()" header="Header 1">' +
        '<div>Gandalf the Grey</div><div>Gandalf the White</div>' +
        '</akam-content-panel>';

      addElement(markup);

      var headerDiv = document.querySelector(PANEL_HEADER);
      var headerContent = document.querySelectorAll(ALL_PANEL_CONTENT);
      var contentWrapper = document.querySelector(PANEL_CONTENT_WRAPPER);
      var headerIcon = document.querySelector(PANEL_HEADER_ICON);

      utilities.click(headerIcon);
      scope.$digest();

      expect(scope.process.calls.count()).toEqual(1);
      expect(headerIcon.classList.contains('aci-caret-right')).toBe(true);
      expect(headerIcon.classList.contains('aci-caret-bottom')).toBe(false);
      expect(contentWrapper.classList.contains('collapsing')).toBe(true);

      utilities.click(headerDiv);
      scope.$digest();

      expect(scope.process.calls.count()).toEqual(2);
      expect(headerIcon.classList.contains('aci-caret-bottom')).toBe(true);
      expect(headerIcon.classList.contains('aci-caret-right')).toBe(false);
      expect(contentWrapper.classList.contains('collapse')).toBe(false);
    });
  });
  describe('when changing html inputs', function() {
    it('should be able to toggle visibility of content if no toggle provided', function() {
      scope.isCollapsed = false;
      var markup = '<akam-content-panel is-collapsed="isCollapsed" header="Header 1">' +
        '<div>Gandalf the Grey</div><div>Gandalf the White</div>' +
        '</akam-content-panel>'
      addElement(markup);

      var headerDiv = document.querySelector(PANEL_HEADER);
      var headerContent = document.querySelectorAll(ALL_PANEL_CONTENT);
      var contentWrapper = document.querySelector(PANEL_CONTENT_WRAPPER);
      var headerIcon = document.querySelector(PANEL_HEADER_ICON);

      utilities.click(headerIcon);
      scope.$digest();

      expect(headerIcon.classList.contains('aci-caret-bottom')).toBe(false);
      expect(headerIcon.classList.contains('aci-caret-right')).toBe(true);
      expect(contentWrapper.classList.contains('collapsing')).toBe(true);

      utilities.click(headerDiv);
      scope.$digest();

      expect(headerIcon.classList.contains('aci-caret-bottom')).toBe(true);
      expect(headerIcon.classList.contains('aci-caret-right')).toBe(false);
      expect(contentWrapper.classList.contains('collapse')).toBe(false);
    });
    it('should be able to toggle visibility of content if no toggle or collapsed provided', function() {
      scope.isCollapsed = null;
      var markup = '<akam-content-panel  header="Header 1">' +
        '<div>Gandalf the Grey</div><div>Gandalf the White</div>' +
        '</akam-content-panel>'
      addElement(markup);

      var headerDiv = document.querySelector(PANEL_HEADER);
      var headerContent = document.querySelectorAll(ALL_PANEL_CONTENT);
      var contentWrapper = document.querySelector(PANEL_CONTENT_WRAPPER);
      var headerIcon = document.querySelector(PANEL_HEADER_ICON);

      utilities.click(headerIcon);
      scope.$digest();

      expect(headerIcon.classList.contains('aci-caret-bottom')).toBe(false);
      expect(headerIcon.classList.contains('aci-caret-right')).toBe(true);
      expect(contentWrapper.classList.contains('collapsing')).toBe(true);

      utilities.click(headerDiv);
      scope.$digest();

      expect(headerIcon.classList.contains('aci-caret-bottom')).toBe(true);
      expect(headerIcon.classList.contains('aci-caret-right')).toBe(false);
      expect(contentWrapper.classList.contains('collapse')).toBe(false);
    });
    it('should not show expand/collapse icon element if notCollapsable attribute provided', function() {
      scope.isCollapsed = null;
      var markup = '<akam-content-panel not-collapsable on-toggle="process()" header="Header 1">' +
        '<div>Gandalf the Grey</div><div>Gandalf the White</div>' +
        '</akam-content-panel>'
      addElement(markup);

      var headerIcon = document.querySelector(PANEL_HEADER_ICON);
      var headerDiv = document.querySelector(PANEL_HEADER);
      var headerWrapper = document.querySelector(PANEL_HEADER_WRAPPER);

      expect(headerIcon.classList.contains('ng-hide')).toBe(true);
      expect(headerIcon.classList.contains('aci-caret-bottom')).toBe(true);
      expect(headerWrapper.classList.contains('util-clickable')).not.toBe(true);
    });
  });
  describe('given a custom content panel', function() {
    describe('when content-panel is destroyed', function(){
      let ctrl = null;
      beforeEach(function(){
        var markup = `<akam-content-panel>
                        <akam-content-panel-header>
                          <span class="uniqueContent"> Custom Header </span>
                        </akam-content-panel-header>
                        <akam-content-panel-body>
                          <i class="aci-world"></i> Panel content
                        </akam-content-panel-body>
                      </akam-content-panel>`;
        addElement(markup);
        ctrl = self.el.isolateScope().contentPanel;
      });
      it('should have customContentScope before $destroy', function() {
        expect(ctrl.customContentScope).not.toBeNull();
      });
      it('should remove customContentScope after $destroy', function() {
        scope.$destroy();
        expect(ctrl.customContentScope).toBeNull();
      });
    });
  });
});
