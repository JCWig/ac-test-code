/*global angular, inject, beforeEach*/
'use strict';

describe('akamai.components.switch-button', function() {
  var $scope, $compile, element;

  beforeEach(angular.mock.module(require('../../src/switch-button').name));
  beforeEach(inject(function($rootScope, _$compile_) {
    $scope = $rootScope;
    $compile = _$compile_;
  }));

  describe('when rendering with just ng-model attribute defined', function() {
    var ON_CLASS = 'switch-button-on', OFF_CLASS = 'switch-button-off';
    var basicTemplate = '<akam-switch-button ng-model="val"></akam-switch-button>';

    it('should set isolate scope defaults correctly', function() {
      var elementScope;

      $scope.val = true;
      element = $compile(basicTemplate)($scope);
      $scope.$digest();

      elementScope = element.isolateScope();
      expect(elementScope.on).toBe(true);
      //expect(elementScope.size).toBe('small');
      expect(elementScope.theme).toBe('color');
      expect(elementScope.onLabel).toBe('On');
      expect(elementScope.offLabel).toBe('Off');
    });

    it('should add the class switch-button-on if the value is true', function() {
      $scope.val = true;
      element = $compile(basicTemplate)($scope);
      $scope.$digest();

      expect(element.hasClass(ON_CLASS)).toBe(true);
      expect(element.hasClass(OFF_CLASS)).toBe(false);
    });

    it('should add the class switch-button-off if the value is false', function() {
      $scope.val = false;
      element = $compile(basicTemplate)($scope);
      $scope.$digest();

      expect(element.hasClass(OFF_CLASS)).toBe(true);
      expect(element.hasClass(ON_CLASS)).toBe(false);
    });

    it('should toggle classes when clicked', function() {
      $scope.val = true;
      element = $compile(basicTemplate)($scope);
      $scope.$digest();

      expect(element.hasClass(ON_CLASS)).toBe(true);
      expect(element.hasClass(OFF_CLASS)).toBe(false);
      element.triggerHandler('click');
      expect(element.hasClass(OFF_CLASS)).toBe(true);
      expect(element.hasClass(ON_CLASS)).toBe(false);
    });

    it('should toggle model values when clicked', function() {
      $scope.val = true;
      element = $compile(basicTemplate)($scope);
      $scope.$digest();

      expect($scope.val).toBe(true);
      expect(element.isolateScope().on).toBe(true);
      element.triggerHandler('click');
      expect($scope.val).toBe(false);
      expect(element.isolateScope().on).toBe(false);
    });
  });

  describe('when setting specific switch-button properties', function() {

    it('should render a medium size version', function() {
      var template = '<akam-switch-button ng-model="val" size="medium"></akam-switch-button>';

      $scope.val = true;
      element = $compile(template)($scope);
      $scope.$digest();

      expect(element.hasClass('medium'));
    });

    it('should render a grayscale theme', function() {
      var template = '<akam-switch-button ng-model="val" theme="grayscale"></akam-switch-button>';

      $scope.val = true;
      element = $compile(template)($scope);
      $scope.$digest();

      expect(element.hasClass('grayscale'));
    });

    it('should render a disabled version', function() {
      var template = '<akam-switch-button ng-model="val" disabled="true"></akam-switch-button>';

      $scope.val = true;
      element = $compile(template)($scope);
      $scope.$digest();

      expect(element.hasClass('disabled'));
    });

  });

});