'use strict';

var utils = require('../utilities');

describe('akamai.components.spinner', function() {
  var scope, self, compile, interval;
  var UP_BUTTON = '.akam-spinner button:first-child';
  var DOWN_BUTTON = '.akam-spinner button:last-child';

  beforeEach(function() {
    inject.strictDi(true);
    self = this;
    angular.mock.module(require('../../src/spinner').name);
    inject(function(_$rootScope_, _$compile_, _$interval_) {
      scope = _$rootScope_.$new();
      compile = _$compile_;
      interval = _$interval_;
    });
    scope.testData = {
      ngModel: "",
      min: 0,
      max: 50,
      disabled: true
    };
  });
  afterEach(function() {
    removeElement();
  });

  function removeElement() {
    if (self.element) {
      document.body.removeChild(self.element);
      self.element = null;
    }
  }

  function addElement(markup) {
    var tpl;
    if (markup) {
      tpl = markup;
    } else {
      tpl = '<akam-spinner ng-model="ngModel"></akam-spinner>';
    }
    tpl = '<form name="form">' + tpl + '</form>';
    self.el = compile(tpl)(scope);
    self.spinnerEl = self.el.find("akam-spinner");
    self.isoScope = self.spinnerEl.isolateScope();
    scope.$digest();

    self.element = document.body.appendChild(self.el[0]);

  };

  describe('when rendering directive without options values', function() {
    beforeEach(function() {
      scope.ngModel = '';
      addElement();
    })

    it('should verify input element exist', function() {
      var inputElem = self.element.querySelector('.akam-spinner input');
      expect(inputElem).not.toBe(undefined);
    });

    it('should verify input element value of empty', function() {
      var inputElem = self.element.querySelector('.akam-spinner input');
      expect(inputElem.value).toBe('');
    });

    it('should verify two button elements', function() {
      var buttonListNode = self.element.querySelectorAll('button');
      expect(buttonListNode.length).toEqual(2);
    });

    it('should verify up button icon', function() {
      var buttonListNode = self.element.querySelectorAll('button');
      var buttonElem = buttonListNode[0].querySelector("i");
      expect(buttonElem.classList.contains('luna-arrow_extra_smUp')).toBeTruthy();
    });

    it('should verify down button icon', function() {
      var buttonListNode = self.element.querySelectorAll('button');
      var buttonElem = buttonListNode[1].querySelector("i");
      expect(buttonElem.classList.contains('luna-arrow_extra_smDown')).toBeTruthy();
    });

    it('should check validity on init', function() {
      expect(scope.form.$valid).toBeTruthy();
    });
  });

  describe('when rendering directive with options values', function() {
    var spinnerElem;
    beforeEach(function() { //Will run after the overall beforeEach but before each it statement in this describe block
      var markup = '<akam-spinner ng-model="ngModel" min="min" max="max" disabled="disabled"></akam-spinner>';
      scope.ngModel = 2;
      scope.min = scope.testData.min;
      scope.max = scope.testData.max;
      scope.disabled = scope.testData.disabled;

      addElement(markup);
      spinnerElem = document.querySelector('.akam-spinner');
    });

    it('should verify input element have correct type of number', function() {
      var typeAttr = spinnerElem.querySelector('input').getAttribute('type');
      expect(typeAttr).toEqual('number');
    });

    it('should verify input element correct value', function() {
      var inputElem = spinnerElem.querySelector('input');
      expect(inputElem.value).toEqual('2');
    });

    it('should verify input element correct attribute disabled value', function() {
      var disabledAttr = spinnerElem.querySelector('input').getAttribute('disabled');
      expect(disabledAttr).toEqual(null);
    });
  });

  describe('when instantiating directive, the isolated scope...', function() {
    it("should functions to be defined", function() {
      addElement();
      expect(self.isoScope.isDisabled).toBeDefined();
      expect(self.isoScope.changed).toBeDefined();
      expect(self.isoScope.isUnderMin).toBeDefined();
      expect(self.isoScope.isOverMax).toBeDefined();
      expect(self.isoScope.startStepUp).toBeDefined();
      expect(self.isoScope.stopStepUp).toBeDefined();
      expect(self.isoScope.startStepDown).toBeDefined();
      expect(self.isoScope.stopStepDown).toBeDefined();

    });

    it("should verify correct min value and form $valid", function() {
      addElement();
      expect(self.isoScope.isUnderMin()).toBeFalsy();
      expect(scope.form.$valid).toBeTruthy();

      var markup = '<akam-spinner ng-model="ngModel" min={{::min}}></akam-spinner>';
      scope.ngModel = 3;
      scope.min = 4;
      addElement(markup);
      var inputElem = self.element.querySelector('.akam-spinner input');

      expect(scope.form.$valid).toBeFalsy();
    });

    it("should verify invalid class names when when input value under min value", function() {
      var markup = '<akam-spinner ng-model="ngModel" min={{::min}}></akam-spinner>';
      scope.ngModel = 3;
      scope.min = 4;
      addElement(markup);
      var inputElem = self.element.querySelector('.akam-spinner input');

      expect(inputElem.classList.contains("ng-invalid")).toBeTruthy();
      expect(inputElem.classList.contains("ng-invalid-min")).toBeTruthy();
    });

    it("should verify invalid class names when when input value over max value", function() {
      var markup = '<akam-spinner ng-model="ngModel" max={{::max}}></akam-spinner>';
      scope.ngModel = 3;
      scope.max = 2;
      addElement(markup);
      var inputElem = self.element.querySelector('.akam-spinner input');

      expect(inputElem.classList.contains("ng-invalid")).toBeTruthy();
      expect(inputElem.classList.contains("ng-invalid-max")).toBeTruthy();
    });

    it("should verify correct max value and form $valid", function() {
      addElement();
      expect(self.isoScope.isOverMax()).toBeFalsy();
      expect(scope.form.$valid).toBeTruthy();

      var markup = '<akam-spinner ng-model="ngModel" max={{::max}}></akam-spinner>';
      scope.ngModel = 5;
      scope.max = 4;
      addElement(markup);
      expect(scope.form.$valid).toBeFalsy();
    });

    it("should verify correct disabled state", function() {
      addElement();
      expect(self.isoScope.disabled).toBeFalsy();

      var markup = '<akam-spinner ng-model="ngModel" disabled="disabled"></akam-spinner>';
      scope.ngModel = 5;
      scope.disabled = true;
      addElement(markup);

      expect(self.isoScope.disabled).toBeTruthy();
      expect(self.isoScope.disabled).toBeTruthy();
    });
  });

  describe('when rendered', function() {

    describe('verify events fired', function() {
      it('should verify input value in mousedown event on uparrow button', function() {
        scope.ngModel = 2;
        addElement();
        var inputElem = self.element.querySelector('.akam-spinner input');
        expect(inputElem.value).toBe('2');

        var buttonListNode = self.element.querySelectorAll('button');
        utils.triggerMouseEvent(buttonListNode[0], "mousedown");

        interval.flush(81);

        var inputElem = self.element.querySelector('.akam-spinner input');
        expect(inputElem.value).toBe('3');

      });

      it('should verify input value in mousedown event on downArrow button', function() {
        scope.ngModel = 2;
        addElement();
        var inputElem = self.element.querySelector('.akam-spinner input');
        expect(inputElem.value).toBe('2');

        var buttonListNode = self.element.querySelectorAll('button');
        utils.triggerMouseEvent(buttonListNode[1], "mousedown");

        interval.flush(81);

        var inputElem = self.element.querySelector('.akam-spinner input');
        expect(inputElem.value).toBe('1');

      });

      it('should verify input value in mousedown event not changing value when in disabled state', function() {
        scope.ngModel = 2;
        scope.disabled = true;
        var markup = '<akam-spinner ng-model="ngModel" disabled="disabled"></akam-spinner>';
        addElement(markup);

        var inputElem = self.element.querySelector('.akam-spinner input');
        expect(inputElem.value).toBe('2');

        var buttonListNode = self.element.querySelectorAll('button');

        utils.triggerMouseEvent(buttonListNode[1], "mousedown");
        interval.flush(81);
        var inputElem = self.element.querySelector('.akam-spinner input');

        expect(inputElem.value).toBe('1');

        utils.triggerMouseEvent(buttonListNode[0], "mousedown");
        interval.flush(81);
        var inputElem = self.element.querySelector('.akam-spinner input');

        expect(inputElem.value).toBe('1');
      });

      it('should verify input value remain same in mouseup event on downArrow button', function() {
        scope.ngModel = 2;
        addElement();
        var inputElem = self.element.querySelector('.akam-spinner input');
        expect(inputElem.value).toBe('2');

        var buttonListNode = self.element.querySelectorAll('button');
        utils.triggerMouseEvent(buttonListNode[1], "mouseup");

        interval.flush(81);

        var inputElem = self.element.querySelector('.akam-spinner input');
        expect(inputElem.value).toBe('2');
      });

      it('should verify input value remain same in mouseup event on upArrow button', function() {
        scope.ngModel = 2;
        addElement();
        var inputElem = self.element.querySelector('.akam-spinner input');
        expect(inputElem.value).toBe('2');

        var buttonListNode = self.element.querySelectorAll('button');
        utils.triggerMouseEvent(buttonListNode[0], "mouseup");

        interval.flush(81);

        var inputElem = self.element.querySelector('.akam-spinner input');
        expect(inputElem.value).toBe('2');

      });

      it('should verify input value remain same in mouseleave event on upArrow button', function() {
        scope.ngModel = 2;
        addElement();
        var inputElem = self.element.querySelector('.akam-spinner input');
        expect(inputElem.value).toBe('2');

        var buttonListNode = self.element.querySelectorAll('button');
        utils.triggerMouseEvent(buttonListNode[0], "mouseleave");

        interval.flush(81);

        var inputElem = self.element.querySelector('.akam-spinner input');
        expect(inputElem.value).toBe('2');

      });

      it('should verify input value remain same in mouseleave event on downArrow button', function() {
        scope.ngModel = 2;
        addElement();
        var inputElem = self.element.querySelector('.akam-spinner input');
        expect(inputElem.value).toBe('2');

        var buttonListNode = self.element.querySelectorAll('button');
        utils.triggerMouseEvent(buttonListNode[0], "mouseleave");

        interval.flush(81);

        var inputElem = self.element.querySelector('.akam-spinner input');
        expect(inputElem.value).toBe('2');

      });

      it('should scope function of startStepUp called', function() {
        addElement();
        spyOn(self.isoScope, 'startStepUp');

        var buttonListNode = self.element.querySelectorAll('button');
        utils.triggerMouseEvent(buttonListNode[0], "mousedown");

        expect(self.isoScope.startStepUp).toHaveBeenCalled();

      });

      it('should scope function of startStepDown called', function() {
        addElement();
        spyOn(self.isoScope, 'startStepDown');

        var buttonListNode = self.element.querySelectorAll('button');
        utils.triggerMouseEvent(buttonListNode[1], "mousedown");

        expect(self.isoScope.startStepDown).toHaveBeenCalled();

      });

      it('should scope function of stopStepUp called', function() {
        addElement();
        spyOn(self.isoScope, 'stopStepUp');

        var buttonListNode = self.element.querySelectorAll('button');
        utils.triggerMouseEvent(buttonListNode[0], "mouseup");

        expect(self.isoScope.stopStepUp).toHaveBeenCalled();

        utils.triggerMouseEvent(buttonListNode[0], "mouseleave");

        expect(self.isoScope.stopStepUp).toHaveBeenCalled();
      });

      it('should scope function of stopStepDown called', function() {
        addElement();
        spyOn(self.isoScope, 'stopStepDown');

        var buttonListNode = self.element.querySelectorAll('button');
        utils.triggerMouseEvent(buttonListNode[1], "mouseup");

        expect(self.isoScope.stopStepDown).toHaveBeenCalled();

        utils.triggerMouseEvent(buttonListNode[1], "mouseleave");

        expect(self.isoScope.stopStepDown).toHaveBeenCalled();

      });
    });
  });
});
