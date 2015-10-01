import template from './templates/tab-directive.tpl.html';

class TabController {

  constructor($translate) {
    this.$translate = $translate;
  }

  initialize(transclude) {
    this.transclude = transclude;
    this.$translate(this.heading).then(heading => this.heading = heading);

    this.stateParams = this.stateParams || {};
    this.stateOptions = this.stateOptions || {};

    this.transclude((clone, scope) => {
      this.transcludeClone = clone;
      this.transcludeScope = scope;
    });
  }
}
TabController.$inject = ['$translate', '$attrs'];

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
      let tab = scope.tab;

      tab.initialize(transclude);
      tab.activate = () => tabs.activate(tab);

      tabs.addTab(tab);
    }
  };
}
