'use strict';
var utilities = require('../utilities');

var selectors = {
  TIMEPICKER: '.akam-time-picker',
  TIMEPICKER_OPEN: '.akam-time-picker .open',
  TIMEPICKER_INPUT: '.akam-time-picker input',
  TIMEPICKER_BTN: '.akam-time-picker button',
  TIMEPICKER_ICON: '.akam-time-picker button i',
  DROPDOWN_MENU: '.akam-time-picker .dropdown-menu'
};

var formatterConfig = {
  MERIDIAN_ON: 'hh:mm a',
  MERIDIAN_OFF: 'HH:mm',
  TIME_MERIDIAN_REGEX: /^(0?[0-9]|1[0-2]):[0-5][0-9] ?[a|p]m$/i,
  TIME_REGEX: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  APM_REGEX: /[a|p]m/i
};

var defaultScopeTime = new Date();
var defaultMarkup = '<akam-time-picker ng-model="inputTime" show-meridian="showMeridian"></akam-time-picker>';

describe('timeFormatter directive', function() {

  var scope, compile, self;

  beforeEach(function() {
    inject.strictDi(true);
    self = this;
    angular.mock.module(require('../../src/time-picker').name);
    inject(function($compile, $rootScope) {
      scope = $rootScope.$new();
      compile = $compile;
    });

  });

  afterEach(function() {
    if (self.element) {
      document.body.removeChild(self.element);
      self.element = null;
    }
  });

  function addElement(markup) {
    var tpl;
    if (markup) {
      tpl = markup;
    } else {
      tpl = defaultMarkup;
    }
    tpl = '<div><form name="form">' + tpl + '</form></div>';
    self.el = compile(tpl)(scope);
    self.timepickerElem = self.el.find("akam-time-picker");
    self.isoScope = self.timepickerElem.isolateScope();
    scope.$digest();

    self.element = document.body.appendChild(self.el[0]);
  };

  describe("when rendering", function() {
    it("should have time-picker-formmater attribute defined", function() {
      scope.inputTime = defaultScopeTime;
      addElement();

      var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);
      expect(timepickerInputElem.getAttribute("time-formmater")).toBeDefined();

    });

    it('has initially the correct time & meridian is on', function() {
      var date = new Date();
      date.setHours("13", "20");
      scope.inputTime = date;
      addElement();

      var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);

      expect(timepickerInputElem.value).toBe("01:20 PM");
      expect(self.isoScope.showMeridian).toBeTruthy();
    });

    it('has initially the correct time & meridian is off', function() {
      var date = new Date();
      date.setHours("13", "20");
      scope.inputTime = date;
      scope.showMeridian = false;
      addElement();

      var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);

      expect(timepickerInputElem.value).toBe("13:20");
      expect(self.isoScope.showMeridian).toBeFalsy();
    });

    describe("validate input state...", function() {

      it("empty field should be valid state", function() {
        scope.inputTime = "";
        addElement();
        var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);

        expect(timepickerInputElem.classList.contains("ng-valid")).toBeTruthy();
        expect(timepickerInputElem.classList.contains("ng-valid-time")).toBeTruthy();

      });

      it("any character should make input validation state invaid", function() {
        scope.inputTime = "abc";
        addElement();
        var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);

        expect(timepickerInputElem.classList.contains("ng-invalid")).toBeTruthy();
        expect(timepickerInputElem.classList.contains("ng-invalid-time")).toBeTruthy();

        scope.inputTime = "12:20 PM";
        scope.$digest();

        expect(timepickerInputElem.classList.contains("ng-valid")).toBeTruthy();
        expect(timepickerInputElem.classList.contains("ng-valid-time")).toBeTruthy();
      });

      it("any date type will be valid", function() {
        scope.inputTime = new Date();
        addElement();
        var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);

        expect(timepickerInputElem.classList.contains("ng-valid")).toBeTruthy();
        expect(timepickerInputElem.classList.contains("ng-valid-time")).toBeTruthy();
      });

      it("any number type will be invalid", function() {
        scope.inputTime = 20;
        addElement();
        var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);

        expect(timepickerInputElem.classList.contains("ng-invalid")).toBeTruthy();
        expect(timepickerInputElem.classList.contains("ng-invalid-time")).toBeTruthy();
      });

      it("time regex needs to be matched to be valid ", function() {
        scope.inputTime = "111:20 am";
        var matched = scope.inputTime.match(formatterConfig.TIME_MERIDIAN_REGEX);
        addElement();

        var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);

        expect(timepickerInputElem.classList.contains("ng-invalid")).toEqual(matched === null);
        expect(timepickerInputElem.classList.contains("ng-invalid-time")).toEqual(matched === null);

        scope.inputTime = "11:20 am";
        matched = scope.inputTime.match(formatterConfig.TIME_MERIDIAN_REGEX);
        scope.$digest();

        expect(timepickerInputElem.classList.contains("ng-valid")).toEqual(matched.length > 0);
        expect(timepickerInputElem.classList.contains("ng-valid-time")).toEqual(matched.length > 0);

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

    describe("ngModel", function() {

      it('should ngModel $viewValue and $viewModel same', function() {

        scope.inputTime = new Date('Mon Mar 23 2015 14:40:11 GMT-0700 (PDT)');
        addElement();

        var ngModel = self.timepickerElem.controller("ngModel");
        expect(ngModel.$viewValue).toBe(scope.inputTime);
        expect(ngModel.$modelValue).toBe(scope.inputTime);
      });

      it('should ngModel value changes when call $setViewValue function', function() {

        scope.inputTime = defaultScopeTime;
        var myTime = new Date('Mon Mar 23 2015 14:40:11 GMT-0700 (PDT)');
        addElement();

        var ngModel = self.timepickerElem.controller("ngModel");
        ngModel.$setViewValue(myTime);

        expect(ngModel.$viewValue).toBe(scope.inputTime);
        expect(ngModel.$modelValue).toBe(scope.inputTime);

      });

      it('should ngModel value changes when call $render function', function() {

        scope.inputTime = defaultScopeTime;
        var myTime = new Date('Mon Mar 23 2015 14:40:11 GMT-0700 (PDT)');
        addElement();

        var ngModel = self.timepickerElem.controller("ngModel");
        expect(typeof ngModel.$render).toBe("function");

      });

    })
  });
});
