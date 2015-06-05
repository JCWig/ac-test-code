'use strict';
var utilities = require('../utilities');

var TOGGLE_DATE_PICKER_BUTTON = 'button.button';
var DATE_PICKER = 'ul.dropdown-menu';
var HEADER_DISPLAYED_ON_DATEPICKER = 'button.btn strong.ng-binding';
var NAVIGATE_DATEPICKER_BACKWARDS = 'button.pull-left';
var NAVIGATE_DATEPICKER_FORWARDS = 'button.pull-right';
var LIBRARY_PATH = /\/libs\/akamai-core\/[0-9]*.[0-9]*.[0-9]*\/locales\/en_US.json/;
var CONFIG_PATH = '/apps/appname/locales/en_US.json';
var enUsMessagesResponse = require("../i18n/i18n_responses/messages_en_US.json");
var enUsResponse = require("../i18n/i18n_responses/en_US.json");

var findCertainButton = function(buttonKey) {
  var calendar = document.querySelectorAll('td.ng-scope');
  for (var i = 0; i < calendar.length; i++) {
    if (calendar[i].textContent.indexOf(buttonKey) >= 0 && !calendar[i].querySelector('span').classList.contains('text-muted')) {
      return calendar[i];
    }
  }
  return null;
};
describe('akam-date-picker', function() {
  var compile = null;
  var scope = null;
  var self = this;

  beforeEach(function() {
    inject.strictDi(true);
    self = this;
    angular.mock.module(require('../../src/date-picker').name);
    inject(function($compile, $rootScope, $httpBackend) {
      compile = $compile;
      scope = $rootScope.$new();
      $httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
      $httpBackend.when('GET', CONFIG_PATH).respond(enUsResponse);
      $httpBackend.flush();
    });
    scope.mychange = function() {};
  });

  afterEach(function() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
  });

  function addElement(markup) {
    self.el = compile(markup)(scope);
    scope.$digest();
    self.element = document.body.appendChild(self.el[0]);
  }

  describe('when rendering date picker', function() {
    beforeEach(function() {
      var markup = '<div id="parent-element"><akam-date-picker ng-model="value" placeholder="placeholder"></akam-date-picker></div>';
      addElement(markup);
    });
    it('should render all parts', function() {
      var inputDateField = document.querySelector('input');
      var toggleDatePickerButton = document.querySelector(TOGGLE_DATE_PICKER_BUTTON);
      var datePicker = document.querySelector(DATE_PICKER);

      expect(inputDateField).not.toBe(null);
      expect(toggleDatePickerButton).not.toBe(null);
      expect(datePicker).not.toBe(null);
      expect(inputDateField.placeholder).toEqual("placeholder");
    });
    it('should default hide the picker', function() {
      var datePicker = document.querySelector(DATE_PICKER);
      expect(datePicker.getAttribute('style')).toContain('display: none');
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
      expect(datePicker.getAttribute('style')).toContain('display: none');

    });
  });
  describe('when date picker is loaded', function() {
    beforeEach(function() {
      var markup = '<div id="parent-element"><akam-date-picker mode="day" ng-model="picked1" ng-change="mychange()"></akam-date-picker></div>';
      addElement(markup);
      utilities.click(TOGGLE_DATE_PICKER_BUTTON);
    });
    it('should hide the date-picker upon click away', function() {
      var datePicker = document.querySelector(DATE_PICKER);

      expect(datePicker.getAttribute('style')).toContain('display: block');

      utilities.clickAwayCreationAndClick('div');
      datePicker = document.querySelector(DATE_PICKER);

      expect(datePicker.getAttribute('style')).toContain('display: none');
    });
    it('should start on todays month', function() {
      var todaysDate = utilities.getMonthInEnglish() + " " + utilities.getTodaysYear();
      var datePicker = document.querySelector(DATE_PICKER);
      var displayedHeaderOfDatePicker = document.querySelector(HEADER_DISPLAYED_ON_DATEPICKER);

      expect(datePicker.getAttribute('style')).toContain('display: block');
      expect(displayedHeaderOfDatePicker.textContent).toEqual(todaysDate);
    });
    it('should have todays date highlighted', function() {
      var todaysButton = findCertainButton(utilities.getTodaysDay()).querySelector('span');
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

      var firstDayOfMonthButton = findCertainButton("01").querySelector('button');
      utilities.click(firstDayOfMonthButton);
      scope.$digest();

      clearIcon = document.querySelector('.clear-date');
      expect(clearIcon).toBe(null);
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
      var firstDayOfMonthButton = findCertainButton("01").querySelector('button');
      expect(scope.mychange).not.toHaveBeenCalled();
      utilities.click(firstDayOfMonthButton);
      scope.$digest();
      var dayString = utilities.getFormattedDate(utilities.getTodaysYear() + "-" + utilities.formatInteger(2, String(utilities.getTodaysMonth() + 1)) + "-01");
      expect(scope.mychange).toHaveBeenCalled();

      var inputDateField = document.querySelector('input.ng-valid-date');
      var datePicker = document.querySelector(DATE_PICKER);

      expect(inputDateField.value).toEqual(dayString);
      expect(datePicker.getAttribute('style')).toContain('display: none');
    });
    it('should be able to open and change date', function() {
      var firstDayOfMonthButton = findCertainButton("01").querySelector('button');
      utilities.click(firstDayOfMonthButton);
      scope.$digest();

      var toggleDatePickerButton = document.querySelector(TOGGLE_DATE_PICKER_BUTTON);
      utilities.click(toggleDatePickerButton);

      var secondDayOfMonthButton = findCertainButton("02").querySelector('button');
      utilities.click(secondDayOfMonthButton);
      scope.$digest();

      var dayString = utilities.getFormattedDate(utilities.getTodaysYear() + "-" + utilities.formatInteger(2, String(utilities.getTodaysMonth() + 1)) + "-02");
      var inputDateField = document.querySelector('input.ng-valid-date');
      var datePicker = document.querySelector(DATE_PICKER);

      expect(inputDateField.value).toEqual(dayString);
      expect(datePicker.getAttribute('style')).toContain('display: none');
    });
    it('should hide clear icon when no date has been picked', function() {
      var clearIcon = document.querySelector('.clear-date');
      expect(clearIcon).toBe(null);

      var firstDayOfMonthButton = findCertainButton("01").querySelector('button');
      utilities.click(firstDayOfMonthButton);
      scope.$digest();

      clearIcon = document.querySelector('.clear-date');
      expect(clearIcon).not.toBe(null);
    });
    it('should be able to clear date', function() {
      var firstDayOfMonthButton = findCertainButton("01").querySelector('button');
      utilities.click(firstDayOfMonthButton);
      scope.$digest();

      var clearIcon = document.querySelector('.clear-date');
      utilities.click(clearIcon);
      var inputDateField = document.querySelector('input');

      expect(inputDateField.value).toEqual('');
      expect(scope.value).toEqual(undefined);
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
      expect(datePicker).not.toBe(null);
    });
    it('should default hide the picker', function() {
      var datePicker = document.querySelector(DATE_PICKER);

      expect(datePicker.getAttribute('style')).toContain('display: none');
    });
    it('should have todays month highlighted', function() {
      var thisMonth = utilities.getMonthInEnglish(utilities.getTodaysMonth()).slice(0, 3);
      var todaysMonthButton = findCertainButton(thisMonth).querySelector('span');
      expect(todaysMonthButton.classList.contains('text-info')).toBe(true);
    });
    it('should have placeholer text if provided', function() {
      var inputDateField = document.querySelector('input.ng-valid-date');
      expect(inputDateField.placeholder).toEqual("placeholder");
    });
    it('should have every month', function() {
      var januaryMonthButton = findCertainButton("Jan").querySelector('button');
      var februaryMonthButton = findCertainButton("Feb").querySelector('button');
      var marchMonthButton = findCertainButton("Mar").querySelector('button');
      var aprilMonthButton = findCertainButton("Apr").querySelector('button');
      var juneMonthButton = findCertainButton("Jun").querySelector('button');
      var julyMonthButton = findCertainButton("Jul").querySelector('button');
      var augustMonthButton = findCertainButton("Aug").querySelector('button');
      var septemberMonthButton = findCertainButton("Sep").querySelector('button');
      var octoberMonthButton = findCertainButton("Oct").querySelector('button');
      var novemberMonthButton = findCertainButton("Nov").querySelector('button');
      var decemberMonthButton = findCertainButton("Dec").querySelector('button');

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
      var januaryMonthButton = findCertainButton("Jan").querySelector('button');
      utilities.click(januaryMonthButton);
      scope.$digest();

      var firstMonthOfThisYearString = "Jan " + utilities.getTodaysYear();
      var inputDateField = document.querySelector('input.ng-valid-date');
      var datePicker = document.querySelector(DATE_PICKER);

      expect(scope.mychange).toHaveBeenCalled();
      expect(inputDateField.value).toEqual(firstMonthOfThisYearString);
      expect(datePicker.getAttribute('style')).toContain('display: none');
    });
    it('should be able to open and change month', function() {
      var januaryMonthButton = findCertainButton("Jan").querySelector('button');
      utilities.click(januaryMonthButton);
      scope.$digest();

      utilities.click(TOGGLE_DATE_PICKER_BUTTON);

      var februaryMonthButton = findCertainButton("Feb").querySelector('button');
      utilities.click(februaryMonthButton);
      scope.$digest();

      var secondMonthOfThisYearString = "Feb " + utilities.getTodaysYear();
      var inputDateField = document.querySelector('input.ng-valid-date');
      var datePicker = document.querySelector(DATE_PICKER);

      expect(scope.mychange).toHaveBeenCalled();
      expect(inputDateField.value).toEqual(secondMonthOfThisYearString);
      expect(datePicker.getAttribute('style')).toContain('display: none');
    });
  });
  describe('when interacting with min and max date date-picker', function() {
    beforeEach(function() {
      var markup = '<div id="parent-element"><akam-date-picker min={{min}} max="{{max}}" mode="day" ng-change="mychange(value)" ng-model="picked1"></akam-date-picker></div>';
      scope.min = new Date(utilities.getTodaysYear(), utilities.getTodaysMonth(), 5);
      scope.max = new Date(utilities.getTodaysYear(), utilities.getTodaysMonth(), 15);
      spyOn(scope, 'mychange');
      addElement(markup);
      utilities.click(TOGGLE_DATE_PICKER_BUTTON);
    });
    it('should be unable to choose day above maximum', function() {
      var dayAboveMax = findCertainButton("20");
      expect(dayAboveMax.getAttribute('aria-disabled')).toMatch(/true/);
    });
    it('should be unable to choose day below minimum', function() {
      var dayBelowMin = findCertainButton("02");
      expect(dayBelowMin.getAttribute('aria-disabled')).toMatch(/true/);
    });
    it('should be able to choose date within range', function() {
      var dayWithinRange = findCertainButton("09");
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
      var monthBelowMin = findCertainButton(monthBelowMinEnglish);
      expect(monthBelowMin.getAttribute('aria-disabled')).toMatch(/true/);
    });
    it('should be unable to choose month above maximum', function() {
      var monthAboveMaxEnglish = utilities.getMonthInEnglish(utilities.getTodaysMonth() + 1).slice(0, 3);
      if (monthAboveMaxEnglish === "Jan") {
        utilities.click(NAVIGATE_DATEPICKER_FORWARDS);
      }
      var monthAboveMax = findCertainButton(monthAboveMaxEnglish);
      expect(monthAboveMax.getAttribute('aria-disabled')).toMatch(/true/);
    });
    it('should be able to choose month within range', function() {
      var monthWithinRange = findCertainButton(utilities.getMonthInEnglish().slice(0, 3));
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
        expect(e.message).toEqual('NEVER REACH THIS CASE');
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
});
describe('when given an i18n locale that does not exist', function() {
  var compile, scope, self, cookies;
  beforeEach(function() {
    inject.strictDi(true);
    self = this;
    angular.mock.module(require('../../src/date-picker').name);
    angular.mock.module(require('../../src/i18n').name);
    angular.mock.module(/*@ngInject*/function($provide, $translateProvider) {
      $translateProvider.useLoader('i18nCustomLoader');
    });
    inject(function($compile, $rootScope, $httpBackend, _$cookies_) {
      compile = $compile;
      scope = $rootScope.$new();
      _$cookies_.put('AKALOCALE', "eXpfUkU=");
      cookies = _$cookies_;
      $httpBackend.when('GET', '/apps/appname/locales/yz_RE.json').respond({});
      $httpBackend.when('GET', /\/libs\/akamai-core\/[0-9]*.[0-9]*.[0-9]*\/locales\/yz_RE.json/).respond({});
      $httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
      $httpBackend.when('GET', CONFIG_PATH).respond(enUsResponse);
      $httpBackend.flush();
    });
  });
  afterEach(function() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
    cookies.remove('AKALOCALE');
  });
  function addElement(markup) {
    self.el = compile(markup)(scope);
    scope.$digest();
    self.element = document.body.appendChild(self.el[0]);
  }

  it('should default to english if time format non existant', function() {
    var markup = '<div id="parent-element"><akam-date-picker mode="day" ng-model="picked1"></akam-date-picker></div>';
    addElement(markup);
    utilities.click(TOGGLE_DATE_PICKER_BUTTON);

    var firstDayOfMonthButton = findCertainButton("01").querySelector('button');
    utilities.click(firstDayOfMonthButton);
    scope.$digest();

    var dayString = utilities.getFormattedDate(utilities.getTodaysYear() + "-" + utilities.formatInteger(2, String(utilities.getTodaysMonth() + 1)) + "-01");

    var inputDateField = document.querySelector('input.ng-valid-date');

    expect(inputDateField.value).toEqual(dayString);
  });
});
