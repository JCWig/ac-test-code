'use strict';
var utilities = require('../utilities');
var translationMock = require('../fixtures/translationFixture.json');

const datetimePickerSelector = ".akam-datetime-picker";
const datePickerSelector = ".akam-date-picker";
const timepickerSelector = ".akam-time-picker";
const timeIncrementSelector = " .dropdown-menu tr.time-increment-row td a.btn-link";

function getDateButtonParentElement(dateNumber) {
  return document.querySelector("ul.dropdown-menu table tbody tr td.day-"+dateNumber);
}

describe('akamai.components.datetime-picker', function() {
  var $scope, $compile, timeout;

  beforeEach(function() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(require('../../src/datetime-picker').name);
    angular.mock.module(function($translateProvider) {
      $translateProvider.translations('en_US', translationMock);
      $translateProvider.useLoader('translateNoopLoader');
    });
    inject(function($rootScope, _$compile_, $httpBackend, $timeout) {
      $scope = $rootScope.$new();
      $compile = _$compile_;
      $httpBackend.when('GET', utilities.LIBRARY_PATH).respond(translationMock);
      $httpBackend.when('GET', utilities.CONFIG_PATH).respond({});
      timeout = $timeout;
    });
  });
  afterEach(function() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
  });

  function addElement(markup) {
    markup = markup || `<akam-datetime-picker ng-model="dt" ng-change="onChange()"></akam-datetime-picker>`;
    this.el = $compile(markup)($scope);
    $scope.$digest();
    this.element = document.body.appendChild(this.el[0]);
    this.isoScope = this.el.isolateScope();
    this.controller = this.isoScope.datetime;
  }

  describe('When control rendered with minimum api included', function() {
    let names;
    beforeEach(function() {
      addElement.call(this, undefined);
      names = Object.getOwnPropertyNames(this.controller);
    });
    it('should verify directive APIs', function() {
      expect(names.length).toBe(7);
      expect(names.indexOf('minuteStep')).not.toBe(-1);
      expect(names.indexOf('date')).not.toBe(-1);
      expect(names.indexOf('time')).not.toBe(-1);
      expect(names.indexOf('datetimeValue')).not.toBe(-1);
      expect(names.indexOf('showMeridian')).not.toBe(-1);
      expect(names.indexOf('isDisabled')).not.toBe(-1);
      expect(names.indexOf('hourStep')).not.toBe(-1);
    });
  });
  describe('When control rendered with all APIs included', function() {
    let ctrl;
    beforeEach(function() {
      let markup = `<akam-datetime-picker
        ng-model="dt"
        ng-change="onChange()"
        format="{{format}}"
        min="{{min}}"
        max="{{max}}"
        minute-step="minuteStep"
        hour-step="hourStep"
        show-meridian="showMeridian"
        is-disabled="disabled">
      </akam-datetime-picker>`;

      $scope.dt = new Date();
      $scope.format = "EEE, MMM dd, yyyy";
      $scope.min = "2015-9-1";
      $scope.max = "2015-9-25";
      $scope.minuteStep = 15;
      $scope.hourStep = 1;
      $scope.showMeridian = true;
      $scope.isDisabled = false;

      addElement.call(this, markup);
      ctrl = this.controller;
    });

    it('should verify directive APIs with values assigned', function() {
      expect(ctrl.format).toBe($scope.format);
      expect(ctrl.min).toBe($scope.min);
      expect(ctrl.max).toBe($scope.max);
      expect(ctrl.minuteStep).toBe($scope.minuteStep);
      expect(ctrl.hourStep).toBe($scope.hourStep);
      expect(ctrl.showMeridian).toBe($scope.showMeridian);
      expect(ctrl.isDisabled).toBe($scope.isDisabled);
    });

    it('should datetimeValue not be undefined when ngModel value has value', function() {
      expect(ctrl.datetimeValue).not.toBe(undefined);
    });
  });
  describe('When control rendered', function() {
    let datetime, date, time, dateButton, timeButton;
    beforeEach(function() {
      addElement.call(this, undefined);
      datetime = document.querySelector(datetimePickerSelector);
      date = document.querySelector(datePickerSelector);
      time = document.querySelector(timepickerSelector);
      dateButton = document.querySelector(datePickerSelector + " .button");
      timeButton = document.querySelector(timepickerSelector + " .btn");
    });

    it("should verify datetime picker element rendered", function() {
      expect(datetime).not.toBe(null);
    });

    it("should verify date picker element rendered", function() {
      expect(date).not.toBe(null);
    });

    it("should verify time picker element rendered", function() {
      expect(time).not.toBe(null);
    });

    it("should verify date picker mode value be 'day'", function() {
      expect(date.classList).toContain('day');
    });

    it("should verify date picker open when click on it", function() {
      utilities.click(dateButton);
      $scope.$digest();

      expect(date.classList).toContain('opened');
    });

    it("should verify time picker open when click on it", function() {
      utilities.click(timeButton);
      $scope.$digest();

      expect(time.classList).toContain('open');
    });
  });

  describe('When selects date picker...', function() {
    let d, dateButton;
    beforeEach(function() {
      addElement.call(this, undefined);
      d = new Date();
      dateButton = document.querySelector(datePickerSelector + " .button");
    });

    it("should verify date value updated when selects a date", function() {
      utilities.click(dateButton);
      $scope.$digest();

      expect(this.controller.datetimeValue.getFullYear()).toEqual(d.getFullYear());
      expect(this.controller.datetimeValue.getMonth()).toEqual(d.getMonth());
      expect(this.controller.datetimeValue.getDate()).toEqual(d.getDate());

      let firstDayOfMonthButton = getDateButtonParentElement("01").querySelector('button');
      utilities.click(firstDayOfMonthButton);
      $scope.$digest();

      expect(this.controller.datetimeValue.getFullYear()).toEqual(d.getFullYear());
      expect(this.controller.datetimeValue.getMonth()).toEqual(d.getMonth());
      expect(this.controller.datetimeValue.getDate()).toEqual(1);
    });
  });

  describe('When selects time picker...', function() {
    let timeButton, arrows;
    beforeEach(function() {
      let d = new Date();
      d.setHours(5, 10);
      $scope.dt = d;
      addElement.call(this, undefined);

      timeButton = document.querySelector(timepickerSelector + " .btn");
      arrows = document.querySelectorAll(timepickerSelector + timeIncrementSelector);
    });

    it("should verify hour value incremented by 1 when click hour up arrow once", function() {
      let initHour = this.controller.datetimeValue.getHours();

      utilities.click(timeButton);
      $scope.$digest();

      utilities.click(arrows[0]);
      $scope.$digest();

      let updatedHour = this.controller.datetimeValue.getHours();

      expect(updatedHour - initHour).toBe(1);
    });

    it("should verify minute value incremented by 15 when clcik minute up arrow once", function() {
      let initMinute = this.controller.datetimeValue.getMinutes();

      utilities.click(timeButton);
      $scope.$digest();

      utilities.click(arrows[1]);
      $scope.$digest();

      let updatedMinute = this.controller.datetimeValue.getMinutes();

      expect(updatedMinute - initMinute).toBe(15);
    });
  });
  describe('When interacting with pickers', function() {
    let dateChangedSpy, timeChangedSpy, dateButton, timeButton, arrows;
    beforeEach(function() {
      addElement.call(this, undefined);
      dateChangedSpy = spyOn(this.isoScope, "dateChanged");
      timeChangedSpy = spyOn(this.isoScope, "timeChanged");
      dateButton = document.querySelector(datePickerSelector + " .button");
      timeButton = document.querySelector(timepickerSelector + " .btn");
      arrows = document.querySelectorAll(timepickerSelector + timeIncrementSelector);
    });

    it("when datepicker selects, should verify scope dateChanged function callled", function() {
      utilities.click(dateButton);
      $scope.$digest();

      let firstDayOfMonthButton = getDateButtonParentElement("01").querySelector('button');
      utilities.click(firstDayOfMonthButton);
      $scope.$digest();

      expect(dateChangedSpy).toHaveBeenCalled();
    });

    it("when timepicker selects, should verify scope timeChange function callled", function() {
      utilities.click(timeButton);
      $scope.$digest();

      utilities.click(arrows[0]);
      $scope.$digest();

      expect(timeChangedSpy).toHaveBeenCalled();

      utilities.click(arrows[1]);
      $scope.$digest();

      expect(timeChangedSpy).toHaveBeenCalled();
    });
  });

  describe('When interacting with pickers', function() {
    let setDatetimeSpy, dateButton;
    beforeEach(function() {
      addElement.call(this, undefined);
      setDatetimeSpy = spyOn(this.controller, "setDatetime");
      dateButton = document.querySelector(datePickerSelector + " .button");
    });

    it("when datepicker selects, should verify controller setDatetime function callled", function() {
      utilities.click(dateButton);
      $scope.$digest();

      let firstDayOfMonthButton = getDateButtonParentElement("01").querySelector('button');
      utilities.click(firstDayOfMonthButton);
      $scope.$digest();

      expect(setDatetimeSpy).toHaveBeenCalled();
    });
  });
});
