'use strict';
/* globals angular, beforeEach, afterEach, spyOn, jasmine */
let utilities = require('../utilities');

let selectors = {
  TIMEPICKER: '.akam-time-picker',
  TIMEPICKER_OPEN: '.akam-time-picker .open',
  TIMEPICKER_INPUT: '.akam-time-picker input',
  TIMEPICKER_BTN: '.akam-time-picker button',
  TIMEPICKER_ICON: '.akam-time-picker button i',
  DROPDOWN_MENU: '.akam-time-picker .dropdown-menu'
};

let formatterConfig = {
  MERIDIAN_ON: 'hh:mm a',
  MERIDIAN_OFF: 'HH:mm',
  TIME_MERIDIAN_REGEX: /^(0?[0-9]|1[0-2]):[0-5][0-9] ?[a|p]m$/i,
  TIME_REGEX: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  APM_REGEX: /[a|p]m/i
};

let defaultScopeTime = new Date();
let defaultMarkup = '<akam-time-picker ng-model="inputTime" show-meridian="showMeridian"></akam-time-picker>';

describe('timeFormatter directive', function() {

  let scope, compile, timeout;

  beforeEach(function() {
    inject.strictDi(true);
    angular.mock.module(require('../../src/time-picker').name);
    inject(function($compile, $rootScope, $timeout) {
      scope = $rootScope.$new();
      compile = $compile;
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
    let tpl;
    if (markup) {
      tpl = markup;
    } else {
      tpl = defaultMarkup;
    }
    tpl = '<div><form name="form">' + tpl + '</form></div>';
    this.el = compile(tpl)(scope);
    this.timepickerElem = this.el.find("akam-time-picker");
    this.isolateScope = this.timepickerElem.isolateScope();
    this.timepicker = this.isolateScope.timepicker;
    scope.$digest();

    this.element = document.body.appendChild(this.el[0]);
    this.formatterScope = angular.element(this.element.querySelector("input")).isolateScope();
    this.formatter = this.formatterScope.timepickerFormatter;
  };

  describe("when rendering", function() {
    it("should have time-picker-formmater attribute defined", function() {
      scope.inputTime = defaultScopeTime;
      addElement.call(this);

      let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
      expect(timepickerInputElem.getAttribute("time-formmater")).toBeDefined();
    });

    it('has initially the correct time & meridian is on', function() {
      let date = new Date();
      date.setHours("13", "20");
      scope.inputTime = date;
      scope.showMeridian = true;
      addElement.call(this);

      let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);

      expect(timepickerInputElem.value).toBe("01:20 PM");
      expect(this.timepicker.showMeridian).toBeTruthy();
    });

    it('has initially the correct time & meridian is off', function() {
      let date = new Date();
      date.setHours("13", "20");
      scope.inputTime = date;
      scope.showMeridian = false;
      addElement.call(this);

      let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);

      expect(timepickerInputElem.value).toBe("13:20");
      expect(this.timepicker.showMeridian).toBeFalsy();
    });

    describe("validate input state...", function() {

      it("empty field should not be valid state", function() {
        scope.inputTime = "";
        addElement.call(this);
        let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);

        expect(timepickerInputElem.classList.contains("ng-invalid")).toBeTruthy();
        expect(timepickerInputElem.classList.contains("ng-invalid-time")).toBeTruthy();
      });

      it("any character should make input validation state invaid", function() {
        scope.inputTime = "abc";

        addElement.call(this);
        let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);

        expect(timepickerInputElem.classList.contains("ng-invalid")).toBeTruthy();
        expect(timepickerInputElem.classList.contains("ng-invalid-time")).toBeTruthy();
      });

      it("any date type will be valid", function() {
        scope.inputTime = new Date();
        addElement.call(this);
        let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);

        expect(timepickerInputElem.classList.contains("ng-valid")).toBeTruthy();
        expect(timepickerInputElem.classList.contains("ng-valid-time")).toBeTruthy();
      });

      it("any number type will be invalid", function() {
        scope.inputTime = 20;
        addElement.call(this);
        let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);

        expect(timepickerInputElem.classList.contains("ng-invalid")).toBeTruthy();
        expect(timepickerInputElem.classList.contains("ng-invalid-time")).toBeTruthy();
      });

      it("time regex needs to be matched to be valid ", function() {
        scope.inputTime = "111:20 am";
        let matched = scope.inputTime.match(formatterConfig.TIME_MERIDIAN_REGEX);
        addElement.call(this);

        let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);

        expect(timepickerInputElem.classList.contains("ng-invalid")).toEqual(matched === null);
        expect(timepickerInputElem.classList.contains("ng-invalid-time")).toEqual(matched === null);

        scope.inputTime = "11:20 am";
        scope.showMeridian = false;
        matched = scope.inputTime.match(formatterConfig.TIME_REGEX);
        scope.$digest();

        expect(timepickerInputElem.classList.contains("ng-invalid")).toEqual(matched === null);
        expect(timepickerInputElem.classList.contains("ng-invalid-time")).toEqual(matched === null);

        scope.inputTime = "11:20";
        scope.showMeridian = false;
        matched = scope.inputTime.match(formatterConfig.TIME_REGEX);
        scope.$digest();

        expect(timepickerInputElem.classList.contains("ng-valid")).toEqual(matched.length > 0);
        expect(timepickerInputElem.classList.contains("ng-valid-time")).toEqual(matched.length > 0);
      });
    });
    describe('when minute selector is disabled', function() {
      beforeEach(function() {
        scope.timepicker = [];
        scope.timepicker.inputTime = new Date();
        scope.disableMinutes = true;
        scope.showMeridian = true;
        let markeup = '<akam-time-picker ng-model="timepicker.inputTime" is-minute-disabled="disableMinutes" show-meridian="vm.showMeridian">';
        addElement.call(this, markeup);
      });
      it('should disable minute up arrow in popup', function() {
        let upArrow = this.element.querySelector('.time-increment-row .minute i');
        expect(upArrow.getAttribute('disabled')).toBeDefined();
      });
      it('should disable minute down arrow in popup', function() {
        let downArrow = this.element.querySelector('.time-decrement-row .minute i');
        expect(downArrow.getAttribute('disabled')).toBeDefined();
      });
      it('should disable minute input in popup', function() {
        let minInput = this.element.querySelector('.minute input');
        expect(minInput.getAttribute('disabled')).toBeDefined();
      });
      it('should change inputTime minutes to 0', function() {
        expect(scope.timepicker.inputTime.getMinutes()).toBe(0);
      });
      describe('when timepicker input field is changed', function() {
        beforeEach(function() {
          scope.timepicker = [];
          scope.timepicker.inputTime = new Date();
          scope.disableMinutes = true;
          scope.showMeridian = true;
          let markeup = '<akam-time-picker ng-model="timepicker.inputTime" is-minute-disabled="disableMinutes" show-meridian="vm.showMeridian">';
          addElement.call(this, markeup);
        });
        it('should invalidate input if minute is not 0', function() {
          let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
          timepickerInputElem.value = '11:11 PM';
          angular.element(timepickerInputElem).triggerHandler('change');
          this.timepicker.changed();
          scope.$digest();

          expect(timepickerInputElem.classList.contains('ng-invalid')).toBeTruthy();
          expect(timepickerInputElem.classList.contains('ng-invalid-time')).toBeTruthy();
          expect(scope.timepicker.inputTime).toBe(undefined);
        });
      });
      describe('when inputTime is changed from timepicker input', function() {
        beforeEach(function() {
          scope.timepicker = [];
          scope.timepicker.inputTime = new Date();
          scope.disableMinutes = true;
          scope.showMeridian = true;
          let markeup = '<akam-time-picker ng-model="timepicker.inputTime" is-minute-disabled="disableMinutes" show-meridian="vm.showMeridian">';

          addElement.call(this, markeup);

          let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
          timepickerInputElem.value = '01:15 PM';
          angular.element(timepickerInputElem).triggerHandler('change');
          this.timepicker.changed();
          scope.$digest();
        });
        describe('when clicking on hour up arrow', function() {
          it('should set inputTime minute to 0', function() {
            let upArrow = this.element.querySelector('.akam-time-picker .dropdown-menu .hour-up-btn');

            expect(scope.timepicker.inputTime).toBe(undefined);
            utilities.click(upArrow);
            expect(scope.timepicker.inputTime.getMinutes()).toEqual(0);
          });
        });
        describe('when clicking on hour down arrow', function() {
          it('should set inputTime minute to 0', function() {
            let downArrow = this.element.querySelector('.akam-time-picker .dropdown-menu .hour-down-btn');

            expect(scope.timepicker.inputTime).toBe(undefined);
            utilities.click(downArrow);
            expect(scope.timepicker.inputTime.getMinutes()).toBe(0);
          });
        });
      });
    });
  });
  describe('When timepicker rendered', function() {
    describe('given new minuteStep value and not number', function() {
      beforeEach(function() {
        scope.inputTime = new Date();
        addElement.call(this);
        this.formatter.minuteStep = "abc";
        scope.$digest();
      });
      it('minuteStep value should default to 15', function() {
        expect(this.formatter.minuteStep).toBe(15);
      })
    });
  });

  describe('When timepicker rendered', function() {
    describe('given new hourStep value and not number', function() {
      beforeEach(function() {
        scope.inputTime = new Date();
        addElement.call(this);
        this.formatter.hourStep = "abc";
        scope.$digest();
      });
      it('hourStep value should default to 1', function() {
        expect(this.formatter.hourStep).toBe(1);
      });
    });
  });

  describe('When timepicker rendered', function() {
    describe('given valid time string and scope not initialized', function() {
      describe('verify scope static function parse', function() {
        beforeEach(function() {
          scope.inputTime = '12:15 PM';
          addElement.call(this);
          spyOn(this.formatter.constructor, 'parse').and.callThrough();
          scope.inputTime = '12:15 AM';
          scope.$digest();
        });
        it('parse method called', function() {
          expect(this.formatter.constructor.parse).toHaveBeenCalled()
        });
      });
    });
  });

  describe('When timepicker rendered', function() {
    describe('given invalid time and scope already initialized  ', function() {
      describe('verify scope static function parse ', function() {
        beforeEach(function() {
          scope.inputTime = '12:15 PM';
          addElement.call(this);
          timeout.flush();
          spyOn(this.formatter.constructor, 'parse').and.callThrough();
          scope.inputTime = undefined;
          scope.$digest();
        });
        it('parse method not called', function() {
          expect(this.formatter.constructor.parse).not.toHaveBeenCalled()
        });
      });
    });
  });
});
