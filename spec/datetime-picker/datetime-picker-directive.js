'use strict';
var utilities = require('../utilities');
import datetime from '../../src/datetime-picker';
var translationMock = require('../fixtures/translationFixture.json');

const datetimePickerSelector = ".akam-datetime-picker";
const datePickerSelector = ".akam-date-picker";
const timepickerSelector = ".akam-time-picker";
const timeIncrementSelector = " .dropdown-menu tr.time-increment-row td a.btn-link";

var findCertainButton = function(buttonKey) {
  var calendar = document.querySelectorAll('td.ng-scope');
  for (var i = 0; i < calendar.length; i++) {
    if (calendar[i].textContent.indexOf(buttonKey) >= 0 && !calendar[i].querySelector('span').classList.contains('text-muted')) {
      return calendar[i];
    }
  }
  return null;
};

describe('akamai.components.datetime-picker', function() {
  var $scope, $compile, timeout;

  beforeEach(function() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(datetime.name);
    angular.mock.module(function($provide, $translateProvider) {
      $translateProvider.useLoader('i18nCustomLoader');
    });
    inject(function($rootScope, _$compile_, $httpBackend, $timeout) {
      $scope = $rootScope.$new();
      $compile = _$compile_;
      $httpBackend.when('GET', utilities.LIBRARY_PATH).respond(translationMock);
      $httpBackend.when('GET', utilities.CONFIG_PATH).respond({});
      $httpBackend.flush();
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

  describe('When rendered with minimum api included', function() {
    beforeEach(function() {
      addElement.call(this, undefined);
    });
    it('should verify directive APIs', function() {
      let ctrl = this.controller;
      let names = Object.getOwnPropertyNames(ctrl);

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
  describe('When rendered with all APIs included', function() {
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
    });

    it('should verify directive APIs with values assigned', function() {
      let ctrl = this.controller;

      expect(ctrl.format).toBe($scope.format);
      expect(ctrl.min).toBe($scope.min);
      expect(ctrl.max).toBe($scope.max);
      expect(ctrl.minuteStep).toBe($scope.minuteStep);
      expect(ctrl.hourStep).toBe($scope.hourStep);
      expect(ctrl.showMeridian).toBe($scope.showMeridian);
      expect(ctrl.isDisabled).toBe($scope.isDisabled);
    });

    it('should datetimeValue not be undefined when ngModel value has value', function() {
      expect(this.controller.datetimeValue).not.toBe(undefined);
    });

  });
  describe('When rendered', function() {
    beforeEach(function() {
      addElement.call(this, undefined);
    });

    it("should verify datetime picker element rendered", function() {
      let datetime = document.querySelector(datetimePickerSelector);
      expect(datetime).not.toBe(null);
    });

    it("should verify date picker element rendered", function() {
      let date = document.querySelector(datePickerSelector);
      expect(date).not.toBe(null);
    });

    it("should verify time picker element rendered", function() {
      let time = document.querySelector(timepickerSelector);
      expect(time).not.toBe(null);
    });

    it("should verify date picker mode value be 'day'", function() {
      let date = document.querySelector(datePickerSelector);
      expect(date.classList).toContain('day');
    });

    it("should verify date picker open when click on it", function() {
      let date = document.querySelector(datePickerSelector);
      let button = document.querySelector(datePickerSelector + " .button");
      utilities.click(button);
      $scope.$digest();

      expect(date.classList).toContain('opened');
    });

    it("should verify time picker open when click on it", function() {
      let time = document.querySelector(timepickerSelector);
      let button = document.querySelector(timepickerSelector + " .btn");
      utilities.click(button);
      $scope.$digest();

      expect(time.classList).toContain('open');
    });
  });

  describe('When selects date...', function() {
    beforeEach(function() {
      addElement.call(this, undefined);
    });

    it("should verify date value updated when selects a date", function() {
      let date = document.querySelector(datePickerSelector);
      let button = document.querySelector(datePickerSelector + " .button");
      utilities.click(button);
      $scope.$digest();

      let d = new Date();
      expect(this.controller.datetimeValue.getFullYear()).toEqual(d.getFullYear());
      expect(this.controller.datetimeValue.getMonth()).toEqual(d.getMonth());
      expect(this.controller.datetimeValue.getDate()).toEqual(d.getDate());

      let firstDayOfMonthButton = findCertainButton("01").querySelector('button');
      utilities.click(firstDayOfMonthButton);
      $scope.$digest();

      expect(this.controller.datetimeValue.getFullYear()).toEqual(d.getFullYear());
      expect(this.controller.datetimeValue.getMonth()).toEqual(d.getMonth());
      expect(this.controller.datetimeValue.getDate()).toEqual(1);
    });
  });

  describe('When selects time...', function() {
    beforeEach(function() {
      let d = new Date();
      d.setHours(5, 10);
      $scope.dt = d;
      addElement.call(this, undefined);
    });

    it("should verify hour value incremented by 1 when click hour up arrow once", function() {
      let button = document.querySelector(timepickerSelector + " .btn");
      let arrows = document.querySelectorAll(timepickerSelector + timeIncrementSelector);

      let initHour = this.controller.datetimeValue.getHours();

      utilities.click(button);
      $scope.$digest();

      utilities.click(arrows[0]);
      $scope.$digest();

      let updatedHour = this.controller.datetimeValue.getHours();

      expect(updatedHour - initHour).toBe(1);
    });

    it("should verify hour value incremented by 15 when clcik minut up arrow once", function() {
      let button = document.querySelector(timepickerSelector + " .btn");
      let arrows = document.querySelectorAll(timepickerSelector + timeIncrementSelector);

      let initMinute = this.controller.datetimeValue.getMinutes();

      utilities.click(button);
      $scope.$digest();

      utilities.click(arrows[1]);
      $scope.$digest();

      let updatedMinute = this.controller.datetimeValue.getMinutes();

      expect(updatedMinute - initMinute).toBe(15);
    });
  });
  describe('When rendered ', function() {
    beforeEach(function() {
      addElement.call(this, undefined);
    });

    it("when datepicker selects, should verify controller setDatetime function callled", function() {
      let setDatetimeSpy = spyOn(this.controller, "setDatetime");

      let button = document.querySelector(datePickerSelector + " .button");
      utilities.click(button);
      $scope.$digest();

      let firstDayOfMonthButton = findCertainButton("01").querySelector('button');
      utilities.click(firstDayOfMonthButton);
      $scope.$digest();

      expect(setDatetimeSpy).toHaveBeenCalled();

    });

    it("when dtepicker selects, should verify scope dateChanged function callled", function() {
      let dateChangedSpy = spyOn(this.isoScope, "dateChanged");

      let button = document.querySelector(datePickerSelector + " .button");
      utilities.click(button);
      $scope.$digest();

      let firstDayOfMonthButton = findCertainButton("01").querySelector('button');
      utilities.click(firstDayOfMonthButton);
      $scope.$digest();

      expect(dateChangedSpy).toHaveBeenCalled();
    });

    it("when timepicker selects, should verify scope timeChange function callled", function() {
      let timeChangedSpy = spyOn(this.isoScope, "timeChanged");
      let button = document.querySelector(timepickerSelector + " .btn");
      let arrows = document.querySelectorAll(timepickerSelector + timeIncrementSelector);

      utilities.click(button);
      $scope.$digest();

      utilities.click(arrows[0]);
      $scope.$digest();

      expect(timeChangedSpy).toHaveBeenCalled();

      utilities.click(arrows[1]);
      $scope.$digest();

      expect(timeChangedSpy).toHaveBeenCalled();
    });
  });
});
