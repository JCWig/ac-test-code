/*global angular, inject*/
'use strict';

describe('akamai.components.switch-button', function() {
  var $scope, $compile, element;

  beforeEach(function() {
    inject.strictDi(true);
    angular.mock.module(require('../../src/switch-button').name);
  });

  beforeEach(inject(function($rootScope, _$compile_) {
    $scope = $rootScope;
    $compile = _$compile_;
  }));

  describe('when rendering the default switch', function() {
    var ON_CLASS = 'switch-button-on', OFF_CLASS = 'switch-button-off';
    var basicTemplate = '<akam-switch-button ng-model="val"></akam-switch-button>';

    it('should set isolate scope defaults correctly', function() {
      var elementScope;

      $scope.val = true;
      element = $compile(basicTemplate)($scope);
      $scope.$digest();

      elementScope = element.isolateScope();
      expect(elementScope.on).toBe(true);
      expect(elementScope.onLabel).toBe('On');
      expect(elementScope.offLabel).toBe('Off');
    });

    it('should show an "on" state', function() {
      $scope.val = true;
      element = $compile(basicTemplate)($scope);
      $scope.$digest();

      expect(element.hasClass(ON_CLASS)).toBe(true);
      expect(element.hasClass(OFF_CLASS)).toBe(false);
    });

    it('should show an "off" state', function() {
      $scope.val = false;
      element = $compile(basicTemplate)($scope);
      $scope.$digest();

      expect(element.hasClass(OFF_CLASS)).toBe(true);
      expect(element.hasClass(ON_CLASS)).toBe(false);
    });

    it('should be able to switch on and off', function() {
      $scope.val = true;
      element = $compile(basicTemplate)($scope);
      $scope.$digest();

      expect(element.hasClass(ON_CLASS)).toBe(true);
      expect(element.hasClass(OFF_CLASS)).toBe(false);
      element.triggerHandler('click');
      expect(element.hasClass(OFF_CLASS)).toBe(true);
      expect(element.hasClass(ON_CLASS)).toBe(false);

      expect($scope.val).toBe(false);
      expect(element.isolateScope().on).toBe(false);
      element.triggerHandler('click');
      expect($scope.val).toBe(true);
      expect(element.isolateScope().on).toBe(true);
    });
  });

  describe('when showing different configurations', function() {

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