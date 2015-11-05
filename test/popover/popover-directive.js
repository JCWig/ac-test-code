/* eslint-disable max-nested-callbacks */
/* global angular, inject */

import utilities from '../utilities';
import enUsMessagesResponse from '../i18n/i18n_responses/messages_en_US.json';
import enUsResponse from '../i18n/i18n_responses/en_US.json';
import popoverDirective from '../../src/popover';

const LIBRARY_PATH = /\/libs\/akamai-core\/[0-9]*.[0-9]*.[0-9]*\/locales\/en_US.json/;
const CONFIG_PATH = '../../_appen_US.json';

const POPOVER = '.popover';
const POPOVER_HEADER = '.popover .popover-title';
const POPOVER_CONTENT = '.popover .popover-content';
const POPOVER_MIDDLE_CONTENT = '.popover .popover-content .popover-middle-content';

describe('akamai.components.popover', function() {
  let translationMock = {
      'components': {
        'popover': {
            'label': 'Popover Label'
          }
      }
  };

  function addElement(markup) {
    this.el = this.$compile(markup)(this.$scope);
    this.$scope.$digest();
    this.element = document.body.appendChild(this.el[0]);
  }

  beforeEach(function() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(popoverDirective.name);
    angular.mock.module(function($translateProvider) {
      $translateProvider.translations('en_US', translationMock);
      $translateProvider.useLoader('translateNoopLoader');
    });
    inject(function($compile, $rootScope, $timeout, $sce, $httpBackend) {
      this.$scope = $rootScope.$new();
      this.$timeout = $timeout;
      this.$compile = $compile;
      this.$sce = $sce;
      this.$httpBackend = $httpBackend;
      this.$httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
      this.$httpBackend.when('GET', CONFIG_PATH).respond(enUsResponse);
      this.$httpBackend.when('GET', 'custom-template.html').respond(`<div class="popover-middle-content"><span class="hover3">Custom Content Example Text</span>
                <div class="popover-button-content"> <button>Click this button to do something</button></div>
                <div class="popover-button-content">
                    <button ng-click="include.btnFunctionInclude()">Click this button and see message in browser log</button>
                </div>
            </div>`);
      this.addElement = addElement;
      this.$scope.translationMock = translationMock;
    });

    jasmine.clock().install();
  });

  afterEach(function() {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    this.element = null;

    jasmine.clock().uninstall();
  });

  describe('given a akam-popover', function() {
    describe('when rendering', function() {
      beforeEach(function() {
        let markup = `
          <span id='trigger-element' class='pull-right'
            akam-popover='tool tip content'
            popover-placement='bottom'
            popover-title='Simple Header'
            popover-trigger='click'>
            Clicky for Bottom Right Side
          </span>`;

        this.addElement(markup);
        this.el.triggerHandler('click');
        this.$timeout.flush();
      });
      it('should render all parts', function() {
        let popoverHeader = utilities.findElement(this.el.parent(), POPOVER_HEADER);
        let popoverContent = utilities.findElement(this.el.parent(), POPOVER_CONTENT);

        expect(popoverHeader.text()).toContain('Simple Header');
        expect(popoverContent.text()).toContain('tool tip content');
      });
    });
    describe('when rendering', function() {
      beforeEach(function() {
        let markup = `
          <span id="trigger-element" class='pull-right'
            akam-popover='tool tip content'
            popover-placement='bottom'
            popover-trigger='click'>
            Clicky for Bottom Right Side
          </span>`;

        this.addElement(markup);
        this.el.triggerHandler('click');
        this.$timeout.flush();
      });
      it('should be able to render without title', function() {
        let popoverHeader = utilities.findElement(this.el.parent(), POPOVER_HEADER);
        let popoverContent = utilities.findElement(this.el.parent(), POPOVER_CONTENT);

        expect(popoverHeader).toEqual({});
        expect(popoverContent.text()).toContain('tool tip content');
      });
    });
    describe('when rendering', function() {
      beforeEach(function() {
        let markup = `
          <span id="trigger-element" class='pull-right'
            akam-popover='<h1>HTML content</h1>'
            popover-placement='bottom'
            popover-trigger='click'>
            Clicky for Bottom Right Side
          </span>`;

        this.addElement(markup);
        this.el.triggerHandler('click');
        this.$timeout.flush();
      });
      it('should be able to render trusted HTML markup', function() {
        let popoverContent = utilities.findElement(this.el.parent(), POPOVER_CONTENT);
        expect(popoverContent.text()).toEqual('HTML content');
      });
    });
    describe('when rendering', function() {
      beforeEach(function() {
        let markup = `
          <span id="trigger-element" class='pull-right'
            akam-popover='<h1>HTML content</h1>'
            popover-placement='top'
            popover-trigger='click'>
            Clicky for Bottom Right Side
          </span>`;

        this.addElement(markup);
        this.el.triggerHandler('click');
        this.$timeout.flush();
      });
      it('should be able to render on the top', function() {
        let popover = utilities.findElement(this.el.parent(), POPOVER);
        expect(popover.hasClass('top')).toBe(true);
      });
    });
    describe('when rendering', function() {
      beforeEach(function() {
        let markup = `
          <span id="trigger-element" class='pull-right'
            akam-popover='<h1>HTML content</h1>'
            popover-placement='left'
            popover-trigger='click'>
            Clicky for Bottom Right Side
          </span>`;

        this.addElement(markup);
        this.el.triggerHandler('click');
        this.$timeout.flush();
      });
      it('should be able to render on the left', function() {
        let popover = utilities.findElement(this.el.parent(), POPOVER);
        expect(popover.hasClass('left')).toBe(true);
      });
    });
    describe('when rendering', function() {
      beforeEach(function() {
        let markup = `
          <span id="trigger-element" class='pull-right'
            akam-popover='<h1>HTML content</h1>'
            popover-placement='right'
            popover-trigger='click'>
            Clicky for Bottom Right Side
          </span>`;

        this.addElement(markup);
        this.el.triggerHandler('click');
        this.$timeout.flush();
      });
      it('should be able to render on the right', function() {
        let popover = utilities.findElement(this.el.parent(), POPOVER);
        expect(popover.hasClass('right')).toBe(true);
      });
    });
    describe('when rendering', function() {
      beforeEach(function() {
        let markup = `
          <span id="trigger-element" class='pull-right'
            akam-popover='<h1>HTML content</h1>'
            popover-placement='bottom'
            popover-trigger='click'>
            Clicky for Bottom Right Side
          </span>`;

        this.addElement(markup);
        this.el.triggerHandler('click');
        this.$timeout.flush();
      });
      it('should be able to render on the bottom', function() {
        let popover = utilities.findElement(this.el.parent(), POPOVER);
        expect(popover.hasClass('bottom')).toBe(true);
      });
    });
    describe('when rendered', function() {
      beforeEach(function() {
        let markup = `
          <span id="trigger-element" class='pull-right'
            akam-popover='<h1>HTML content</h1>'
            popover-placement='bottom'
            popover-trigger='click'>
            Clicky for Bottom Right Side
          </span>`;

        this.addElement(markup);
      });

      it('should open on trigger element click', function(){
        this.el.triggerHandler('click');
        this.$timeout.flush();

        let popover = utilities.findElement(this.el.parent(), POPOVER);
        expect(popover.hasClass('in')).toBe(true);
      });
      it('should close popover on trigger element click', function(){
        this.el.triggerHandler('click');
        this.$timeout.flush();

        this.el.triggerHandler('click');
        jasmine.clock().tick(201);

        let popover = utilities.findElement(this.el.parent(), POPOVER);
        expect(popover).toEqual({});
      });
      it('should close on click away', function(){
        this.el.triggerHandler('click');
        this.$timeout.flush();

        utilities.clickAwayCreationAndClick('div');
        jasmine.clock().tick(201);

        let popover = utilities.findElement(this.el.parent(), POPOVER);
        expect(popover).toEqual({});
      });
    });
    describe('when passing invalid values', function() {
      beforeEach(function() {
        let markup = `
          <span id="trigger-element" class='pull-right'
            akam-popover='<h1>HTML content</h1>'
            popover-placement='mamamiya'
            popover-trigger='click'>
            Clicky for Bottom Right Side
          </span>`;

        this.addElement(markup);
        this.el.triggerHandler('click');
        this.$timeout.flush();
      });
      it('should render on top when position is invalid', function() {
        let popover = utilities.findElement(this.el.parent(), POPOVER);

        expect(popover.hasClass('top')).toBe(false);
        expect(popover.hasClass('right')).toBe(false);
        expect(popover.hasClass('left')).toBe(false);
        expect(popover.hasClass('bottom')).toBe(false);
      });
    });
    describe('when passing invalid values', function() {
      beforeEach(function() {
        let markup = `
          <span id="trigger-element" class='pull-right'
            akam-popover='<h1>HTML content</h1>'
            popover-trigger='click'>
            Clicky for Bottom Right Side
          </span>`;

        this.addElement(markup);
        this.el.triggerHandler('click');
        this.$timeout.flush();
      });
      it('should render on top when position is not provided', function() {
        let popover = utilities.findElement(this.el.parent(), POPOVER);

        expect(popover.hasClass('top')).toBe(true);
      });
    });
    describe('when trigger is mouse enter', function() {
      beforeEach(function() {
        let markup = `
          <span id="trigger-element" class='pull-right'
            akam-popover='<h1>HTML content</h1>'
            popover-trigger='mouseenter'>
            Clicky for Bottom Right Side
          </span>`;

        this.addElement(markup);
      });
      it('should show on mouseenter', function() {
        this.el.triggerHandler('mouseenter');
        this.$timeout.flush();

        let popover = utilities.findElement(this.el.parent(), POPOVER);
        expect(popover.hasClass('in')).toBe(true);
      });
      it('shoud hide on mouseleave', function() {
        this.el.triggerHandler('mouseenter');
        this.$timeout.flush();

        this.el.triggerHandler('mouseleave');
        jasmine.clock().tick(201);

        let popover = utilities.findElement(this.el.parent(), POPOVER);
        expect(popover).toEqual({});
      });
      it('should remain open when hovering over popover', function() {
        let popover;
        this.el.triggerHandler('mouseenter');
        this.$timeout.flush();

        this.el.triggerHandler('mouseleave');
        jasmine.clock().tick(100);

        popover = utilities.findElement(this.el.parent(), POPOVER);
        popover.triggerHandler('mouseenter');
        jasmine.clock().tick(201);

        popover = utilities.findElement(this.el.parent(), POPOVER);
        expect(popover.hasClass('in')).toBe(true);
      });
      it('should close after hovering out of popover', function() {
        let popover;
        this.el.triggerHandler('mouseenter');
        this.$timeout.flush();
        this.el.triggerHandler('mouseleave');
        jasmine.clock().tick(100);

        popover = utilities.findElement(this.el.parent(), POPOVER);
        popover.triggerHandler('mouseenter');
        jasmine.clock().tick(100);
        popover.triggerHandler('mouseleave');
        jasmine.clock().tick(201);

        popover = utilities.findElement(this.el.parent(), POPOVER);
        expect(popover).toEqual({});
      });
    });
    describe('when popover contains translation key', function() {
      beforeEach(function() {
        let markup = `
          <span id="trigger-element" class='pull-right'
            akam-popover='components.popover.label'
            popover-placement='bottom'
            popover-trigger='click'>
            Clicky for Bottom Right Side
          </span>`;

        this.addElement(markup);
        this.el.triggerHandler('click');
        this.$timeout.flush();
      });
      it('should translate content', function() {
        let popover = utilities.findElement(this.el.parent(), POPOVER_CONTENT);
        expect(popover.text()).toEqual('Popover Label');
      });
    });
  });

  describe('given akam-popover-template', function() {
    describe('when rendered', function() {
      beforeEach(function() {
        this.$scope.customData = 'custom-template.html';
        let markup = `
          <span id="trigger-element" class='pull-right'
            akam-popover-template='customData'
            popover-placement='bottom'
            popover-trigger='click'>
            Trusted Content
          </span>`;

        this.addElement(markup);
        this.el.triggerHandler('click');
        this.$timeout.flush();
      });
      it('should render popover using template', function() {
        let popover = utilities.findElement(this.el.parent(), '.popover-content');
        expect(popover[0].outerHTML).toEqual('<div class="popover-content" ' +
          'tooltip-template-transclude="contentExp()" ' +
           'tooltip-template-transclude-scope="originScope()"></div>');
      });
    });
  });
});
