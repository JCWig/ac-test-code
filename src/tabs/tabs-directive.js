import angular from 'angular';

import template from './templates/tabs-directive.tpl.html';

class TabsController {
  constructor($state, $attrs) {
    this.tabs = [];
    this.$state = $state;
    this.vertical = angular.isDefined($attrs.vertical);
    this.routable = angular.isDefined($attrs.routable);
    this.secondary = angular.isDefined($attrs.secondary);
  }

  initialize(elem) {
    if (this.routable) {
      this.tabs.forEach(tab => {
        if (tab.state && tab.active) {
          throw new Error('When using routable tabs, a tab\'s active attribute must not be set.');
        }
      });
    } else if (this.tabs.filter(tab => tab.active).length > 1) {
      throw new Error('Only one tab can be declared as active.')
    }

    this.elem = elem;
    this.tabContentElem =
      angular.element(this.elem[0].querySelector('div.tab-content'));

    this.updateTabs();
  }

  addTab(tab) {
    this.tabs.push(tab);
  }

  activate(tab) {
    if (tab.disabled || tab.disabled === 'true') {
      return;
    }

    if (!this.routable) {
      let activeTab = this.getActiveTab();
      activeTab.transcludeClone.remove();
      activeTab.transcludeScope.$destroy();
    }

    this.tabs.forEach(aTab => aTab.active = false);
    tab.active = true;

    if (this.routable) {
      if (!this.$state.is(tab.state, tab.stateParams, tab.stateOptions) && !tab.disabled) {
        this.$state.go(tab.state, tab.stateParams, tab.stateOptions);
      }
    } else {
      tab.transclude((clone, scope) => {
        tab.transcludeClone = clone;
        tab.transcludeScope = scope;
        this.tabContentElem.append(clone);
      });
    }
  }

  getActiveTab() {
    return this.tabs.find(tab => tab.active);
  }

  updateTabs() {

    if (this.routable) {
      let active = (tab) => {
        return this.$state.includes(tab.state, tab.stateParams, tab.stateOptions);
      };
      this.tabs.forEach(tab => tab.active = active(tab));
    } else {
      if (!this.tabs.some(tab => tab.active)) {
        this.tabs[0].active = true;
      }
      this.activate(this.getActiveTab());
    }
  }

  getClasses() {
    return {
      'nav-tabs': !this.secondary,
      'nav-pills': this.secondary,
      'nav-stacked': this.vertical
    }
  }
}
TabsController.$inject = ['$state', '$attrs'];

function tabs($rootScope) {

  return {
    restrict: 'E',
    transclude: true,
    scope: {},
    bindToController: {},
    controller: TabsController,
    controllerAs: 'tabs',
    template: template,
    link: function(scope, elem, attrs, ctrl) {
      ctrl.initialize(elem);

      if (ctrl.routable) {
        let updateTabs = angular.bind(ctrl, ctrl.updateTabs);

        let unbindStateChangeSuccess = $rootScope.$on('$stateChangeSuccess', updateTabs);
        let unbindStateChangeError = $rootScope.$on('$stateChangeError', updateTabs);
        let unbindStateChangeCancel = $rootScope.$on('$stateChangeCancel', updateTabs);
        let unbindStateNotFound = $rootScope.$on('$stateNotFound', updateTabs);

        scope.$on('$destroy', unbindStateChangeSuccess);
        scope.$on('$destroy', unbindStateChangeError);
        scope.$on('$destroy', unbindStateChangeCancel);
        scope.$on('$destroy', unbindStateNotFound);
      }
    }
  };
}

tabs.$inject = ['$rootScope'];

export default tabs;
