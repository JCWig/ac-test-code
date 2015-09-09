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

  describe('When selects date and time', function() {
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
});
