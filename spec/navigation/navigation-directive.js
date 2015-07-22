/*global angular, inject*/
'use strict';
var util = require('../utilities');

describe('akamai.components.navigation', function() {
  var $scope, $compile, stateSpy, self = this;

  beforeEach(function() {
    inject.strictDi(true);

    angular.mock.module(require('../../src/navigation').name);

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

  describe('given a set of tab data', function() {
    describe('when rendering', function() {
      beforeEach(function() {

        $scope.tabData   = [
          {
            heading: 'Tab 1',
            route: 'tab1.route'
          },
          {
            heading: 'Tab 2',
            route: 'tab2.route'
          },
          {
            heading: 'Tab 3',
            route: 'tab3.route'
          }
         ];

        addElement('<akam-navigation data="tabData"></akam-navigation>');

      });

      it('should render the tab container', function() {
        expect(document.querySelector('.tab-container')).toBeDefined();
      });

      it('should render the individual tabs', function() {
        var tab = document.querySelector('.nav-tabs');
        expect(tab.getElementsByTagName('li').length).toBe(3);
      });
    });
  });

  // TODO - need to test routing
  describe('given a set of tab data', function() {
    describe('when clicking on another tab', function() {
      beforeEach(function() {

        $scope.tabData   = [
          {
            heading: 'Tab 1',
            route: 'tab1.route'
          },
          {
            heading: 'Tab 2',
            route: 'tab2.route'
          },
          {
            heading: 'Tab 3',
            route: 'tab3.route'
          }
        ];

        addElement('<akam-navigation data="tabData"></akam-navigation>');

      });

    });
  });








});








