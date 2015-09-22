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

  var translationMock = {
    "examples.appName": "{{name}}"
  };

  beforeEach(function() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(menuButton.name);
    angular.mock.module(function($provide, $translateProvider) {
      function i18nCustomLoader($q, $timeout) {
        return function(options) {
          var deferred = $q.defer();
          deferred.resolve(translationMock);
          return deferred.promise;
        };
      }
      i18nCustomLoader.$inject = ['$q', '$timeout'];

      $provide.factory('i18nCustomLoader', i18nCustomLoader);
      $translateProvider.useLoader('i18nCustomLoader');
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

  describe('given a dropdown menu', function() {
    describe('when a dropdown item is disabled', function() {
      beforeEach(function() {
        let markup =
          `<akam-menu-button default-text="examples.appNames.pm" >
          <akam-menu-button-item is-disabled="true" text="examples.appNames.tq"></akam-menu-button-item>
          <akam-menu-button-item text="examples.appNames.bc"></akam-menu-button-item>
          </akam-menu-button-item>
        </akam-menu-button>`;

        addElement.call(this, markup);
      });
      it('should not be selectable', function() {
        expect(this.element.querySelector('.dropdown-menu').children[0].classList.contains('disabled')).toEqual(true);
      });
    })
  });

  describe('given a menu button', function() {
    describe('when provided text-values attribute with variable replacements', function() {
      beforeEach(function() {
        let markup =
          `<akam-menu-button default-text="examples.appNames.pm" >
          <akam-menu-button-item text="examples.appName" text-values="{name: 'property manager'}"></akam-menu-button-item>
          <akam-menu-button-item text="examples.appName" text-values="{name: 'event center'}"></akam-menu-button-item>
          </akam-menu-button-item>
        </akam-menu-button>`;

        addElement.call(this, markup);
      });
      it('should render item name correctly', function() {
        let itemList = this.element.querySelectorAll('.dropdown-menu a');
        expect(itemList[0].textContent).toBe("property manager");
        expect(itemList[1].textContent).toBe("event center");
      });
    })
  });

});
