'use strict';
var utilities = require('../utilities');

var SPINNER_BUTTON = '.spinner-button';
var SPINNER_TEXT = '.text';

describe('akam-spinner-button', function() {
  var compile = null;
  var scope = null;

  beforeEach(function() {
    inject.strictDi(true);
    angular.mock.module(require('../../src/spinner-button').name);
    inject(function($compile, $rootScope) {
      compile = $compile;
      scope = $rootScope.$new();
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

    describe('when text property is set to "hello"', function() {

      describe('when rendered', function() {

        beforeEach(function() {
          var markup = '<akam-spinner-button text="hello"></akam-spinner-button>';
          let el = compile(markup)(scope);
          scope.$digest();
          this.element = document.body.appendChild(el[0]);
        });

        it('should have the text show', function() {
          expect(this.element.textContent.trim()).toBe('hello');
        });

      });

    });

  });

  describe('given a spinner button', function() {

    describe('when disabled property is set to true', function() {

      describe('when rendered', function() {

        beforeEach(function() {
          scope.disabled = true;
          var markup = '<akam-spinner-button text="hello" disabled="disabled"></akam-spinner-button>';
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
          var markup = '<akam-spinner-button text="hello" disabled="disabled"></akam-spinner-button>';
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
          var markup = '<akam-spinner-button text="hello" processing="processing"></akam-spinner-button>';
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

  });

});
