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

var timepikerConfig = {
  MINUTE_STEP: 15,
  HOUR_STEP: 1,
  MERIDIAN_ON: 'hh:mm a',
  MERIDIAN_OFF: 'HH:mm'
};

var defaultScopeTime = new Date();
var defaultMarkup = '<akam-time-picker ng-model="inputTime" is-minute-disabled="disableMinutes" show-meridian="showMeridian"></akam-time-picker>';

describe('akamTimepicker directive', function() {

  var scope, compile, self, controller, parse;

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
    controller = self.timepickerElem.isolateScope().timepicker;
    scope.$digest();

    self.element = document.body.appendChild(self.el[0]);
  };

  describe('when rendering', function() {

    it('should render all elements', function() {
      scope.inputTime = defaultScopeTime;
      addElement();

      var timepickerElem = self.element.querySelector(selectors.TIMEPICKER);
      var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);
      var timepickerBtnElem = self.element.querySelector(selectors.TIMEPICKER_BTN);
      var timepickerIconElem = self.element.querySelector(selectors.TIMEPICKER_ICON);
      var timepickerDropdown = self.element.querySelector(selectors.DROPDOWN_MENU);

      expect(timepickerElem).not.toBe(null);
      expect(timepickerInputElem).not.toBe(null);
      expect(timepickerBtnElem).not.toBe(null);
      expect(timepickerIconElem).not.toBe(null);
      expect(timepickerDropdown).not.toBe(null);

    });

    it('should render initial input value', function() {
      scope.inputTime = defaultScopeTime;
      scope.showMeridian = true;
      addElement();
      var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);

      expect(timepickerInputElem.value).not.toBe("");
      expect(timepickerInputElem.value).toContain(":");
      expect(timepickerInputElem.value.match(/[a|p]m/i).length > 0).toBeTruthy();

    });

    it('should input field contains all attributes', function() {
      scope.inputTime = defaultScopeTime;
      addElement();

      var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);

      expect(timepickerInputElem.getAttribute('placeholder')).not.toBe(undefined);
      expect(timepickerInputElem.getAttribute('time-formatter')).not.toBe(undefined);
      expect(timepickerInputElem.getAttribute('show-meridian')).not.toBe(undefined);
      expect(timepickerInputElem.getAttribute('ng-model')).not.toBe(undefined);
      expect(timepickerInputElem.getAttribute('is-minute-disabled')).not.toBe(undefined);
    });

    it("should hide the dropdown menu timepicker", function() {
      scope.inputTime = defaultScopeTime;
      addElement();

      var timepickerDropdown = self.element.querySelector(selectors.DROPDOWN_MENU);

      expect(timepickerDropdown.classList.contains("ng-hide")).toBeTruthy();
    });

    it('should downdown menu has ui bootstrap timepicker element', function() {
      scope.inputTime = defaultScopeTime;
      addElement();

      var timepickerTable = self.element.querySelector(selectors.DROPDOWN_MENU + " table");

      expect(timepickerTable).not.toBe(undefined);
    });

    it('should bootstrap timepicker element contains all attributes', function() {
      scope.inputTime = defaultScopeTime;
      addElement();

      var timepickerTable = self.element.querySelector(selectors.DROPDOWN_MENU + " table[ng-model]");

      expect(timepickerTable.getAttribute("ng-model")).not.toBe(undefined);
      expect(timepickerTable.getAttribute("show-meridian")).not.toBe(undefined);
      expect(timepickerTable.getAttribute("minute-step")).not.toBe(undefined);
      expect(timepickerTable.getAttribute("hour-step")).not.toBe(undefined);
      expect(timepickerTable.getAttribute('is-minute-disabled')).not.toBe(undefined);
    });

    it('should render time without meridian in the value display', function() {
      scope.inputTime = defaultScopeTime;
      scope.showMeridian = false;
      var markup = '<akam-time-picker ng-model="inputTime" show-meridian="showMeridian"></akam-time-picker>';
      addElement(markup);

      var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);
      expect(timepickerInputElem.value.match(/[a|p]m/i)).toBe(null);

    });

    it('should render time in disabled state', function() {
      scope.inputTime = defaultScopeTime;
      scope.disabled = true;
      var markup = '<akam-time-picker ng-model="inputTime" is-disabled="disabled"></akam-time-picker>';
      addElement(markup);

      var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);
      expect(timepickerInputElem.getAttribute("disabled")).toEqual("disabled");

    });

    it('should render placeholder default with meridian value true', function() {
      scope.inputTime = "";
      scope.showMeridian = true;
      addElement();

      var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);
      expect(timepickerInputElem.getAttribute("placeholder")).toBe(timepikerConfig.MERIDIAN_ON);

    });
  });

  describe('when rendered', function() {
    it('should button click display correct hours and minutes input values', function() {
      var date = new Date();
      date.setHours("02", "15");
      scope.inputTime = date;
      addElement();

      var timepickerBtnElem = self.element.querySelector(selectors.TIMEPICKER_BTN);
      utilities.click(timepickerBtnElem);
      scope.$digest();

      var inputs = self.element.querySelectorAll(selectors.DROPDOWN_MENU + " table input[type=text]");

      expect(inputs.length).toEqual(2);
      expect(inputs[0].value.length).toEqual(2);
      expect(inputs[0].value).toBe("02");
      expect(inputs[1].value.length).toEqual(2);
      expect(inputs[1].value).toBe("15");

    });

    it('should button click have open classes and click again no open classes', function() {
      scope.inputTime = defaultScopeTime;
      addElement();

      var timepickerBtnElem = self.element.querySelector(selectors.TIMEPICKER_BTN);
      utilities.click(timepickerBtnElem);
      scope.$digest();

      var timepickerElem = self.element.querySelector(selectors.TIMEPICKER);
      expect(timepickerElem.classList.contains("open")).toBeTruthy();
      expect(controller.isOpen).toBeTruthy();

      var dropdownElem = self.element.querySelector(selectors.DROPDOWN_MENU);
      expect(dropdownElem.classList.contains("open")).toBeTruthy();

      utilities.click(timepickerBtnElem);
      scope.$digest();

      var timepickerElem = self.element.querySelector(selectors.TIMEPICKER);
      expect(timepickerElem.classList[1]).toBe(null);
      expect(controller.isOpen).toBeFalsy();

      var dropdownElem = self.element.querySelector(selectors.DROPDOWN_MENU);
      expect(dropdownElem.classList.contains("open")).toBeFalsy();

    });

    it('should button click have open classes and click outside region again no open classes', function() {
      scope.inputTime = defaultScopeTime;
      addElement();

      var timepickerBtnElem = self.element.querySelector(selectors.TIMEPICKER_BTN);
      utilities.click(timepickerBtnElem);
      scope.$digest();

      var timepickerElem = self.element.querySelector(selectors.TIMEPICKER);
      expect(timepickerElem.classList.contains("open")).toBeTruthy();

      var dropdownElem = self.element.querySelector(selectors.DROPDOWN_MENU);
      expect(dropdownElem.classList.contains("open")).toBeTruthy();

      utilities.clickAwayCreationAndClick('div');
      scope.$digest();

      var timepickerElem = self.element.querySelector(selectors.TIMEPICKER);
      expect(timepickerElem.classList[1]).toBe(null);

      var dropdownElem = self.element.querySelector(selectors.DROPDOWN_MENU);
      expect(dropdownElem.classList.contains("ng-hide")).toBeTruthy();

    });

    it("should display correct value from increment hour and  minute region click", function() {
      var date = new Date();
      date.setHours("02", "15");
      scope.inputTime = date;
      addElement();

      var timepickerBtnElem = self.element.querySelector(selectors.TIMEPICKER_BTN);
      utilities.click(timepickerBtnElem);
      scope.$digest();

      var dropdownLinks = self.element.querySelectorAll(selectors.DROPDOWN_MENU + " .time-increment-row td a");
      utilities.click(dropdownLinks[0]);
      scope.$digest();

      var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);
      expect(timepickerInputElem.value).toContain("03");

      utilities.click(dropdownLinks[1]);
      scope.$digest();

      var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);
      expect(timepickerInputElem.value).toContain("30");
    });

    it("should display correct value from decrement hour and  minute region click", function() {
      var date = new Date();
      date.setHours("02", "15");
      scope.inputTime = date;
      addElement();

      var timepickerBtnElem = self.element.querySelector(selectors.TIMEPICKER_BTN);
      utilities.click(timepickerBtnElem);
      scope.$digest();

      var dropdownLinks = self.element.querySelectorAll(selectors.DROPDOWN_MENU + " .time-decrement-row td a");
      utilities.click(dropdownLinks[0]);
      scope.$digest();

      var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);
      expect(timepickerInputElem.value).toContain("01");

      utilities.click(dropdownLinks[1]);
      scope.$digest();

      var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);
      expect(timepickerInputElem.value).toContain("00");
    });


    it("should display meridian button on open", function() {
      scope.inputTime = defaultScopeTime;
      addElement();

      var timepickerBtnElem = self.element.querySelector(selectors.TIMEPICKER_BTN);
      utilities.click(timepickerBtnElem);
      scope.$digest();

      var meridianBtnElem = self.element.querySelector(selectors.DROPDOWN_MENU + " .meridian input");
      expect(meridianBtnElem).not.toBe(undefined);
      expect(meridianBtnElem.value.match(/[a|p]m/i)).toBeDefined();

    });

    it("should not display meridian button when showMeridian vlaue is false", function() {
      scope.inputTime = defaultScopeTime;
      scope.showMeridian = false;
      var markup = '<akam-time-picker ng-model="inputTime" show-meridian="showMeridian"></akam-time-picker>';
      addElement(markup);

      var timepickerBtnElem = self.element.querySelector(selectors.TIMEPICKER_BTN);
      utilities.click(timepickerBtnElem);
      scope.$digest();

      var meridianElem = self.element.querySelector(selectors.DROPDOWN_MENU + " .meridian");
      expect(meridianElem.classList.contains("ng-hide")).toBeTruthy();
    });
  });
  describe("directive controller", function() {

    it("should verify controller variables initial values", function() {
      scope.inputTime = defaultScopeTime;
      addElement();

      expect(controller.inputTime).toBeDefined();
      expect(angular.isDate(controller.inputTime)).toBeTruthy();
      expect(controller.isOpen).toBeFalsy();
      expect(controller.disabled).toBeFalsy();
      expect(controller.hourStep).toBe(timepikerConfig.HOUR_STEP);
      expect(controller.minuteStep).toBe(timepikerConfig.MINUTE_STEP);
      expect(controller.placeholder).toBe(timepikerConfig.MERIDIAN_ON);
      expect(controller.showMeridian).toBeTruthy();
      expect(controller.disableMinutes).toBeFalsy();
    });

    it("should verify scope values when passing in", function() {
      var date = new Date();
      date.setHours("12", "20");
      scope.inputTime = date;
      scope.disabled = true;
      var markup = '<akam-time-picker ng-model="inputTime" is-disabled="disabled"></akam-time-picker>';
      addElement(markup);

      expect(controller.inputTime.getHours()).toBe(12);
      expect(controller.inputTime.getMinutes()).toBe(20);
      expect(controller.disabled).toBeTruthy();
      expect(controller.isDisabled()).toBeTruthy();
    });

    it("should isDisabled function call with correct value", function() {
      scope.inputTime = defaultScopeTime;
      scope.disabledd = false;
      var markup = '<akam-time-picker ng-model="inputTime" is-disabled="disabledd"></akam-time-picker>';
      addElement(markup);

      expect(controller.isDisabled()).toBeFalsy();

      scope.disabledd = true;
      scope.$digest();

      expect(controller.isDisabled()).toBeTruthy();

    });

  });

});