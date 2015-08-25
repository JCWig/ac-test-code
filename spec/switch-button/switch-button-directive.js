/*global inject*/
'use strict';
var angular = require('angular');
var utilities = require('../utilities');
var translationMock = require('../fixtures/translationFixture.json');

describe('akamai.components.switch-button', function() {
  var $scope, $compile, SWITCH_SELECTOR = '.switch-button';

  beforeEach(function() {
    inject.strictDi(true);
    angular.mock.module(require('../../src/switch-button').name);
    angular.mock.module(function($provide, $translateProvider) {
      $translateProvider.useLoader('i18nCustomLoader');
    });
    inject(function($rootScope, _$compile_, $httpBackend) {
      $scope = $rootScope;
      $compile = _$compile_;

      $httpBackend.when('GET', utilities.LIBRARY_PATH).respond(translationMock);
      $httpBackend.when('GET', utilities.CONFIG_PATH).respond({});
      $httpBackend.flush();
    });
  });

  afterEach(function() {
    if (self.element) {
      document.body.removeChild(self.element);
      self.element = null;
    }
  });

  function addElement(markup) {
    self.el = $compile(markup)($scope);
    $scope.$digest();
    self.element = document.body.appendChild(self.el[0]);
  }

  describe('when rendering the default switch', function() {
    var ON_CLASS = 'switch-button-on', OFF_CLASS = 'switch-button-off';
    var basicTemplate = '<akam-switch-button ng-model="val" disabled="false"></akam-switch-button>';

    it('should render correctly without customization', function() {
      var elementScope, onLabelElem, offLabelElem;

      $scope.val = true;
      addElement(basicTemplate);

      elementScope = self.el.isolateScope().switchButton;
      expect(elementScope.on).toBe(true);
      expect(elementScope.onLabel).toBe('On');
      expect(elementScope.offLabel).toBe('Off');

      onLabelElem = document.querySelector('.switch-button-container > span:first-child');
      offLabelElem = document.querySelector('.switch-button-container > span:last-child');
      expect(onLabelElem.textContent).toMatch(/On/);
      expect(offLabelElem.textContent).toMatch(/Off/);
    });

    it('should show an "on" state', function() {
      var elem;

      $scope.val = true;
      addElement(basicTemplate);
      elem = document.querySelector(SWITCH_SELECTOR);

      expect(elem.classList.contains(ON_CLASS)).toBe(true);
      expect(elem.classList.contains(OFF_CLASS)).toBe(false);
    });

    it('should show an "off" state', function() {
      var elem;

      $scope.val = false;
      addElement(basicTemplate);
      elem = document.querySelector(SWITCH_SELECTOR);

      expect(elem.classList.contains(OFF_CLASS)).toBe(true);
      expect(elem.classList.contains(ON_CLASS)).toBe(false);
    });

    it('should be able to switch on and off', function() {
      var elem;

      $scope.val = true;
      addElement(basicTemplate);

      elem = document.querySelector(SWITCH_SELECTOR);

      expect(elem.classList.contains(ON_CLASS)).toBe(true);
      expect(elem.classList.contains(OFF_CLASS)).toBe(false);
      utilities.click(self.element);
      expect(elem.classList.contains(OFF_CLASS)).toBe(true);
      expect(elem.classList.contains(ON_CLASS)).toBe(false);

      expect($scope.val).toBe(false);
      expect(self.el.isolateScope().switchButton.on).toBe(false);
      utilities.click(self.element);
      expect($scope.val).toBe(true);
      expect(self.el.isolateScope().switchButton.on).toBe(true);
    });
  });

  describe('when showing different configurations', function() {

    it('should render a medium size version', function() {
      var elem;
      var template = '<akam-switch-button ng-model="val" size="medium"></akam-switch-button>';

      $scope.val = true;
      addElement(template);

      elem = document.querySelector(SWITCH_SELECTOR);
      expect(elem.classList.contains('medium'));
    });

    it('should render a grayscale theme', function() {
      var elem;
      var template = '<akam-switch-button ng-model="val" theme="grayscale"></akam-switch-button>';

      $scope.val = true;
      addElement(template);

      elem = document.querySelector(SWITCH_SELECTOR);
      expect(elem.classList.contains('grayscale'));
    });

    it('should render a disabled version', function() {
      var elem;
      var template = '<akam-switch-button ng-model="val" disabled="true"></akam-switch-button>';

      $scope.val = true;
      addElement(template);

      elem = document.querySelector(SWITCH_SELECTOR);
      expect(elem.classList.contains('disabled'));
    });

  });

});