/* eslint-disable max-nested-callbacks */
/*global angular, inject*/

import timepickerDirective from '../../src/time-picker';
import utilities from '../utilities';

const selectors = Object.freeze({
  TIMEPICKER: '.akam-time-picker',
  TIMEPICKER_OPEN: '.akam-time-picker .open',
  TIMEPICKER_INPUT: '.akam-time-picker input',
  TIMEPICKER_BTN: '.akam-time-picker button',
  TIMEPICKER_ICON: '.akam-time-picker button i',
  DROPDOWN_MENU: '.akam-time-picker .dropdown-menu'
});

const timepikerConfig = Object.freeze({
  MINUTE_STEP: 15,
  HOUR_STEP: 1,
  MERIDIAN_ON: 'hh:mm a',
  MERIDIAN_OFF: 'HH:mm'
});

let defaultScopeTime = new Date();
const DEFAULT_MARKUP = '<akam-time-picker ng-model="inputTime" is-minute-disabled="disableMinutes" show-meridian="showMeridian"></akam-time-picker>';

describe('akamTimepicker directive', function() {

  function addElement(markup) {
    let tpl;

    tpl = markup ? markup : DEFAULT_MARKUP;
    tpl = `<div><form name='form'>${tpl}</form></div>`;

    this.el = this.$compile(tpl)(this.$scope);
    this.timepickerElem = this.el.find('akam-time-picker');
    this.timepicker = this.timepickerElem.isolateScope().timepicker;
    this.$scope.$digest();
    this.element = document.body.appendChild(this.el[0]);
  }

  beforeEach(function() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(timepickerDirective.name);
    inject(function(_$compile_, $rootScope) {
      this.$scope = $rootScope.$new();
      this.$compile = _$compile_;
      this.addElement = addElement;
      this.$scope.readOnly = true;
    });
  });

  afterEach(function() {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    this.element = null;
  });

  describe('given a time picker', function() {
    describe('when rendered', function() {
      beforeEach(function() {
        this.$scope.inputTime = defaultScopeTime;
        this.addElement();
      });
      it('should render all elements', function() {
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
    });

    describe('when rendered', function() {
      beforeEach(function() {
        this.$scope.inputTime = defaultScopeTime;
        this.$scope.showMeridian = true;
        this.addElement();
      });
      it('should render initial input value', function() {
        let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);

        expect(timepickerInputElem.value).not.toBe('');
        expect(timepickerInputElem.value).toContain(':');
        expect(timepickerInputElem.value.match(/[a|p]m/i).length > 0).toBe(true);
      });
    });

    describe('when rendered', function() {
      beforeEach(function() {
        this.$scope.inputTime = defaultScopeTime;
        this.addElement();
      });
      it('should input field contains all attributes', function() {
        let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);

        expect(timepickerInputElem.getAttribute('placeholder')).not.toBe(undefined);
        expect(timepickerInputElem.getAttribute('time-formatter')).not.toBe(undefined);
        expect(timepickerInputElem.getAttribute('show-meridian')).not.toBe(undefined);
        expect(timepickerInputElem.getAttribute('ng-model')).not.toBe(undefined);
        expect(timepickerInputElem.getAttribute('is-minute-disabled')).not.toBe(undefined);
      });
      it('should hide the dropdown menu timepicker', function() {
        let timepickerDropdown = this.element.querySelector(selectors.DROPDOWN_MENU);
        expect(timepickerDropdown.classList.contains('ng-hide')).toBe(true);
      });
      it('should hide the dropdown menu timepicker', function() {
        let timepickerDropdown = this.element.querySelector(selectors.DROPDOWN_MENU);
        expect(timepickerDropdown.classList.contains('ng-hide')).toBe(true);
      });
      it('should render ui bootstrap timepicker element', function() {
        let timepickerTable = this.element.querySelector(selectors.DROPDOWN_MENU + ' table');
        expect(timepickerTable).not.toBe(undefined);
      });
      it('should bootstrap timepicker element contain all attributes', function() {
        let timepickerTable = this.element.querySelector(selectors.DROPDOWN_MENU + ' table[ng-model]');

        expect(timepickerTable.getAttribute('ng-model')).not.toBe(undefined);
        expect(timepickerTable.getAttribute('show-meridian')).not.toBe(undefined);
        expect(timepickerTable.getAttribute('minute-step')).not.toBe(undefined);
        expect(timepickerTable.getAttribute('hour-step')).not.toBe(undefined);
        expect(timepickerTable.getAttribute('is-minute-disabled')).not.toBe(undefined);
      });
    });

    describe('when rendered', function() {
      beforeEach(function() {
        this.$scope.inputTime = defaultScopeTime;
        this.$scope.showMeridian = false;
        let markup = '<akam-time-picker ng-model="inputTime" show-meridian="showMeridian"></akam-time-picker>';
        this.addElement(markup);
      });
      it('should render time without meridian in the value display', function() {
        let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
        expect(timepickerInputElem.value.match(/[a|p]m/i)).toBe(null);
      });
    });

    describe('when rendered', function() {
      beforeEach(function() {
        this.$scope.inputTime = defaultScopeTime;
        this.$scope.disabled = true;
        let markup = '<akam-time-picker ng-model="inputTime" is-disabled="disabled"></akam-time-picker>';
        this.addElement(markup);
      });
      it('should render time in disabled state', function() {
        let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
        expect(timepickerInputElem.getAttribute('disabled')).toEqual('disabled');
      });
    });

    describe('when readonly attribute is true', function() {
      beforeEach(function() {
        this.$scope.inputTime = defaultScopeTime;
        let markup = '<akam-time-picker ng-model="inputTime" is-readonly="readOnly"></akam-time-picker>';
        this.addElement(markup);
      });
      it('should render time in disabled state', function() {
        let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
        expect(timepickerInputElem.className).toContain('readonly');
      });
    });

    describe('when rendered', function() {
      beforeEach(function() {
        this.$scope.inputTime = defaultScopeTime;
        this.$scope.disabled = true;
        let markup = '<akam-time-picker ng-model="inputTime" is-disabled="disabled"></akam-time-picker>';
        this.addElement(markup);
      });
      it('should render time in disabled state', function() {
        let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
        expect(timepickerInputElem.getAttribute('disabled')).toEqual('disabled');
      });
    });

    describe('when showMeridian is true', function() {
      beforeEach(function() {
        this.$scope.inputTime = '';
        this.$scope.showMeridian = true;
        this.addElement();
      });
      it('should render placeholder default values with meridian value true', function() {
        let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
        expect(timepickerInputElem.getAttribute('placeholder')).toBe(timepikerConfig.MERIDIAN_ON);
      });
    });

    describe('when rendered', function() {
      beforeEach(function() {
        let date = new Date();
        date.setHours('02', '15');
        this.$scope.inputTime = date;
        this.addElement();
      });
      it('should display correct hours and minutes input values', function() {
        let inputs = this.element.querySelectorAll(selectors.DROPDOWN_MENU + ' table input[type=text]');
        expect(inputs.length).toEqual(2);
        expect(inputs[0].value.length).toEqual(2);
        expect(inputs[0].value).toBe('02');
        expect(inputs[1].value.length).toEqual(2);
        expect(inputs[1].value).toBe('15');
      });
    });

    describe('when rendered', function() {
      beforeEach(function() {
        this.$scope.inputTime = defaultScopeTime;
        this.addElement();

        let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
        utilities.click(timepickerBtnElem);
        this.$scope.$digest();
      });
      it('should open on button click', function() {
        let timepickerElem = this.element.querySelector(selectors.TIMEPICKER);
        let dropdownElem = this.element.querySelector(selectors.DROPDOWN_MENU);

        expect(timepickerElem.classList.contains('open')).toBe(true);
        expect(this.timepicker.isOpen).toBe(true);
        expect(dropdownElem.classList.contains('open')).toBe(true);
      });
    });

    describe('when rendered', function() {
      beforeEach(function() {
        this.$scope.inputTime = defaultScopeTime;
        this.addElement();

        let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
        utilities.click(timepickerBtnElem); // open dropdown
        utilities.click(timepickerBtnElem); // close dropdown
        this.$scope.$digest();
      });
      it('should close open dropdown on button click', function() {
        let timepickerElem = this.element.querySelector(selectors.TIMEPICKER);
        let dropdownElem = this.element.querySelector(selectors.DROPDOWN_MENU);

        expect(timepickerElem.classList.contains('open')).toBeFalsy();
        expect(this.timepicker.isOpen).toBeFalsy();
        expect(dropdownElem.classList.contains('open')).toBeFalsy();
      });
    });

    describe('when rendered', function() {
      beforeEach(function() {
        let date = new Date();
        date.setHours('02', '15');
        this.$scope.inputTime = date;
        this.addElement();

        let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
        utilities.click(timepickerBtnElem); // open dropdown
        this.$scope.$digest();

        let dropdownLinks = this.element.querySelectorAll(`${selectors.DROPDOWN_MENU} .time-increment-row td a`);
        utilities.click(dropdownLinks[0]);
        this.$scope.$digest();
      });
      it('should display correct hour value when increment hour button is clicked', function() {
        let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
        expect(timepickerInputElem.value).toContain('03');
      });
    });
    describe('when rendered', function() {
      beforeEach(function() {
        let date = new Date();
        date.setHours('02', '15');
        this.$scope.inputTime = date;
        this.addElement();

        let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
        utilities.click(timepickerBtnElem); // open dropdown
        this.$scope.$digest();

        let dropdownLinks = this.element.querySelectorAll(`${selectors.DROPDOWN_MENU} .time-increment-row td a`);
        utilities.click(dropdownLinks[1]);
        this.$scope.$digest();
      });
      it('should display correct minutes value when increment minute button is clicked', function() {
        let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
        expect(timepickerInputElem.value).toContain('30');
      });
    });

    describe('when rendered', function() {
      beforeEach(function() {
        let date = new Date();
        date.setHours('02', '15');
        this.$scope.inputTime = date;
        this.addElement();

        let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
        utilities.click(timepickerBtnElem); // open dropdown
        this.$scope.$digest();

        let dropdownLinks = this.element.querySelectorAll(`${selectors.DROPDOWN_MENU} .time-decrement-row td a`);
        utilities.click(dropdownLinks[0]);
        this.$scope.$digest();
      });
      it('should display correct hour value when decrement hour button is clicked', function() {
        let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
        expect(timepickerInputElem.value).toContain('01');
      });
    });
    describe('when rendered', function() {
      beforeEach(function() {
        let date = new Date();
        date.setHours('02', '15');
        this.$scope.inputTime = date;
        this.addElement();

        let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
        utilities.click(timepickerBtnElem); // open dropdown
        this.$scope.$digest();

        let dropdownLinks = this.element.querySelectorAll(`${selectors.DROPDOWN_MENU} .time-decrement-row td a`);
        utilities.click(dropdownLinks[1]);
        this.$scope.$digest();
      });
      it('should display correct minutes value when decrement minute button is clicked', function() {
        let timepickerInputElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
        expect(timepickerInputElem.value).toContain('00');
      });
    });

    describe('when rendered', function() {
      beforeEach(function() {
        this.$scope.inputTime = defaultScopeTime;
        this.addElement();

        let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
        utilities.click(timepickerBtnElem);
        this.$scope.$digest();
      });
      it('should display meridian button on open', function() {
        let meridianBtnElem = this.element.querySelector(`${selectors.DROPDOWN_MENU} .meridian input`);
        expect(meridianBtnElem.classList.contains('ng-hide')).toBe(false);
      });
    });

    describe('when rendered', function() {
      describe('when showMeridian is false', function() {
        beforeEach(function() {
          this.$scope.inputTime = defaultScopeTime;
          this.$scope.showMeridian = false;
          let markup = `<akam-time-picker ng-model='inputTime' show-meridian='showMeridian'></akam-time-picker>`;
          this.addElement(markup);

          let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
          utilities.click(timepickerBtnElem);
          this.$scope.$digest();
        });
        it('should not display meridian button on open', function() {
          let meridianBtnElem = this.element.querySelector(`${selectors.DROPDOWN_MENU} .meridian input`);
          expect(meridianBtnElem.classList.contains('ng-hide')).toBe(true);
        });
      });
    });

    describe('when rendered', function() {
      beforeEach(function() {
        this.$scope.inputTime = defaultScopeTime;
        this.addElement();
      });
      it('should render initial values for timepicker', function() {
        expect(this.timepicker.inputTime).toBeDefined();
        expect(angular.isDate(this.timepicker.inputTime)).toBe(true);
        expect(this.timepicker.isOpen).toBe(false);
        expect(this.timepicker.isDisabled).toBeFalsy();
        expect(this.timepicker.hourStep).toBe(timepikerConfig.HOUR_STEP);
        expect(this.timepicker.minuteStep).toBe(timepikerConfig.MINUTE_STEP);
        expect(this.timepicker.placeholder).toBe(timepikerConfig.MERIDIAN_ON);
        expect(this.timepicker.showMeridian).toBe(true);
        expect(this.timepicker.disableMinutes).toBe(false);
      });
    });

    describe('when rendered', function() {
      describe('when attributes provided', function() {
        beforeEach(function() {
          let date = new Date();
          date.setHours('12', '20');
          this.$scope.inputTime = date;
          this.$scope.disabled = true;
          let markup = `<akam-time-picker ng-model='inputTime' is-disabled='disabled'></akam-time-picker>`;
          this.addElement(markup);
        });
        it('should verify scope values applied', function() {
          expect(this.timepicker.inputTime.getHours()).toBe(12);
          expect(this.timepicker.inputTime.getMinutes()).toBe(20);
          expect(this.timepicker.isDisabled).toBe(true);
        });
      });
    });

    describe('when rendered', function() {
      describe('when isDisabled is true', function() {
        beforeEach(function() {
          this.$scope.inputTime = defaultScopeTime;
          this.$scope.disabled = true;
          let markup = `<akam-time-picker ng-model='inputTime' is-disabled='disabled'></akam-time-picker>`;
          this.addElement(markup);
        });
        it('should disable timepicker', function() {
          expect(this.timepicker.isDisabled).toBe(true);
        });
      });
    });

    describe('when rendered', function() {
      describe('when input changes', function() {
        beforeEach(function() {
          this.$scope.inputTime = defaultScopeTime;
          this.addElement();
          spyOn(this.timepicker, 'changed');
          let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
          utilities.click(timepickerBtnElem);
          this.$scope.$digest();

          let dropdownLinks = this.element.querySelectorAll(`${selectors.DROPDOWN_MENU} .time-increment-row td a`);
          utilities.click(dropdownLinks[0]);
          this.$scope.$digest();
        });
        it('should have called timepicker.changed()', function() {
          expect(this.timepicker.changed).toHaveBeenCalled();
        });
      });
    });

    describe('when rendered', function() {
      describe('given minute-step new value of 12', function() {
        beforeEach(function() {
          this.$scope.inputTime = defaultScopeTime;
          let markup = '<akam-time-picker ng-model="inputTime" minute-step="minuteStep"></akam-time-picker>';
          this.$scope.minuteStep = 12;
          this.addElement(markup);
        });
        it('should timepicker minuteStep value change to 12', function() {
          expect(this.timepicker.minuteStep).toBe(12);
        });
      });
    });

    describe('when rendered', function() {
      describe('given hour-step new value of 2', function() {
        beforeEach(function() {
          this.$scope.inputTime = defaultScopeTime;
          let markup = '<akam-time-picker ng-model="inputTime" hour-step="hourStep"></akam-time-picker>';
          this.$scope.hourStep = 12;
          this.addElement(markup);
        });
        it('should timepicker hourStep value change to 2', function() {
          expect(this.timepicker.hourStep).toBe(12);
        });
      });
    });

    describe('when rendered', function() {
      describe('when no initial time value provided', function() {
        describe('when timepicker is clicked', function() {
          beforeEach(function() {
            addElement.call(this);
            spyOn(this.timepicker, 'toggle').and.callThrough();
            spyOn(this.timepicker, 'changed').and.callThrough();
            let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_INPUT);
            utilities.click(timepickerBtnElem);
            this.$scope.$digest();
          });
          it('should timepicker inputTime to be assigned date', function() {
            expect(angular.isDate(this.timepicker.inputTime)).toBe(true);
          });
          it('should timepicker inputTime with current hours', function() {
            expect(this.timepicker.inputTime.getHours()).toBe(new Date().getHours());
          });
          it('should timepicker inputTime with current minutes', function() {
            expect(this.timepicker.inputTime.getMinutes()).toBe(new Date().getMinutes());
          });
          it('should timepicker toggle function have been called', function() {
            expect(this.timepicker.toggle).toHaveBeenCalled();
          });
          it('should timepicker changed function have been called', function() {
            expect(this.timepicker.changed).toHaveBeenCalled();
          });
        });
      });
    });

    describe('when rendered', function() {
      describe('when clicking on timpicker dropdown region', function() {
        beforeEach(function() {
          this.addElement();
          let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
          utilities.click(timepickerBtnElem);
          this.$scope.$digest();
          let dropdownElement = this.element.querySelector('.dropdown-menu');
          utilities.click(dropdownElement);
          this.$scope.$digest();
        });
        it('timepicker dropdown should remain open', function() {
          let timepickerElem = this.element.querySelector(selectors.TIMEPICKER);
          expect(timepickerElem.classList.contains('open')).toBe(true);
        });
      });
    });

    describe('when rendered', function() {
      describe('when timepicker is open', function() {
        beforeEach(function() {
          this.$scope.inputTime = defaultScopeTime;
          this.addElement();
          let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
          utilities.mouseUp(timepickerBtnElem); // open dropdown
          this.$scope.$digest();
        });
        it('should close on click away', function() {
          utilities.clickAwayCreationAndClick('div');
          this.$scope.$digest();

          let timepickerElem = this.element.querySelector(selectors.TIMEPICKER);
          let dropdownElem = this.element.querySelector(selectors.DROPDOWN_MENU);
          expect(timepickerElem.classList.contains('open')).toBe(false);
          expect(dropdownElem.classList.contains('ng-hide')).toBe(true);
        });
      });
    });

    describe('when rendered', function() {
      describe('when no initial time provided', function() {
        beforeEach(function() {
          this.$scope.inputTime = '';
          this.addElement();

          let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
          utilities.click(timepickerBtnElem);
          this.$scope.$digest();
        });
        it('should set timepicker input to valid time on timepicker click', function() {
          expect(angular.isDate(this.timepicker.inputTime)).toBe(true);
        });
      });
    });
  });

  describe('given timepicker', function() {
    describe('when rendered', function() {
      describe('click timepicker button to open', function() {
        beforeEach(function() {
          addElement.call(this);
          spyOn(this.timepicker, 'toggle');
          let timepickerBtnElem = this.element.querySelector(selectors.TIMEPICKER_BTN);
          utilities.click(timepickerBtnElem);
          this.$scope.$digest();
        });
        it("should timepicker toggle function get called", function() {
          expect(this.timepicker.toggle).toHaveBeenCalled();
        });
      });
    });
  });
});
