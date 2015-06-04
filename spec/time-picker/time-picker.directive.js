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
var defaultMarkup = '<akam-time-picker ng-model="inputTime"></akam-time-picker>';

describe('akam-time-picker', function() {

  var scope, timeout, compile, self;

  beforeEach(function() {
    inject.strictDi(true);
    self = this;
    angular.mock.module(require('../../src/time-picker').name);
    inject(function($compile, $rootScope, $timeout) {
      scope = $rootScope.$new();
      timeout = $timeout;
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
      addElement();
      var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);

      expect(timepickerInputElem.value).not.toBe("");
      expect(timepickerInputElem.value).toContain(":");
      expect(timepickerInputElem.value.match(/[a|p]m/i).length > 0).toBe(true);

    });

    it('should input field contains all attributes', function() {
      scope.inputTime = defaultScopeTime;
      addElement();

      var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);

      expect(timepickerInputElem.getAttribute('placeholder')).not.toBe(undefined);
      expect(timepickerInputElem.getAttribute('time-formatter')).not.toBe(undefined);
      expect(timepickerInputElem.getAttribute('show-meridian')).not.toBe(undefined);
      expect(timepickerInputElem.getAttribute('ng-model')).not.toBe(undefined);
    });

    it("should hide the dropdown menu timepicker", function() {
      scope.inputTime = defaultScopeTime;
      addElement();

      var timepickerDropdown = self.element.querySelector(selectors.DROPDOWN_MENU);

      expect(timepickerDropdown.classList[1]).toBe("ng-hide");
    })

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
    });

    it('should render time without meridian in the value display', function() {
      scope.inputTime = defaultScopeTime;
      scope.showMeridian = false;
      var markup = '<akam-time-picker ng-model="inputTime" show-meridian="showMeridian"></akam-time-picker>';
      addElement(markup);

      var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);
      expect(timepickerInputElem.value.match(/[a|p]m/i)).toBe(null);

    });

    it('should render time without meridian in the value display', function() {
      scope.inputTime = defaultScopeTime;
      scope.disabled = true;
      var markup = '<akam-time-picker ng-model="inputTime" disabled="disabled"></akam-time-picker>';
      addElement(markup);

      var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);
      expect(timepickerInputElem.getAttribute("disabled")).toEqual("disabled");

    });

    it('should render placeholder default with meridian value', function() {
      scope.inputTime = defaultScopeTime;
      addElement();

      var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);

      expect(timepickerInputElem.getAttribute("placeholder")).toBe(timepikerConfig.MERIDIAN_ON);

    });

    it('should render placeholder without meridian value', function() {
      scope.inputTime = defaultScopeTime;
      scope.showMeridian = false;
      var markup = '<akam-time-picker ng-model="inputTime" show-meridian="showMeridian"></akam-time-picker>';
      addElement(markup);

      var timepickerInputElem = self.element.querySelector(selectors.TIMEPICKER_INPUT);

      expect(timepickerInputElem.getAttribute("placeholder")).toBe(timepikerConfig.MERIDIAN_OFF);

    });

    /*
        it('should render time hour step of 2', function() {
          scope.inputTime = defaultScopeTime;
          scope.hourStep = 2;
          var markup = '<akam-time-picker ng-model="inputTime" hour-step="hourStep"></akam-time-picker>';
          addElement(markup);



          var timepickerTable = self.element.querySelector(selectors.DROPDOWN_MENU+" table");

    console.log(timepickerTable)

          expect(timepickerTable.getAttribute("hour-step")).toEqual(2);

        });

        it('should render time minute step of 20', function() {
          scope.inputTime = defaultScopeTime;
          scope.minuteStep = 20;
          var markup = '<akam-time-picker ng-model="inputTime" minute-step="minuteStep"></akam-time-picker>';
          addElement(markup);

          var timepickerTable = self.element.querySelector(selectors.DROPDOWN_MENU+" table");
          expect(timepickerTable.getAttribute("minute-step")).toEqual(20);

        });

    */
  });

  describe('when rendered', function() {
    it('should button click display correct hours and minutes input values', function() {
      scope.inputTime = defaultScopeTime;
      addElement();

      var timepickerBtnElem = self.element.querySelector(selectors.TIMEPICKER_BTN);
      utilities.click(timepickerBtnElem);
      scope.$digest();

      var timepickerTable = self.element.querySelector(selectors.DROPDOWN_MENU+" table");
      var inputs = self.element.querySelectorAll(selectors.DROPDOWN_MENU+" table input[type=text]");

      expect(inputs.length).toEqual(2);
      expect(inputs[0].value.length).toEqual(2);
      expect(inputs[1].value.length).toEqual(2);
    });

    it("should display meridian button on open", function() {

    });

    it("should not display meridian button when showMeridian vlaue is false", function() {

    });

  });

});
