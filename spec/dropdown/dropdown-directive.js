/*global angular, inject*/
'use strict';
var util = require('../utilities');

describe('akamai.components.dropdown', function() {
  var $scope, $compile, stateStrings, stateObjects;

  stateStrings = [
    'Colorado',
    'Connecticut',
    'Maryland',
    'Massachusetts',
    'New Hampshire',
    'New Jersey',
    'New York',
    'Vermont',
    'Virginia',
    'Washington DC'
  ];

  stateObjects = [
    {name: 'Colorado'},
    {name: 'Connecticut'},
    {name: 'Maryland'},
    {name: 'Massachusetts'},
    {name: 'New Hampshire'},
    {name: 'New Jersey'},
    {name: 'New York'},
    {name: 'Vermont'},
    {name: 'Virginia'},
    {name: 'Washington DC'},
  ];

  beforeEach(function() {
    inject.strictDi(true);
    angular.mock.module(require('../../src/dropdown').name);
    inject(function($rootScope, _$compile_, $httpBackend) {
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

  describe('when rendering the default dropdown', function() {

    it('should render correctly without customization', function() {
      var dropdownTemplate =
        '<akam-dropdown ng-model="selectedState" options="stateStrings"></akam-dropdown>';

      $scope.selectedState = undefined;
      $scope.stateStrings = stateStrings;

      addElement(dropdownTemplate);

      var dropdown = util.find('.dropdown');
      var dropdownToggle = util.find('.dropdown-toggle');
      var dropdownMenu = util.find('.dropdown-menu');
      var selected = util.find('span.selected-option');


      expect(dropdown.classList.contains('open')).toBe(false);
      expect(selected.children.length).toBe(1);
      expect(selected.children[0].innerHTML).toBe('');

      util.click(dropdownToggle);
      expect(dropdown.classList.contains('open')).toBe(true);

      expect(dropdownMenu.children[0].classList.contains('ng-hide')).toBe(true);
      expect(dropdownMenu.getElementsByTagName('li').length).toBe(stateStrings.length);
    });

    it('should render correctly without customization - with objects', function() {
      var dropdownTemplate =
        '<akam-dropdown ng-model="selectedState" options="stateObjects" option-property="name"></akam-dropdown>';

      $scope.selectedState = {name: 'New York'};
      $scope.stateObjects = stateObjects;

      addElement(dropdownTemplate);

      var dropdown = util.find('.dropdown');
      var dropdownToggle = util.find('.dropdown-toggle');
      var dropdownMenu = util.find('.dropdown-menu');
      var selected = util.find('span.selected-option');

      expect(dropdown.classList.contains('open')).toBe(false);
      expect(selected.children.length).toBe(1);
      expect(selected.children[0].innerHTML).toBe('New York');

      expect(dropdownMenu.getElementsByTagName('li').length).toBe(stateObjects.length);
    });

  });

});