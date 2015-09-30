import template from './templates/tab-directive.tpl.html';

class TabController {

  constructor($translate) {
    this.$translate = $translate;
  }

  activate() {
    this.tabs.activate(this);
  }

  initialize(tabs, transclude) {
    this.tabs = tabs;
    this.transclude = transclude;
    this.$translate(this.heading).then(heading => this.heading = heading);

    this.stateParams = this.stateParams || {};
    this.stateOptions = this.stateOptions || {};

    tabs.addTab(this);

    this.transclude((clone, scope) => {
      this.transcludeClone = clone;
      this.transcludeScope = scope;
    });
  }
}
TabController.$inject = ['$translate'];

export default function() {

  return {
    restrict: 'E',
    require: '^akamTabs',
    transclude: true,
    replace: true,
    scope: {},
    bindToController: {
      heading: '@',
      state: '@',
      stateParams: '=?',
      stateOptions: '=?',
      active: '=?',
      disabled: '=?'
    },
    controller: TabController,
    controllerAs: 'tab',
    template: template,
    link: function(scope, elem, attrs, tabs, transclude) {
      scope.tab.initialize(tabs, transclude);
    }
  };
}
