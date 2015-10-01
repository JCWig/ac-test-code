'use strict';
var utilities = require('../utilities');

var TOGGLE_DATE_PICKER_BUTTON = 'button.button';
var DATE_PICKER = 'ul.dropdown-menu';
var HEADER_DISPLAYED_ON_DATEPICKER = 'button.btn strong.ng-binding';
var NAVIGATE_DATEPICKER_BACKWARDS = 'button.pull-left';
var NAVIGATE_DATEPICKER_FORWARDS = 'button.pull-right';

function getDateButtonParentElement(date) {
  let selector = `${DATE_PICKER} table tbody tr td.month-${date.getMonth() + 1}.day-${date.getDate()}`;
  return document.querySelector(selector);
}

function getMonthButtonParentElement(monthName) {
  return document.querySelector(DATE_PICKER + " table tbody tr td.month-" + monthName);
}

describe('akam-date-picker', function() {
  var compile = null;
  var scope = null;
  var timeout = null;
  var self = this;

  function setUpKeyboardEventForDate(dateValue, selector, key) {
    scope.date = new Date(dateValue);
    var markup = '<div id="parent-element"><akam-date-picker mode="day" ng-change="mychange(value)" ng-model="date"></akam-date-picker></div>';
    addElement(markup);
    utilities.click(TOGGLE_DATE_PICKER_BUTTON);

    utilities.keyDown(selector, key);
    scope.$digest();
  }

  function setUpKeyboardEventForMonth(dateValue, selector, key) {
    scope.date = new Date(dateValue);
    var markup = '<div id="parent-element"><akam-date-picker mode="month" keydown="arrowKeyCallback" ng-change="mychange(value)" ng-model="date"></akam-date-picker></div>';
    addElement(markup);
    utilities.click(TOGGLE_DATE_PICKER_BUTTON);

    utilities.keyDown(selector, key);
    scope.$digest();
  }

  beforeEach(function() {
    inject.strictDi(true);
    angular.mock.module(require('../../src/date-picker').name);
    angular.mock.module(function($translateProvider) {
      $translateProvider.useLoader('translateNoopLoader');
    });
    inject(function($compile, $rootScope, $timeout, $httpBackend) {
      compile = $compile;
      scope = $rootScope.$new();
      timeout = $timeout;
    });
    scope.mychange = function() {};
    self = this;
  });

  afterEach(function() {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    self.element = null;
  });

  function addElement(markup) {
    self.el = compile(markup)(scope);
    scope.$digest();
    timeout.flush();
    self.element = document.body.appendChild(self.el[0]);
    self.isoScope = self.el.isolateScope();
  }

  function setMinMaxSpecValues(value, type) {
    let date = new Date();
    scope.min = new Date(date.setDate(5));
    scope.max = new Date(date.setDate(10));
    let markup = `<akam-date-picker ng-model='date' min="{{min}}" max="{{max}}"></akam-date-picker>`;
    addElement(markup);
    spyOn(self.isoScope, 'clearDate');
    utilities.click(TOGGLE_DATE_PICKER_BUTTON);
    var btnElem = getDateButtonParentElement(utilities.generateDate(8)).querySelector('button');
    utilities.click(btnElem);
    scope.$digest();

    if (type === 'min') {
      scope.min = new Date(date.setDate(value));
    }
    else if (type === 'max') {
      scope.max = new Date(date.setDate(value));
    }
    scope.$digest();
  }

  describe('when date picker is loaded', function() {
    beforeEach(function() {
      var markup = '<div id="parent-element"><akam-date-picker mode="day" ng-model="picked1" ng-change="mychange()"></akam-date-picker><div id="hi">hello</div></div>';
      addElement(markup);

      utilities.click(TOGGLE_DATE_PICKER_BUTTON);

      var datePicker = document.querySelector(DATE_PICKER);
      expect(datePicker.getAttribute('style')).toContain('display: block');
      timeout.flush(0);
      utilities.clickAwayCreationAndClick('div');
    });
    it('should hide the date-picker upon click away', function() {
      var datePicker = document.querySelector(DATE_PICKER);
      expect(datePicker).toBe(null);
    });
  });

  describe('when interacting with month picker', function() {
    beforeEach(function() {
      var markup = '<div id="parent-element"><akam-date-picker mode="month" ng-change="mychange()" ng-model="picked1"></akam-date-picker></div>';
      spyOn(scope, 'mychange');
      addElement(markup);
      utilities.click(TOGGLE_DATE_PICKER_BUTTON);
    });
    it('should change year left when prompted', function() {
      utilities.click(NAVIGATE_DATEPICKER_BACKWARDS);

      var last_year = String(utilities.getTodaysYear() - 1);

      var displayedHeaderOfDatePicker = document.querySelector(HEADER_DISPLAYED_ON_DATEPICKER);
      expect(displayedHeaderOfDatePicker.textContent).toEqual(last_year);
    });
    it('should change year rights when prompted', function() {
      utilities.click(NAVIGATE_DATEPICKER_FORWARDS);

      var next_year = String(utilities.getTodaysYear() + 1);

      var displayedHeaderOfDatePicker = document.querySelector(HEADER_DISPLAYED_ON_DATEPICKER);
      expect(displayedHeaderOfDatePicker.textContent).toEqual(next_year);
    });
    it('should close and save month when month is chosen', function() {
      var januaryMonthButton = getMonthButtonParentElement("Jan").querySelector('button');
      utilities.click(januaryMonthButton);

      var firstMonthOfselfYearString = "Jan " + utilities.getTodaysYear();
      var inputDateField = document.querySelector('input.ng-valid-date');
      var datePicker = document.querySelector(DATE_PICKER);

      expect(scope.mychange).toHaveBeenCalled();
      expect(inputDateField.value).toEqual(firstMonthOfselfYearString);
      expect(datePicker).toBe(null);
    });
    it('should be able to open and change month', function() {
      var januaryMonthButton = getMonthButtonParentElement("Jan").querySelector('button');
      utilities.click(januaryMonthButton);
      scope.$digest();

      utilities.click(TOGGLE_DATE_PICKER_BUTTON);

      var februaryMonthButton = getMonthButtonParentElement("Feb").querySelector('button');
      utilities.click(februaryMonthButton);
      scope.$digest();

      var secondMonthOfselfYearString = "Feb " + utilities.getTodaysYear();
      var inputDateField = document.querySelector('input.ng-valid-date');
      var datePicker = document.querySelector(DATE_PICKER);

      expect(scope.mychange).toHaveBeenCalled();
      expect(inputDateField.value).toEqual(secondMonthOfselfYearString);
      expect(datePicker).toBe(null);
    });
  });



  describe('when rendering date picker', function() {
    beforeEach(function() {
        var markup = '<div id="parent-element"><akam-date-picker ng-model="value" placeholder="placeholder"></akam-date-picker></div>';
      addElement(markup);
    });
    it('should render all parts', function() {
      var inputDateField = self.element.querySelector('input');
      var toggleDatePickerButton = self.element.querySelector(TOGGLE_DATE_PICKER_BUTTON);
      var datePicker = self.element.querySelector(DATE_PICKER);

      expect(inputDateField).not.toBe(null);
      expect(toggleDatePickerButton).not.toBe(null);
      expect(datePicker).toBe(null);
      expect(inputDateField.placeholder).toEqual("placeholder");
    });
    it('should default hide the picker', function() {
      var datePicker = self.element.querySelector(DATE_PICKER);
      expect(datePicker).toBe(null);
    });
  });

  describe('when pressing the open button', function() {
    beforeEach(function() {
      var markup = '<div id="parent-element"><akam-date-picker ng-model="value"></akam-date-picker></div>';
      addElement(markup);
    });
    it('should display the date-picker', function() {
      utilities.click(TOGGLE_DATE_PICKER_BUTTON);
      var datePicker = document.querySelector(DATE_PICKER);

      expect(datePicker.getAttribute('style')).toContain('display: block');
    });
    it('should close the date-picker', function() {
      utilities.click(TOGGLE_DATE_PICKER_BUTTON);
      var datePicker = document.querySelector(DATE_PICKER);

      expect(datePicker.getAttribute('style')).toContain('display: block');

      utilities.click(TOGGLE_DATE_PICKER_BUTTON);
      datePicker = document.querySelector(DATE_PICKER);
      expect(datePicker).toBe(null);

    });
  });
  describe('when date picker is loaded', function() {
    beforeEach(function() {
      var markup = '<div id="parent-element"><akam-date-picker mode="day" ng-model="picked1" ng-change="mychange()"></akam-date-picker></div>';
      addElement(markup);
      utilities.click(TOGGLE_DATE_PICKER_BUTTON);
    });
    it('should start on todays month', function() {
      var todaysDate = utilities.getMonthInEnglish() + " " + utilities.getTodaysYear();
      var datePicker = document.querySelector(DATE_PICKER);
      var displayedHeaderOfDatePicker = document.querySelector(HEADER_DISPLAYED_ON_DATEPICKER);

      expect(datePicker.getAttribute('style')).toContain('display: block');
      expect(displayedHeaderOfDatePicker.textContent).toEqual(todaysDate);
    });
    it('should have todays date highlighted', function() {
      var todaysButton = getDateButtonParentElement(utilities.getTodaysDate()).querySelector('span');
      expect(todaysButton.classList.contains('text-info')).toBe(true);
    });
  });

  describe('when clear is disabled', function() {
    beforeEach(function() {
      var markup = '<div id="parent-element"><akam-date-picker mode="day" ng-model="picked1" no-clear></akam-date-picker></div>';
      addElement(markup);
      utilities.click(TOGGLE_DATE_PICKER_BUTTON);
    });

    it('should hide the clear icon', function() {
      var clearIcon = document.querySelector('.clear-date');
      expect(clearIcon).toBe(null);

      var firstDayOfMonthButton = getDateButtonParentElement(utilities.generateDate(1)).querySelector('button');
      utilities.click(firstDayOfMonthButton);
      scope.$digest();

      clearIcon = document.querySelector('.clear-date');
      expect(clearIcon).toBe(null);
    });
  });

  describe('when is-disabled added', function() {
    beforeEach(function() {
      var markup = '<div id="parent-element"><akam-date-picker mode="day" ng-model="picked1" no-clear is-disabled="disabled"></akam-date-picker></div>';
      scope.disabled = false;
      addElement(markup);
    });

    it('should date picker enabled when set to false', function() {
      var inputDateField = document.querySelector('input');

      expect(inputDateField.getAttribute('disabled')).toBe(null);
    });

    it('should date picker disabled when set to true', function() {
      scope.disabled = true;
      scope.$digest();
      var inputDateField = document.querySelector('input');

      expect(inputDateField.getAttribute('disabled')).toBe('disabled');
    });

    it('should date picker calendar button disabled when set to true', function() {
      scope.disabled = true;
      scope.$digest();
      var buttonElem = document.querySelector('.akam-date-picker .button');

      expect(buttonElem.getAttribute('disabled')).toBe('disabled');
    });

    it('should date picker calendar icon disabled when set to true', function() {
      scope.disabled = true;
      scope.$digest();
      var iconElem = document.querySelector('.akam-date-picker .button .luna-calendar');
      expect(iconElem.getAttribute('disabled')).toBe('disabled');
    });
  });

  describe('when interacting with the date picker', function() {
    beforeEach(function() {
      var markup = '<div id="parent-element"><akam-date-picker mode="day" ng-model="picked1" ng-change="mychange()"></akam-date-picker></div>';
      spyOn(scope, 'mychange');
      addElement(markup);
      utilities.click(TOGGLE_DATE_PICKER_BUTTON);
    });
    it('should change month left when prompted', function() {
      utilities.click(NAVIGATE_DATEPICKER_BACKWARDS);

      var month = utilities.getMonthInEnglish(utilities.getTodaysMonth() - 1);
      var year = utilities.getTodaysYear();
      var last_month = month + " " + year;

      var displayedHeaderOfDatePicker = document.querySelector(HEADER_DISPLAYED_ON_DATEPICKER);
      expect(displayedHeaderOfDatePicker.textContent).toEqual(last_month);
    });
    it('should change month right when prompted', function() {
      utilities.click(NAVIGATE_DATEPICKER_FORWARDS);

      var month = utilities.getMonthInEnglish(utilities.getTodaysMonth() + 1);
      var year = utilities.getTodaysYear();
      var next_month = month + " " + year;

      var displayedHeaderOfDatePicker = document.querySelector(HEADER_DISPLAYED_ON_DATEPICKER);
      expect(displayedHeaderOfDatePicker.textContent).toEqual(next_month);
    });
    it('should close and save date when date is chosen', function() {
      var firstDayOfMonthButton = getDateButtonParentElement(utilities.generateDate(1)).querySelector('button');
      expect(scope.mychange).not.toHaveBeenCalled();
      utilities.click(firstDayOfMonthButton);
      scope.$digest();
      var dayString = utilities.getFormattedDate(utilities.getTodaysYear() + "-" + utilities.formatInteger(2, String(utilities.getTodaysMonth() + 1)) + "-01");
      expect(scope.mychange).toHaveBeenCalled();

      var inputDateField = document.querySelector('input.ng-valid-date');
      var datePicker = document.querySelector(DATE_PICKER);

      expect(inputDateField.value).toEqual(dayString);
      expect(datePicker).toBe(null);
    });
    it('should be able to open and change date', function() {
      var firstDayOfMonthButton = getDateButtonParentElement(utilities.generateDate(1)).querySelector('button');
      utilities.click(firstDayOfMonthButton);
      scope.$digest();

      var toggleDatePickerButton = document.querySelector(TOGGLE_DATE_PICKER_BUTTON);
      utilities.click(toggleDatePickerButton);

      var secondDayOfMonthButton = getDateButtonParentElement(utilities.generateDate(2)).querySelector('button');
      utilities.click(secondDayOfMonthButton);
      scope.$digest();

      var dayString = utilities.getFormattedDate(utilities.getTodaysYear() + "-" + utilities.formatInteger(2, String(utilities.getTodaysMonth() + 1)) + "-02");
      var inputDateField = document.querySelector('input.ng-valid-date');
      var datePicker = document.querySelector(DATE_PICKER);

      expect(inputDateField.value).toEqual(dayString);
      expect(datePicker).toBe(null);
    });
    it('should hide clear icon when no date has been picked', function() {
      var clearIcon = document.querySelector('.clear-date');
      expect(clearIcon).toBe(null);

      var firstDayOfMonthButton = getDateButtonParentElement(utilities.generateDate(1)).querySelector('button');
      utilities.click(firstDayOfMonthButton);
      scope.$digest();

      clearIcon = document.querySelector('.clear-date');
      expect(clearIcon).not.toBe(null);
    });
    it('should be able to clear date', function() {
      var firstDayOfMonthButton = getDateButtonParentElement(utilities.generateDate(1)).querySelector('button');
      utilities.click(firstDayOfMonthButton);
      scope.$digest();

      var clearIcon = document.querySelector('.clear-date');
      utilities.click(clearIcon);
      var inputDateField = document.querySelector('input');

      expect(inputDateField.value).toEqual('');
      expect(scope.value).toEqual(undefined);
    });
    it('should translate placeholder text if non-provided', function() {
      document.body.removeChild(self.element);
      self.element = null;
      var markup = '<div id="parent-element"><akam-date-picker mode="day" ng-model="picked1"></akam-date-picker></div>';
      addElement(markup);
      var inputDateField = document.querySelector('input.ng-valid-date');
      expect(inputDateField.placeholder).toEqual("components.date-picker.placeholder.date");
    });
  });
  describe('when rendering month picker', function() {
    beforeEach(function() {
      var markup = '<div id="parent-element"><akam-date-picker mode="month" ng-model="picked1" placeholder="placeholder"></akam-date-picker></div>';
      addElement(markup);
    });
    it('should render all parts', function() {
      var inputDateField = document.querySelector('input');
      var toggleDatePickerButton = document.querySelector(TOGGLE_DATE_PICKER_BUTTON);
      var datePicker = document.querySelector(DATE_PICKER);

      expect(inputDateField).not.toBe(null);
      expect(toggleDatePickerButton).not.toBe(null);
      expect(datePicker).toBe(null);
    });
    it('should default hide the picker', function() {
      var datePicker = document.querySelector(DATE_PICKER);

      expect(datePicker).toBe(null);
    });
    it('should have todays month highlighted', function() {
      utilities.click(TOGGLE_DATE_PICKER_BUTTON);

      var thisMonth = utilities.getMonthInEnglish(utilities.getTodaysMonth()).slice(0, 3);
      var todaysMonthButton = getMonthButtonParentElement(thisMonth).querySelector('span');
      expect(todaysMonthButton.classList.contains('text-info')).toBe(true);
    });
    it('should have placeholer text if provided', function() {
      var inputDateField = document.querySelector('input.ng-valid-date');
      expect(inputDateField.placeholder).toEqual("placeholder");
    });
    it('should have every month', function() {
      utilities.click(TOGGLE_DATE_PICKER_BUTTON);
      var januaryMonthButton = getMonthButtonParentElement("Jan").querySelector('button');
      var februaryMonthButton = getMonthButtonParentElement("Feb").querySelector('button');
      var marchMonthButton = getMonthButtonParentElement("Mar").querySelector('button');
      var aprilMonthButton = getMonthButtonParentElement("Apr").querySelector('button');
      var juneMonthButton = getMonthButtonParentElement("Jun").querySelector('button');
      var julyMonthButton = getMonthButtonParentElement("Jul").querySelector('button');
      var augustMonthButton = getMonthButtonParentElement("Aug").querySelector('button');
      var septemberMonthButton = getMonthButtonParentElement("Sep").querySelector('button');
      var octoberMonthButton = getMonthButtonParentElement("Oct").querySelector('button');
      var novemberMonthButton = getMonthButtonParentElement("Nov").querySelector('button');
      var decemberMonthButton = getMonthButtonParentElement("Dec").querySelector('button');

      expect(januaryMonthButton).not.toBe(null);
      expect(februaryMonthButton).not.toBe(null);
      expect(marchMonthButton).not.toBe(null);
      expect(aprilMonthButton).not.toBe(null);
      expect(juneMonthButton).not.toBe(null);
      expect(julyMonthButton).not.toBe(null);
      expect(augustMonthButton).not.toBe(null);
      expect(septemberMonthButton).not.toBe(null);
      expect(octoberMonthButton).not.toBe(null);
      expect(novemberMonthButton).not.toBe(null);
      expect(decemberMonthButton).not.toBe(null);
    });
    it('should translate placeholder text if non-provided', function() {
      document.body.removeChild(self.element);
      self.element = null;
      var markup = '<div id="parent-element"><akam-date-picker mode="month" ng-model="picked1"></akam-date-picker></div>';
      addElement(markup);
      var inputDateField = document.querySelector('input.ng-valid-date');
      expect(inputDateField.placeholder).toEqual("components.date-picker.placeholder.month");
    });
  });
  describe('when interacting with min and max date date-picker', function() {
    var datePicker;
    beforeEach(function() {
      var markup = `<akam-date-picker min="{{min}}" max="{{max}}" mode="day" ng-change="mychange(value)" ng-model="day"></akam-date-picker>`;
      scope.min = new Date(utilities.getTodaysYear(), utilities.getTodaysMonth(), 5);
      scope.max = new Date(utilities.getTodaysYear(), utilities.getTodaysMonth(), 15);
      spyOn(scope, 'mychange');
      addElement(markup);
      utilities.click(TOGGLE_DATE_PICKER_BUTTON);
    });
    it('should be unable to choose day above maximum', function() {
      var dayAboveMax = getDateButtonParentElement(utilities.generateDate(20));
      expect(dayAboveMax.getAttribute('aria-disabled')).toMatch(/true/);
    });
    it('should be unable to choose day below minimum', function() {
      var dayBelowMin = getDateButtonParentElement(utilities.generateDate(2));
      expect(dayBelowMin.getAttribute('aria-disabled')).toMatch(/true/);
    });
    it('should be able to choose date within range', function() {
      var dayWithinRange = getDateButtonParentElement(utilities.generateDate(9));
      expect(dayWithinRange.getAttribute('aria-disabled')).toMatch(/false/);
    });
  });
  describe('when interacting with min and max date month picker', function() {
    beforeEach(function() {
      var markup = '<div id="parent-element"><akam-date-picker min="{{min}}" max="{{max}}" mode="month" ng-change="mychange()" ng-model="picked1"></akam-date-picker></div>';
      scope.min = new Date(utilities.getTodaysYear(), utilities.getTodaysMonth(), 5);
      scope.max = new Date(utilities.getTodaysYear(), utilities.getTodaysMonth(), 15);
      spyOn(scope, 'mychange');
      addElement(markup);
      utilities.click(TOGGLE_DATE_PICKER_BUTTON);
    });
    it('should be unable to choose month below minimum', function() {
      var monthBelowMinEnglish = utilities.getMonthInEnglish(utilities.getTodaysMonth() - 1).slice(0, 3);
      if (monthBelowMinEnglish === "Dec") {
        utilities.click(NAVIGATE_DATEPICKER_BACKWARDS);
      }
      var monthBelowMin = getMonthButtonParentElement(monthBelowMinEnglish);
      expect(monthBelowMin.getAttribute('aria-disabled')).toMatch(/true/);
    });
    it('should be unable to choose month above maximum', function() {
      var monthAboveMaxEnglish = utilities.getMonthInEnglish(utilities.getTodaysMonth() + 1).slice(0, 3);
      if (monthAboveMaxEnglish === "Jan") {
        utilities.click(NAVIGATE_DATEPICKER_FORWARDS);
      }
      var monthAboveMax = getMonthButtonParentElement(monthAboveMaxEnglish);
      expect(monthAboveMax.getAttribute('aria-disabled')).toMatch(/true/);
    });
    it('should be able to choose month within range', function() {
      var monthWithinRange = getMonthButtonParentElement(utilities.getMonthInEnglish().slice(0, 3));
      expect(monthWithinRange.getAttribute('aria-disabled')).toMatch(/false/);
    });
  });
  describe('when disabling interactions with previous/next buttons in a min and max day date-picker', function() {
    beforeEach(function() {
      var markup = '<div id="parent-element"><akam-date-picker min={{min}} max="{{max}}" mode="day" ng-change="mychange(value)" ng-model="picked1"></akam-date-picker></div>';
      scope.min = new Date(utilities.getTodaysYear(), utilities.getTodaysMonth(), 1);
      scope.max = new Date(utilities.getTodaysYear(), utilities.getTodaysMonth() + 1, 0);
      spyOn(scope, 'mychange');
      addElement(markup);
      utilities.click(TOGGLE_DATE_PICKER_BUTTON);
    });
    it('should be unable to navigate forward of backwards a month', function() {
      var nextButton = utilities.find(NAVIGATE_DATEPICKER_FORWARDS);
      expect(nextButton.getAttribute('disabled')).not.toBeNull();
      var prevButton = utilities.find(NAVIGATE_DATEPICKER_BACKWARDS);
      expect(prevButton.getAttribute('disabled')).not.toBeNull();
    });
  });
  describe('when interacting with previous/next buttons in a min and max day date-picker', function() {
    beforeEach(function() {
      var markup = '<div id="parent-element"><akam-date-picker min="{{min}}" max="{{max}}" mode="day" ng-change="mychange()" ng-model="picked1"></akam-date-picker></div>';
      scope.min = new Date(utilities.getTodaysYear(), utilities.getTodaysMonth(), 1);
      scope.max = new Date(utilities.getTodaysYear(), utilities.getTodaysMonth() + 2, 0);
      spyOn(scope, 'mychange');
      addElement(markup);
      utilities.click(TOGGLE_DATE_PICKER_BUTTON);
    });
    it('should be unable to navigate backward a month but should be able to navigate forward a month', function() {
      var nextButton = utilities.find(NAVIGATE_DATEPICKER_FORWARDS);
      expect(nextButton.getAttribute('disabled')).toBeNull();
      var prevButton = utilities.find(NAVIGATE_DATEPICKER_BACKWARDS);
      expect(prevButton.getAttribute('disabled')).not.toBeNull();
    });
  });

  describe('when disabling interactions with previous/next buttons in a min and max month date-picker', function() {
    beforeEach(function() {
      var markup = '<div id="parent-element"><akam-date-picker min="{{min}}" max="{{max}}" mode="month" ng-change="mychange()" ng-model="picked1"></akam-date-picker></div>';
      // set to december 1 - 31
      scope.min = new Date(utilities.getTodaysYear(), 11, 1);
      scope.max = new Date(utilities.getTodaysYear(), 11, 31);
      spyOn(scope, 'mychange');
      addElement(markup);
      utilities.click(TOGGLE_DATE_PICKER_BUTTON);
    });
    it('should be unable to navigate forward of backwards a year', function() {
      var nextButton = utilities.find(NAVIGATE_DATEPICKER_FORWARDS);
      expect(nextButton.getAttribute('disabled')).not.toBeNull();
      var prevButton = utilities.find(NAVIGATE_DATEPICKER_BACKWARDS);
      expect(prevButton.getAttribute('disabled')).not.toBeNull();
    });
  });
  describe('when interacting with previous/next buttons in a min and max date month picker', function() {
    beforeEach(function() {
      var markup = '<div id="parent-element"><akam-date-picker min="{{min}}" max="{{max}}" mode="month" ng-change="mychange()" ng-model="picked1"></akam-date-picker></div>';
      // set to december 1 - 31
      scope.min = new Date(utilities.getTodaysYear(), 11, 1);
      scope.max = new Date(utilities.getTodaysYear() + 1, 11, 31);
      spyOn(scope, 'mychange');
      addElement(markup);
      utilities.click(TOGGLE_DATE_PICKER_BUTTON);
    });
    it('should be unable to navigate backward a year but should be able to navigate forward a year', function() {
      var nextButton = utilities.find(NAVIGATE_DATEPICKER_FORWARDS);
      expect(nextButton.getAttribute('disabled')).toBeNull();
      var prevButton = utilities.find(NAVIGATE_DATEPICKER_BACKWARDS);
      expect(prevButton.getAttribute('disabled')).not.toBeNull();
    });
  });

  describe('when changing html inputs', function() {
    it('shoud throw an angular error if ng-model not provided', function() {
      var markup = '<div id="parent-element"><akam-date-picker min={{min}} max="{{max}}" mode="day" ng-change="mychange(value)"></akam-date-picker></div>';
      try {
        addElement(markup);
      } catch (e) {
        expect(e.message).toContain('errors.angularjs');
      }
    });
    it('should not error if ng-change not provided', function() {
      var markup = '<div id="parent-element"><akam-date-picker min={{min}} max="{{max}}" mode="day" ng-model="picked1"></akam-date-picker></div>';
      try {
        addElement(markup);
      } catch (e) {
        expect(e.message).toEqual('NEVER REACH self CASE');
      }
    });
    it('shoud default to day picker if mode not provided', function() {
      var markup = '<div id="parent-element"><akam-date-picker min={{min}} max="{{max}}" ng-change="mychange(value)" ng-model="picked1"></akam-date-picker></div>';
      addElement(markup);
      utilities.click(TOGGLE_DATE_PICKER_BUTTON);
      var todaysDate = utilities.getMonthInEnglish() + " " + utilities.getTodaysYear();
      var datePicker = document.querySelector(DATE_PICKER);
      var displayedHeaderOfDatePicker = document.querySelector(HEADER_DISPLAYED_ON_DATEPICKER);

      expect(datePicker.getAttribute('style')).toContain('display: block');
      expect(displayedHeaderOfDatePicker.textContent).toEqual(todaysDate);
    });
  });
  describe('given daypicker', function() {
    describe('when daypicker open', function() {
      describe('press keyboard keys up key', function() {
        beforeEach(function() {
          setUpKeyboardEventForDate('September 30, 2010 15:30:00', "#parent-element", 38);
          scope.keydown = jasmine.createSpy('keydown');
        });
        it('should not trigger daypicker keydown event when press up-arrow key', function() {
          expect(scope.keydown).not.toHaveBeenCalled();
        });
        it('should not change model value when press up-arrow key', function() {
          expect(scope.date).toEqual(new Date('September 30, 2010 15:30:00'));
        });
      });
    });
  });
  describe('given daypicker', function() {
    describe('when daypicker open', function() {
      describe('press keyboard keys down key', function() {
        beforeEach(function() {
          setUpKeyboardEventForDate('September 30, 2010 15:30:00', "#parent-element", 40);
          scope.keydown = jasmine.createSpy('keydown');
        });

        it('should not trigger daypicker keydown event when press down-arrow key', function() {
          expect(scope.keydown).not.toHaveBeenCalled();
        });
        it('should not change model value when press down-arrow key', function() {
          expect(scope.date).toEqual(new Date('September 30, 2010 15:30:00'));
        });
      });
    });
  });

  describe('given daypicker', function() {
    describe('when daypicker open', function() {
      describe('press keyboard keys left key', function() {
        beforeEach(function() {
          setUpKeyboardEventForDate('September 30, 2010 15:30:00', "#parent-element", 37);
          scope.keydown = jasmine.createSpy('keydown');
        });

        it('should not trigger daypicker keydown event when press down-arrow key', function() {
          expect(scope.keydown).not.toHaveBeenCalled();
        });
        it('should not change model value when press left-arrow key', function() {
          expect(scope.date).toEqual(new Date('September 30, 2010 15:30:00'));
        });
      });
    });
  });

  describe('given daypicker', function() {
    describe('when daypicker open', function() {
      describe('press keyboard keys right key', function() {
        beforeEach(function() {
          setUpKeyboardEventForDate('September 30, 2010 15:30:00', "#parent-element", 39);
          scope.keydown = jasmine.createSpy('keydown');
        });

        it('should not trigger daypicker keydown event when press right-arrow key', function() {
          expect(scope.keydown).not.toHaveBeenCalled();
        });
        it('should not change model value when press right-arrow key', function() {
          expect(scope.date).toEqual(new Date('September 30, 2010 15:30:00'));
        });
      });
    });
  });

  describe('given monthpicker', function() {
    describe('when monthpicker open', function() {
      describe('press keyboard arrow up key', function() {
        beforeEach(function() {
          setUpKeyboardEventForMonth('November 7, 2005 23:30:00', "#parent-element", 38);
          scope.arrowKeyCallback = jasmine.createSpy('arrowKeyCallback');
        });
        it('should not trigger month picker keydown event', function() {
          expect(scope.arrowKeyCallback).not.toHaveBeenCalled();
        });
        it('should not change model value', function() {
          expect(scope.date).toEqual(new Date('November 7, 2005 23:30:00'));
        });
      });
    });
  });

  describe('given monthpicker', function() {
    describe('when monthpicker open', function() {
      describe('press keyboard arrow down key', function() {
        beforeEach(function() {
          setUpKeyboardEventForMonth('November 7, 2005 23:30:00', "#parent-element", 40);
          scope.arrowKeyCallback = jasmine.createSpy('arrowKeyCallback');
        });
        it('should not trigger month picker keydown event', function() {
          expect(scope.arrowKeyCallback).not.toHaveBeenCalled();
        });
        it('should not change model value', function() {
          expect(scope.date).toEqual(new Date('November 7, 2005 23:30:00'));
        });
      });
    });
  });

  describe("Datepicker resets from max date changes ", function() {
    describe("given new max date value", function() {
      describe("new max date is greater than selected date", function() {
        beforeEach(function() {
          setMinMaxSpecValues(11, 'max');
        });
        it("Should not call scope.clearDate method to clear date value", function() {
          expect(self.isoScope.clearDate).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("Datepicker resets from max date changes ", function() {
    describe("given new max date value", function() {
      describe("new max date is less than selected date", function() {
        let isoScope;
        beforeEach(function() {
          setMinMaxSpecValues(7, 'max');
        });
        it("Should call scope.clearDate method to clear date value", function() {
          expect(self.isoScope.clearDate).toHaveBeenCalled();
        });
      });
    });
  });

  describe("Datepicker resets from min date changes ", function() {
    describe("given new min date value", function() {
      describe("new min date is less than selected date", function() {
        let isoScope;
        beforeEach(function() {
          setMinMaxSpecValues(4, 'min');
        });
        it("Should not call scope.clearDate method to clear date value", function() {
          expect(self.isoScope.clearDate).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("Datepicker resets from min date changes ", function() {
    describe("given new min date value", function() {
      describe("new min date is greater than selected date", function() {
        let isoScope;
        beforeEach(function() {
          setMinMaxSpecValues(9, 'min');
        });
        it("Should call scope.clearDate method to clear date value", function() {
          expect(self.isoScope.clearDate).toHaveBeenCalled();
        });
      });
    });
  });
});
