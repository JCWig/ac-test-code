/* eslint-disable max-nested-callbacks */
/* globals angular, beforeEach, afterEach, spyOn, jasmine */

import utils from '../utilities';
import dateRange from '../../src/date-range';
import datePicker from '../../src/date-picker';

const LIBRARY_PATH = /\/libs\/akamai-core\/[0-9]*.[0-9]*.[0-9]*\/locales\/en_US.json/,
  CONFIG_PATH = '/apps/appname/locales/en_US.json';

describe('akamai.components.date-range', function() {

  afterEach(function() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
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
    angular.mock.module(datePicker.name);
    angular.mock.module(function($provide, $translateProvider) {
      $translateProvider.useLoader('i18nCustomLoader');
    });

    angular.mock.inject(function($compile, $timeout, $rootScope, $httpBackend) {
      this.$compile = $compile;
      this.$scope = $rootScope.$new();
      this.$timeout = $timeout;

      $httpBackend.when('GET', LIBRARY_PATH).respond({});
      $httpBackend.when('GET', CONFIG_PATH).respond({});
      $httpBackend.flush();
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

    it('should verify ctrl id is required to handle event', function() {

    })
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
      let markup = `<akam-date-range ng-model='dateRange' min-date="{{min | date: 'yyyy-MM-dd'}}" max-date="{{max | date: 'yyyy-MM-dd'}}"></akam-date-range>`;
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

    it('should verify controller minDate and maxDate values', function() {

      expect(dateRange.minDate).not.toBe(null);
      expect(dateRange.maxDate).not.toBe(null);

      expect(dateRange.minDate).toBe('2013-08-01');
      expect(dateRange.maxDate).toBe('2017-07-31');

    });

  });

  describe("Verify correct element rendered ", function() {
    let datePickerMarkup, dateRangeMarkup;

    beforeEach(function() {
      datePickerMarkup = '<div id="parent-element"><akam-date-picker mode="month" ng-model="value"></akam-date-picker></div>';
      dateRangeMarkup  = '<div id="parent-element"><akam-date-range ng-model="dateRange"></akam-date-range></div>';
    });

    it('should verify date picker element rendered and date range element is not', function() {
      addElement.call(this, datePickerMarkup);

      let dateRangeElem = this.element.querySelector(`.akam-date-range .dropdown-menu`);
      let datePickerElem = this.element.querySelector(`.akam-date-picker.month .dropdown-menu`);

      expect(dateRangeElem).toBe(null);
      expect(datePickerElem).not.toBe(null);

    });

    it('should verify date range element rendered and date picker element is not', function() {
      addElement.call(this, dateRangeMarkup);

      let dateRangeElem = this.element.querySelector(`.akam-date-range .dropdown-menu`);
      let datePickerElem = this.element.querySelector(`.akam-date-picker.month .dropdown-menu`);

      expect(datePickerElem).toBe(null);
      expect(dateRangeElem).not.toBe(null);

    });
  });
});
