/* eslint-disable max-nested-callbacks */
/*global angular, inject*/

import autocomplete from '../../src/autocomplete';

import util from '../utilities';
import translationMock from '../fixtures/translationFixture.json';

describe('akamai.components.autocomplete', function() {

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

  function addElement(markup) {
    this.el = this.$compile(markup)(this.$scope);
    this.$scope.$digest();
    this.element = document.body.appendChild(this.el[0]);
  }

  function loadStateStrings() {
    let deferral = this.$q.defer();

    deferral.resolve(stateStrings);
    return deferral.promise;
  }

  function loadStateObjects() {
    let deferral = this.$q.defer();

    deferral.resolve(stateObjects);
    return deferral.promise;
  }

  beforeEach(function() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(autocomplete.name);

    angular.mock.module(function($translateProvider) {
      $translateProvider.translations('en_US', translationMock);
      $translateProvider.useLoader('translateNoopLoader');
    });

    inject(function($rootScope, $compile, $httpBackend, $timeout, $q) {
      this.$scope = $rootScope;
      this.$compile = $compile;
      this.$timeout = $timeout;
      this.$q = $q;
      this.$scope.foo = 'migbar';

      this.$scope.loadStateStrings = angular.bind(this, loadStateStrings);
      this.$scope.loadStateObjects = angular.bind(this, loadStateObjects);
      this.$scope.selectedState = undefined;
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

  describe('given an empty object bound to the ng-model attribute', function() {
    describe('when the autocomplete is rendered', function() {
      beforeEach(function() {
        addElement.call(this, `<akam-autocomplete ng-model="selectedState"
                                                  on-search="loadStateStrings(searchTerm)">
                               </akam-autocomplete>`);
      });

      it('should rendered with a placeholder string', function() {
        expect(document.querySelector('.selected-option').textContent).toContain('Select one');
      });
    });
  });

  describe('given an empty object bound to the ng-model attribute', function() {
    describe('when the autocomplete is rendered', function() {
      describe('and a string is to the placeholder attribute', function() {
        beforeEach(function() {
          let autocompleteTemplate = `
            <akam-autocomplete ng-model="selectedState"
                               placeholder="new placeholder"
                               on-search="loadStateStrings(searchTerm)">
            </akam-autocomplete>`;

          addElement.call(this, autocompleteTemplate);
        });

        it('should render with a placeholder string', function() {
          expect(document.querySelector('.selected-option').textContent)
            .toContain('new placeholder');
        });
      });
    });
  });

  describe('given an string bound to the ng-model attribute', function() {
    describe('when the autocomplete is rendered', function() {
      beforeEach(function() {
        this.$scope.selectedState = 'Colorado';
        let autocompleteTemplate = `
            <akam-autocomplete ng-model="selectedState" on-search="loadStateStrings(searchTerm)">
            </akam-autocomplete>`;

        addElement.call(this, autocompleteTemplate);
      });

      it('should render with that value selected', function() {
        expect(document.querySelector('.selected-option').textContent).toContain('Colorado');
      });
    });
  });

  describe('given an array returned by the on-search promise', function() {
    describe('when the autocomplete is rendered', function() {
      beforeEach(function() {
        this.$scope.selectedState = 'Colorado';
        let autocompleteTemplate = `
            <akam-autocomplete ng-model="selectedState" on-search="loadStateStrings(searchTerm)">
            </akam-autocomplete>`;

        addElement.call(this, autocompleteTemplate);
        util.findElement(this.el, 'input.autocomplete-search').triggerHandler('keyup');
      });

      it('should add the items to the autocomplete', function() {
        expect(util.find('.dropdown-menu').getElementsByTagName('li').length)
          .toBe(stateObjects.length);
      });
    });
  });

  describe('given a string bound to the text-property attribute', function() {
    describe('when the autocomplete is rendered', function() {
      beforeEach(function() {
        this.$scope.selectedStateObj = {name: 'Colorado'};

        let autocompleteTemplate = `
            <akam-autocomplete ng-model="selectedStateObj"
                               on-search="loadStateObjects(searchTerm)"
                               text-property="name">
            </akam-autocomplete>`;

        addElement.call(this, autocompleteTemplate);

      });

      it('should display each items text-property value', function() {
        expect(util.find('.selected-option').textContent).toContain('Colorado');
      });
    });
  });

  describe('given a is-disabled=false attribute added', function() {
    describe('when the autocomplete is rendered', function() {
      describe('disabled state in dropdown-toggle element when value changes', function() {
        beforeEach(function() {
          this.$scope.selectedStateObj = {name: 'Colorado'};
          this.$scope.disabled = false;

          let autocompleteTemplate = `
            <akam-autocomplete ng-model="selectedStateObj"
                               on-search="loadStateObjects(searchTerm)"
                               is-disabled="disabled">
            </akam-autocomplete>`;

          addElement.call(this, autocompleteTemplate);
        });
        it('dropdown-toggle element should not have disabled attribute', function() {
          expect(util.find('.dropdown-toggle').getAttribute('disabled')).toBe(null);
        });

        it('selected-option element should not have disabled class', function() {
          expect(util.find('.selected-option.disabled')).toBe(null);
        });
      });
    });
  });

  describe('given a is-disabled=true attribute added', function() {
    describe('when the autocomplete is rendered', function() {
      describe('disabled state in dropdown-toggle element when value changes', function() {
        beforeEach(function() {
          this.$scope.selectedStateObj = {name: 'Colorado'};
          this.$scope.disabled = true;
          let autocompleteTemplate = `
            <akam-autocomplete ng-model="selectedStateObj"
                               on-search="loadStateObjects(searchTerm)"
                               is-disabled="disabled">
            </akam-autocomplete>`;

          addElement.call(this, autocompleteTemplate);
        });
        it('dropdown-toggle element should have disabled attribute', function() {
          expect(util.find('.dropdown-toggle').getAttribute('disabled')).toBe('disabled');
        });

        it('selected-option element should have disabled class', function() {
          expect(util.find('.selected-option.disabled')).not.toBe(null);
        });

        it('should not open dropdown in the disabled state when click', function() {
          util.click('.selected-option');
          expect(util.find('.selected-option').classList).not.toContain('ng-hide');
        });
      });
    });
  });

  describe('given a clearable attribute', function() {
    describe('when the autocomplete is rendered', function() {
      describe('and some item is selected', function() {
        beforeEach(function() {
          this.$scope.selectedStateObj = {name: 'Colorado'};
          let autocompleteTemplate = `
            <akam-autocomplete ng-model="selectedStateObj"
                               on-search="loadStateObjects(searchTerm)" clearable>
            </akam-autocomplete>`;

          addElement.call(this, autocompleteTemplate);
        });
        it('should present a clear icon', function() {
          expect(util.find('.luna-small_close_dark_gray')).not.toBe(null);
        });
      });
    });
  });

  describe('given an append-to-body attribute', function() {
    describe('when the autocomplete is rendered', function() {
      beforeEach(function() {
        this.$scope.selectedStateObj = {name: 'Colorado'};
        let autocompleteTemplate = `
            <akam-autocomplete ng-model="selectedStateObj"
                               on-search="loadStateObjects(searchTerm)" append-to-body>
            </akam-autocomplete>`;

        addElement.call(this, autocompleteTemplate);
        this.$timeout.flush();
      });
      it('should append the dropdown to the body', function() {
        let dropdownMenuNormal = document.querySelector('.dropdown').
          querySelector('.dropdown-menu');

        expect(dropdownMenuNormal).toBe(null);
        expect(util.find('body > .dropdown-menu')).not.toBe(null);
      });
    });
  });

  describe('given custom markup in an akam-autocomplete-option', function() {
    describe('when the dropdown is rendered', function() {
      beforeEach(function() {
        this.$scope.selectedState = {name: 'Colorado'};
        this.$scope.foo = 'bar';
        let autocompleteTemplate = `
          <akam-autocomplete ng-model="selectedState" text-property="name"
                             on-search="loadStateObjects(searchTerm)">

            <akam-autocomplete-option>
              <span title="custom: {{ autocomplete.textPropertyFn(item) }}"
                    ng-bind-html="'custom: ' + autocomplete.textPropertyFn(item) + foo"></span>
            </akam-autocomplete-option>
          </akam-autocomplete>`;

        addElement.call(this, autocompleteTemplate);
        util.findElement(this.el, 'input.autocomplete-search').triggerHandler('keyup');
      });
      it('should compile the markup with the parent scope', function() {
        let optionElem = util.findElement(this.el, 'ul.dropdown-menu > li > a > span');

        expect(optionElem.html()).toBe('custom: Coloradobar');
      });
    });
  });

  describe('given custom markup in an akam-dropdown-selected', function() {
    describe('when the autocomplete is rendered', function() {
      beforeEach(function() {
        this.$scope.selectedState = {name: 'Colorado'};
        this.$scope.foo = 'bar';
        let autocompleteTemplate = `
          <akam-autocomplete ng-model="selectedState" text-property="name"
                             on-search="loadStateObjects(searchTerm)">

            <akam-autocomplete-selected>
                <span ng-if="autocomplete.selectedItem">
                    custom: {{foo + ' ' + autocomplete.getSelectedItemText()}}
                </span>
            </akam-autocomplete-selected>

            <akam-autocomplete-option>
              <span title="custom: {{ autocomplete.textPropertyFn(item) }}"
                    ng-bind-html="'custom: ' + autocomplete.textPropertyFn(item) + foo"></span>
            </akam-autocomplete-option>

          </akam-autocomplete>`;

        addElement.call(this, autocompleteTemplate);
      });
      it('should compile the markup with the parent scope', function() {
        let selected = util.findElement(this.el, 'span.selected-option');

        expect(selected.text().trim()).toBe('custom: bar Colorado');
      });
    });
  });

  describe('given a clearable attribute on the akam-dropdown', function() {
    describe('when the autocomplete is rendered', function() {
      describe('and some item is selected', function() {
        describe('and the clear icon is clicked', function() {
          beforeEach(function() {
            this.$scope.selectedStateObj = {name: 'Colorado'};
            let autocompleteTemplate = `
              <akam-autocomplete ng-model="selectedStateObj"
                                 on-search="loadStateObjects(searchTerm)" clearable>
              </akam-autocomplete>`;

            addElement.call(this, autocompleteTemplate);
            util.click(util.find('.luna-small_close_dark_gray'));
          });
          it('should clear the selected item', function() {
            expect(this.$scope.selectedStateObj).toBe(undefined);
          });
        });
      });
    });
  });

  describe('when the autocomplete is rendered', function() {
    describe('and a placeholder attribute is not provided', function() {
      beforeEach(function() {
        let autocompleteTemplate = `
            <akam-autocomplete ng-model="selectedState"
                               placeholder=""
                               on-search="loadStateStrings(searchTerm)">
            </akam-autocomplete>`;

        addElement.call(this, autocompleteTemplate);
      });
      it('should render default placeholder', function() {
        expect(util.find('.dropdown-placeholder').textContent).toContain('Select one');
      });
    });

    describe('and placeholder attribute is provided', function() {
      beforeEach(function() {
        let autocompleteTemplate = `
            <akam-autocomplete ng-model="selectedState"
                               placeholder="examples.autocomplete.search.states"
                               on-search="loadStateStrings(searchTerm)">
            </akam-autocomplete>`;

        addElement.call(this, autocompleteTemplate);
      });
      it('should translate placeholder if key is valid', function() {
        expect(util.find('.dropdown-placeholder').textContent).toContain('Search States');
      });
    });

    describe('and placeholder attribute is provided', function() {
      beforeEach(function() {
        let autocompleteTemplate = `
            <akam-autocomplete ng-model="selectedState"
                               placeholder="invalidKey"
                               on-search="loadStateStrings(searchTerm)">
            </akam-autocomplete>`;

        addElement.call(this, autocompleteTemplate);
      });
      it('should translate and display key if key is invalid', function() {
        expect(util.find('.dropdown-placeholder').textContent).toContain('invalidKey');
      });
    });
  });

  describe('given minimum-search set to 3', function() {
    describe('when a search term of length is 2', function() {
      let ctrl;
      beforeEach(function() {
        spyOn(this.$scope, 'loadStateStrings');
        addElement.call(this, `<akam-autocomplete ng-model="selectedState"
                                                  minimum-search="3"
                                                  on-search="loadStateStrings(searchTerm)">
                               </akam-autocomplete>`);
        ctrl = this.el.controller('akamAutocomplete');
        ctrl.searchTerm = 'Ne';
        ctrl.search();
      });

      it('should not call the onSearch callback', function() {
        expect(this.$scope.loadStateStrings).not.toHaveBeenCalled();
      });

      it('should not show the menu', function() {
        expect(ctrl.isOpen).toBe(false);
      });
    });
    describe('when a search term of length is 3', function() {
      let ctrl;
      beforeEach(function() {
        spyOn(this.$scope, 'loadStateStrings').and.returnValue([]);
        addElement.call(this, `<akam-autocomplete ng-model="selectedState"
                                                  minimum-search="3"
                                                  on-search="loadStateStrings(searchTerm)">
                               </akam-autocomplete>`);
        ctrl = this.el.controller('akamAutocomplete');
        ctrl.searchTerm = 'New';
        ctrl.search();
      });

      it('should not call the onSearch callback', function() {
        expect(this.$scope.loadStateStrings).toHaveBeenCalled();
      });

      it('should show the menu', function() {
        expect(ctrl.isOpen).toBe(true);
      });
    });

  });

});
