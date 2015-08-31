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
    angular.mock.module(function($translateProvider) {
      $translateProvider.translations('en_US', translationMock);
      $translateProvider.useLoader('translateNoopLoader');
    });
    inject(function($rootScope, _$compile_) {
      $scope = $rootScope;
      $compile = _$compile_;
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

  describe('when rendering switch button on off labels', function() {
    it('should translate and display component default value if key not provided', function() {
      var onLabelElem, offLabelElem;
      var markup = '<akam-switch-button ng-model="val"></akam-switch-button>';
      $scope.val = true;
      addElement(markup);

      onLabelElem = document.querySelector('.switch-button-container > span:first-child');
      offLabelElem = document.querySelector('.switch-button-container > span:last-child');
      expect(onLabelElem.textContent).toMatch(/On/);
      expect(offLabelElem.textContent).toMatch(/Off/);
    });

    it('should translate and display translated value if key found', function() {
      var onLabelElem, offLabelElem;
      var markup = '<akam-switch-button ng-model="val" on-label="examples.switchbutton.custom.allow" off-label="examples.switchbutton.custom.deny"></akam-switch-button>';
      $scope.val = true;
      addElement(markup);

      onLabelElem = document.querySelector('.switch-button-container > span:first-child');
      offLabelElem = document.querySelector('.switch-button-container > span:last-child');
      expect(onLabelElem.textContent).toMatch(/Allow/);
      expect(offLabelElem.textContent).toMatch(/Deny/);
    });

    it('should translate and display key if key not found in translation table', function() {
      var onLabelElem, offLabelElem;
      var markup = '<akam-switch-button ng-model="val" on-label="On Value" off-label="Off Value"></akam-switch-button>';
      $scope.val = true;
      addElement(markup);

      onLabelElem = document.querySelector('.switch-button-container > span:first-child');
      offLabelElem = document.querySelector('.switch-button-container > span:last-child');
      expect(onLabelElem.textContent).toMatch(/On Value/);
      expect(offLabelElem.textContent).toMatch(/Off Value/);
    });

    it('should translate key when key provided to translate filter', function() {
      var onLabelElem, offLabelElem;
      var markup = '<akam-switch-button ng-model="val" on-label=\'{{"examples.switchbutton.custom.allow" | translate}}\'' +
                   ' off-label=\'{{"examples.switchbutton.custom.deny" | translate}}\'></akam-switch-button>';
      $scope.val = true;
      addElement(markup);

      onLabelElem = document.querySelector('.switch-button-container > span:first-child');
      offLabelElem = document.querySelector('.switch-button-container > span:last-child');
      expect(onLabelElem.textContent).toMatch(/Allow/);
      expect(offLabelElem.textContent).toMatch(/Deny/);
    });

    it('should translate and display key if key not found in translation table when using translate filter', function() {
      var onLabelElem, offLabelElem;
      var markup = '<akam-switch-button ng-model="val" on-label=\'{{"Yes" | translate}}\'' +
                   ' off-label=\'{{"No" | translate}}\'></akam-switch-button>';
      $scope.val = true;
      addElement(markup);

      onLabelElem = document.querySelector('.switch-button-container > span:first-child');
      offLabelElem = document.querySelector('.switch-button-container > span:last-child');
      expect(onLabelElem.textContent).toMatch(/Yes/);
      expect(offLabelElem.textContent).toMatch(/No/);
    });

    // it('should translate and display component default value when empty key provided to akamTranslate filter', function() {
    //   var onLabelElem, offLabelElem;
    //   var markup = '<akam-switch-button ng-model="val" on-label=\'{{"" | akamTranslate}}\'' +
    //                ' off-label=\'{{"" | akamTranslate}}\'></akam-switch-button>';
    //   $scope.val = true;
    //   addElement(markup);

    //   onLabelElem = document.querySelector('.switch-button-container > span:first-child');
    //   offLabelElem = document.querySelector('.switch-button-container > span:last-child');
    //   console.log(onLabelElem);
    //   console.log(offLabelElem);
    //   expect(onLabelElem.textContent).toMatch(/On/);
    //   expect(offLabelElem.textContent).toMatch(/Off/);
    // });
  });



});