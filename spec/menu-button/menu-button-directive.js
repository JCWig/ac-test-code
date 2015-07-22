/* eslint-disable max-nested-callbacks */
/* globals angular, beforeEach, afterEach, spyOn, jasmine */

import menuButton from '../../src/menu-button';

const LIBRARY_PATH = /\/libs\/akamai-core\/[0-9]*.[0-9]*.[0-9]*\/locales\/en_US.json/,
  CONFIG_PATH = '/apps/appname/locales/en_US.json';

describe('akamai.components.menu-button', function() {

  afterEach(function() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
  });

  function addElement(markup) {
    this.el = this.$compile(markup)(this.$scope);
    this.$scope.$digest();
    this.element = document.body.appendChild(this.el[0]);
  }

  beforeEach(function() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(menuButton.name);
    angular.mock.module(function($provide, $translateProvider) {
      $translateProvider.useLoader('i18nCustomLoader');
    });

    angular.mock.inject(function($compile, $rootScope, $httpBackend) {
      this.$compile = $compile;
      this.$scope = $rootScope.$new();

      $httpBackend.when('GET', LIBRARY_PATH).respond({});
      $httpBackend.when('GET', CONFIG_PATH).respond({});
      $httpBackend.flush();
    });

  });

  describe('given no "akam-menu-button-item" set as a default-action', function() {

    beforeEach(function() {
      let markup =
        `<akam-menu-button>
          <akam-menu-button-item text="examples.appNames.tq"></akam-menu-button-item>
          <akam-menu-button-item text="examples.appNames.bc"></akam-menu-button-item>
          <akam-menu-button-item text="examples.appNames.pm"></akam-menu-button-item>
        </akam-menu-button>`;

      addElement.call(this, markup);
    });

    it('should render the dropdown menu', function() {
      expect(this.element.querySelector('.dropdown-menu').children.length).toBeGreaterThan(0);
    });

    it('should show the gear icon button', function() {
      expect(this.element.querySelectorAll('.menu-button').length).toEqual(1);
    });

    it('should not show the split button', function() {
      expect(this.element.querySelectorAll('.split-button').length).toEqual(0);
    });

  });

  describe('given a "akam-menu-button-item" set as a default-action', function() {

    beforeEach(function() {
      let markup =
        `<akam-menu-button>
          <akam-menu-button-item text="examples.appNames.tq"></akam-menu-button-item>
          <akam-menu-button-item text="examples.appNames.bc"></akam-menu-button-item>
          <akam-menu-button-item default-action text="examples.appNames.pm">
          </akam-menu-button-item>
        </akam-menu-button>`;

      addElement.call(this, markup);
    });

    it('should render the dropdown menu', function() {
      expect(this.element.querySelector('.dropdown-menu').children.length).toBeGreaterThan(0);
    });

    it('should show not the gear icon button', function() {
      expect(this.element.querySelectorAll('.menu-button').length).toEqual(0);
    });

    it('should show the split button', function() {
      expect(this.element.querySelectorAll('.split-button').length).toEqual(2);
    });

  });

});