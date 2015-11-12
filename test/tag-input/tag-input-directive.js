/* eslint-disable max-nested-callbacks */
/*global angular, inject*/

import tagInput from '../../src/tag-input';

import util from '../utilities';
import translationMock from '../fixtures/translationFixture.json';

const DIRECTIVE_NAME = 'akamTagInput';
const SELECTED_TAGS = 'li.tag';
const MENU_TAGS = 'li.menu-tag';

describe('akamai.components.tag-input', function() {

  let tagStrings = {
    selectedTags: [
      'Connecticut',
      'Maryland',
      'Massachusetts'
    ],
    menuTags: [
      'Colorado',
      'Connecticut',
      'Maryland',
      'Massachusetts',
      'New Hampshire',
      'New Jersey',
      'New York',
      'Vermont',
      'Virginia',
      'Washington, District of Columbia'
    ]
  };

  let tagObjs = {
    selectedTags: [
      {state: 'Massachusetts'},
      {state: 'Maryland'},
      {state: 'Massachusetts'}
    ],
    menuTags: [
      {state: 'Colorado'},
      {state: 'Connecticut'},
      {state: 'Maryland'},
      {state: 'Massachusetts'},
      {state: 'New Hampshire'},
      {state: 'New Jersey'},
      {state: 'New York'},
      {state: 'Vermont'},
      {state: 'Virginia'},
      {state: 'Washington, District of Columbia'}
    ]
  };

  beforeEach(function() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(tagInput.name);
    angular.mock.module(function($translateProvider) {
      $translateProvider.translations('en_US', translationMock);
      $translateProvider.useLoader('translateNoopLoader');
    });
    inject(function($rootScope, $compile, $timeout, $q, $document) {
      this.$scope = $rootScope;
      this.$compile = $compile;
      this.$timeout = $timeout;
      this.$q = $q;
      this.$document = $document;

      this.$scope.selectedTagStrings = angular.copy(tagStrings.selectedTags);
      this.$scope.menuTagStrings = angular.copy(tagStrings.menuTags);

      this.$scope.selectedTagObjs = angular.copy(tagObjs.selectedTags);
      this.$scope.menuTagObjs = angular.copy(tagObjs.menuTags);

      this.$scope.tagsString = 'aString';
    });
  });

  describe('given a basic tag-input control', function() {

    describe('when rendered with tag strings', function() {
      let selectedTagElems, menuTagElems;
      beforeEach(function() {
        let markup = `<akam-tag-input ng-model="selectedTagStrings"
                                      items="menuTagStrings"></akam-tag-input>`;

        let el = this.$compile(markup)(this.$scope);
        this.$scope.$digest();

        selectedTagElems = util.findElements(el, SELECTED_TAGS);
        menuTagElems = util.findElements(el, MENU_TAGS);
      });
      it('should render all selected tags', function() {
        expect(selectedTagElems.length).toBe(3);
      });
      it('should render the labels for all selected tags', function() {
        tagStrings.selectedTags.forEach((selectedTag, i) => {
          expect(selectedTagElems[i].find('span').text()).toBe(selectedTag);
        });
      });
      it('should render all menu tags', function() {
        expect(menuTagElems.length).toBe(10);
      });
      it('should render the labels for all menu tags', function() {
        tagStrings.menuTags.forEach((menuTag, i) => {
          expect(menuTagElems[i].find('span').text()).toBe(menuTag);
        });
      });
    });

    describe('when rendered with tag objects', function() {
      let selectedTagElems, menuTagElems;
      beforeEach(function() {
        let markup = `<akam-tag-input ng-model="selectedTagObjs" text-property="state"
                                      items="menuTagObjs"></akam-tag-input>`;

        let el = this.$compile(markup)(this.$scope);
        this.$scope.$digest();
        this.$timeout.flush();

        selectedTagElems = util.findElements(el, SELECTED_TAGS);
        menuTagElems = util.findElements(el, MENU_TAGS);
      });
      it('should render all selected tags', function() {
        expect(selectedTagElems.length).toBe(3);
      });
      it('should render the labels for all selected tags', function() {
        tagObjs.selectedTags.forEach((selectedTag, i) => {
          expect(selectedTagElems[i].find('span').text()).toBe(selectedTag.state);
        });
      });
      it('should render all menu tags', function() {
        expect(menuTagElems.length).toBe(10);
      });
      it('should render the labels for all menu tags', function() {
        tagObjs.menuTags.forEach((menuTag, i) => {
          expect(menuTagElems[i].find('span').text()).toBe(menuTag.state);
        });
      });
    });

    describe('when rendered with ng-model values other than an array', function() {
      let selectedTagElems;
      beforeEach(function() {
        let markup = `<akam-tag-input ng-model="tagsString"
                                      items="menuTagStrings"></akam-tag-input>`;

        let el = this.$compile(markup)(this.$scope);
        this.$scope.$digest();
        selectedTagElems = util.findElements(el, SELECTED_TAGS);
      });
      it('should not render any selected tags', function() {
        expect(selectedTagElems.length).toBe(0);
      })
    });

    describe('when a value is entered into the input field', function() {
      let ctrl;
      beforeEach(function() {
        let markup = `<akam-tag-input ng-model="selectedTagStrings"
                                      items="menuTagStrings"></akam-tag-input>`;

        let el = this.$compile(markup)(this.$scope);
        this.$scope.$digest();

        ctrl = el.controller(DIRECTIVE_NAME);
        ctrl.proposedTag = 'New Tag,';
        let elem = util.findElement(el, 'input.tag-input');
        elem.triggerHandler('keydown');
      });

      it('should add a new tag to selected tags', function() {
        expect(ctrl.selectedTags[ctrl.selectedTags.length - 1]).toBe('New Tag');
      });
    });

    describe('when a value is entered into the input field and return is pressed', function() {
      let ctrl;
      beforeEach(function() {
        let markup = `<akam-tag-input ng-model="selectedTagStrings"
                                      items="menuTagStrings"></akam-tag-input>`;

        let el = this.$compile(markup)(this.$scope);
        this.$scope.$digest();

        ctrl = el.controller(DIRECTIVE_NAME);
        ctrl.proposedTag = 'New Tag';
        let elem = util.findElement(el, 'input.tag-input');
        elem.triggerHandler({type: 'keydown', which: 13});
      });

      it('should add a new tag to selected tags', function() {
        expect(ctrl.selectedTags[ctrl.selectedTags.length - 1]).toBe('New Tag');
      });
    });

    describe('when a delete key is pressed once', function() {

      let ctrl;
      beforeEach(function() {
        let markup = `<akam-tag-input ng-model="selectedTagStrings"
                                      items="menuTagStrings"></akam-tag-input>`;

        let el = this.$compile(markup)(this.$scope);
        this.$scope.$digest();
        ctrl = el.controller(DIRECTIVE_NAME);

        let elem = util.findElement(el, 'input.tag-input');
        elem.triggerHandler({type: 'keydown', which: 8});
      });

      it('should set canDelete to true', function() {
        expect(ctrl.canDelete).toBe(true);
      });

      it('should not delete the last tag', function() {
        expect(ctrl.selectedTags[ctrl.selectedTags.length - 1]).toBe('Massachusetts');
      });
    });

    describe('when a delete key is pressed once and no tags have been selected', function() {

      let ctrl;
      beforeEach(function() {
        let markup = `<akam-tag-input ng-model="nothingSelected"
                                      items="menuTagStrings"></akam-tag-input>`;

        let el = this.$compile(markup)(this.$scope);
        this.$scope.$digest();
        ctrl = el.controller(DIRECTIVE_NAME);

        let elem = util.findElement(el, 'input.tag-input');
        elem.triggerHandler({type: 'keydown', which: 8});
      });

      it('should not set canDelete to true', function() {
        expect(ctrl.canDelete).toBe(false);
      });
    });

    describe('when a delete key is pressed twice', function() {
      let ctrl;
      beforeEach(function() {
        let markup = `<akam-tag-input ng-model="selectedTagStrings"
                                      items="menuTagStrings"></akam-tag-input>`;

        let el = this.$compile(markup)(this.$scope);
        this.$scope.$digest();
        ctrl = el.controller(DIRECTIVE_NAME);

        let elem = util.findElement(el, 'input.tag-input');
        elem.triggerHandler({type: 'keydown', which: 8});
        elem.triggerHandler({type: 'keydown', which: 8});
      });

      it('should set canDelete to false', function() {
        expect(ctrl.canDelete).toBe(false);
      });

      it('should not delete the last tag', function() {
        expect(ctrl.selectedTags[ctrl.selectedTags.length - 1]).toBe('Maryland');
      });
    });

    describe('when the tag input is focused', function() {
      let ctrl;
      beforeEach(function() {
        let markup = `<akam-tag-input ng-model="selectedTagStrings"
                                      items="menuTagStrings"></akam-tag-input>`;

        let el = this.$compile(markup)(this.$scope);
        this.$scope.$digest();
        ctrl = el.controller(DIRECTIVE_NAME);

        let elem = util.findElement(el, 'input.tag-input');
        elem.triggerHandler('focus');
      });
      it('should set focused to true', function() {
        expect(ctrl.focused).toBe(true);
      });
      it('should set the util-show class on the tag menu', function() {
        expect(ctrl.tagMenu.hasClass('util-show')).toBe(true);
      });
      it('should remove the util-hide class from the tag menu', function() {
        expect(ctrl.tagMenu.hasClass('util-hide')).toBe(false);
      });
    });

    describe('when the tag input is blurred', function() {
      let ctrl;
      beforeEach(function() {
        let markup = `<akam-tag-input ng-model="selectedTagStrings"
                                      items="menuTagStrings"></akam-tag-input>`;

        let el = this.$compile(markup)(this.$scope);
        this.$scope.$digest();
        ctrl = el.controller(DIRECTIVE_NAME);

        let elem = util.findElement(el, 'input.tag-input');
        elem.triggerHandler('blur');
      });
      it('should set focused to false', function() {
        expect(ctrl.focused).toBe(false);
      });
      it('should set the util-hide class on the tag menu', function() {
        expect(ctrl.tagMenu.hasClass('util-hide')).toBe(true);
      });
      it('should remove the util-show class from the tag menu', function() {
        expect(ctrl.tagMenu.hasClass('util-show')).toBe(false);
      });
    });

    describe('when a new tag is selected from the tag menu', function() {
      let ctrl;
      beforeEach(function() {
        let markup = `<akam-tag-input ng-model="selectedTagObjs" text-property="state"
                                      items="menuTagObjs"></akam-tag-input>`;

        let el = this.$compile(markup)(this.$scope);
        this.$scope.$digest();
        ctrl = el.controller(DIRECTIVE_NAME);

        ctrl.proposedTag = 'New Tag';

        let elem = util.findElement(el, 'input.tag-input');
        elem.triggerHandler('focus');

        let newItemElem = util.findElement(el, '.dropdown-menu li:first-child a');
        newItemElem.triggerHandler('mousedown');
      });
      it('should add the new tag to selectedTags', function() {
        expect(ctrl.selectedTags[ctrl.selectedTags.length - 1].state).toBe('New Tag');
      });
    });
  });

  describe('given an items attribute', function() {
    describe('when a value other a Promise or Array is supplied', function() {
      let error;
      beforeEach(function() {
        let markup = `<akam-tag-input ng-model="selectedTagStrings"
                                      items="tagsString"></akam-tag-input>`;

        this.$compile(markup)(this.$scope);

        try {
          this.$scope.$digest();
        } catch (e) {
          error = e;
        }
      });
      it('should throw an error', function() {
        expect(error.message).toBe('Tag items must be an Array');
      })
    });
    describe('when a Promise is supplied and resolved', function() {
      let menuTagElems;
      beforeEach(function() {

        let deferred = this.$q.defer();
        this.$scope.itemsPromise = deferred.promise;

        let markup = `<akam-tag-input ng-model="selectedTagStrings"
                                      items="itemsPromise"></akam-tag-input>`;

        let el = this.$compile(markup)(this.$scope);
        deferred.resolve(this.$scope.menuTagStrings);
        this.$scope.$digest();

        menuTagElems = util.findElements(el, MENU_TAGS);
      });
      it('should render all selected tags', function() {
        expect(menuTagElems.length).toBe(10);
      });
    });
    describe('when a Promise is supplied and rejected', function() {
      let error;
      beforeEach(function() {

        let deferred = this.$q.defer();
        this.$scope.itemsPromise = deferred.promise;

        let markup = `<akam-tag-input ng-model="selectedTagStrings"
                                      items="itemsPromise"></akam-tag-input>`;

        this.$compile(markup)(this.$scope);
        deferred.reject('Reason');
        try {
          this.$scope.$digest();
        } catch (e) {
          error = e;
        }

      });
      it('should throw an error', function() {
        expect(error.message).toBe('Error while returning items. Reason: Reason');
      });
    });
  });

  describe('given an appended-to-body attribute', function() {
    describe('when rendering', function() {
      let ctrl, elem;
      beforeEach(function() {
        let markup = `<akam-tag-input ng-model="selectedTagStrings" appended-to-body
                                      items="menuTagStrings"></akam-tag-input>`;

        let el = this.$compile(markup)(this.$scope);
        this.$scope.$digest();

        ctrl = el.controller(DIRECTIVE_NAME);
        ctrl.proposedTag = 'Ma';
        elem = util.findElement(el, 'input.tag-input');
        elem.triggerHandler('focus');
      });
      it('should show the dropdown menu appended to body', function() {
        expect(util.findElement(angular.element(this.$document[0].body), '.dropdown-menu'))
          .not.toBe(null);
      });
    });
  });

  describe('given an is-draggable attribute', function() {
    describe('when a selected tag is dragged to a new position', function() {
      let tagListElem;
      beforeEach(function() {
        let markup = `<akam-tag-input ng-model="selectedTagStrings" appended-to-body
                                      items="menuTagStrings"></akam-tag-input>`;

        let el = this.$compile(markup)(this.$scope);
        this.$scope.$digest();

        tagListElem = util.findElement(el, '.tag-input-list');
        let theLis = tagListElem.children().detach();
        let tempLi = theLis[1];
        theLis[1] = theLis[3];
        theLis[3] = tempLi
        tagListElem.append(theLis);

        el.controller(DIRECTIVE_NAME).sortableConfig.onSort();
      });
      it('should make sure the tag-input-container is the last li', function() {
        expect(true).toBe(true);
        expect(util.findElement(tagListElem, 'li:last-child').prop('className'))
          .toContain('tag-input-container');
      });
    });
  });
});