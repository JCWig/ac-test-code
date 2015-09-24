import angular from 'angular';
import template from './templates/content-panel.tpl.html';

class ContentPanelController {

  static get $inject() {
    return ['$scope', '$log'];
  }

  constructor($scope, $log) {
    this.$scope = $scope;
    this.$log = $log;
    this.collapsable = null;
    this.transcludedContent = null;
    this.customContentScope = null;

    $scope.$watch('contentPanel.isCollapsed', (newValue, oldValue) => {
      if (newValue !== oldValue && typeof this.onToggle === 'function') {
        this.onToggle({ value: newValue});
      }
    });
  }

  initialize(element, attrs, transclude) {
    if (!element || !attrs || !transclude) {
      throw new Error('Element, attrs and transclude function required to initialize.');
    }

    let transcludedContent;

    this.collapsable = angular.isUndefined(attrs.notCollapsable);
    this.isCollapsed = this.isCollapsed === true;

    if (!attrs.header) {
      transclude((clone, cloneScope) => {
        element.append(clone);
        transcludedContent = clone;
        this.customContentScope = cloneScope;
        this.customContentScope.headerClick = this.headerClick;

        this.customContentScope.contentPanel = {
          headerClick: angular.bind(this, this.headerClick),
          collapsable: this.collapsable,
          isCollapsed: this.isCollapsed
        };
      });

      //This doesn't appear to be necessary but garbage clean up just in case,
      // for added robustness against future issues.
      //Chrome node/listener graphs appear the same whether or not this is done.
      this.$scope.$on('$destroy', () => {
        this.customContentScope.$destroy();
        this.customContentScope = null;

        transcludedContent.remove();
        transcludedContent = null;
      });

      // Check if header is included
      if (!element[0].querySelector('.panel-heading')) {
        this.$log.error('No "akam-content-panel-header" tag found. Header will not render.');
      }
    }
  }

  headerClick(e) {
    if (this.collapsable) {
      this.isCollapsed = !this.isCollapsed;
      if (this.customContentScope) {
        this.customContentScope.contentPanel.isCollapsed =
          !this.customContentScope.contentPanel.isCollapsed;
      }
    }
    e.preventDefault();
    e.stopPropagation();
  }

}

function contentPanelDirective() {

  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {},
    bindToController: {
      header: '@?',
      isCollapsed: '=?',
      onToggle: '&?'
    },
    controller: ContentPanelController,
    controllerAs: 'contentPanel',
    template: template,
    compile: function compile(tElement, tAttrs) {
      // If the header attribute is not specified, assume
      // the developer provided their own akam-content-panel-header
      // and akam-content-panel-body inner directives.
      if (!tAttrs.header) {
        tElement.empty();
      }

      return function(scope, iElement, iAttrs, controller, transclude) {
        scope.contentPanel.initialize(iElement, iAttrs, transclude);
      };
    }
  };
}

export default contentPanelDirective;