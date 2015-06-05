/* globals angular, beforeEach, afterEach */
'use strict';

var utilities = require('../utilities');

var TREE_VIEW_WRAPPER = '.akam-tree-view';

describe('akamai.components.akam-standalone', function() {
  var self, scope, compile;

  beforeEach(function() {
    self = this;
    angular.mock.inject.strictDi(true);
    angular.mock.module(require('../../src/utils').name);
    angular.mock.module(require('../../src/tree-view').name);
    angular.mock.inject(function($compile, $rootScope, $httpBackend) {
      scope = $rootScope.$new();
      compile = $compile;
      $httpBackend.when('GET', utilities.LIBRARY_PATH).respond({});
      $httpBackend.when('GET', utilities.CONFIG_PATH).respond({});
    });
  });

  afterEach(function() {
    if (self.element) {
      document.body.removeChild(self.element);
      self.element = null;
    }
  });

  function addElement(markup) {
    self.el = compile(markup)(scope);
    scope.$digest();
    self.element = document.body.appendChild(self.el[0]);
  }

  describe('when rendering', function() {
    it('should add correct class when directive is not replaced', function() {
      var markup, treeContents;

      scope.contextData = {
        parent: {title: 'Justice League'},
        current: {title: 'Bruce Wayne'},
        children: [{title: 'Dick Grayson'}]
      };
      scope.triggerChange = function() {};
      markup = '<div style="max-width:150px"><akam-tree-view akam-standalone ' +
      'context-data="contextData" on-context-change="triggerChange"> </akam-tree-view></div>';
      addElement(markup);
      treeContents = document.querySelector(TREE_VIEW_WRAPPER);
      expect(treeContents.classList.contains('standalone')).toBe(true);
    });

  });
});