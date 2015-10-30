/* eslint-disable max-nested-callbacks */
/*global angular, inject*/

import dropdown from '../../src/dropdown';

import util from '../utilities';
import translationMock from '../fixtures/translationFixture.json';

const DROPDOWN = '.dropdown';
const SELECTED_OPTION = '.selected-option';
const DROPDOWN_TOGGLE = '.dropdown-toggle';
const DROPDOWN_MENU = '.dropdown-menu';
const DROPDOWN_INDETERMINATE_PROGRESS = '.dropdown-indeterminate-progress';

describe('akamai.components.dropdown', function() {

  let stateStrings = [
    'Colorado',
    'Connecticut',
    'Maryland',
    'Massachusetts'
  ];

  let stateObjects = [
    {name: 'Colorado'},
    {name: 'Connecticut'},
    {name: 'Maryland'},
    {name: 'Massachusetts'}
  ];

  let stateObjectsWithKeys = [
    {state: {key: 'key1', name: 'components.dropdown.placeholder.filter'}},
    {state: {key: 'key2', name: 'Connecticut'}},
    {state: {key: 'some', name: 'Maine'}}
  ];

  let stateObjectsWithIntegerKeys = [
    {state: {key: 0, name: 'Colorado'}},
    {state: {key: 1, name: 'Connecticut'}}
  ];

  function addElement(markup) {
    this.el = this.$compile(markup)(this.$scope);
    this.$scope.$digest();
    this.element = document.body.appendChild(this.el[0]);
  }

  function getSelectedOptionText() {
    return this.getSelectedOption().text().trim();
  }

  function getDropdownMenu() {
    return util.findElement(this.el, DROPDOWN_MENU);
  }

  function getIndeterminateProgress() {
    return util.findElement(this.el, DROPDOWN_INDETERMINATE_PROGRESS);
  }
  function getDropdownToggle() {
    return util.findElement(this.el, DROPDOWN_TOGGLE);
  }

  function clickDropdownToggle() {
    this.getDropdownToggle().triggerHandler('click');
  }

  function getSelectedOption() {
    return util.findElement(this.el, SELECTED_OPTION);
  }

  beforeEach(function() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(dropdown.name);
    angular.mock.module(function($translateProvider) {
      $translateProvider.translations('en_US', translationMock);
      $translateProvider.useLoader('translateNoopLoader');
    });
    inject(function($rootScope, _$compile_, $httpBackend, $timeout, $document, $q) {
      this.$scope = $rootScope;
      this.$compile = _$compile_;
      this.$timeout = $timeout;
      this.$document = $document;
      this.$q = $q;
      this.$scope.stateStrings = stateStrings;
      this.$scope.stateObjects = stateObjects;
      this.$scope.stateObjectsWithKeys = stateObjectsWithKeys;
      this.$scope.stateObjectsWithIntegerKeys = stateObjectsWithIntegerKeys;

      this.addElement = addElement;
      this.getSelectedOption = getSelectedOption;
      this.getSelectedOptionText = getSelectedOptionText;
      this.clickDropdownToggle = clickDropdownToggle;
      this.getDropdownMenu = getDropdownMenu;
      this.getDropdownToggle = getDropdownToggle;
      this.getIndeterminateProgress = getIndeterminateProgress;
    });
  });

  afterEach(function() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }

    let remainingDropdown = document.querySelector('.dropdown-menu');
    if (remainingDropdown) {
      document.body.removeChild(remainingDropdown);
    }
  });

  describe('given undefined items', function() {
    describe('when the dropdown is rendered', function() {
      beforeEach(function() {
        this.addElement(`<akam-dropdown ng-model="dummyValue"
                                        items="someUndefinedValue"></akam-dropdown>`);
      });

      it('should render successfully with a placeholder string', function() {
        expect(this.getSelectedOptionText()).toBe('Select one');
      });
    });
  });

  describe('given nullable items', function() {
    describe('when the dropdown is rendered', function() {
      beforeEach(function() {
        this.$scope.nullableItems = null;
        this.addElement(`<akam-dropdown ng-model="dummyValue"
                                        items="nullableItems"></akam-dropdown>`);
      });

      it('should render successfully with a placeholder string', function() {
        expect(this.getSelectedOptionText()).toBe('Select one');
      });
    });
  });

  describe('given an undefined value bound to the ng-model attribute', function() {
    describe('when the dropdown is rendered', function() {
      beforeEach(function() {
        this.addElement(`<akam-dropdown ng-model="selectedState"
                                        items="stateStrings"></akam-dropdown>`);
      });

      it('should render with a placeholder string', function() {
        expect(this.getSelectedOptionText()).toBe('Select one');
      });
    });

    describe('when providing a value to ngModel', function() {
      beforeEach(function() {
        this.$scope.selectedState = 'Maryland';
        this.addElement(`<akam-dropdown ng-model="selectedState"
                                        items="stateStrings"></akam-dropdown>`);
      });

      it('should set the dropdown selectedItem property to the value of ngModel', function() {
        expect(this.getSelectedOptionText()).toBe('Maryland');
      });
    });
  });

  describe('given an empty object bound to the ng-model attribute', function() {
    describe('when a value is provided for placeholder attribute', function() {
      beforeEach(function() {
        this.addElement(`<akam-dropdown ng-model="selectedState" placeholder="new placeholder"
                                        items="stateStrings"></akam-dropdown>`);
      });
      it('should render with a placeholder string', function() {
        expect(this.getSelectedOptionText()).toBe('new placeholder');
      });
    });

    describe('when an item is selected', function() {
      beforeEach(function() {
        this.$scope.selectedStateObj = {name: 'Colorado'};

        this.addElement(`<akam-dropdown ng-model="selectedStateObj"
                                        items="stateObjects"></akam-dropdown>`);

        this.clickDropdownToggle();
        util.findElement(this.el, '.dropdown-menu li:last-child a').triggerHandler('mousedown');
      });

      it('should set the selectedItem to the same item that was selected', function() {
        expect(this.$scope.selectedStateObj).toBe(this.$scope.stateObjects[3]);
      });
    });
  });

  describe('given an object bound to the ng-model attribute', function() {
    describe('when the dropdown is rendered', function() {
      beforeEach(function() {
        this.$scope.selectedState = 'Colorado';
        this.addElement(`<akam-dropdown ng-model="selectedState"
                                        items="stateStrings"></akam-dropdown>`);
      });

      it('should render with that value selected', function() {
        expect(this.getSelectedOptionText()).toBe('Colorado');
      });
    });
  });

  describe('given an array bound to the items attribute', function() {
    describe('when the dropdown is rendered', function() {
      beforeEach(function() {
        this.$scope.selectedState = 'Colorado';
        this.addElement(`<akam-dropdown ng-model="selectedState"
                                        items="stateStrings"></akam-dropdown>`);
        this.clickDropdownToggle();
      });
      it('should add the items to the dropdown', function() {
        expect(this.getDropdownMenu().find('li').length)
          .toBe(this.$scope.stateStrings.length + 1);
          // note +1 to include hidden akam-indeterminate-progress
      });
    });
  });

  describe('given a string bound to the text-property attribute', function() {
    describe('when the dropdown is rendered', function() {
      beforeEach(function() {
        this.$scope.selectedStateObj = {name: 'Colorado'};
        this.addElement(`<akam-dropdown ng-model="selectedStateObj" text-property="name"
                                        items="stateObjects"></akam-dropdown>`);
      });
      it('should display each items text-property value', function() {
        expect(this.getSelectedOptionText()).toBe('Colorado');
      });
    });
    describe('when the dropdown is rendered', function() {
      beforeEach(function() {
        this.$scope.stateObjectsLocale = [{name: 'examples.autocomplete.search.states'}];

        this.addElement(`<akam-dropdown ng-model="selectedStateObj" text-property="name"
                                        items="stateObjectsLocale"></akam-dropdown>`);

        this.clickDropdownToggle();
      });
      it('should translate each item if key is valid', function() {
        expect(util.findElement(this.el, 'li a.dropdown-item-link span:first-child')
          .text()).toBe('Search States');
      });
    });
  });

  describe('given a is-disabled=false attribute added', function() {
    describe('when disabled state in dropdown-toggle element when value changes', function() {
      beforeEach(function() {
        this.$scope.selectedStateObj = {name: 'Colorado'};
        this.$scope.disabled = false;
        this.addElement(`<akam-dropdown ng-model="selectedStateObj" is-disabled="disabled"
                                        items="stateStrings"></akam-dropdown>`);
      });

      it('dropdown-toggle element should not have disabled attribute', function() {
        expect(this.getDropdownToggle().attr('disabled')).toBeUndefined();
      });

      it('selected-option element should not have disabled class', function() {
        expect(util.findElement(this.el, '.selected-option.disabled').length).toBe(0);
      });
    });
  });
  describe('given a is-disabled=true attribute added', function() {
    describe('when the disabled state in dropdown-toggle element value changes', function() {
      beforeEach(function() {
        this.$scope.selectedStateObj = {name: 'Colorado'};
        this.$scope.disabled = true;
        this.addElement(`<akam-dropdown ng-model="selectedStateObj" is-disabled="disabled"
                                        items="stateStrings"></akam-dropdown>`);
      });
      it('dropdown-toggle element should have disabled attribute', function() {
        expect(this.getDropdownToggle().attr('disabled')).toBe('disabled');
      });

      it('selected-option element should have disabled class', function() {
        expect(util.findElement(this.el, '.selected-option').prop('classList'))
          .toContain('disabled');
      });

      it('should not open dropdown in the disabled state when click', function() {
        this.clickDropdownToggle();
        expect(util.findElement(this.el, DROPDOWN).prop('classList')).not.toContain('open');
      });
    });
  });

  describe('given an is-readonly attribute', function() {
    describe('when is-readonly is true', function() {
      beforeEach(function() {
        this.$scope.readOnly = true;
        this.addElement(`<akam-dropdown ng-model="selectedStateObj" is-readonly="readOnly"
                                        items="stateStrings"></akam-dropdown>`);
      });
      it('should add the readonly class to the selected-option element', function() {
        expect(util.findElement(this.el, '.selected-option').prop('classList'))
          .toContain('readonly');
      });
    });
  });

  describe('given a clearable attribute', function() {
    describe('when an item is selected', function() {
      beforeEach(function() {
        this.$scope.selectedStateObj = {name: 'Colorado'};
        this.addElement(`<akam-dropdown ng-model="selectedStateObj" clearable
                                        items="stateStrings"></akam-dropdown>`);
      });
      it('should present a clear icon', function() {
        expect(util.findElement(this.el, '.luna-small_close_dark_gray')).not.toBe(null);
      });
    });
  });

  describe('given an appended-to-body attribute', function() {
    describe('when the dropdown is rendered', function() {
      beforeEach(function() {
        this.$scope.selectedStateObj = {name: 'Colorado'};
        this.addElement(`<akam-dropdown ng-model="selectedStateObj" appended-to-body
                                        items="stateStrings"></akam-dropdown>`);
      });
      it('should append the dropdown to the body', function() {
        expect(this.getDropdownMenu()[0]).toBeUndefined();
        expect(util.findElement(angular.element(this.$document[0].body), '.dropdown-menu'))
          .not.toBe(null);
      });
    });
  });

  describe('given custom markup in an akam-dropdown-option', function() {
    describe('when the dropdown is rendered', function() {
      beforeEach(function() {
        this.$scope.selectedState = {name: 'Colorado'};

        let featureDropdownTemplate =
          `<akam-dropdown ng-model="selectedState" text-property="name" items="stateObjects"
                          clearable>
            <akam-dropdown-option>
              <span title="{{item[dropdown.textProperty]}}">
                custom option: {{item[dropdown.textProperty]}}
              </span>
            </akam-dropdown-option>
          </akam-dropdown>`;

        this.addElement(featureDropdownTemplate);
      });
      it('should compile the markup with the parent scope', function() {
        expect(util.findElement(this.el, 'ul.dropdown-menu li span[title=Colorado]')
          .text()
          .trim())
          .toBe('custom option: Colorado');
      });
      it('should use the option custom markup for the selected element', function() {
        expect(util.findElement(this.getSelectedOption(), 'span:first-child').text().trim())
          .toBe('custom option:');
      });
    });
  });

  describe('given custom markup in an akam-dropdown-selected', function() {
    describe('when the dropdown is rendered', function() {
      beforeEach(function() {
        this.$scope.selectedState = {name: 'Colorado'};

        let featureDropdownTemplate = `
          <akam-dropdown ng-model="selectedState" text-property="name" items="stateObjects"
                         clearable>
            <akam-dropdown-selected>
              <span title="{{dropdown.getSelectedItemText()}}">
                custom: {{dropdown.getSelectedItemText()}}
              </span>
              <span ng-if="!dropdown.selectedItem" class="dropdown-placeholder">
                {{::dropdown.placeholder}}
              </span>
            </akam-dropdown-selected>
            <akam-dropdown-option>
              <span title="{{item[dropdown.textProperty]}}">
                custom: {{item[dropdown.textProperty]}}
              </span>
            </akam-dropdown-option>
          </akam-dropdown>`;
        this.addElement(featureDropdownTemplate);
      });
      it('should compile the markup with the parent scope', function() {
        expect(this.getSelectedOption().children(0).text().trim()).toBe('custom: Colorado');
      });
    });
  });

  describe('given a clearable attribute on the akam-dropdown', function() {
    describe('when the clear icon is clicked', function() {
      beforeEach(function() {
        this.$scope.selectedStateObj = {name: 'Colorado'};
        this.addElement(`<akam-dropdown ng-model="selectedStateObj" clearable
                                        items="stateStrings"></akam-dropdown>`);

        util.findElement(this.el, '.clear-dropdown').triggerHandler('click');
      });
      it('should clear the selected item', function() {
        expect(this.$scope.selectedStateObj).toBe(undefined);
      });
    });
  });

  describe('given no placeholder attribute', function() {
    describe('when rendered', function() {
      beforeEach(function() {
        this.addElement(`<akam-dropdown ng-model="selectedState" placeholder=""
                                        items="stateStrings"></akam-dropdown>`);
      });
      it('should render default placeholder', function() {
        expect(util.findElement(this.el, '.dropdown-placeholder').text())
          .toContain('Select one');
      });
    });
  });
  describe('given a placeholder attribute', function() {
    describe('when rendered', function() {
      beforeEach(function() {
        this.addElement(`<akam-dropdown ng-model="selectedState"
                                        placeholder="examples.autocomplete.search.states"
                                        items="stateStrings"></akam-dropdown>`);
      });

      it('should translate placeholder if key is valid', function() {
        expect(util.findElement(this.el, '.dropdown-placeholder').text())
          .toContain('Search States');
      });
    });
  });

  describe('given dropdown with a list of objects with keys', function() {
    describe('when the dropdown is rendered', function() {
      beforeEach(function() {
        this.$scope.selectedStateObj = { selectedState: 'key9' };

        this.addElement(`<akam-dropdown ng-model='selectedStateObj' text-property='state.name'
                                        key-property='state.key' items='stateObjectsWithKeys'
                                        clearable></akam-dropdown>`);
        this.clickDropdownToggle();
      });

      it('should translate text-property for given key-property', function() {
        let option = angular.element(this.getDropdownMenu().find('li')[1]);
        expect(util.findElement(option, 'a > span').attr('title')).toBe('Filter');
      });

      it('should not translate text-property if it is not a valid key', function() {
        let option = angular.element(this.getDropdownMenu().find('li')[2]);
        expect(util.findElement(option, 'a > span').attr('title')).toBe('Connecticut');
      });
    });
  });

  describe('given dropdown with a list of objects with integer keys', function() {
    describe('when the dropdown is rendered', function() {
      beforeEach(function() {
        this.$scope.selectedState = 0;

        this.addElement(`<akam-dropdown ng-model='selectedStateObj' text-property='state.name'
                                        key-property='state.key' clearable
                                        items='stateObjectsWithIntegerKeys'></akam-dropdown>`);
      });

      it('should render the selected item when ng-model is set to 0', function() {
        expect(this.getSelectedOptionText()).toBe('Select one');
      });

    });
  });

  describe('given dropdown with a promise', function() {
    describe('when the dropdown is rendered', function() {
      let itemsDefferal;
      beforeEach(function() {
        this.$scope.selectedState = '';

        itemsDefferal = this.$q.defer();
        this.$scope.itemsPromise = itemsDefferal.promise;

        let markup = `<akam-dropdown ng-model='selectedState' items='itemsPromise'
          clearable></akam-dropdown>`;
        this.addElement(markup);
      });
      it('should not resolve items until promise is resolved', function() {
        expect(this.$scope.itemsPromise).toEqual([]);
      });
      it('should display indeterminate progress until promise is resolved', function() {
        let indeterminate = util.findElement(this.el, 'akam-indeterminate-progress');
        expect(angular.element(indeterminate).attr('completed')).toBe('false');
      });
      it('should resolve items after promise is resolved', function() {
        itemsDefferal.resolve(this.$scope.stateStrings);
        this.$scope.$apply();
        expect(this.$scope.itemsPromise.then).toBeUndefined();
        expect(this.$scope.itemsPromise).toEqual(this.$scope.stateStrings);
      });
      it('should remove indeterminate progress after promise is resolved', function() {
        itemsDefferal.resolve(this.$scope.stateStrings);
        this.$scope.$apply();
        expect(this.getIndeterminateProgress()).toEqual({});
      });
      it('should display error message if promise is rejected', function() {
        itemsDefferal.reject(this.$scope.stateStrings);
        this.$scope.$apply();
        expect(util.find('.dropdown-no-items span').textContent)
          .toBe('An error has occurred while loading data.');
      });
    });
  });
});

