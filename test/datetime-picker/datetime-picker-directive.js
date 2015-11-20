'use strict';
var utilities = require('../utilities');
var translationMock = require('../fixtures/translationFixture.json');

const datetimePickerSelector = ".akam-datetime-picker";
const datePickerSelector = ".akam-date-picker";
const timepickerSelector = ".akam-time-picker";
const timeIncrementSelector = " .dropdown-menu tr.time-increment-row td a.btn-link";
const dateClearIconSelector = ".akam-datetime-picker .clear-date";

function getDateButtonParentElement(date) {
  let selector = `ul.dropdown-menu table tbody tr td.month-${date.getMonth() + 1}.day-${date.getDate()}`;
  return document.querySelector(selector);
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

      $scope.dt = new Date(utilities.getTodaysYear(), 11, 15);
      $scope.format = "EEE, MMM dd, yyyy";
      $scope.min = new Date(utilities.getTodaysYear(), 11, 1);
      $scope.max = new Date(utilities.getTodaysYear() + 1, 11, 31);
      $scope.minuteStep = 15;
      $scope.hourStep = 1;
      $scope.showMeridian = true;
      $scope.isDisabled = false;

      addElement.call(this, markup);
      ctrl = this.controller;
    });

    it('should verify directive APIs with values assigned', function() {
      expect(ctrl.format).toBe($scope.format);
      expect(ctrl.min).toEqual($scope.min);
      expect(ctrl.max).toEqual($scope.max);
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
    let datetime, date, dateWrapper, time, dateButton, timeButton;
    beforeEach(function() {
      addElement.call(this, undefined);
      datetime = document.querySelector(datetimePickerSelector);
      date = document.querySelector(datePickerSelector);
      dateWrapper = document.querySelector('akam-date-picker');
      time = document.querySelector(timepickerSelector);
      dateButton = document.querySelector(datePickerSelector + " > .input-group-btn > .btn");
      timeButton = document.querySelector(timepickerSelector + " > .input-group-btn > .btn");
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

      expect(dateWrapper.classList).toContain('opened');
    });

    it("should verify time picker open when click on it", function() {
      angular.element(timeButton).triggerHandler('click');
      $scope.$digest();
      expect(time.classList).toContain('open');
    });
  });

  describe('When selects date picker...', function() {
    let d, dateButton;
    beforeEach(function() {
      addElement.call(this, undefined);
      d = new Date();
      dateButton = document.querySelector(datePickerSelector + " > .input-group-btn > .btn");
      utilities.click(dateButton);
      $scope.$digest();

      let firstDayOfMonthButton = getDateButtonParentElement(utilities.generateDate(1)).querySelector('button');
      utilities.click(firstDayOfMonthButton);
      $scope.$digest();
    });

    it("should verify date value updated when selects a date", function() {
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
      dateButton = document.querySelector(datePickerSelector + " > .input-group-btn .btn");
      timeButton = document.querySelector(timepickerSelector + " > .input-group-btn .btn");
      arrows = document.querySelectorAll(timepickerSelector + timeIncrementSelector);
      utilities.click(dateButton);
      $scope.$digest();

      let firstDayOfMonthButton = getDateButtonParentElement(utilities.generateDate(1)).querySelector('button');
      utilities.click(firstDayOfMonthButton);
      $scope.$digest();
    });

    it("when datepicker selects, should verify scope dateChanged function callled", function() {
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
      dateButton = document.querySelector(datePickerSelector + " .btn");
      utilities.click(dateButton);
      $scope.$digest();
      let firstDayOfMonthButton = getDateButtonParentElement(utilities.generateDate(1)).querySelector('button');
      utilities.click(firstDayOfMonthButton);
      $scope.$digest();
    });

    it("when datepicker selects, should verify controller setDatetime function callled", function() {
      expect(setDatetimeSpy).toHaveBeenCalled();
    });
  });

  describe('When interact with datepicker', function() {
    describe('given datetime.max watch', function() {
      describe('when change max value dynamically', function() {
        let setDatetimeSpy, dateButton;
        beforeEach(function() {
          let markup = `<akam-datetime-picker ng-model="dt" max="{{max}}"></akam-datetime-picker>`;
          $scope.dt = new Date(utilities.getTodaysYear(), 11, 15);
          $scope.max = new Date(utilities.getTodaysYear() + 1, 11, 31);

          addElement.call(this, markup);
          $scope.max = new Date(utilities.getTodaysYear() + 1, 10, 31);
          $scope.$digest();
        });
        it("should datetimepicker controlller max value change to new max value", function() {
          expect(this.controller.max).toEqual($scope.max);
        });
      });
    });
  });
  describe('When interact with datepicker', function() {
    describe('given datetime.min watch', function() {
      describe('when change min value dynamically', function() {
        let setDatetimeSpy, dateButton;
        beforeEach(function() {
          let markup = `<akam-datetime-picker ng-model="dt" min="{{min}}"></akam-datetime-picker>`;
          $scope.dt = new Date(utilities.getTodaysYear(), 11, 15);
          $scope.min = new Date(utilities.getTodaysYear(), 11, 1);

          addElement.call(this, markup);

          $scope.min = new Date(utilities.getTodaysYear(), 10, 1);
          $scope.$digest();
        });
        it("should datetimepicker controller min value change to new min value", function() {
          expect(this.controller.min).toEqual($scope.min);
        });
      });
    });
  });

  describe('given datetime picker has no init value', function() {
    describe('when datetime picker rendered', function() {
      describe('when datepicker is clicked', function() {
        beforeEach(function() {
          addElement.call(this);
          let dateButton = document.querySelector(datePickerSelector + " .input-group-btn button");
          utilities.click(dateButton);
          $scope.$digest();
        });
        it("should controller date and time value be defined", function() {
          expect(this.controller.date).toBe(undefined);
          expect(this.controller.time).toBe(undefined);
          expect(this.controller.datetimeValue).toBe(undefined);
        });
      });
    });
  });
  describe('given datetime picker has no init value', function() {
    describe('when datetime picker rendered', function() {
      describe('when open timepicker', function() {
        beforeEach(function() {
          addElement.call(this);
          let timeButton = document.querySelector(timepickerSelector + " > .form-control");
          utilities.click(timeButton);
          $scope.$digest();
        });
        it("should controller time value be set to current time", function() {
          expect(angular.isDate(this.controller.time)).toBe(true);
          expect(this.controller.time.getHours()).toBe(new Date().getHours());
          expect(this.controller.time.getMinutes()).toBe(new Date().getMinutes());
        });
      });
    });
  });
  describe('given datetime picker has no init value', function() {
    describe('when datetime picker rendered', function() {
      describe('open datepicker and selects a date', function() {
        beforeEach(function() {
          addElement.call(this);
          let dateButton = document.querySelector(datePickerSelector + " .btn");
          utilities.click(dateButton);
          $scope.$digest();
          let firstDayOfMonthButton = getDateButtonParentElement(utilities.generateDate(1)).querySelector('button');
          utilities.click(firstDayOfMonthButton);
          $scope.$digest();
        });
        it("should controller time value be set on current time", function() {
          expect(angular.isDate(this.controller.time)).toBe(true);
          expect(this.controller.time.getHours()).toBe(new Date().getHours());
          expect(this.controller.time.getMinutes()).toBe(new Date().getMinutes());
        });
      });
    });
  });
  describe('given datetime picker has no init value', function() {
    describe('when datetime picker rendered', function() {
      describe('open timepicker dropdown', function() {
        beforeEach(function() {
          addElement.call(this);
          spyOn(this.controller, "setDatetime");
          let timeButton = document.querySelector(timepickerSelector + " > .form-control");
          utilities.click(timeButton);
          $scope.$digest();
        });
        it("should controller setDatetime function to be called", function() {
          expect(this.controller.setDatetime).toHaveBeenCalled();
        });
      });
    });
  });
  describe('given datetime picker ', function() {
    describe('when rendered and open timepicker dropdown', function() {
      describe('key press to change minute input field ', function() {
        beforeEach(function() {
          let d = new Date();
          d.setHours(5, 10);
          $scope.dt = d;
          addElement.call(this);
          let timeButton = document.querySelector(timepickerSelector + " .btn");
          utilities.click(timeButton);
          $scope.$digest();
          let minuteInput = document.querySelector(timepickerSelector + " .minute-input");
          utilities.triggerKeyboardEvent(minuteInput, "57");
          $scope.$digest();
        });
        it("should minute input be able to change value", function() {
          expect(this.controller.time.getMinutes()).toBe(10);
        });
      });
    });
  });
  describe('given datetime picker ', function() {
    describe('when rendered and open timepicker dropdown', function() {
      describe('key press to change hour input field ', function() {
        beforeEach(function() {
          let d = new Date();
          d.setHours(5, 10);
          $scope.dt = d;
          addElement.call(this);
          let timeButton = document.querySelector(timepickerSelector + " .btn");
          utilities.click(timeButton);
          $scope.$digest();
          let hourInput = document.querySelector(timepickerSelector + " .hour-input");
          utilities.triggerKeyboardEvent(hourInput, "57");
          $scope.$digest();
        });
        it("should hour input be able to change value", function() {
          expect(this.controller.time.getHours()).toBe(5);
        });
      });
    });
  });
  describe('given datetime picker ', function() {
    describe('when rendered and datepicker and timepicker not open', function() {
      describe('click outside area ', function() {
        beforeEach(function() {
          addElement.call(this);
          utilities.clickAwayCreationAndClick('div');
          $scope.$digest();
        });
        it("should date value remain undefined", function() {
          expect(this.controller.date).toBe(undefined);
        });
        it("should time value remain undefined", function() {
          expect(this.controller.time).toBe(undefined);
        });
      });
    });
  });

  describe('given datetime picker ', function() {
    describe('when rendered and selected date value', function() {
      describe('click clear icon ', function() {
        beforeEach(function() {
          addElement.call(this);
          spyOn(this.controller, 'setDatetime').and.callThrough();
          let timeButton = document.querySelector(timepickerSelector + " .btn");
          utilities.click(timeButton);
          $scope.$digest();
          utilities.clickAwayCreationAndClick('div');
          $scope.$digest();
          let clearIcon = document.querySelector(dateClearIconSelector);
          utilities.click(clearIcon);
          $scope.$digest();
        });
        it("should date value be null", function() {
          expect(this.controller.date).toBe(null);
        });
        it("should time value be nyll", function() {
          expect(this.controller.time).toBe(null);
        });
        it("should datetime value be undefined", function() {
          expect(this.controller.dateTimeValue).toBe(undefined);
        });
      });
    });
  });
});
