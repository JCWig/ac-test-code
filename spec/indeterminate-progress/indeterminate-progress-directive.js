'use strict';
import indeterminateProgress from '../../src/indeterminate-progress';

var angular = require('angular');
var utilities = require('../utilities');
var translationMock = require('../fixtures/translationFixture.json');

var INDETERMINATE_PROGRESS_WRAPPER = '.indeterminate-progress-wrapper';
var INDETERMINATE_PROGRESS_LABEL = '.indeterminate-progress-wrapper label';
var INDETERMINATE_PROGRESS_CLASS = 'indeterminate-progress';

describe('akam-indeterminate-progress', function() {

  beforeEach(function() {
    inject.strictDi(true);
    angular.mock.module(indeterminateProgress.name);
    angular.mock.module(function($provide, $translateProvider) {
      $translateProvider.useLoader('i18nCustomLoader');
    });
    inject(function($compile, $rootScope, $httpBackend) {
      this.compile = $compile;
      this.scope = $rootScope.$new();

      this.addElement = function(markup) {
        this.el = this.compile(markup)(this.scope);
        this.scope.$digest();
        this.element = document.body.appendChild(this.el[0]);
      };

      $httpBackend.when('GET', utilities.LIBRARY_PATH).respond(translationMock);
      $httpBackend.when('GET', utilities.CONFIG_PATH).respond({});
      $httpBackend.flush();
    });
  });

  afterEach(function() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
  });

  describe('given an indeterminate progress element', function() {

    describe('when no attributes are set', function() {

      beforeEach(function(){
        this.addElement('<div id="parent-element"><akam-indeterminate-progress></akam-indeterminate-progress></div>');
        this.result = this.element.querySelector(INDETERMINATE_PROGRESS_WRAPPER);
      });

      it('should set the parent element class', function(){
        expect(this.element.classList.contains(INDETERMINATE_PROGRESS_CLASS)).toBe(true);
      });

      it('should default the size of the indeterminate to "normal"', function () {
        expect(this.result.classList.contains('normal')).toBe(true);
      });

      it('should have a scope value of "started" for the state property', function(){
        expect(angular.element(this.result).isolateScope().indeterminateProgress.state).toEqual('started');
      });

    });

  });

  describe('given an indeterminate progress element', function() {

    describe('when destroyed', function() {

      beforeEach(function(){
        this.addElement('<div id="parent-element"><akam-indeterminate-progress></akam-indeterminate-progress></div>');
        this.result = this.element.querySelector(INDETERMINATE_PROGRESS_WRAPPER);
        angular.element(this.element).find('akam-indeterminate-progress').remove();
      });

      it('should unset the class on the parent element class', function(){
        expect(this.element.classList.contains(INDETERMINATE_PROGRESS_CLASS)).toBe(false);
      });

    });

  });


  describe('given an indeterminate progress element', function() {

    describe('when size attribute is set to micro', function() {

      beforeEach(function(){
        this.addElement('<div id="parent-element"><akam-indeterminate-progress size="micro"></akam-indeterminate-progress></div>');
        this.result = this.element.querySelector(INDETERMINATE_PROGRESS_WRAPPER);
      });

      it('should apply the class "micro" to the element', function () {
        expect(this.result.classList.contains('micro')).toBe(true);
      });

    });

  });

  describe('given an indeterminate progress element', function() {

    describe('when size attribute is set to small', function() {

      beforeEach(function(){
        this.addElement('<div id="parent-element"><akam-indeterminate-progress size="small"></akam-indeterminate-progress></div>');
        this.result = this.element.querySelector(INDETERMINATE_PROGRESS_WRAPPER);
      });

      it('should apply the class "small" to the element', function () {
        expect(this.result.classList.contains('small')).toBe(true);
      });

    });

  });

  describe('given an indeterminate progress element', function() {

    describe('when size attribute is set to normal', function() {

      beforeEach(function(){
        this.addElement('<div id="parent-element"><akam-indeterminate-progress size="normal"></akam-indeterminate-progress></div>');
        this.result = this.element.querySelector(INDETERMINATE_PROGRESS_WRAPPER);
      });

      it('should apply the class "normal" to the element', function () {
        expect(this.result.classList.contains('normal')).toBe(true);
      });

    });

  });


  describe('given an indeterminate progress element', function() {

    describe('when size attribute is set to large', function() {

      beforeEach(function(){
        this.addElement('<div id="parent-element"><akam-indeterminate-progress size="large"></akam-indeterminate-progress></div>');
        this.result = this.element.querySelector(INDETERMINATE_PROGRESS_WRAPPER);
      });

      it('should apply the class "large" to the element', function () {
        expect(this.result.classList.contains('large')).toBe(true);
      });

    });

  });

  describe('given an indeterminate progress element', function() {

    describe('when size attribute is set to an unknown value', function() {

      beforeEach(function(){
        this.addElement('<div id="parent-element"><akam-indeterminate-progress size="some_unknown"></akam-indeterminate-progress></div>');
        this.result = this.element.querySelector(INDETERMINATE_PROGRESS_WRAPPER);
      });

      it('should apply the class "normal" to the element', function () {
        expect(this.result.classList.contains('normal')).toBe(true);
      });

    });

  });

  describe('given an indeterminate progress element', function() {

    describe('when failed attribute is set to true value', function() {

      beforeEach(function(){
        this.addElement('<div id="parent-element"><akam-indeterminate-progress failed="true"></akam-indeterminate-progress></div>');
        this.result = this.element.querySelector(INDETERMINATE_PROGRESS_WRAPPER);
      });

      it('should apply the class "failed" to the element', function () {
        expect(this.result.classList.contains('failed')).toBe(true);
      });

      it('should have a scope value of "failed" for the state property', function(){
        expect(angular.element(this.result).isolateScope().indeterminateProgress.state).toEqual('failed');
      });

    });

  });

  describe('given an indeterminate progress element', function() {

    describe('when success attribute is set to true value', function() {

      beforeEach(function(){
        this.addElement('<div id="parent-element"><akam-indeterminate-progress success="true"></akam-indeterminate-progress></div>');
        this.result = this.element.querySelector(INDETERMINATE_PROGRESS_WRAPPER);
      });

      it('should apply the class "success" to the element', function () {
        expect(this.result.classList.contains('success')).toBe(true);
      });


    });

  });

  describe('given an indeterminate progress element', function() {

    describe('when completed attribute is set to true value', function() {

      beforeEach(function(){
        this.addElement('<div id="parent-element"><akam-indeterminate-progress completed="true"></akam-indeterminate-progress></div>');
        this.result = this.element.querySelector(INDETERMINATE_PROGRESS_WRAPPER);
      });

      it('should remove the indeterminate-progress class from the parent element', function () {
        expect(this.element.classList.contains(INDETERMINATE_PROGRESS_CLASS)).toBe(false);
      });

      it('should have a scope value of "completed" for the state property', function(){
        expect(angular.element(this.result).isolateScope().indeterminateProgress.state).toEqual('completed');
      });

    });

  });

  describe('given an indeterminate progress element', function() {

    describe('when label is set to a string value', function() {

      beforeEach(function(){
        this.addElement('<div id="parent-element"><akam-indeterminate-progress label="some text"></akam-indeterminate-progress></div>');
        this.result = this.element.querySelector(INDETERMINATE_PROGRESS_LABEL);
      });

      it('should have the text content of the label match the input', function(){
        expect(this.result.textContent).toMatch(/some text/);
      });

    });

  });

});
