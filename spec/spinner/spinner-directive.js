'use strict';

describe('akamai.components.spinner', function() {
  var scope, self;
  beforeEach(function() { //Will run before each complete block
    self = this;
    angular.mock.module(require('../../src/spinner').name);
    inject(function($rootScope) {
      //Include Services, Factories and Constants
      scope = $rootScope.$new(); //angular service
    });
    scope.testData = {
      value: "",
      min: 0,
      max: 50,
      label: 'my spinner',
      disabled: 'disabled'
    };
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
      beforeEach(function() { //Will run after the overall beforeEach but before each it statement in this describe block
        var markup = '<akam-spinner ng-model="value"></akam-spinner>';
        addElement(markup);
      });

      it('should verify initial model value correct', function() {
        scope.value = scope.testData.value;
        var inputElem = document.querySelector('.akam-spinner').find("input");
        expect(spinnerElem.textContent).toEqual(0);
      });

      it('should verify directive value changes if parent scope value changes', function() {
        scope.value = 6;
        var inputElem = document.querySelector('.akam-spinner').find("input");
        expect(inputElem.textContent).toEqual(6);
      });
    });
  });
});
