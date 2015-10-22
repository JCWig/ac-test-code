'use strict';
let utilities = require('../utilities');

let selectors = {
  TIMEPICKER: '.akam-time-picker',
  TIMEPICKER_OPEN: '.akam-time-picker .open',
  TIMEPICKER_INPUT: '.akam-time-picker input',
  TIMEPICKER_BTN: '.akam-time-picker button',
  TIMEPICKER_ICON: '.akam-time-picker button i',
  DROPDOWN_MENU: '.akam-time-picker .dropdown-menu'
};

let timepikerConfig = {
  MINUTE_STEP: 15,
  HOUR_STEP: 1,
  MERIDIAN_ON: 'hh:mm a',
  MERIDIAN_OFF: 'HH:mm'
};

let defaultScopeTime = new Date();
let defaultMarkup = '<akam-time-picker ng-model="inputTime" is-minute-disabled="disableMinutes" show-meridian="showMeridian"></akam-time-picker>';

describe('akamTimepicker directive', function() {

  let scope, compile, timepicker;

  beforeEach(function() {
    inject.strictDi(true);
    angular.mock.module(require('../../src/time-picker').name);
    inject(function($compile, $rootScope) {
      scope = $rootScope.$new();
      compile = $compile;
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
    timepicker = this.timepickerElem.isolateScope().timepicker;
    scope.$digest();

    this.element = document.body.appendChild(this.el[0]);
  };

  describe('when rendering', function() {

    it('should render all elements', function() {
      scope.inputTime = defaultScopeTime;
      addElement.call(this);

      let timepickerElem = this.element.querySelector(selectors.TIMEPICKER);
      let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
      let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
      let timepickerIconElem = this.element.querySelector(selectors.TIMEPICKER_ICON);
      let timepickerDropdown = this.element.querySelector(selectors.DROPDOWN_MENU);

      expect(timepickerElem).not.toBe(null);
      expect(timepickerInputElem).not.toBe(null);
      expect(timepickerBtnElem).not.toBe(null);
      expect(timepickerIconElem).not.toBe(null);
      expect(timepickerDropdown).not.toBe(null);

    });

    it('should render initial input value', function() {
      scope.inputTime = defaultScopeTime;
      scope.showMeridian = true;
      addElement.call(this);
      let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);

      expect(timepickerInputElem.value).not.toBe("");
      expect(timepickerInputElem.value).toContain(":");
      expect(timepickerInputElem.value.match(/[a|p]m/i).length > 0).toBeTruthy();

    });

    it('should input field contains all attributes', function() {
      scope.inputTime = defaultScopeTime;
      addElement.call(this);

      let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);

      expect(timepickerInputElem.getAttribute('placeholder')).not.toBe(undefined);
      expect(timepickerInputElem.getAttribute('time-formatter')).not.toBe(undefined);
      expect(timepickerInputElem.getAttribute('show-meridian')).not.toBe(undefined);
      expect(timepickerInputElem.getAttribute('ng-model')).not.toBe(undefined);
      expect(timepickerInputElem.getAttribute('is-minute-disabled')).not.toBe(undefined);
    });

    it("should hide the dropdown menu timepicker", function() {
      scope.inputTime = defaultScopeTime;
      addElement.call(this);

      let timepickerDropdown = this.element.querySelector(selectors.DROPDOWN_MENU);

      expect(timepickerDropdown.classList.contains("ng-hide")).toBeTruthy();
    });

    it('should downdown menu has ui bootstrap timepicker element', function() {
      scope.inputTime = defaultScopeTime;
      addElement.call(this);

      let timepickerTable = this.element.querySelector(selectors.DROPDOWN_MENU + " table");

      expect(timepickerTable).not.toBe(undefined);
    });

    it('should bootstrap timepicker element contains all attributes', function() {
      scope.inputTime = defaultScopeTime;
      addElement.call(this);

      let timepickerTable = this.element.querySelector(selectors.DROPDOWN_MENU + " table[ng-model]");

      expect(timepickerTable.getAttribute("ng-model")).not.toBe(undefined);
      expect(timepickerTable.getAttribute("show-meridian")).not.toBe(undefined);
      expect(timepickerTable.getAttribute("minute-step")).not.toBe(undefined);
      expect(timepickerTable.getAttribute("hour-step")).not.toBe(undefined);
      expect(timepickerTable.getAttribute('is-minute-disabled')).not.toBe(undefined);
    });

    it('should render time without meridian in the value display', function() {
      scope.inputTime = defaultScopeTime;
      scope.showMeridian = false;
      let markup = '<akam-time-picker ng-model="inputTime" show-meridian="showMeridian"></akam-time-picker>';
      addElement.call(this, markup);

      let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
      expect(timepickerInputElem.value.match(/[a|p]m/i)).toBe(null);

    });

    it('should render time in disabled state', function() {
      scope.inputTime = defaultScopeTime;
      scope.disabled = true;
      let markup = '<akam-time-picker ng-model="inputTime" is-disabled="disabled"></akam-time-picker>';
      addElement.call(this, markup);

      let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
      expect(timepickerInputElem.getAttribute("disabled")).toEqual("disabled");

    });

    it('should render placeholder default with meridian value true', function() {
      scope.inputTime = "";
      scope.showMeridian = true;
      addElement.call(this);

      let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
      expect(timepickerInputElem.getAttribute("placeholder")).toBe(timepikerConfig.MERIDIAN_ON);

    });
  });

  describe('when rendered', function() {
    it('should button click display correct hours and minutes input values', function() {
      let date = new Date();
      date.setHours("02", "15");
      scope.inputTime = date;
      addElement.call(this);

      let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
      utilities.click(timepickerBtnElem);
      scope.$digest();

      let inputs = this.element.querySelectorAll(selectors.DROPDOWN_MENU + " table input[type=text]");

      expect(inputs.length).toEqual(2);
      expect(inputs[0].value.length).toEqual(2);
      expect(inputs[0].value).toBe("02");
      expect(inputs[1].value.length).toEqual(2);
      expect(inputs[1].value).toBe("15");

    });

    it('should button click have open classes and click again no open classes', function() {
      scope.inputTime = defaultScopeTime;
      addElement.call(this);

      let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
      utilities.click(timepickerBtnElem);
      scope.$digest();

      let timepickerElem = this.element.querySelector(selectors.TIMEPICKER);
      expect(timepickerElem.classList.contains("open")).toBeTruthy();
      expect(timepicker.isOpen).toBeTruthy();

      let dropdownElem = this.element.querySelector(selectors.DROPDOWN_MENU);
      expect(dropdownElem.classList.contains("open")).toBeTruthy();

      utilities.click(timepickerBtnElem);
      scope.$digest();

      timepickerElem = this.element.querySelector(selectors.TIMEPICKER);
      expect(timepickerElem.classList[1]).toBe(null);
      expect(timepicker.isOpen).toBeFalsy();

      dropdownElem = this.element.querySelector(selectors.DROPDOWN_MENU);
      expect(dropdownElem.classList.contains("open")).toBeFalsy();

    });

    it('should button click have open classes and click outside region again no open classes', function() {
      scope.inputTime = defaultScopeTime;
      addElement.call(this);

      let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
      utilities.click(timepickerBtnElem);
      scope.$digest();

      let timepickerElem = this.element.querySelector(selectors.TIMEPICKER);
      expect(timepickerElem.classList.contains("open")).toBeTruthy();

      let dropdownElem = this.element.querySelector(selectors.DROPDOWN_MENU);
      expect(dropdownElem.classList.contains("open")).toBeTruthy();

      utilities.clickAwayCreationAndClick('div');
      scope.$digest();

      timepickerElem = this.element.querySelector(selectors.TIMEPICKER);
      expect(timepickerElem.classList[1]).toBe(null);

      dropdownElem = this.element.querySelector(selectors.DROPDOWN_MENU);
      expect(dropdownElem.classList.contains("ng-hide")).toBeTruthy();

    });

    it("should display correct value from increment hour and  minute region click", function() {
      let date = new Date();
      date.setHours("02", "15");
      scope.inputTime = date;
      addElement.call(this);

      let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
      utilities.click(timepickerBtnElem);
      scope.$digest();

      let dropdownLinks = this.element.querySelectorAll(selectors.DROPDOWN_MENU + " .time-increment-row td a");
      utilities.click(dropdownLinks[0]);
      scope.$digest();

      let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
      expect(timepickerInputElem.value).toContain("03");

      utilities.click(dropdownLinks[1]);
      scope.$digest();

      timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
      expect(timepickerInputElem.value).toContain("30");
    });

    it("should display correct value from decrement hour and  minute region click", function() {
      let date = new Date();
      date.setHours("02", "15");
      scope.inputTime = date;
      addElement.call(this);

      let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
      utilities.click(timepickerBtnElem);
      scope.$digest();

      let dropdownLinks = this.element.querySelectorAll(selectors.DROPDOWN_MENU + " .time-decrement-row td a");
      utilities.click(dropdownLinks[0]);
      scope.$digest();

      let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
      expect(timepickerInputElem.value).toContain("01");

      utilities.click(dropdownLinks[1]);
      scope.$digest();

      timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
      expect(timepickerInputElem.value).toContain("00");
    });


    it("should display meridian button on open", function() {
      scope.inputTime = defaultScopeTime;
      addElement.call(this);

      let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
      utilities.click(timepickerBtnElem);
      scope.$digest();

      let meridianBtnElem = this.element.querySelector(selectors.DROPDOWN_MENU + " .meridian input");
      expect(meridianBtnElem).not.toBe(undefined);
      expect(meridianBtnElem.value.match(/[a|p]m/i)).toBeDefined();

    });

    it("should not display meridian button when showMeridian vlaue is false", function() {
      scope.inputTime = defaultScopeTime;
      scope.showMeridian = false;
      let markup = '<akam-time-picker ng-model="inputTime" show-meridian="showMeridian"></akam-time-picker>';
      addElement.call(this, markup);

      let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
      utilities.click(timepickerBtnElem);
      scope.$digest();

      let meridianInputElem = this.element.querySelector(selectors.DROPDOWN_MENU + " .meridian input");
      expect(meridianInputElem.classList.contains("ng-hide")).toBeTruthy();
    });
  });
  describe("directive timepicker", function() {

    it("should verify timepicker letiables initial values", function() {
      scope.inputTime = defaultScopeTime;
      addElement.call(this);

      expect(timepicker.inputTime).toBeDefined();
      expect(angular.isDate(timepicker.inputTime)).toBeTruthy();
      expect(timepicker.isOpen).toBeFalsy();
      expect(timepicker.disabled).toBeFalsy();
      expect(timepicker.hourStep).toBe(timepikerConfig.HOUR_STEP);
      expect(timepicker.minuteStep).toBe(timepikerConfig.MINUTE_STEP);
      expect(timepicker.placeholder).toBe(timepikerConfig.MERIDIAN_ON);
      expect(timepicker.showMeridian).toBeTruthy();
      expect(timepicker.disableMinutes).toBeFalsy();
    });

    it("should verify scope values when passing in", function() {
      let date = new Date();
      date.setHours("12", "20");
      scope.inputTime = date;
      scope.disabled = true;
      let markup = '<akam-time-picker ng-model="inputTime" is-disabled="disabled"></akam-time-picker>';
      addElement.call(this, markup);

      expect(timepicker.inputTime.getHours()).toBe(12);
      expect(timepicker.inputTime.getMinutes()).toBe(20);
      expect(timepicker.disabled).toBeTruthy();
      expect(timepicker.isDisabled()).toBeTruthy();
    });

    it("should isDisabled function call with correct value", function() {
      scope.inputTime = defaultScopeTime;
      scope.disabledd = false;
      let markup = '<akam-time-picker ng-model="inputTime" is-disabled="disabledd"></akam-time-picker>';
      addElement.call(this, markup);

      expect(timepicker.isDisabled()).toBeFalsy();

      scope.disabledd = true;
      scope.$digest();

      expect(timepicker.isDisabled()).toBeTruthy();

    });

  });

  describe('When directive rendered', function() {
    describe('listening element input fields', function() {
      describe('when input changed', function() {
        beforeEach(function() {
          scope.inputTime = defaultScopeTime;
          addElement.call(this);
          spyOn(timepicker, 'changed');
          let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
          utilities.click(timepickerBtnElem);
          scope.$digest();

          let dropdownLinks = this.element.querySelectorAll(selectors.DROPDOWN_MENU + " .time-increment-row td a");
          utilities.click(dropdownLinks[0]);
          scope.$digest();
        });
        it("should controller function changed called", function() {
          expect(timepicker.changed).toHaveBeenCalled();
        })
      });
    });
  });

  describe('When directive rendering', function() {
    describe('given minute-step new value of 12', function() {
      beforeEach(function() {
        scope.inputTime = defaultScopeTime;
        let markup = '<akam-time-picker ng-model="inputTime" minute-step="minuteStep"></akam-time-picker>';
        scope.minuteStep = 12;
        addElement.call(this, markup);
      });
      it("should timepicker minuteStep value change to 12", function() {
        expect(timepicker.minuteStep).toBe(12);
      })
    });
  });

  describe('When directive rendering', function() {
    describe('given hour-step new value of 2', function() {
      beforeEach(function() {
        scope.inputTime = defaultScopeTime;
        let markup = '<akam-time-picker ng-model="inputTime" hour-step="hourStep"></akam-time-picker>';
        scope.hourStep = 12;
        addElement.call(this, markup);
      });
      it("should timepicker hourStep value change to 2", function() {
        expect(timepicker.hourStep).toBe(12);
      })
    });
  });

  describe('When timepicker rendered', function() {
    describe('given no initial time value', function() {
      describe('click timepicker to open', function() {
        beforeEach(function() {
          addElement.call(this);
          spyOn(timepicker, "toggle").and.callThrough();
          spyOn(timepicker, "changed").and.callThrough();
          let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
          utilities.click(timepickerBtnElem);
          scope.$digest();
        });
        it("should timepicker inputTime to be assigned date", function() {
          expect(angular.isDate(timepicker.inputTime)).toBe(true);
        });
        it("should timepicker inputTime with current hours", function() {
          expect(timepicker.inputTime.getHours()).toBe(new Date().getHours());
        });
        it("should timepicker inputTime with current minutes", function() {
          expect(timepicker.inputTime.getMinutes()).toBe(new Date().getMinutes());
        });
        it("should timepicker toggle function have been called", function() {
          expect(timepicker.toggle).toHaveBeenCalled();
        });
        it("should timepicker changed function have been called", function() {
          expect(timepicker.changed).toHaveBeenCalled();
        });
      });
    });
  });

  describe('given timepicker open', function() {
    describe('click timepicker dropdown region', function() {
      let timepickerElem;
      beforeEach(function() {
        addElement.call(this);
        let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
        utilities.click(timepickerBtnElem);
        scope.$digest();
        let dropdownElement = this.element.querySelector('.dropdown-menu');
        utilities.click(dropdownElement);
        scope.$digest();
        timepickerElem = this.element.querySelector(selectors.TIMEPICKER);
      });
      it("the timepicker should remain open", function() {
        expect(timepickerElem.classList.contains("open")).toBe(true);
      });
    });
  });

  describe('given timepicker open', function() {
    describe('click outside of timepicker dropdown region', function() {
      let timepickerElem;
      beforeEach(function() {
        addElement.call(this);
        let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
        utilities.click(timepickerBtnElem);
        scope.$digest();
        utilities.clickAwayCreationAndClick("div");
        scope.$digest();
        timepickerElem = this.element.querySelector(selectors.TIMEPICKER);
      });
      it("the timepicker should close", function() {
        expect(timepickerElem.classList.contains("open")).toBe(false);
      });
    });
  });


  describe('given no initial time value', function() {
    describe('when rendered', function() {
      describe('click timepicker to open', function() {
        describe('given empty value to hour input, then click outside to close', function() {
          beforeEach(function() {
            addElement.call(this);
            let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
            utilities.click(timepickerBtnElem);
            scope.$digest();
            let hourInputElem = this.element.querySelector(".hour-input");
            hourInputElem.value = "";
            scope.$digest();
            utilities.clickAwayCreationAndClick("div");
            scope.$digest();
          });
          it("timepicker input should close", function() {
            expect(timepicker.isOpen).toBe(false);
          });
          it("timepicker input should default back to valid time", function() {
            expect(angular.isDate(timepicker.inputTime)).toBe(true);
          });
        });
      });
    });
  });
  describe('given no initial time value', function() {
    describe('when rendered', function() {
      describe('click timepicker to open', function() {
        describe('given empty value to hour input, then click outside to close', function() {
          beforeEach(function() {
            addElement.call(this);
            let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
            utilities.click(timepickerBtnElem);
            scope.$digest();
            let minuteInputElem = this.element.querySelector(".hour-input");
            minuteInputElem.value = "";
            scope.$digest();
            utilities.clickAwayCreationAndClick("div");
            scope.$digest();
          });
          it("timepicker input should close", function() {
            expect(timepicker.isOpen).toBe(false);
          });
          it("timepicker input should default back to valid time", function() {
            expect(angular.isDate(timepicker.inputTime)).toBe(true);
          });
        });
      });
    });
  });
  describe('given no initial time value', function() {
    describe('when rendered', function() {
      describe('click timepicker to open', function() {
        describe('given invalid value to inputTime, then click outside to close', function() {
          beforeEach(function() {
            addElement.call(this);
            let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
            utilities.click(timepickerBtnElem);
            scope.$digest();
            timepicker.inputTime = "";
            scope.$digest();
            utilities.clickAwayCreationAndClick("div");
            scope.$digest();
          });
          it("timepicker input should close", function() {
            expect(timepicker.isOpen).toBe(false);
          });
          it("timepicker input should default back to valid time", function() {
            expect(angular.isDate(timepicker.inputTime)).toBe(true);
          });
        });
      });
    });
  });
});
