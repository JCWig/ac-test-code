/* eslint-disable max-nested-callbacks */
/* globals angular, beforeEach, afterEach, spyOn, jasmine */

import menuButton from '../../src/menu-button';

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
    angular.mock.module(function($translateProvider) {
      $translateProvider.useLoader('translateNoopLoader');
    });

    angular.mock.inject(function($compile, $rootScope) {
      this.$compile = $compile;
      this.$scope = $rootScope.$new();
    });

  });

  describe('given a dropdown menu', function() {

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

  describe('given a split button menu', function() {

    beforeEach(function() {
      let markup =
        `<akam-menu-button default-text="examples.appNames.pm" >
          <akam-menu-button-item text="examples.appNames.tq"></akam-menu-button-item>
          <akam-menu-button-item text="examples.appNames.bc"></akam-menu-button-item>
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