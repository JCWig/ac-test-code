/*global angular, inject*/
/* eslint-disable max-nested-callbacks */

import spinner from '../../src/spinner';
import utils from '../utilities';

const defaults = {
  VALUE: 0,
  STEP: 1,
  INTERVAL: 80
};

describe('akamai.components.spinner', function() {
  let scope, compile, interval, timeout,
    UP_BUTTON = '.akam-spinner .btn.increment',
    DOWN_BUTTON = '.akam-spinner .btn.decrement';

  beforeEach(() => {
    inject.strictDi(true);
    angular.mock.module(spinner.name);

    inject((_$rootScope_, _$compile_, _$interval_, $timeout) => {
      scope = _$rootScope_.$new();
      compile = _$compile_;
      interval = _$interval_;
      timeout = $timeout;
    });

    scope.testData = {
      ngModel: "",
      min: 0,
      max: 50,
      disabled: false
    };
  });

  afterEach(() => {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
  });

  function addElement(markup) {
    var tpl;
    if (markup) {
      tpl = markup;
    } else {
      tpl = `<akam-spinner ng-model="testData.ngModel" min="{{testData.min}}" max="{{testData.max}}" is-disabled="testData.disabled" ng-style="spinner.dynamicMinWidth"></akam-spinner>`;
    }
    this.el = compile(tpl)(scope);
    this.isoScope = this.el.isolateScope();
    scope.$digest();
    this.element = document.body.appendChild(this.el[0]);
  };

  function getElement(selector) {
    return this.element.querySelector(selector);
  }

  function getElements(selector) {
    return this.element.querySelectorAll(selector);
  }

  describe('Given directive empty value ng-model=""', () => {
    describe('when directive rendered', () => {
      let inputElement;
      beforeEach(function() {
        addElement.call(this, '');
        inputElement = getElement.call(this, '.akam-spinner input');
      });

      it('should be able to verify input element', function() {
        expect(inputElement).not.toBe(undefined);
      });

      it('should be able to verify input element initial value is empty', function() {
        expect(inputElement.textContent).toBe('');
      });

      it('should be able to verify input element attributes', function() {
        expect(inputElement.getAttribute('id')).not.toBe(undefined);
        expect(inputElement.getAttribute('type')).toBe('number');
        expect(inputElement.getAttribute('ngModel')).not.toBe(undefined);
        expect(inputElement.getAttribute('ngChange')).not.toBe(undefined);
        expect(inputElement.getAttribute('min')).not.toBe(undefined);
        expect(inputElement.getAttribute('max')).not.toBe(undefined);
      });

      it('should verify two button elements', function() {
        expect(getElements.call(this, 'button').length).toEqual(2);
      });

      it('should verify up button icon element', function() {
        let arrowUpBtn = getElement.call(this, UP_BUTTON);
        let iconElem = arrowUpBtn.querySelector("i");

        expect(iconElem.classList.contains('luna-arrow_extra_smUp')).toBeTruthy();
      });

      it('should verify down button icon element', function() {
        let arrowDownBtn = getElement.call(this, DOWN_BUTTON);
        let iconElem = arrowDownBtn.querySelector("i");

        expect(iconElem.classList.contains('luna-arrow_extra_smDown')).toBeTruthy();
      });
    });
  });

  describe('When directive rendered', () => {
    describe('given the isolate scope and controller', () => {
      describe('should the properties and functions be verified', () => {
        beforeEach(function() {
          addElement.call(this, '');
        });
        it('directive isolated scope is not undefined', function() {
          expect(this.isoScope).not.toBe(undefined);
        });
        it('should verify all scope methods to not be undefined', function() {
          expect(this.isoScope.startStepDown).not.toBe(undefined);
          expect(this.isoScope.stopStepUp).not.toBe(undefined);
          expect(this.isoScope.startStepUp).not.toBe(undefined);
          expect(this.isoScope.changed).not.toBe(undefined);
          expect(this.isoScope.stopStepDown).not.toBe(undefined);
        });

        it('spinner controller is not undefined', function() {
          expect(this.isoScope.spinner).not.toBe(undefined);
        });

        it('should verify all controller methods to not be undefined', function() {
          expect(this.isoScope.spinner.initialize).not.toBe(undefined);
          expect(this.isoScope.spinner.isUnderMin).not.toBe(undefined);
          expect(this.isoScope.spinner.isOverMax).not.toBe(undefined);
          expect(this.isoScope.spinner.clickNoop).not.toBe(undefined);
        });
        it('should verify the controller APIs not to be undefined', function() {
          expect(this.isoScope.spinner.inputValue).not.toBe(undefined);
          expect(this.isoScope.spinner.min).not.toBe(undefined);
          expect(this.isoScope.spinner.max).not.toBe(undefined);
          expect(this.isoScope.spinner.disabled).not.toBe(undefined);
        });
      });
    });
  });

  describe('When directive rendered', function() {
    describe('given initial ngModel value', function() {
      describe('should verify correct value', function() {
        let inputElem;
        beforeEach(function() {
          scope.testData.ngModel = 2;
          addElement.call(this, '');
          inputElem = getElement.call(this, '.akam-spinner input');
        });
        it('should input element display value of 2', function() {
          expect(inputElem.value).toBe('2');
        });
        it('should spinner inputValue to be same as ngModel value', function() {
          expect(this.isoScope.spinner.inputValue).toBe(2);
        });
      });
    });
  });

  describe('When directive rendered', function() {
    describe('given initial disabled true value', function() {
      describe('should verify element disabled state', function() {
        let inputElem;
        beforeEach(function() {
          scope.testData.disabled = true;
          addElement.call(this, '');
          interval.flush();
          inputElem = getElement.call(this, '.akam-spinner input');
        });
        it('should input element has disabled="disabled"', function() {
          expect(inputElem.getAttribute('disabled')).toBe("disabled");
        });
        it('should button element has disabled="disabled"', function() {
          expect(getElement.call(this, UP_BUTTON).getAttribute('disabled')).toBe("disabled");
          expect(getElement.call(this, DOWN_BUTTON).getAttribute('disabled')).toBe("disabled");
        });
      });
    });
  });

  describe('When directive rendered', function() {
    describe('given initial min value greater than ngModel value', function() {
      describe('should verify min state', function() {
        let inputElem;
        beforeEach(function() {
          scope.testData.disabled = false;
          scope.testData.min = 0;
          scope.testData.ngModel = 0;
          addElement.call(this, '');
          inputElem = getElement.call(this, '.akam-spinner input');
        });
        it('should input element is enabled', function() {
          expect(inputElem.getAttribute('disabled')).toBe(null);
        });
        it('should spinner uparrow button element is enabled', function() {
          expect(getElement.call(this, UP_BUTTON).getAttribute('disabled')).not.toBe("disabled");
          expect(getElement.call(this, DOWN_BUTTON).getAttribute('disabled')).toBe("disabled");
        });
      });
    });
  });

  describe('Given missing max and min value', function() {
    describe('when rendering', function() {
      beforeEach(function() {
        scope.testData.ngModel = 1;
        addElement.call(this, `<akam-spinner ng-model="testData.ngModel"></akam-spinner>`);
      });
      it('should min be empty string', function() {
        expect(this.isoScope.spinner.min).toBe('');
      });
      it('should max be empty string', function() {
        expect(this.isoScope.spinner.max).toBe('');
      });
    });
  });

  describe('When directive rendered', function() {
    describe('given initial min values greater than input value', function() {
      beforeEach(function() {
        scope.testData.disabled = false;
        scope.testData.min = 2;
        scope.testData.ngModel = 1;
        addElement.call(this, '');
        spyOn(this.isoScope.spinner, 'isUnderMin');
        spyOn(this.isoScope.spinner, 'clickNoop');
      });
      it('should spinner function isUnderMin called', function() {
        utils.click(getElement.call(this, DOWN_BUTTON));
        scope.$digest();

        expect(this.isoScope.spinner.isUnderMin).toHaveBeenCalled();
      });
      it('should spinner function clickNoop called', function() {
        utils.click(getElement.call(this, UP_BUTTON));
        scope.$digest();

        expect(this.isoScope.spinner.clickNoop).toHaveBeenCalled();
      });
    });
  });

  describe('When directive rendered', function() {
    describe('given initial max values less than input value', function() {
      beforeEach(function() {
        scope.testData.disabled = false;
        scope.testData.max = 1;
        scope.testData.ngModel = 2;
        addElement.call(this, '');
        spyOn(this.isoScope.spinner, 'isOverMax');
        spyOn(this.isoScope.spinner, 'clickNoop');
      });
      it('should spinner function isOverMax called when click arrow up button', function() {
        utils.click(getElement.call(this, UP_BUTTON));
        scope.$digest();

        expect(this.isoScope.spinner.isOverMax).toHaveBeenCalled();
      });

      it('should spinner function clickNoop called', function() {
        utils.click(getElement.call(this, UP_BUTTON));
        scope.$digest();

        expect(this.isoScope.spinner.clickNoop).toHaveBeenCalled();
      });
    });
  });

  describe('When directive rendered', function() {
    describe('given initial values', function() {
      describe('should verify scope functions when keydown event', function() {
        beforeEach(function() {
          scope.testData.disabled = false;
          scope.testData.min = 0;
          scope.testData.ngModel = 1;
          addElement.call(this, '');
          spyOn(this.isoScope, 'startStepUp');
          spyOn(this.isoScope, 'stopStepUp');
          spyOn(this.isoScope, 'startStepDown');
          spyOn(this.isoScope, 'stopStepDown');
        });
        it('should spinner function startStepUp called', function() {
          utils.mouseDown(getElement.call(this, UP_BUTTON));
          scope.$digest();

          expect(this.isoScope.startStepUp).toHaveBeenCalled();
        });
        it('should spinner function startStepDown called', function() {
          utils.mouseDown(getElement.call(this, DOWN_BUTTON));
          scope.$digest();

          expect(this.isoScope.startStepDown).toHaveBeenCalled();
        });

        it('should spinner function stopStepUp called', function() {
          utils.mouseDown(getElement.call(this, UP_BUTTON));
          scope.$digest();

          utils.mouseUp(getElement.call(this, UP_BUTTON));
          scope.$digest();

          expect(this.isoScope.stopStepUp).toHaveBeenCalled();

        });
        it('should spinner function stopStepDown called', function() {
          utils.mouseDown(getElement.call(this, DOWN_BUTTON));
          scope.$digest();

          utils.mouseUp(getElement.call(this, DOWN_BUTTON));
          scope.$digest();

          expect(this.isoScope.stopStepDown).toHaveBeenCalled();
        });
      });
    });
  });

  describe('When directive rendered', function() {
    describe('given initial integer min values and inputValue is undefined', function() {
      describe('should verify scope functions when keydown event', function() {
        beforeEach(function() {
          scope.testData.disabled = false;
          scope.testData.min = 0;
          scope.testData.ngModel = undefined;
          addElement.call(this, '');
        });
        it('should spinner inputValue same as min value as integer', function() {
          expect(this.isoScope.spinner.inputValue).toBe(defaults.VALUE);
        });
      });
    });
  });

  describe('When directive rendered', function() {
    describe('given initial min string values and inputValue is undefined', function() {
      describe('should verify inputValue be default to min value', function() {
        beforeEach(function() {
          scope.testData.disabled = false;
          scope.testData.min = "u";
          scope.testData.ngModel = undefined;
          addElement.call(this, '');
        });
        it('should spinner inputValue same as min value as integer', function() {
          expect(this.isoScope.spinner.inputValue).toBe(defaults.VALUE);
        });
      });
    });
  });

  describe('When directive rendered', function() {
    describe('given initial max values and inputValue is greater than max', function() {
      describe('should verify inputValue correctly', function() {
        beforeEach(function() {
          scope.testData.disabled = false;
          scope.testData.max = 3;
          scope.testData.ngModel = 1;
          addElement.call(this, '');
          this.isoScope.spinner.inputValue = 4;
          scope.$digest();
        });
        it('should spinner input has ng-invalid-max class', function() {
          let inputElem = getElement.call(this, '.akam-spinner input');
          expect(inputElem.classList.contains('ng-invalid-max')).toBe(true);
        });
      });
    });
  });

  describe('When directive rendered', function() {
    describe('given initial max value', function() {
      describe('should spinner member dynamicMinWidth has correct value', function() {
        let length;
        beforeEach(function() {
          scope.testData.disabled = false;
          scope.testData.max = 12;
          scope.testData.ngModel = 1;
          addElement.call(this, '');
          length = String(scope.testData.max).length;
        });
        it('should spinner dynamicMinWidth min-width value contains max string length', function() {
          expect(this.isoScope.spinner.dynamicMinWidth['width']).toBe('calc(' + length + 'ch + 20px)');
        });
      });
    });
  });

  describe('When directive rendered', function() {
    describe('given spinner clickNoop function', function() {
      beforeEach(function() {
        let event = {
          preventDefault: angular.noop,
          stopPropagation: angular.noop
        };
        addElement.call(this, '');
        this.isoScope.spinner.eventObj = event;
        spyOn(this.isoScope.spinner.eventObj, 'preventDefault');
        spyOn(this.isoScope.spinner.eventObj, 'stopPropagation');
        this.isoScope.spinner.clickNoop(event);
        scope.$digest();
      });
      it('should spinner clickNoop call through with event parameter', function() {
        expect(this.isoScope.spinner.eventObj.preventDefault).toHaveBeenCalled();
        expect(this.isoScope.spinner.eventObj.stopPropagation).toHaveBeenCalled();
      });
    });
  });

  describe('when rendered', function() {
    describe('given mouse down events fire', function() {
      describe('verify values increments', function() {
        let inputElem;
        beforeEach(function() {
          scope.testData.ngModel = 2;
          addElement.call(this, '');
          inputElem = this.element.querySelector('.akam-spinner input');
          let arrowUpBtn = this.element.querySelector(UP_BUTTON);
          utils.triggerMouseEvent(arrowUpBtn, "mousedown");
          interval.flush(81);
        });

        it('should input element value increment by 1', function() {
          expect(inputElem.value).toBe('3');
        });
        it('should spinner inputValue increment by 1', function() {
          expect(this.isoScope.spinner.inputValue).toBe(3);
        });
      });
    });
  });

  describe('when rendered', function() {
    describe('given mouse down events fire', function() {
      describe('verify values decrement', function() {
        let inputElem;
        beforeEach(function() {
          scope.testData.ngModel = 2;
          addElement.call(this, '');
          inputElem = this.element.querySelector('.akam-spinner input');
          let arrowDownBtn = this.element.querySelector(DOWN_BUTTON);
          utils.triggerMouseEvent(arrowDownBtn, "mousedown");
          interval.flush(81);
        });

        it('should input element value decrement by 1', function() {
          expect(inputElem.value).toBe('1');
        });
        it('should spinner inputValue decrement by 1', function() {
          expect(this.isoScope.spinner.inputValue).toBe(1);
        });
      });
    });
  });

  describe('when rendered', function() {
    describe('given mouse up on arrow down events fire', function() {
      describe('verify values stay same', function() {
        let inputElem;
        beforeEach(function() {
          scope.testData.ngModel = 2;
          addElement.call(this, '');
          inputElem = this.element.querySelector('.akam-spinner input');
          let arrowUpBtn = this.element.querySelector(UP_BUTTON);
          utils.triggerMouseEvent(arrowUpBtn, "mouseup");
          interval.flush(81);
        });

        it('should input element value be same', function() {
          expect(inputElem.value).toBe('2');
        });
        it('should spinner inputValue remain same', function() {
          expect(this.isoScope.spinner.inputValue).toBe(2);
        });
      });
    });
  });

  describe('when rendered', function() {
    describe('given mouse down on arrow down events fire', function() {
      describe('verify values stay same', function() {
        let inputElem;
        beforeEach(function() {
          scope.testData.ngModel = 2;
          addElement.call(this, '');
          inputElem = this.element.querySelector('.akam-spinner input');
          let arrowDownBtn = this.element.querySelector(DOWN_BUTTON);
          utils.triggerMouseEvent(arrowDownBtn, "mouseup");
          interval.flush(81);
        });

        it('should input element value be same', function() {
          expect(inputElem.value).toBe('2');
        });
        it('should spinner inputValue remain same', function() {
          expect(this.isoScope.spinner.inputValue).toBe(2);
        });
      });
    });
  });

  describe('when rendered', function() {
    describe('given mouseleave on arrow up events fire', function() {
      describe('verify values stay same', function() {
        let inputElem;
        beforeEach(function() {
          scope.testData.ngModel = 2;
          addElement.call(this, '');
          inputElem = this.element.querySelector('.akam-spinner input');
          let arrowUpBtn = this.element.querySelector(UP_BUTTON);
          utils.triggerMouseEvent(arrowUpBtn, "mouseleave");
          interval.flush(81);
        });

        it('should input element value be same', function() {
          expect(inputElem.value).toBe('2');
        });
        it('should spinner inputValue remain same', function() {
          expect(this.isoScope.spinner.inputValue).toBe(2);
        });
      });
    });
  });

  describe('when rendered', function() {
    describe('given mouseleave on arrow down events fire', function() {
      describe('verify values stay same', function() {
        let inputElem;
        beforeEach(function() {
          scope.testData.ngModel = 2;
          addElement.call(this, '');
          spyOn(this.isoScope, 'stopStepDown');
          inputElem = this.element.querySelector('.akam-spinner input');
          let arrowDownBtn = this.element.querySelector(DOWN_BUTTON);
          utils.triggerMouseEvent(arrowDownBtn, "mouseleave");
          interval.flush(81);
        });

        it('should input element value be same', function() {
          expect(inputElem.value).toBe('2');
        });
        it('should spinner inputValue remain same', function() {
          expect(this.isoScope.spinner.inputValue).toBe(2);
        });
      });
    });
  });

  describe('when rendered', function() {
    describe('given scope function startStepUp call', function() {
      describe('given defined scope.upMouseDownPromise value', function() {
        let returnValue;
        beforeEach(function() {
          scope.testData.ngModel = 2;
          addElement.call(this, '');
          this.isoScope.upMouseDownPromise = {};
          let event = {
            stopPropagation: angular.noop
          };
          returnValue = this.isoScope.startStepUp(event);
          scope.$digest();
        });
        it('should startStepUp called returned with same object', function() {
          expect(returnValue).toBe(this.isoScope.upMouseDownPromise);
        });
      });
    });
  });

  describe('when rendered', function() {
    describe('given scope function startStepUp call', function() {
      describe('given undefined scope.upMouseDownPromise value', function() {
        beforeEach(function() {
          scope.testData.ngModel = 2;
          addElement.call(this, '');
          this.isoScope.upMouseDownPromise = undefined;
          this.isoScope.spinner.isOverMax = function() {
            return true;
          }
          spyOn(this.isoScope, 'stopStepUp');
          let arrowUpBtn = this.element.querySelector(UP_BUTTON);
          utils.triggerMouseEvent(arrowUpBtn, "mousedown");
          scope.$digest();
          interval.flush(81);
        });
        it('should stopStepUp called', function() {
          expect(this.isoScope.stopStepUp).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when rendered', function() {
    describe('given scope function stopStepUp call', function() {
      describe('given undefined scope.upMouseDownPromise value', function() {
        beforeEach(function() {
          scope.testData.ngModel = 2;
          addElement.call(this, '');
          this.isoScope.upMouseDownPromise = {};
          let event = {
            stopPropagation: angular.noop
          };
          spyOn(interval, 'cancel');
          this.isoScope.stopStepUp(event);
          scope.$digest();
          interval.flush(81);
        });
        it('should interval.cancel called', function() {
          expect(interval.cancel).toHaveBeenCalled();
        });
        it('should this.isoScope.upMouseDownPromise reset to undefined', function() {
          expect(this.isoScope.upMouseDownPromise).toBeUndefined();
        });
      });
    });
  });

  describe('when rendered', function() {
    describe('given scope function startStepDown call', function() {
      describe('given defined scope.downMouseDownPromise value', function() {
        let returnValue;
        beforeEach(function() {
          scope.testData.ngModel = 2;
          addElement.call(this, '');
          this.isoScope.downMouseDownPromise = {};
          let event = {
            stopPropagation: angular.noop
          };
          returnValue = this.isoScope.startStepDown(event);
          scope.$digest();
        });
        it('should startStepDown called returned with same object', function() {
          expect(returnValue).toBe(this.isoScope.downMouseDownPromise);
        });
      });
    });
  });

  describe('when rendered', function() {
    describe('given scope function startStepDown call', function() {
      describe('given undefined scope.downMouseDownPromise value', function() {
        beforeEach(function() {
          scope.testData.ngModel = 2;
          addElement.call(this, '');
          this.isoScope.downMouseDownPromise = undefined;
          this.isoScope.spinner.isUnderMin = function() {
            return true;
          }
          spyOn(this.isoScope, 'stopStepDown');
          let arrowDownBtn = this.element.querySelector(DOWN_BUTTON);
          utils.triggerMouseEvent(arrowDownBtn, "mousedown");
          scope.$digest();
          interval.flush(81);
        });
        it('should stopStepDown called', function() {
          expect(this.isoScope.stopStepDown).toHaveBeenCalled();
        });
      });
    });
  });

  describe('given scope.downMouseDownPromise value undefined', function() {
    describe('when rendered', function() {
      describe('scope function stopStepDown call ', function() {
        beforeEach(function() {
          scope.testData.ngModel = 2;
          addElement.call(this, '');
          this.isoScope.downMouseDownPromise = {};
          let event = {
            stopPropagation: angular.noop
          };
          spyOn(interval, 'cancel');
          this.isoScope.stopStepDown(event);
          scope.$digest();
          interval.flush(81);
        });
        it('should interval.cancel called', function() {
          expect(interval.cancel).toHaveBeenCalled();
        });
        it('should this.isoScope.downMouseDownPromise reset to undefined', function() {
          expect(this.isoScope.downMouseDownPromise).toBeUndefined();
        });
      });
    });
  });

  describe('given spinner API custom-step not included in the markup', function() {
    describe('when rendered and user click increment button', function() {
      describe('input value should be ngModel + default value', function() {
        beforeEach(function() {
          scope.testData.ngModel = 2;
          addElement.call(this, '');
          this.isoScope.downMouseDownPromise = {};
          let event = {
            stopPropagation: angular.noop
          };
          this.isoScope.startStepUp(event);
          scope.$digest();
          interval.flush(81);
        });
        it('should value be increment by 1', function() {
          expect(this.isoScope.spinner.inputValue).toBe(3);
        });
      });
    });
  });

  describe('given spinner API custom-step included in the markup', function() {
    describe('when rendered and user click increment button', function() {
      describe('input value should be ngMode + custom step value', function() {
        beforeEach(function() {
          scope.testData.ngModel = 2;
          scope.testData.customStep = 2;
          let tpl = `<akam-spinner ng-model="testData.ngModel"
            custom-step="{{testData.customStep}}"></akam-spinner>`;
          addElement.call(this, tpl);
          this.isoScope.downMouseDownPromise = {};
          let event = {
            stopPropagation: angular.noop
          };
          this.isoScope.startStepUp(event);
          scope.$digest();
          interval.flush(81);
        });
        it('should value be increment by 2', function() {
          expect(this.isoScope.spinner.inputValue).toBe(4);
        });
      });
    });
  });

  describe('given spinner API custom-step included in the markup', function() {
    describe('when rendered and user click decrement button', function() {
      describe('input value should be ngMode - custom step value', function() {
        beforeEach(function() {
          scope.testData.ngModel = 8;
          scope.testData.customStep = 4;
          let tpl = `<akam-spinner ng-model="testData.ngModel"
            custom-step="{{testData.customStep}}"></akam-spinner>`;
          addElement.call(this, tpl);
          this.isoScope.upMouseDownPromise = {};
          let event = {
            stopPropagation: angular.noop
          };
          this.isoScope.startStepDown(event);
          scope.$digest();
          interval.flush(81);
        });
        it('should value be decrement by 4', function() {
          expect(this.isoScope.spinner.inputValue).toBe(4);
        });
      });
    });
  });

  describe('given spinner API custom-step included in the markup', function() {
    describe('when rendered and user changes custom-step value', function() {
      describe('user click decrement button', function() {
        describe('input value should be ngMode + custom step value', function() {
          beforeEach(function() {
            scope.testData.ngModel = 4;
            scope.testData.customStep = 2;
            let tpl = `<akam-spinner ng-model="testData.ngModel"
              custom-step="{{testData.customStep}}"></akam-spinner>`;
            addElement.call(this, tpl);
            this.isoScope.downMouseDownPromise = {};
            let event = {
              stopPropagation: angular.noop
            };
            this.isoScope.startStepUp(event);
            scope.$digest();
            interval.flush(81);
          });
          it('should increment value by 2', function() {
            expect(this.isoScope.spinner.inputValue).toBe(6);
          });
        });
      });
    });
  });
  describe('given spinner API custom-step with invalid value of random string', function() {
    describe('when rendered', function() {
      describe('user click increment button', function() {
        beforeEach(function() {
          scope.testData.ngModel = 4;
          scope.testData.customStep = "www";
          let tpl = `<akam-spinner ng-model="testData.ngModel"
              custom-step="{{testData.customStep}}"></akam-spinner>`;
          addElement.call(this, tpl);
          this.isoScope.downMouseDownPromise = {};
          let event = {
            stopPropagation: angular.noop
          };
          this.isoScope.startStepUp(event);
          scope.$digest();
          interval.flush(81);
        });
        it('should increment value by 1', function() {
          expect(this.isoScope.spinner.inputValue).toBe(5);
        });
      });
    });
  });
  describe('given spinner API custom-step with invalid value of -2', function() {
    describe('when rendered', function() {
      describe('user click increment button', function() {
        beforeEach(function() {
          scope.testData.ngModel = 4;
          scope.testData.customStep = -2;
          let tpl = `<akam-spinner ng-model="testData.ngModel"
              custom-step="{{testData.customStep}}"></akam-spinner>`;
          addElement.call(this, tpl);
          this.isoScope.downMouseDownPromise = {};
          let event = {
            stopPropagation: angular.noop
          };
          this.isoScope.startStepUp(event);
          scope.$digest();
          interval.flush(81);
        });
        it('should increment value by 1', function() {
          expect(this.isoScope.spinner.inputValue).toBe(5);
        });
      });
    });
  });
  describe('given spinner', function() {
    describe('when rendered', function() {
      describe('user manually update the valid input value', function() {
        beforeEach(function() {
          scope.testData.ngModel = 4;
          let tpl = `<akam-spinner ng-model="testData.ngModel"></akam-spinner>`;
          addElement.call(this, tpl);
          spyOn(this.isoScope, 'changed');
          let inputElem = this.element.querySelector('.akam-spinner input');
          angular.element(inputElem).val('8').triggerHandler('input');
        });
        it('should trigger ng-change event', function() {
          expect(this.isoScope.changed).toHaveBeenCalled();
        });
        it('should set inputValue to be same', function() {
          expect(this.isoScope.spinner.inputValue).toBe(8);
        });
      });
    });
  });

  describe('given spinner', function() {
    describe('when rendered', function() {
      describe('user manually update the invalid input value', function() {
        beforeEach(function() {
          scope.testData.ngModel = 4;
          let tpl = `<akam-spinner ng-model="testData.ngModel"></akam-spinner>`;
          addElement.call(this, tpl);
          spyOn(this.isoScope, 'changed');
          let inputElem = this.element.querySelector('.akam-spinner input');
          angular.element(inputElem).val('abc').triggerHandler('input');
        });
        it('should trigger ng-change event', function() {
          expect(this.isoScope.changed).toHaveBeenCalled();
        });
        it('should initial inputValue to be null', function() {
          expect(this.isoScope.spinner.inputValue).toBe(null);
        });
      });
    });
  });
  describe('given spinner', function() {
    describe('when rendered', function() {
      describe('user manually update the invalid input value', function() {
        beforeEach(function() {
          scope.testData.ngModel = 4;
          let tpl = `<akam-spinner ng-model="testData.ngModel"></akam-spinner>`;
          addElement.call(this, tpl);
          spyOn(this.isoScope, 'changed').and.callThrough();
          let inputElem = this.element.querySelector('.akam-spinner input');
          angular.element(inputElem).val('abc').triggerHandler('input');
        });
        it('should initial inputValue to be default of 0 after call through', function() {
          expect(this.isoScope.spinner.inputValue).toBe(0);
        });
      });
    });
  });
});
