/* globals angular, beforeEach, afterEach */
'use strict';

import util from '../../src/utils';
import treeView from '../../src/tree-view';

const TREE_VIEW_WRAPPER = '.akam-tree-view';

describe('akamai.components.akam-standalone', function() {

  beforeEach(function() {
    angular.mock.inject.strictDi(true);
    angular.mock.module(util.name);
    angular.mock.module(treeView.name);
    angular.mock.inject(function($compile, $rootScope) {
      this.$scope = $rootScope.$new();
      this.$compile = $compile;
    });

    this.addElement = function(markup) {
      this.el = this.$compile(markup)(this.$scope);
      this.$scope.$digest();
      this.element = document.body.appendChild(this.el[0]);
    };

  });

  afterEach(function() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
  });

  describe('when rendering', function() {

    beforeEach(function() {
      var markup;

      this.$scope.contextData = {
        parent: {title: 'Justice League'},
        current: {title: 'Bruce Wayne'},
        children: [{title: 'Dick Grayson'}]
      };
      this.$scope.triggerChange = function() {};

      markup = `<div style="max-width:150px">
                  <akam-tree-view akam-standalone
                    context-data="contextData"
                    on-context-change="triggerChange">
                  </akam-tree-view>
                </div>`;

      this.addElement(markup);
      this.result = document.querySelector(TREE_VIEW_WRAPPER);
    });

    it('should add correct class when directive is not replaced', function() {
      expect(this.result.classList.contains('standalone')).toBe(true);
    });

  });

});