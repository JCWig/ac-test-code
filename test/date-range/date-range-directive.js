/* eslint-disable max-nested-callbacks */
/* globals angular, beforeEach, afterEach, spyOn, jasmine */

import utils from '../utilities';
import dateRange from '../../src/date-range';
import translationMock from '../fixtures/translationFixture.json';
const TABLE_SELECTOR = '.akam-date-range ul.dropdown-menu table';

function getDateButtonParentElement(dateNumber) {
  return document.querySelector("ul.dropdown-menu table tbody tr td.day-" + dateNumber);
}

function clickScrollingButton(isNext) {
  let btnSelector = isNext ? '.next-button' : '.previous-button';
  utils.click(document.querySelector(btnSelector));
  this.$scope.$digest();
}

describe('akamai.components.date-range', function() {

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

  function addElement(markup) {
    markup = markup || `<akam-date-range ng-model="range" min="{{min}}" max="{{max}}"
    is-disabled="disabled" format="{{format}}" on-select="onSelect()" placeholder="{{::placeholder}}"></akam-date-range>`;
    this.el = this.$compile(markup)(this.$scope);
    this.isoScope = this.el.isolateScope();
    this.dateRange = this.isoScope.dateRange;
    this.$scope.$digest();
    this.$timeout.flush();
    this.element = document.body.appendChild(this.el[0]);
  }

  beforeEach(function() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(dateRange.name);
    angular.mock.module(function($translateProvider) {
      $translateProvider.translations('en_US', translationMock);
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
    angular.mock.inject(function($compile, $timeout, $rootScope, dateRangeService) {
      this.$compile = $compile;
      this.$scope = $rootScope.$new();
      this.$timeout = $timeout;
      this.dateRangeService = dateRangeService;

      this.addElement = addElement;
      this.getDateButtonParentElement = getDateButtonParentElement;
      this.clickScrollingButton = clickScrollingButton;
    });
  });

  describe('given ngModel undefined', () => {
    describe('when dateRange rendered', () => {
      beforeEach(function() {
        this.$scope.dr = undefined;
        this.addElement();
        spyOn(this.dateRange, 'initialize');
        this.$scope.$digest();
      });
      it('should dateRange controller created', function() {
        expect(this.dateRange).not.toBe(undefined);
      });
      it('should dateRange API ngModel object to be undefined', function() {
        expect(this.dateRange.dateRange).toBe(undefined);
      });
      it('should dateRange initalize function never called', function() {
        expect(this.dateRange.initialize).not.toHaveBeenCalled();
      });
    });
  });

  describe('given DateRangeController initialized', () => {
    describe('when dateRange rendered', () => {
      beforeEach(function() {
        this.$scope.dateRange = {};
        this.addElement();
      });
      it('should verify DateRangeController all injectors', function() {
        expect(this.dateRange.scope).not.toBe(undefined);
        expect(this.dateRange.$log).not.toBe(undefined);
        expect(this.dateRange.$timeout).not.toBe(undefined);
        expect(this.dateRange.dateFilter).not.toBe(undefined);
        expect(this.dateRange.$rootScope).not.toBe(undefined);
        expect(this.dateRange.$translate).not.toBe(undefined);
        expect(this.dateRange.dateRangeService).not.toBe(undefined);
      });
    });
  });

  describe('given initial invalid (undefined)ngModel startDate and endDate', () => {
    describe('when dateRange rendered and DateRangeController initialized', () => {
      beforeEach(function() {
        this.$scope.range = {};
        this.addElement();
      });
      it('should dateRange initalized value to be true', function() {
        expect(this.dateRange.initialized).toBe(true);
      });
      it('should dateRange format to be default value', function() {
        expect(this.dateRange.format).toMatch(/EEE, MMM dd, yyyy/);
      });
      it('should dateRange min to be empty', function() {
        expect(this.dateRange.min).toBe('');
      });
      it('should dateRange max to be empty', function() {
        expect(this.dateRange.max).toBe('');
      });
      it('should dateRange selectedValue to be empty', function() {
        expect(this.dateRange.selectedValue).toBe('');
      });
      it('should dispaly placeholder element', function() {
        expect(this.element.querySelector('.date-range-placeholder')).not.toBe(null);
      });
      it('should not dispaly inut element', function() {
        expect(this.element.querySelector('.dateRange-input')).toBe(null);
      });
    });
  });

  describe('given date range placeholder empty value', () => {
    describe('when dateRange rendered', () => {
      let placeholder;
      beforeEach(function() {
        let markup = `<akam-date-range ng-model="range" placeholder=""></akam-date-range>`;
        this.$scope.range = {};
        this.addElement(markup);
        placeholder = this.element.querySelector('.date-range-placeholder');
      });
      it('should placeholder field value be translated and displays', function() {
        expect(placeholder.textContent).toMatch(/Select From Date - Select To Date/);
      });
      it('should dateRange placeholder value be translated', function() {
        expect(this.dateRange.placeholder).toMatch(/Select From Date - Select To Date/);
      });
    });
  });

  describe('given date range placeholder value', () => {
    describe('when dateRange rendered', () => {
      let placeholder;
      beforeEach(function() {
        this.$scope.range = {};
        this.$scope.placeholder = "Select date range."
        this.addElement();
        placeholder = this.element.querySelector('.date-range-placeholder');
      });
      it('should placeholder field displays as it is', function() {
        expect(placeholder.textContent).toMatch(/Select date range/);
      });
      it('should dateRange placeholder value same as value passed in', function() {
        expect(this.dateRange.placeholder).toMatch(/Select date range/);
      });
    });
  });

  describe('given is-disabled=true in markup', () => {
    describe('when dateRange rendered', () => {
      let wrapper, buttonElem, iconElem;
      beforeEach(function() {
        this.$scope.range = {};
        this.$scope.disabled = true;
        this.addElement();
        wrapper = this.element.querySelector('.date-range-wrapper');
        buttonElem = wrapper.querySelector('.btn.date-range-button');
        iconElem = this.element.querySelector('.luna-calendar');
      });
      it('should wrapper element has class disabled', function() {
        expect(wrapper.classList).toContain("disabled");
      });
      it('should button element has disabled attribute', function() {
        expect(buttonElem.disabled).toBe(true);
      });
      it('should icon element has disabled attribute', function() {
        expect(iconElem.disabled).toBe(true);
      });
    });
  });

  describe('given dateRange', () => {
    describe('when rendered', () => {
      describe('click button to open', () => {
        beforeEach(function() {
          this.$scope.range = {
            startDate: new Date('9/20/2015'),
            endDate: new Date('10/20/2015')
          };
          this.addElement();
          spyOn(this.dateRange, 'toggle').and.callThrough();
          utils.click(".date-range-wrapper button");
          this.$scope.$digest();
        });
        it('should daterange wrapper parent div has open class', function() {
          expect(this.element.querySelector('.akam-date-range').classList).toContain("opened");
        });
        it('should daterange toggle function to have been called', function() {
          expect(this.dateRange.toggle).toHaveBeenCalled();
        });
        it('should daterange controller opened property to be set to true', function() {
          expect(this.dateRange.opened).toBe(true);
        });
      });
    });
  });

  describe('given dateRange and is-disabled=true', () => {
    describe('when rendered', () => {
      describe('click button to open', () => {
        beforeEach(function() {
          this.$scope.range = {
            startDate: new Date('9/20/2015'),
            endDate: new Date('10/20/2015')
          };
          this.$scope.disabled = true;
          this.addElement();
          utils.click(".date-range-wrapper button");
          this.$scope.$digest();
        });
        it('should daterange wrapper parent div has no open class', function() {
          expect(this.element.querySelector('.akam-date-range').classList).not.toContain("opened");
        });
        it('should daterange controller opened property to be set to true', function() {
          expect(this.dateRange.opened).toBe(false);
        });
      });
    });
  });

  describe('given dateRange', () => {
    describe('when rendered and click button to open', () => {
      describe('select a calendar button', () => {
        beforeEach(function() {
          this.$scope.range = {
            startDate: new Date('9/20/2015'),
            endDate: new Date('10/20/2015')
          };
          this.addElement();
          utils.click(".date-range-wrapper button");
          this.$scope.$digest();
          this.getDateButtonParentElement(10).querySelector(".btn");
          this.$scope.$digest();
        });
        it('should daterange wrapper parent div has open class', function() {
          expect(this.element.querySelector('.akam-date-range').classList).toContain("opened");
        });
      });
    });
  });

  describe('given is-disabled=false in markup', () => {
    describe('when dateRange rendered', () => {
      describe('change is-disabled=true', () => {
        let wrapper, buttonElem, iconElem;
        beforeEach(function() {
          this.$scope.range = {};
          this.$scope.disabled = false;
          this.addElement();
          this.$scope.disabled = true;
          this.$scope.$digest();
          wrapper = this.element.querySelector('.date-range-wrapper');
          buttonElem = wrapper.querySelector('.btn.date-range-button');
          iconElem = this.element.querySelector('.luna-calendar');
        });
        it('should wrapper element has class disabled', function() {
          expect(wrapper.classList).toContain("disabled");
        });
        it('should button element has disabled attribute', function() {
          expect(buttonElem.disabled).toBe(true);
        });
        it('should icon element has disabled attribute', function() {
          expect(iconElem.disabled).toBe(true);
        });
      });
    });
  });

  describe("given format='EEE, MMM d, y'", () => {
    describe('when dateRange rendered', () => {
      describe('click a calendar button', function() {
        let inputValueElem, inputElem;
        beforeEach(function() {
          let d = new Date();
          this.$scope.range = {
            startDate: new Date('9/20/2015'),
            endDate: new Date('10/20/2015')
          };
          this.$scope.format = 'EEE, MMM d, y';
          this.addElement();
          let btnElem = this.getDateButtonParentElement(10).querySelector(".btn");
          utils.click(btnElem);
          this.$scope.$digest();
          inputValueElem = this.element.querySelector('.dateRange-input');
          d.setDate(10);
          inputElem = this.element.querySelector('.akam-date-range input');
        });
        it('should datepicker input datepicker-popup value matches format', function() {
          expect(inputElem.getAttribute("datepicker-popup")).toBe(this.$scope.format);
        });
        it('should dateRange selectedValue matches', function() {
          expect(new Date(this.dateRange.selectedValue).getDate()).toBe(10);
        });
        it('should input field dispaly correct formatted value ', function() {
          expect(new Date(inputValueElem.textContent).getDate()).toBe(10);
        });
      })
    });
  });

  describe("given default format value", () => {
    describe('when dateRange rendered', () => {
      describe('when change format value', function() {
        let inputValueElem, inputElem;
        beforeEach(function() {
          let d = new Date();
          this.$scope.range = {
            startDate: new Date('9/20/2015'),
            endDate: new Date('10/20/2015')
          };
          this.addElement();
          spyOn(this.dateRangeService, 'getSelectedDateRange');
          this.$scope.format = 'MMMM d, y';
          this.$scope.$digest();
        });
        it('should daterngeService getSelectedDateRange to have been called', function() {
          expect(this.dateRangeService.getSelectedDateRange).toHaveBeenCalled();
        });
      })
    });
  });

  describe('given initial valid ngModel startDate and endDate', () => {
    describe('when dateRange rendered and DateRangeController initialized', () => {
      beforeEach(function() {
        this.$scope.range = {
          startDate: new Date('9/20/2015'),
          endDate: new Date('10/20/2015')
        };
        this.addElement();
      });
      it('should dateRange selectedValue not to be empty', function() {
        expect(this.dateRange.selectedValue).toBe('Sun, Sep 20, 2015 - Tue, Oct 20, 2015');
      });
      it('should not dispaly placeholder element', function() {
        expect(this.element.querySelector('.date-range-placeholder')).toBe(null);
      });
      it('should dispaly inut element', function() {
        expect(this.element.querySelector('.dateRange-input')).not.toBe(null);
      });
    });
  });
  describe('given initial valid ngModel startDate and invalid endDate', () => {
    describe('when dateRange rendered and DateRangeController initialized', () => {
      beforeEach(function() {
        this.$scope.range = {
          startDate: new Date('9/20/2015'),
          endDate: ''
        };
        this.addElement();
      });
      it('should dateRange selectedValue have imcomplete range value', function() {
        expect(this.dateRange.selectedValue).toBe('Sun, Sep 20, 2015');
      });
      it('should not dispaly placeholder element', function() {
        expect(this.element.querySelector('.date-range-placeholder')).toBe(null);
      });
      it('should dispaly inut element', function() {
        expect(this.element.querySelector('.dateRange-input')).not.toBe(null);
      });
      it('should have class of "invalid-date-range"', function() {
        expect(this.element.querySelector('.date-range-wrapper').classList)
          .toContain('invalid-date-range');
      });
    });
  });

  describe('given ngModel startDate greater than endDate', () => {
    describe('when dateRange rendered', () => {
      beforeEach(function() {
        this.$scope.range = {
          startDate: new Date('10/20/2015'),
          endDate: new Date('9/20/2015')
        };;
        this.addElement();
      });
      it('should dateRange controller startDate and endDate value reversed', function() {
        expect(this.dateRange.dateRange.startDate).toEqual(new Date('9/20/2015'));
        expect(this.dateRange.dateRange.endDate).toEqual(new Date('10/20/2015'));
      });
    });
  });

  describe('given dateRange onSelect', () => {
    describe('when rendered and click button to open', () => {
      describe('select a calendar button', () => {
        beforeEach(function() {
          this.$scope.range = {
            startDate: new Date('10/20/2015'),
            endDate: new Date('9/20/2015')
          };
          this.$scope.onSelect = jasmine.createSpy('spy');
          this.addElement();
          utils.click(".date-range-wrapper button");
          this.$scope.$digest();
          this.getDateButtonParentElement(16).querySelector(".btn");
          this.$scope.$digest();
          this.$timeout.flush();
        });
        it('should onSelect function have been callled', function() {
          expect(this.$scope.onSelect).toHaveBeenCalled();
        });
      });
    });
  });

  describe('given dateRange', () => {
    describe('when rendered and click button to open', () => {
      describe('select 2 calendar buttons sequentially ', () => {
        let inputValueElem, inputElem;
        beforeEach(function() {
          let d = new Date();
          this.$scope.range = {
            startDate: new Date('9/20/2015'),
            endDate: new Date('10/20/2015')
          };
          this.addElement();
          let btnElem = this.getDateButtonParentElement(10).querySelector(".btn");
          utils.click(btnElem);
          this.$scope.$digest();
          this.$timeout.flush();
          btnElem = this.getDateButtonParentElement(12).querySelector(".btn");
          utils.click(btnElem);
          this.$timeout.flush(601);
        });
        it('should dateRange selectedValue to be set', function() {
          expect(this.dateRange.selectedValue).toContain(" - ");
        });
        it('should dateRange startDate to be set', function() {
          expect(this.dateRange.dateRange.startDate).not.toBe(null);
        });
        it('should dateRange endDate to be set', function() {
          expect(this.dateRange.dateRange.endDate).not.toBe(null);
        });
      })
    });
  });

  describe("give no attributes for min and max values", () => {
    describe("when rendered", () => {
      let btnElem;
      beforeEach(function() {
        this.$scope.range = {
          startDate: '',
          endDate: ''
        };
        this.addElement();
        btnElem = this.getDateButtonParentElement(10).querySelector(".btn");
      });
      it("should be able to select any dates", () => {
        expect(btnElem.getAttribute('disabled')).toBe(null);
      });
    });
  });
  describe("give only valid min value", () => {
    describe("when rendered", () => {
      let btnElem;
      beforeEach(function() {
        this.$scope.range = {
          startDate: new Date('8/20/2015'),
          endDate: new Date('9/20/2015')
        };
        let d = new Date(this.$scope.range.startDate);
        d.setDate(this.$scope.range.startDate.getDate() +1);
        this.$scope.min = d;
        this.addElement();
        btnElem = this.getDateButtonParentElement(
          this.$scope.range.startDate.getDate()).querySelector(".btn");
      });
      it("should calendar btn outside the min date has disabled attribute", () => {

        expect(btnElem.getAttribute('disabled')).toBe('disabled');
      });
    });
  });
  describe("give only valid max value", () => {
    describe("when rendered", () => {
      let btnElem;
      beforeEach(function() {
        this.$scope.range = {
          startDate: new Date('8/20/2015'),
          endDate: new Date('8/25/2015')
        };
        let d = new Date(this.$scope.range.endDate);
        d.setDate(this.$scope.range.endDate.getDate() -1);
        this.$scope.max = d;
        this.addElement();
        btnElem = getDateButtonParentElement(
          this.$scope.range.endDate.getDate()).querySelector(".btn");
      });
      it("should calendar btn outside the max date has no disabled attribute", () => {
        expect(btnElem.getAttribute('disabled')).toBe('disabled');
      });
    });
  });

  describe("give only valid min value", () => {
    describe("when rendered", () => {
      describe("reassign min date dynamically", function() {
        let btnElem;
        beforeEach(function() {
          this.$scope.range = {
            startDate: new Date('8/20/2015'),
            endDate: new Date('9/20/2015')
          };
          this.$scope.min = new Date('8/15/2015');
          let origMinDate = this.$scope.min.getDate();
          this.addElement();
          this.$scope.min.setDate(origMinDate+5)
          btnElem = this.getDateButtonParentElement(origMinDate).querySelector(".btn");
        });
        it("should calendar resets the selection and display current month", () => {
          expect(btnElem.getAttribute('disabled')).not.toBe('disabled');
        });
      });
    });
  });

  describe("give valid min value and max", () => {
    describe("when rendered", () => {
      describe("reassign min date value grater then current min date dynamically", () => {
        let btnElem, newMinValue;
        beforeEach(function() {
          let d = new Date();
          this.$scope.range = {
            startDate: new Date('8/20/2015'),
            endDate: new Date('8/23/2015')
          };
          this.$scope.min = d;
          this.$scope.min.setDate(10);
          this.addElement();
          this.$scope.min.setDate(15);
          this.$scope.$digest();
          btnElem = this.getDateButtonParentElement(14).querySelector(".btn");
          newMinValue = new Date(this.dateRange.min.replace(/^"(.+)"$/, '$1'));
        });
        it("should calendar btn outside the min date has disabled attribute", () => {
          expect(btnElem.getAttribute('disabled')).toBe('disabled');
        });
        it("should dateRange min value changed to be new value", function() {
          expect(newMinValue.getDate()).toBe(this.$scope.min.getDate());
        });
      });
    });
  });

  describe("give valid min value and max", () => {
    describe("when rendered", () => {
      describe("reassign max date value less then current max date dynamically", () => {
        let btnElem, newMaxValue;
        beforeEach(function() {
          let d = new Date();
          this.$scope.range = {
            startDate: new Date('8/20/2015'),
            endDate: new Date('8/23/2015')
          };
          this.$scope.max = d;
          this.$scope.max.setDate(20);
          this.addElement();
          this.$scope.max.setDate(15);
          this.$scope.$digest();
          btnElem = this.getDateButtonParentElement(16).querySelector(".btn");
          newMaxValue = new Date(this.dateRange.max.replace(/^"(.+)"$/, '$1'));
        });
        it("should calendar btn outside the max date has disabled attribute", () => {
          expect(btnElem.getAttribute('disabled')).toBe('disabled');
        });
        it("should dateRange max value changed to be new value", function() {
          expect(newMaxValue.getDate()).toBe(this.$scope.max.getDate());
        });
      });
    });
  });

  describe("give min date value ", () => {
    describe("when rendered", () => {
      describe("change new selected start date earlier than given min date", function() {
        let inputField, placeholderField;
        beforeEach(function() {
          this.$scope.range = {
            startDate: '',
            endDate: ''
          };
          this.$scope.min = new Date("December 25, 2013");
          this.$scope.max = new Date("December 25, 2014");
          this.addElement();
          this.$scope.range = {
            startDate: new Date("December 26, 2013"),
            endDate: new Date("December 26, 2014")
          };
          this.$scope.$digest();
          this.$scope.min = new Date("December 27, 2013");
          this.$scope.$digest();
          placeholderField = this.element.querySelector(".date-range-placeholder");
          inputField = this.element.querySelector(".date-range-input");
        });
        it("Should not display date input field", () => {
          expect(placeholderField).not.toBe(null);
        });
        it("Should display the date placeholder field", () => {
          expect(inputField).toBe(null);
        });
      });
    });
  });

  describe("given max date value ", () => {
    describe("when rendered", () => {
      describe("change new selected end date later than given max date", function() {
        let inputField, placeholderField;
        beforeEach(function() {
          this.$scope.range = {
            startDate: '',
            endDate: ''
          };
          this.$scope.min = new Date("December 25, 2013");
          this.$scope.max = new Date("December 25, 2014");
          this.addElement();
          this.$scope.range = {
            startDate: new Date("December 24, 2013"),
            endDate: new Date("December 24, 2014")
          };
          this.$scope.$digest();
          this.$scope.max = new Date("December 23, 2014");
          this.$scope.$digest();
          placeholderField = this.element.querySelector(".date-range-placeholder");
          inputField = this.element.querySelector(".date-range-input");
        });
        it("Should not display date input field", () => {
          expect(placeholderField).not.toBe(null);
        });
        it("Should display the date placeholder field", () => {
          expect(inputField).toBe(null);
        });
      });
    });
  });

  describe('given daterange', () => {
    describe('when rendered and open', () => {
      describe('press keyboard keys down key', () => {
        beforeEach(function() {
          this.$scope.keydown = jasmine.createSpy('keydown');
          this.$scope.range = {
            'startDate': '',
            'endDate': ''
          };
          this.addElement();
          utils.click(".date-range-wrapper button");
          let elem = this.element.querySelector(".dropdown-menu li > div");
          angular.element(elem).bind("keydown", this.$scope.keydown);
        });
        it('should not trigger date-range keydown event when press down-arrow key 40', function() {
          utils.keyDown(".akam-date-range .dropdown-menu", 40);
          this.$scope.$digest();

          expect(this.$scope.keydown).not.toHaveBeenCalled();
        });
        it('should not trigger date-range keydown event when press up-arrow key 38', function() {
          utils.keyDown(".akam-date-range .dropdown-menu", 38);
          this.$scope.$digest();

          expect(this.$scope.keydown).not.toHaveBeenCalled();
        });
        it('should not trigger date-range keydown event when press left-arrow key 37', function() {
          utils.keyDown(".akam-date-range .dropdown-menu", 37);
          this.$scope.$digest();

          expect(this.$scope.keydown).not.toHaveBeenCalled();
        });
        it('should not trigger date-range keydown event when press right-arrow key 39', function() {
          utils.keyDown(".akam-date-range .dropdown-menu", 39);
          this.$scope.$digest();

          expect(this.$scope.keydown).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('given date range', () => {
    describe('when rendered and open', () => {
      describe('clicking on the calendar empty space area', () => {
        beforeEach(function() {
          this.$scope.range = {
            'startDate': '',
            'endDate': ''
          };
          this.addElement();

          utils.click(".date-range-wrapper button");
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
  });

  describe('given date range', () => {
    describe('when rendered and daterange template loaded', () => {
      beforeEach(function() {
        this.$scope.range = {
          'startDate': '',
          'endDate': ''
        };
        this.addElement();
      });
      it('should datepicker.js scope variable renderDateRange flag be set to true', function() {
        let dpScope = angular.element(this.element.querySelector(TABLE_SELECTOR)).scope();
        expect(dpScope.renderDateRange).toBe(true);
      });
      it('should dateRange specific element to be rendered', function() {
        expect(this.element.querySelector('.akam-date-range ul.dropdown-menu table')).not.toBe(null);
      });
    });
  });

  describe('given datepicker decorator', () => {
    describe('when daterange rendered', () => {
      describe('click button to open', () => {
        let datepicikerScope;
        beforeEach(function() {
          this.$scope.range = {
            'startDate': '',
            'endDate': ''
          };
          this.addElement();
          datepicikerScope = angular.element(this.element.querySelector(TABLE_SELECTOR)).scope();
          spyOn(datepicikerScope, 'isInRange');
          spyOn(datepicikerScope, 'isStart');
          spyOn(datepicikerScope, 'isEnd');
          utils.click(".date-range-wrapper button");
          this.$scope.$digest();
        });
        it('should verify all the decorator functions', () => {
          expect(datepicikerScope.isInRange).toHaveBeenCalled();
          expect(datepicikerScope.isStart).toHaveBeenCalled();
          expect(datepicikerScope.isEnd).toHaveBeenCalled();
        });
      });
    });
  });
  describe('given datepicker decorator', () => {
    describe('when daterange rendered and open', () => {
      describe('click previous button', () => {
        let datepicikerScope, date;
        beforeEach(function() {
          this.$scope.range = {
            'startDate': '',
            'endDate': ''
          };
          date = new Date();
          this.addElement();
          datepicikerScope = angular.element(this.element.querySelector(TABLE_SELECTOR)).scope();
          utils.click(".date-range-wrapper button");
          this.$scope.$digest();
          this.clickScrollingButton(false);
        });
        it('should move previous be only decrement one month', () => {
          expect(datepicikerScope.datepicker.activeDate.getMonth() + 1).toBe(date.getMonth());
        });
      });
    });
  });

  describe('given datepicker decorator', () => {
    describe('when daterange rendered and open', () => {
      describe('click next button', () => {
        let datepicikerScope, date;
        beforeEach(function() {
          date = new Date();
          this.addElement();
          datepicikerScope = angular.element(this.element.querySelector(TABLE_SELECTOR)).scope();
          utils.click(".date-range-wrapper button");
          this.$scope.$digest();
          this.clickScrollingButton(true);
        });
        it('should click next button be only increment one month', () => {
          expect(datepicikerScope.datepicker.activeDate.getMonth() - 1).toBe(date.getMonth());
        });
      });
    });
  });

  describe('given datepicker decorator and dateRange selected', () => {
    describe('when rendered and open', () => {
      let datepicikerScope, date;
      beforeEach(function() {
        this.$scope.range = {
          startDate: new Date('9/20/2015'),
          endDate: new Date('10/20/2015')
        };
        this.addElement();
        datepicikerScope = angular.element(this.element.querySelector(TABLE_SELECTOR)).scope();
        spyOn(datepicikerScope, 'dateSelect').and.callThrough();
        let btnElem = this.getDateButtonParentElement(10).querySelector(".btn");
        utils.click(btnElem);
        this.$scope.$digest();
        this.$timeout.flush();
        btnElem = this.getDateButtonParentElement(12).querySelector(".btn");
        utils.click(btnElem);
        this.$timeout.flush(601);
      });
      it('should datepicker scope dateSelect function to be callled', () => {
        expect(datepicikerScope.dateSelect).toHaveBeenCalled();
      });
    });
  });

  describe('given datepicker decorator and dateRange selected', () => {
    describe('when rendered and open', () => {
      describe('select endDate earlier than startDate', () => {
        let datepicikerScope, date;
        beforeEach(function() {
          this.$scope.range = {
            startDate: new Date('9/20/2015'),
            endDate: new Date('10/20/2015')
          };
          this.addElement();
          datepicikerScope = angular.element(this.element.querySelector(TABLE_SELECTOR)).scope();
          spyOn(datepicikerScope, 'dateSelect').and.callThrough();
          let btnElem = this.getDateButtonParentElement(12).querySelector(".btn");
          utils.click(btnElem);
          this.$scope.$digest();
          this.$timeout.flush();
          btnElem = this.getDateButtonParentElement(10).querySelector(".btn");
          utils.click(btnElem);
          this.$timeout.flush(601);
        });
        it('should datepicker scope selectedStart and selectedEnd values be swapped', () => {
          expect(datepicikerScope.selectedStart).toEqual(new Date("9/10/2015"));
          expect(datepicikerScope.selectedEnd).toEqual(new Date("9/12/2015"));
        });
      });
    });
  });
  describe('given datepicker decorator', () => {
    describe('when rendered and close', () => {
      let datepicikerScope, date;
      beforeEach(function() {
        this.$scope.range = {
          startDate: new Date('1/1/2015'),
          endDate: new Date('1/20/2016')
        };
        this.addElement();
        datepicikerScope = angular.element(this.element.querySelector(TABLE_SELECTOR)).scope();
        spyOn(datepicikerScope, "$destroy");
        datepicikerScope.$destroy();
      });
      it('should datepicker scope $destroy be called ', function() {
        expect(datepicikerScope.$destroy).toHaveBeenCalled();
      });
    });
  });
});
