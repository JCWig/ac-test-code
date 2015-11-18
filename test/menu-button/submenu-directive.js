/* eslint-disable max-nested-callbacks */
/* globals angular, beforeEach, afterEach, spyOn, jasmine */

import menuButton from '../../src/menu-button';

describe('akamai.components.submenu', function () {

  let $compile;
  let $scope;

  beforeEach(function () {
    angular.mock.inject.strictDi(true);
    angular.mock.module(menuButton.name);

    angular.mock.inject(function (_$compile_, $rootScope) {
      $compile = _$compile_;
      $scope = $rootScope.$new();
    });
  });

  afterEach(function() {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  describe('when used outside akam-menu-button', function() {
    let tryToCompileOutsideAkamMenuButton;

    beforeEach(function() {
      tryToCompileOutsideAkamMenuButton =
        () => compiledElement('<akam-submenu text="foo"></akam-submenu>');
    });

    it('should throw an error', function () {
      expect(tryToCompileOutsideAkamMenuButton).toThrow();
    });
  });

  describe('given akam-menu-button with submenu', function () {
    let compiledMarkup;

    describe('when size attribute defined on akam-menu-button', function () {
      describe('and no size attribute defined on submenu', function () {
        beforeEach(function() {
          const markup = `
            <akam-menu-button size="small">
              <akam-menu-button-item text="foo"></akam-menu-button-item>
              <akam-submenu id="submenu" text="bar">
                <akam-menu-button-item text="baz"></akam-menu-button-item>
              </akam-submenu>
            </akam-menu-button>`;

          compiledMarkup = compiledElement(markup);
        });

        it('should inherit that attribute from akam-menu-button', function () {
          // when
          const nestedMenuList = compiledMarkup.querySelector('#submenu > ul');

          // then
          expect(nestedMenuList.classList.contains('small')).toBeTruthy();
        });
      });

      describe('and defined on submenu directly', function () {
        beforeEach(function() {
          const markup = `
            <akam-menu-button size="small">
              <akam-menu-button-item text="foo"></akam-menu-button-item>
              <akam-submenu id="submenu" text="bar" size="big">
                <akam-menu-button-item text="baz"></akam-menu-button-item>
              </akam-submenu>
            </akam-menu-button>`;

          compiledMarkup = compiledElement(markup);
        });

        it('should ignore attribute defined on akam-menu-button', function () {
          // when
          const nestedMenuList = compiledMarkup.querySelector('#submenu > ul');

          // then
          expect(nestedMenuList.classList.contains('big')).toBeTruthy();
        });
      });
    });

    describe('when position attribute defined on akam-menu-button', function () {
      describe('and no position attribute defined on submenu itself', function () {
        beforeEach(function() {
          const markup = `
            <akam-menu-button position="left">
              <akam-menu-button-item text="foo"></akam-menu-button-item>
              <akam-submenu id="submenu" text="bar">
                <akam-menu-button-item text="baz"></akam-menu-button-item>
              </akam-submenu>
            </akam-menu-button>`;

          compiledMarkup = compiledElement(markup);
        });

        it('should inherit that attribute from akam-menu-button', function () {
          // when
          const nestedMenuList = compiledMarkup.querySelector('#submenu > ul');

          // then
          expect(nestedMenuList.classList.contains('nested-menu-left')).toBeTruthy();
        });
      });

      describe('and defined on sumbenu itself', function () {
        beforeEach(function() {
          const markup = `
            <akam-menu-button position="right">
              <akam-menu-button-item text="foo"></akam-menu-button-item>
              <akam-submenu id="submenu" text="bar" position="left">
                <akam-menu-button-item text="baz"></akam-menu-button-item>
              </akam-submenu>
            </akam-menu-button>`;

          compiledMarkup = compiledElement(markup);
        });

        it('should ignore position attribute defined on akam-menu-button', function () {
          // when
          const nestedMenuList = compiledMarkup.querySelector('#submenu > ul');

          // then
          expect(nestedMenuList.classList.contains('nested-menu-left')).toBeTruthy();
        });
      })
    });

    describe('when position attribute not defined on akam-menu-button nor on submenu itself', function () {
      beforeEach(function() {
        const markup = `
          <akam-menu-button>
            <akam-menu-button-item text="foo"></akam-menu-button-item>
            <akam-submenu id="submenu" text="bar">
              <akam-menu-button-item text="baz"></akam-menu-button-item>
            </akam-submenu>
          </akam-menu-button>`;

        compiledMarkup = compiledElement(markup);
      });

      it('should align on right by default', function () {
        // when
        const nestedMenuList = compiledMarkup.querySelector('#submenu > ul');

        // then
        expect(nestedMenuList.classList.contains('nested-menu-right')).toBeTruthy();
      })
    });

    describe('when isDisabled attribute is truthy', function () {
      beforeEach(function () {
        $scope.disabled = true;
        const markup = `
          <akam-menu-button>
            <akam-menu-button-item text="foo"></akam-menu-button-item>
            <akam-submenu id="submenu" text="bar" is-disabled="disabled">
              <akam-menu-button-item text="baz"></akam-menu-button-item>
            </akam-submenu>
          </akam-menu-button>`;

        compiledMarkup = compiledElement(markup);
      });

      it('should be disabled', function () {
        // when
        const submenu = compiledMarkup.querySelector('#submenu');

        // then
        expect(submenu.classList.contains('disabled')).toBeTruthy();
      });

      it('should not include any children', function () {
        // when
        const unorderedListChild = compiledMarkup.querySelector('#submenu > ul');

        // then
        expect(unorderedListChild).toBeNull();
      });
    })

  });

  function compiledElement(markup) {
    const compiledElement = $compile(markup)($scope);
    $scope.$digest();

    return document.body.appendChild(compiledElement[0]);
  }
});