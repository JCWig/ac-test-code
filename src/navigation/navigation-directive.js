import angular from 'angular';
import template from './templates/navigation.tpl.html';

class NavigationController {
  constructor($state) {

    let currentStateEqualTo = (tab) => {
      return $state.is(tab.route, tab.params, tab.options);
    };

    this.go = function(tab) {
      if (!currentStateEqualTo(tab) && !tab.disabled) {
        $state.go(tab.route, tab.params, tab.options);
      }
    };

    this.active = (tab) => {
      return $state.includes(tab.route, tab.params, tab.options);
    };

    this.updateTabs = () => {
      angular.forEach(this.tabs, (tab) => {
        tab.params = tab.params || {};
        tab.options = tab.options || {};
        tab.active = this.active(tab);
      });
    };

    this.updateTabs();
  }
}
NavigationController.$inject = ['$state'];

function navigation($rootScope) {

  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      tabs: '=data',
      type: '@',
      justified: '@'
    },
    controller: NavigationController,
    controllerAs: 'navigation',
    template: template,
    link: function(scope, elem, attrs, ctrl) {

      ctrl.vertical = angular.isDefined(attrs.vertical);

      let updateTabs = () => {
        ctrl.updateTabs();
      };

      let unbindStateChangeSuccess = $rootScope.$on('$stateChangeSuccess', updateTabs);
      let unbindStateChangeError = $rootScope.$on('$stateChangeError', updateTabs);
      let unbindStateChangeCancel = $rootScope.$on('$stateChangeCancel', updateTabs);
      let unbindStateNotFound = $rootScope.$on('$stateNotFound', updateTabs);

      scope.$on('$destroy', unbindStateChangeSuccess);
      scope.$on('$destroy', unbindStateChangeError);
      scope.$on('$destroy', unbindStateChangeCancel);
      scope.$on('$destroy', unbindStateNotFound);

    }
  };
}
navigation.$inject = ['$rootScope'];

export default navigation;

