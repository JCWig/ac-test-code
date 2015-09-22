var utilities = require('../utilities');

var SPINNER_BUTTON = '.spinner-button';
var SPINNER_TEXT = '.text';

describe('akam-spinner-button', function() {
  var compile = null;
  var scope = null;
  var parse = null;

  var translationMock = {
    "components": {
      "custom": 'hello',
      "name": '{{first}} {{last}}'
    }
  };

  beforeEach(function() {
    inject.strictDi(true);
    angular.mock.module(require('../../src/spinner-button').name);
    angular.mock.module(function($provide, $translateProvider) {
      function i18nCustomLoader($q, $timeout) {
        return function(options) {
          var deferred = $q.defer();
          deferred.resolve(translationMock);
          return deferred.promise;
        };
      }
      i18nCustomLoader.$inject = ['$q', '$timeout'];

      $provide.factory('i18nCustomLoader', i18nCustomLoader);
      $translateProvider.useLoader('i18nCustomLoader');
    });

    inject(function($compile, $rootScope, $parse) {
      compile = $compile;
      scope = $rootScope.$new();
      parse = $parse;
    });
  });

  afterEach(function() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
  });

  describe('given a spinner button', function() {

    describe('when rendered', function() {

      beforeEach(function() {
        var markup = '<akam-spinner-button></akam-spinner-button>';
        let el = compile(markup)(scope);
        scope.$digest();
        this.element = document.body.appendChild(el[0]);
      });

      it('should produce a button', function() {
        expect(this.element.tagName.toLowerCase()).toBe('button');
      });

      it('should have spinner-button class', function() {
        expect(this.element.classList.contains('spinner-button')).toBe(true);
      });

    });

  });

  describe('given a spinner button', function() {

    describe('when textContent property is set to i18n key', function() {

      describe('when rendered', function() {

        beforeEach(function() {
          var markup = '<akam-spinner-button text-content="components.custom"></akam-spinner-button>';
          let el = compile(markup)(scope);
          scope.$digest();
          this.element = document.body.appendChild(el[0]);
        });

        it('should have the text show', function() {
          expect(this.element.textContent.trim()).toBe(translationMock.components.custom);
        });

      });

    });

  });

  describe('given a spinner button', function() {

    describe('when disabled property is set to true', function() {

      describe('when rendered', function() {

        beforeEach(function() {
          scope.disabled = true;
          var markup = '<akam-spinner-button text-content="hello" disabled="disabled"></akam-spinner-button>';
          let el = compile(markup)(scope);
          scope.$digest();
          this.element = document.body.appendChild(el[0]);
        });

        it('should have the disabled attribute set for the button', function() {
          expect(this.element.hasAttribute('disabled')).toBe(true);
        });

      });

    });

  });

  describe('given a spinner button', function() {

    describe('when disabled property set to false', function() {

      describe('when rendered', function() {

        beforeEach(function() {
          scope.disabled = false;
          var markup = '<akam-spinner-button text-content="hello" disabled="disabled"></akam-spinner-button>';
          let el = compile(markup)(scope);
          scope.$digest();
          this.element = document.body.appendChild(el[0]);
        });

        it('should not have the disabled attribute set for the button', function() {
          expect(this.element.hasAttribute('disabled')).toBe(false);
        });

      });

    });

  });

  describe('given a spinner button', function() {

    describe('when processing property set to true', function() {

      describe('when rendered', function() {

        beforeEach(function() {
          scope.processing = true;
          var markup = '<akam-spinner-button text-content="hello" processing="processing"></akam-spinner-button>';
          let el = compile(markup)(scope);
          scope.$digest();
          this.element = document.body.appendChild(el[0]);
        });

        it('should have the class "in-progress" set for the button', function() {
          expect(this.element.classList.contains('in-progress')).toBe(true);
        });

        it('should have the disabled attribute set for the button', function() {
          expect(this.element.hasAttribute('disabled')).toBe(true);
        });

      });

    });

    describe('given a spinner button', function() {

      describe('when not add text-content-values attribute with translation key only', function() {

        describe('when rendered', function() {

          beforeEach(function() {
            var markup = '<akam-spinner-button text-content="components.custom"></akam-spinner-button>';
            let el = compile(markup)(scope);
            scope.$digest();
            this.element = document.body.appendChild(el[0]);
          });

          it('should have attribute of "translate-values"', function() {
            let textElement = this.element.querySelector('span.text');
            expect(textElement.hasAttribute('translate-values')).toBe(true);
          });

          it('should verify translated value', function() {
            let textElement = this.element.querySelector('span.text');
            expect(textElement.textContent).toBe(translationMock.components.custom);
          });
        });

      });
    });
    describe('given a spinner button', function() {

      describe('when add text-content-values attribute with translation key and variable replacements', function() {

        describe('when rendered', function() {
          let textElement;
          beforeEach(function() {
            var markup = `<akam-spinner-button text-content="components.name" text-content-values="{first:'Sean', last:'Wang'}"></akam-spinner-button>`;
            let el = compile(markup)(scope);
            scope.$digest();
            this.element = document.body.appendChild(el[0]);
            textElement = this.element.querySelector('span.text');
          });

          it('should have attribute of "translate-values"', function() {
            expect(textElement.hasAttribute('translate-values')).toBe(true);
          });

          it('should verify "translate-values" attribute object property', function() {
            expect(parse(textElement.getAttribute('translate-values'))().first).toBe("Sean");
          });

           it('should have text content value matches translated value with passing in variables', function() {
            expect(textElement.textContent).toBe('Sean Wang');
          });

        });

      });
    });
  });
});
