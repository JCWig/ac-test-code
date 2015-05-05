'use strict';

describe('akamai.components.spinner', function() {
  var scope, self, compile;
  var UP_BUTTON = '.akam-spinner button:first-child';
  var DOWN_BUTTON = '.akam-spinner button:last-child';

  beforeEach(function() { //Will run before each complete block
    self = this;
    angular.mock.module(require('../../src/spinner').name);
    inject(function($rootScope, _$compile_) {
      //Include Services, Factories and Constants
      scope = $rootScope.$new(); //angular service
      compile = _$compile_;
    });
    scope.testData = {
      value: "",
      min: 0,
      max: 50,
      label: 'my spinner',
      disabled: 'disabled'
    };
  });
  afterEach(function() { //Will run after each it block is completed
    if (self.element) {
      document.body.removeChild(self.element);
      self.element = null;
    }
  });

  function addElement(markup) {
    self.el = compile(markup)(scope);
    scope.$digest();
    self.element = document.body.appendChild(self.el[0]);
  };
  describe('when rendering akam-spinner directive without options', function() {
    var spinnerElem;
    beforeEach(function() { //Will run after the overall beforeEach but before each it statement in this describe block
      var markup = '<akam-spinner ng-model="value"></akam-spinner>';
      scope.value = scope.testData.value;
      addElement(markup);
      spinnerElem = document.querySelector('.akam-spinner');
    });

    it('should verify initial input element value correct', function() {
      var inputElem = spinnerElem.querySelector('input');
      expect(inputElem.value).toEqual('0');
    });

    it('should verify input element "disabled" attribute', function() {
      var inputElem = spinnerElem.querySelector('input');
      expect(inputElem.classList.contains('disabled')).toBe(false);
    })

    it('should verify input element "min" attribute', function() {

    })

    it('should verify input element "max" attribute', function() {

    })

    it('should verify initial label element value correct', function() {
      var labelElem = spinnerElem.querySelector('label');
      expect(labelElem.textContent).toBe('');
    });

    it('should verify button elements', function() {
      var buttonListNode = spinnerElem.querySelectorAll('button');
      expect(buttonListNode.length).toEqual(2);
    });

    it('should verify up button icon', function() {
      var buttonListNode = spinnerElem.querySelectorAll('button');
      var buttonElem = buttonListNode[0].querySelector("i");
      expect(buttonElem.classList.contains('luna-arrow_smUp')).toBe(true);
    });

    it('should verify down button icon', function() {
      var buttonListNode = spinnerElem.querySelectorAll('button');
      var buttonElem = buttonListNode[1].querySelector("i");
      expect(buttonElem.classList.contains('luna-arrow_smDown')).toBe(true);
    });




/*
    it('should verify directive value changes if parent scope value changes', function() {
      scope.value = 6;
      var inputElem = spinnerElem.querySelector('input');
      expect(inputElem.textContent).toEqual(6);
    });
*/
  });
});
