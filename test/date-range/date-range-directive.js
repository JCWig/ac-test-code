/* eslint-disable max-nested-callbacks */
/* globals angular, beforeEach, afterEach, spyOn, jasmine */

import utils from '../utilities';
import dateRange from '../../src/date-range';

function getDateButtonParentElement(dateNumber) {
  return document.querySelector("ul.dropdown-menu table tbody tr td.day-" + dateNumber);
}

describe('akamai.components.date-range', function() {

  afterEach(function() {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    this.element = null;
  });

  function addElement(markup) {
    this.el = this.$compile(markup)(this.$scope);
    this.$scope.$digest();
    this.$timeout.flush();
    this.element = document.body.appendChild(this.el[0]);
  }

  beforeEach(function() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(dateRange.name);
    angular.mock.module(function($translateProvider) {
      $translateProvider.useLoader('translateNoopLoader');
    });
    angular.mock.module(function($provide) {
      function datepickerDirective($delegate, $timeout) {
        let directive = $delegate[0];
        let link = directive.link;
        directive.compile = () => {
          return function(scope, element, attrs, ctrl) {
            link.apply(this, arguments);
            scope.renderDateRange = true;
          };
        }
        return $delegate;
      }
      datepickerDirective.$inject = ['$delegate', '$timeout'];

      $provide.decorator('datepickerDirective', datepickerDirective);
    });
    angular.mock.inject(function($compile, $timeout, $rootScope) {
      this.$compile = $compile;
      this.$scope = $rootScope.$new();
      this.$timeout = $timeout;
    });
  });

  describe("when date range rendering with default values", function() {
    beforeEach(function() {
      this.$scope.dateRange = {
        startDate: '',
        endDate: ''
      };
      let markup = `<akam-date-range ng-model='dateRange'></akam-date-range>`;
      addElement.call(this, markup);
    });

    it('should verify date range component', function() {
      expect(this.element.querySelector('.akam-date-range').children.length).toBeGreaterThan(0);
    });

    it('should verify date range input element', function() {
      expect(this.element.querySelector('.range-picker input')).not.toBe(null);
    });

    it('should verify date range selection element', function() {
      expect(this.element.querySelector('.range-selection')).not.toBe(null);
    });

    it('should render placeholder element only', function() {
      expect(this.element.querySelector('.date-range-placeholder')).not.toBe(null);
    });

    it('should render button and calendar icon', function() {
      expect(this.element.querySelector('.range-selection button')).not.toBe(null);
      expect(this.element.querySelector('.range-selection button i.luna-calendar')).not.toBe(null);
    });
  });

  describe("when date range rendering with disabled true state", function() {
    beforeEach(function() {
      this.$scope.dateRange = {
        startDate: '',
        endDate: ''
      };
      this.$scope.disabled = true;
      let markup = `<akam-date-range ng-model='dateRange' is-disabled='disabled'></akam-date-range>`;
      addElement.call(this, markup);
    });

    it('should verify disabled class', function() {
      expect(this.element.querySelector('.range-selection.disabled')).not.toBe(null);
    });

    it('should verify button disabled attribute', function() {
      expect(this.element.querySelector('.range-selection button').getAttribute('disabled')).not.toBe(null);
    });

    it('should verify icon disabled attribute', function() {
      expect(this.element.querySelector('.range-selection i').getAttribute('disabled')).not.toBe(null);
    });
  });

  describe("when verify date range open state with selection", function() {
    beforeEach(function() {
      this.$scope.dateRange = {
        startDate: '',
        endDate: ''
      };
      let markup = `<akam-date-range ng-model='dateRange'></akam-date-range>`;
      addElement.call(this, markup);
    });

    it('should verify open classes before or after click on calendar button', function() {
      expect(this.element.querySelector('.akam-date-range.open')).toBe(null);

      let btnElem = this.element.querySelector('.range-selection button');
      utils.click(btnElem);
      this.$scope.$digest();

      expect(this.element.querySelector('.akam-date-range.opened')).not.toBe(null);

      utils.click(btnElem);
      this.$scope.$digest();

      expect(this.element.querySelector('.akam-date-range.opened')).toBe(null);

    });

    it('should verify open classes before or after click on range field', function() {
      expect(this.element.querySelector('.akam-date-range.open')).toBe(null);

      let rangeElem = this.element.querySelector('.range-selection .range-start');
      utils.click(rangeElem);
      this.$scope.$digest();

      expect(this.element.querySelector('.akam-date-range.opened')).not.toBe(null);

      utils.click(rangeElem);
      this.$scope.$digest();

      expect(this.element.querySelector('.akam-date-range.opened')).toBe(null);

    });
  });

  describe("when date range rendering with preloaded values", function() {
    beforeEach(function() {
      let d = new Date();
      let startDate = new Date(d.getFullYear(), d.getMonth(), 3);
      let endDate = new Date(d.getFullYear(), d.getMonth() + 1, 5);
      this.$scope.dateRange = {
        startDate: startDate,
        endDate: endDate
      };
      let markup = `<akam-date-range ng-model='dateRange'></akam-date-range>`;
      addElement.call(this, markup);
    });

    it('should verify selected field element', function() {
      expect(this.element.querySelector('.range-selection .range-start')).not.toBe(null);
    });

    it('should verify selected field preloaded value', function() {
      expect(this.element.querySelector('.range-selection .range-start').textContent).not.toBe('');
    });

    it('should verify range selected', function() {
      expect(this.element.querySelector('.range-selection .range-start span').getAttribute('title')).not.toBe(null);
    });
  });

  describe("after render, the date range isolated scope controller...", function() {
    let dateRange;
    beforeEach(function() {
      this.$scope.dateRange = {
        startDate: '',
        endDate: ''
      };
      let markup = `<akam-date-range ng-model='dateRange'></akam-date-range>`;
      addElement.call(this, markup);
      dateRange = this.el.isolateScope().dateRange;

    });

    it('should verify correct properties and values from controller', function() {
      expect(dateRange.opened).not.toBe(undefined);
      expect(dateRange.rangeStart).not.toBe(undefined);
      expect(dateRange.dateRange.startDate).not.toBe(undefined);
      expect(dateRange.dateRange.endDate).not.toBe(undefined);
      expect(dateRange.rangeStart.minDate).not.toBe(null);
      expect(dateRange.rangeStart.maxDate).not.toBe(null);
      expect(dateRange.rangeStart.selectedValue).toBe('');
      expect(dateRange.rangeSelected).toBeFalsy();
      expect(dateRange.options).not.toBe(undefined);
    });

    it('should verify correct methods from controller', function() {
      expect(dateRange.toggle).not.toBe(undefined);
      expect(angular.isFunction(dateRange.toggle)).toBe(true);
      expect(dateRange.preventOtherEvents).not.toBe(undefined);
      expect(angular.isFunction(dateRange.preventOtherEvents)).toBeTruthy();
    });


    it('should verify the APIs values if not provided in directive', function() {
      expect(dateRange.dateRange).not.toBe(undefined);
      expect(angular.isObject(dateRange.dateRange)).toBeTruthy();
      expect(angular.isObject(dateRange.dateRange.startDate)).toBeFalsy();
      expect(angular.isObject(dateRange.dateRange.endDate)).toBeFalsy();
      expect(dateRange.isDisabled).toBeFalsy();
      expect(dateRange.placeholder).toBe(undefined);
      expect(dateRange.format).not.toBe(undefined);
      expect(dateRange.format).toEqual('EEE, MMM dd, yyyy');
      expect(dateRange.minDate).toBe(undefined);
      expect(dateRange.maxDate).toBe(undefined);
      expect(angular.isFunction(dateRange.onSelect)).toBeTruthy();
    });

    it('should verify toggle function to be called if calendar button click', function() {

      let btnElem = this.element.querySelector('.range-selection button');
      let toggleSpy = spyOn(dateRange, "toggle");

      utils.click(btnElem);
      this.$scope.$digest();

      expect(toggleSpy).toHaveBeenCalled();
    });

  });
  describe("Verify preload data from controller rangeSelectied ", function() {
    let dateRange;
    let d = new Date();
    let startDate = new Date(d.getFullYear(), d.getMonth(), 3);
    let endDate = new Date(d.getFullYear(), d.getMonth() + 1, 5);
    beforeEach(function() {
      this.$scope.dateRange = {
        startDate: startDate,
        endDate: endDate
      };
      let markup = `<akam-date-range ng-model='dateRange'></akam-date-range>`;
      addElement.call(this, markup);
      dateRange = this.el.isolateScope().dateRange;
    });

    it('should verify selected property to truthy if preloaded data', function() {
      expect(dateRange.rangeSelected).toBeTruthy();
    });
  });
  describe("Verify preload data from controller rangeSelectied ", function() {

    let dateRange;
    let d = new Date();
    let startDate = new Date(d.getFullYear(), d.getMonth(), 3);
    let endDate = new Date(d.getFullYear(), d.getMonth() + 1, 5);
    beforeEach(function() {
      this.$scope.dateRange = {
        startDate: startDate,
        endDate: endDate
      };
      this.$scope.disabled = true;
      this.$scope.placeholder = "blah blah";
      this.$scope.format = 'MMM dd, yyyy';
      let markup = `<akam-date-range ng-model='dateRange' is-disabled='disabled' placeholder='placeholder' format='format'></akam-date-range>`;
      addElement.call(this, markup);
      dateRange = this.el.isolateScope().dateRange;
    });

    it('should verify the APIs value if provided in directive', function() {

      expect(dateRange.dateRange).not.toBe(undefined);
      expect(angular.isObject(dateRange.dateRange)).toBeTruthy();
      expect(angular.isObject(dateRange.dateRange.startDate)).not.toBe('');
      expect(angular.isObject(dateRange.dateRange.endDate)).not.toBe('');
      expect(angular.isDate(new Date(dateRange.dateRange.startDate))).toBeTruthy();
      expect(angular.isDate(new Date(dateRange.dateRange.endDate))).toBeTruthy();
      expect(dateRange.isDisabled).toBeTruthy();
      expect(angular.isFunction(dateRange.onSelect)).toBeTruthy();
    });
  });

  describe("Verify control id  ", function() {

    let dateRange;
    let d = new Date();
    let startDate = new Date(d.getFullYear(), d.getMonth(), 3);
    let endDate = new Date(d.getFullYear(), d.getMonth() + 1, 5);
    beforeEach(function() {
      this.$scope.dateRange = {
        startDate: startDate,
        endDate: endDate
      };
      let markup = `<akam-date-range ng-model='dateRange'></akam-date-range>`;
      addElement.call(this, markup);
      dateRange = this.el.isolateScope().dateRange;
    });

    it('should verify id is required to handle event', function() {
      expect(dateRange.id).not.toBe(undefined);
    })

    it('should verify id can not be undefined to handle event', function() {
      dateRange.id = undefined;
      this.$scope.$digest();

      expect(dateRange.id).toBe(undefined);
      expect(dateRange.startDate).toBe(undefined);
      expect(dateRange.endDate).toBe(undefined);
    });

    it('should verify id is required to be same as created and cached to handle event', function() {
      dateRange.id = 1234;
      this.$scope.$digest();

      expect(dateRange.startDate).toBe(undefined);
      expect(dateRange.endDate).toBe(undefined);
    });
  });

  describe("Verify dropdown child elements before and after date range open...", function() {
    beforeEach(function() {
      this.$scope.dateRange = {
        startDate: '',
        endDate: ''
      };
      let markup = `<akam-date-range ng-model='dateRange'></akam-date-range>`;
      addElement.call(this, markup);

    });

    it('should verify selected-start and in-range elements not present when range not selected', function() {
      let startSelector = `.range-picker .dropdown-menu button.selected-start`;
      let inRangeSelector = `.range-picker .dropdown-menu button.in-range`;
      let dateBtnElem1 = this.element.querySelector(startSelector);
      let dateBtnElem2 = this.element.querySelector(inRangeSelector);
      let btnElem = this.element.querySelector('.range-selection button');

      utils.click(btnElem);
      this.$scope.$digest();

      expect(dateBtnElem1).toBe(null);
      expect(dateBtnElem2).toBe(null);
    });

  });

  describe("Checking min and max APIs", function() {
    describe("given no min and max attributes in the directive", function() {
      let btnElem;
      beforeEach(function() {
        let d = new Date("08/09/1999");
        this.$scope.date = d;
        let markup = `<akam-date-range ng-model='date'></akam-date-range>`;
        addElement.call(this, markup);
        btnElem = getDateButtonParentElement(10).querySelector(".btn");
      });
      it("should be able to select any dates", function() {
        expect(btnElem.getAttribute('disabled')).toBe(null);
      });
    });
  });
  describe("Checking min and max APIs", function() {
    describe("given min and max attributes no values assigned in the directive", function() {
      let btnElem;
      beforeEach(function() {
        let d = new Date("08/09/1999");
        this.$scope.date = d;
        let markup = `<akam-date-range ng-model='date' min max></akam-date-range>`;
        addElement.call(this, markup);
        btnElem = getDateButtonParentElement(10).querySelector(".btn");
      });
      it("should be able to select any dates", function() {
        expect(btnElem.getAttribute('disabled')).toBe(null);
      });
    });
  });
  describe("Checking min and max APIs", function() {
    describe("given min and max attributes empty values in the directive", function() {
      let btnElem;
      beforeEach(function() {
        let d = new Date("08/09/1999");
        this.$scope.date = d;
        let markup = `<akam-date-range ng-model='date' min='' max=''></akam-date-range>`;
        addElement.call(this, markup);
        btnElem = getDateButtonParentElement(10).querySelector(".btn");
      });
      it("should be able to select any dates", function() {
        expect(btnElem.getAttribute('disabled')).toBe(null);
      });
    });
  });

  describe("Verify minDate and maxDate updates dynamically...", function() {
    let dateRange;
    let d = new Date("08/09/2015");
    let min = new Date(d.getFullYear() - 2, d.getMonth(), 1);
    let max = new Date(d.getFullYear() + 2, d.getMonth(), 0);
    beforeEach(function() {
      this.$scope.dateRange = {
        startDate: '',
        endDate: ''
      };
      this.$scope.min = min;
      this.$scope.max = max
      let markup = `<akam-date-range ng-model='dateRange' min="{{min | date: 'yyyy-MM-dd'}}" max="{{max | date: 'yyyy-MM-dd'}}"></akam-date-range>`;
      addElement.call(this, markup);
      dateRange = this.el.isolateScope().dateRange;
    });

    it('should verify min-date and max-date values from input element', function() {
      let inputElem = this.element.querySelector('.range-picker input');
      let minDateString = inputElem.getAttribute('min-date');
      let maxDateString = inputElem.getAttribute('max-date');

      expect(minDateString).not.toBe(null);
      expect(maxDateString).not.toBe(null);

      expect(minDateString).toBe('2013-08-01');
      expect(maxDateString).toBe('2017-07-31');

    });

    it('should verify controller min and max values', function() {

      expect(dateRange.min).not.toBe(null);
      expect(dateRange.max).not.toBe(null);

      expect(dateRange.min).toBe('2013-08-01');
      expect(dateRange.max).toBe('2017-07-31');

    });

    it('should verify input min-date changed when scope min changed', function() {
      let min = new Date('December 25, 1995');
      this.$scope.min = min;
      this.$scope.$digest();

      let inputElem = this.element.querySelector('.range-picker input');
      let d = new Date(inputElem.getAttribute('min-date'));

      expect(d.getFullYear()).toBe(1995);
      expect(d.getMonth()).toBe(11);
    });

    it('should verify date button disabled with outside the date range when scope min changed', function() {
      let date = new Date();
      let min = new Date(date.getFullYear(), date.getMonth(), 5);

      this.$scope.min = min;
      this.$scope.$digest();

      let btnElem = getDateButtonParentElement('04').querySelector("button");
      expect(btnElem.getAttribute("disabled")).toBe("disabled");

    });
    it('should verify date button disabled outside the date range when scope max changed', function() {
      let date = new Date();
      let max = new Date(date.getFullYear(), date.getMonth(), 10);

      this.$scope.max = max;
      this.$scope.$digest();

      let btnElem = getDateButtonParentElement("11").querySelector("button");
      expect(btnElem.getAttribute("disabled")).toBe("disabled");

    });
  });

  describe("DateRange reset from min date changes ", function() {
    describe("given min date value", function() {
      describe("if new selected start date earlier than given min date", function() {
        let startDateValueField, dateRange;
        beforeEach(function() {
          this.$scope.dateRange = {
            startDate: '',
            endDate: ''
          };
          this.$scope.min = new Date("December 25, 2013");
          this.$scope.max = new Date("December 25, 2014");
          let markup = `<akam-date-range ng-model='dateRange' min="min" max="max"></akam-date-range>`;
          addElement.call(this, markup);
          dateRange = this.el.isolateScope().dateRange;
          this.$scope.dateRange = {
            startDate: new Date("December 26, 2013"),
            endDate: new Date("December 26, 2014")
          };
          this.$scope.$digest();
          this.$scope.min = new Date("December 27, 2013");
          this.$scope.$digest();
          startDateValueField = this.element.querySelectorAll(".range-selection span")[0];
        });
        it("Should date range start date field gets reset to original", function() {
          expect(startDateValueField.textContent).toBe("components.date-range.placeholder");
        });
        it("Should date range start date selected value being empty", function() {
          expect(dateRange.rangeStart.selectedValue).toBe("");
        });
      });
    });
  });

  describe("DateRange reset from max date changes ", function() {
    describe("given max date value", function() {
      describe("if new selected end date later than given max date", function() {
        let dateRange, endDateValueField;
        beforeEach(function() {
          this.$scope.dateRange = {
            startDate: '',
            endDate: ''
          };
          this.$scope.min = new Date("December 25, 2013");
          this.$scope.max = new Date("December 25, 2014");
          let markup = `<akam-date-range ng-model='dateRange' min="min" max="max"></akam-date-range>`;
          addElement.call(this, markup);
          dateRange = this.el.isolateScope().dateRange;
          this.$scope.dateRange = {
            startDate: new Date("December 24, 2013"),
            endDate: new Date("December 24, 2014")
          };
          this.$scope.$digest();
          this.$scope.max = new Date("December 23, 2014");
          this.$scope.$digest();
          endDateValueField = this.element.querySelectorAll(".range-selection span")[1];
        });
        it("Should date range start date field gets reset to original", function() {
          expect(endDateValueField.textContent).toBe("components.date-range.placeholder");
        });
        it("Should date range start date selected value being empty", function() {
          expect(dateRange.rangeEnd.selectedValue).toBe("");
        });
      });
    });
  });

  describe("Verify correct element rendered ", function() {
    let dateRangeMarkup;

    beforeEach(function() {
      dateRangeMarkup = '<div id="parent-element"><akam-date-range ng-model="dateRange"></akam-date-range></div>';
    });

    it('should verify date range element rendered and date picker element is not', function() {
      addElement.call(this, dateRangeMarkup);

      let dateRangeElem = this.element.querySelector(`.akam-date-range .dropdown-menu`);
      expect(dateRangeElem).not.toBe(null);
    });
  });

  describe("after render, the date range isolated scope controller...", function() {
    let dateRange, isoScope;
    beforeEach(function() {
      this.$scope.dateRange = {
        startDate: '2015-9-1',
        endDate: '2015-9-15'
      };
      let markup = `<akam-date-range ng-model='dateRange'></akam-date-range>`;
      addElement.call(this, markup);
      isoScope = this.el.isolateScope();
      dateRange = isoScope.dateRange;
    });

    it('should verify scope function setRangeValues to be called if calendar date selected', function() {

      expect(dateRange.rangeSelected).toBeTruthy();
      expect(dateRange.rangeStart.selectedValue).toBe('2015-9-1');
      expect(dateRange.rangeEnd.selectedValue).toBe('2015-9-15');

    });

    it('should verify removing handler get called when isolated scope $destroyed', function() {

      expect(dateRange.rangeSelectedEvent).not.toBe(undefined);

      let rangeSelectedEventMethod = spyOn(dateRange, "rangeSelectedEvent");

      let btnElem = this.element.querySelector('.range-selection button');
      utils.click(btnElem);
      this.$scope.$digest();

      isoScope.$destroy();

      expect(rangeSelectedEventMethod).toHaveBeenCalled();
    });

  });

  describe('given daterange', function() {
    describe('when daterange open', function() {
      describe('press keyboard keys down key', function() {
        beforeEach(function() {
          this.$scope.keydown = jasmine.createSpy('keydown');
          this.$scope.dateRange = {
            'startDate': '',
            'endDate': ''
          };
          var markup = '<akam-date-range ng-model="dateRange"></akam-date-range>';
          addElement.call(this, markup);
          utils.click(".range-selection button");
          let elem = this.element.querySelector(".dropdown-menu li > div");
          angular.element(elem).bind("keydown", this.$scope.keydown);
        });
        it('should not trigger date-range keydown event when press down-arrow key 40', function() {
          utils.keyDown(".range-picker .dropdown-menu", 40);
          this.$scope.$digest();

          expect(this.$scope.keydown).not.toHaveBeenCalled();
        });
        it('should not trigger date-range keydown event when press up-arrow key 38', function() {
          utils.keyDown(".range-picker .dropdown-menu", 38);
          this.$scope.$digest();

          expect(this.$scope.keydown).not.toHaveBeenCalled();
        });
        it('should not trigger date-range keydown event when press left-arrow key 37', function() {
          utils.keyDown(".range-picker .dropdown-menu", 37);
          this.$scope.$digest();

          expect(this.$scope.keydown).not.toHaveBeenCalled();
        });
        it('should not trigger date-range keydown event when press right-arrow key 39', function() {
          utils.keyDown(".range-picker .dropdown-menu", 39);
          this.$scope.$digest();

          expect(this.$scope.keydown).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("given one date value", function() {
    describe('start date has initial value, end date undefined', function() {
      describe('when daterange rendered', function() {
        let dateRange, dateFieldElems;
        beforeEach(function() {
          this.$scope.dateRange = {
            startDate: '2015-9-1',
            endDate: undefined
          };
          this.$scope.format = 'M/d/yy';
          let markup = `<akam-date-range ng-model='dateRange' format="{{format}}"></akam-date-range>`;
          addElement.call(this, markup);
          dateRange = this.el.isolateScope().dateRange;
          dateFieldElems = this.element.querySelectorAll(".range-selection span");
        });
        it("should render start date selected element only", function() {
          expect(dateFieldElems[0].classList.contains("date-range-placeholder")).not.toBe(true);
        });
        it("should render end date element with placeholder element", function() {
          expect(dateFieldElems[1].classList.contains("date-range-placeholder")).toBe(true);
        });
        it("should start date with placeholder element contain 'util-ellipsis' class", function() {
          expect(dateFieldElems[0].classList.contains("util-ellipsis")).toBe(true);
        });
        it("should end date with placeholder element contain 'util-ellipsis' class", function() {
          expect(dateFieldElems[1].classList.contains("util-ellipsis")).toBe(true);
        });
        it("should dateRange controller rangeStart.selectedValue match initial value", function() {
          expect(dateRange.rangeStart.selectedValue).toBe("2015-9-1")
        });
        it("should dateRange controller rangeEnd selectedValue match undefined", function() {
          expect(dateRange.rangeEnd.SelectedValue).toBe(undefined);
        });
        it("should dateRange controller rangeSelected be false", function() {
          expect(dateRange.rangeSelected).toBe(false);
        });
      });
    });
  });

  describe("given one date value", function() {
    describe('end date has initial value, start date undefined', function() {
      describe('when daterange rendered', function() {
        let dateRange, dateFieldElems;
        beforeEach(function() {
          this.$scope.dateRange = {
            startDate: undefined,
            endDate: '2015-9-1'
          };
          this.$scope.format = 'M/d/yy';
          let markup = `<akam-date-range ng-model='dateRange' format="{{format}}"></akam-date-range>`;
          addElement.call(this, markup);
          dateRange = this.el.isolateScope().dateRange;
          dateFieldElems = this.element.querySelectorAll(".range-selection span");
        });
        it("should render end date selected element only", function() {
          expect(dateFieldElems[1].classList.contains("date-range-placeholder")).not.toBe(true);
        });
        it("should render start date element with placeholder element", function() {
          expect(dateFieldElems[0].classList.contains("date-range-placeholder")).toBe(true);
        });
        it("should dateRange controller rangeEnd.selectedValue match initial value", function() {
          expect(dateRange.rangeEnd.selectedValue).toBe("2015-9-1")
        });
        it("should dateRange controller rangeStart selectedValue match undefined", function() {
          expect(dateRange.rangeStart.SelectedValue).toBe(undefined);
        });
        it("should dateRange controller rangeSelected be false", function() {
          expect(dateRange.rangeSelected).toBe(false);
        });
      });
    });
  });

  describe('given an open date range calendar', function() {
    describe('when clicking on the calendar eampty space area', function() {
      beforeEach(function() {
        let markup = `<akam-date-range ng-model='dateRange'></akam-date-range>`;
        addElement.call(this, markup);

        utils.click(".range-selection button");
        this.$scope.$digest();

        let spaceColumn = document.querySelector("ul.dropdown-menu table tbody tr td.space");
        utils.click(spaceColumn);
        this.$scope.$digest();
      });
      it('should calendar remain open', function() {
        expect(this.element.querySelector('.akam-date-range').classList).toContain("opened");
      });
    });
  });

  describe('given date range calendar rendered', function() {
    describe('verify date range template part to be used', function() {
      beforeEach(function() {
        let markup = `<akam-date-range ng-model='dateRange'></akam-date-range>`;
        addElement.call(this, markup);
      });
      it('should datepicker.js childScope renderDateRange flag should be set to true', function() {
        let dpScope = angular.element(this.element.querySelector('.akam-date-range ul.dropdown-menu table')).scope();
        expect(dpScope.renderDateRange).toBe(true);
      });
      it('should dateRange specific DOM element to be rendered', function() {
        expect(this.element.querySelector('.akam-date-range .range-picker ul.dropdown-menu table')).not.toBe(null);
      });
    });
  });
});
