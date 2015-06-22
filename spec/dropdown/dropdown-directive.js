/*global angular, inject*/
'use strict';
var util = require('../utilities');
var translationMock = require('../fixtures/translationFixture.json');

describe('akamai.components.dropdown', function() {
  var $scope, $compile, stateStrings, stateObjects, timeout;

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
    angular.mock.module(function($provide, $translateProvider) {
      $translateProvider.useLoader('i18nCustomLoader');
    });
    inject(function($rootScope, _$compile_, $httpBackend, $timeout) {
      $scope = $rootScope;
      $compile = _$compile_;

      $httpBackend.when('GET', util.LIBRARY_PATH).respond(translationMock);
      $httpBackend.when('GET', util.CONFIG_PATH).respond({});
      $httpBackend.flush();
      timeout = $timeout;
    });
  });

  afterEach(function() {
    if (self.element) {
      document.body.removeChild(self.element);
      self.element = null;
    }
    var remainingDropdown = document.querySelector('.dropdown-menu');
    if (remainingDropdown) {
      document.body.removeChild(remainingDropdown);
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
        '<akam-dropdown ng-model="selectedState" items="stateStrings"></akam-dropdown>';

      $scope.selectedState = undefined;
      $scope.stateStrings = stateStrings;

      addElement(dropdownTemplate);

      var dropdown = util.find('.dropdown');
      var dropdownToggle = util.find('.dropdown-toggle');
      var dropdownMenu = util.find('.dropdown-menu');
      var selected = util.find('span.selected-option');

      expect(dropdown.classList.contains('open')).toBe(false);
      expect(selected.children.length).toBe(1);
      expect(selected.children[0].innerHTML).toBe('Select one');

      util.click(dropdownToggle);
      expect(dropdown.classList.contains('open')).toBe(true);

      expect(dropdownMenu.children[0].classList.contains('ng-hide')).toBe(true);
      expect(dropdownMenu.getElementsByTagName('li').length).toBe(stateStrings.length);
    });

    it('should render correctly without customization - with objects', function() {
      var dropdownTemplate =
        '<akam-dropdown ng-model="selectedState" items="stateObjects" text-property="name"></akam-dropdown>';

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
  describe('when appending dropdown to the body', function(){
    it('should render dropdown onto body', function(){
      var dropdownTemplate =
        '<akam-dropdown ng-model="selectedState" text-property="name"'+
                           'items="stateObjects" append-to-body filterable="name" clearable>'+
            '</akam-dropdown>';

      $scope.selectedState = {name: 'New York'};
      $scope.stateObjects = stateObjects;

      addElement(dropdownTemplate);
      timeout.flush();

      var dropdown = util.find('.dropdown');
      var dropdownMenu = util.find('.dropdown .dropdown-menu');
      var dropdownMenuBody = util.find('body .dropdown-menu');

      expect(dropdown).not.toBe(null);
      expect(dropdownMenu).toBe(null);
      expect(dropdownMenuBody).not.toBe(null);
    });
    it('should not auto close when filter is clicked', function(){
      var dropdownTemplate =
        '<akam-dropdown ng-model="selectedState" text-property="name"'+
                           'items="stateObjects" append-to-body filterable="name" clearable>'+
            '</akam-dropdown>';

      $scope.selectedState = {name: 'New York'};
      $scope.stateObjects = stateObjects;

      addElement(dropdownTemplate);
      timeout.flush();

      var dropdown = util.find('.dropdown');
      util.click('.dropdown-toggle');
      $scope.$digest();
      expect(dropdown.classList).toContain('open');
      var dropdownMenu = util.find('body .dropdown-menu');
      util.click(document.querySelectorAll('.dropdown-menu input')[0]);
      $scope.$digest();

      expect(dropdown.classList).toContain('open');
    });
    it('should still be able to select items', function(){
      var dropdownTemplate =
        '<akam-dropdown ng-model="selectedState" text-property="name"'+
                           'items="stateObjects" append-to-body filterable="name" clearable>'+
            '</akam-dropdown>';

      $scope.selectedState = {name: 'New York'};
      $scope.stateObjects = stateObjects;

      addElement(dropdownTemplate);
      timeout.flush();

      var dropdown = util.find('.dropdown');
      util.click('.dropdown-toggle');
      $scope.$digest();
      expect(dropdown.classList).toContain('open');
      var dropdownMenu = util.find('body .dropdown-menu');
      var secondDropDown = document.querySelectorAll('body .dropdown-menu')[1].querySelector('li a');
      util.click(secondDropDown);
      $scope.$digest();

      expect($scope.selectedState.state).not.toEqual('New York');
      expect($scope.selectedState.state).not.toEqual('Colorado');
    });
  });
});