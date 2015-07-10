'use strict';


module.exports = function($rootScope, $state, $log) {

  class NavigationController {
    constructor($log, $state) {
      $log.log('inside NavigationController constructor');

      var currentStateEqualTo = function(tab) {
        var isEqual = $state.is(tab.route, tab.params, tab.options);
        return isEqual;
      };

      this.go = function(tab) {

        if (!currentStateEqualTo(tab) && !tab.disabled) {
          $state.go(tab.route, tab.params, tab.options);
        }
      };

      /* whether to highlight given route as part of the current state */
      this.active = function(tab) {

        var isAncestorOfCurrentRoute = $state.includes(tab.route, tab.params, tab.options);
        return isAncestorOfCurrentRoute;
      };

      this.update_tabs = function() {

        // sets which tab is active (used for highlighting)
        angular.forEach(this.tabs, (tab) => {
          tab.params = tab.params || {};
          tab.options = tab.options || {};
          tab.active = this.active(tab);
        });
      };

      // this always selects the first tab currently - fixed in ui-bootstrap master but not yet released
      this.update_tabs();

    }
  }
  NavigationController.$inject = ['$log', '$state'];

  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      tabs: '=data',
      type: '@',
      justified: '@',
      vertical: '@'
    },
    controller: NavigationController,
    controllerAs: 'navigation',
    template: require('./templates/navigation.tpl.html'),
    link: function (scope, elem, attrs, ctrl) {
      $log.log('navigation directive link');

      var updateTabs = function() {
        ctrl.update_tabs();
      };

      var unbindStateChangeSuccess = $rootScope.$on('$stateChangeSuccess', updateTabs);
      var unbindStateChangeError = $rootScope.$on('$stateChangeError', updateTabs);
      var unbindStateChangeCancel = $rootScope.$on('$stateChangeCancel', updateTabs);
      var unbindStateNotFound = $rootScope.$on('$stateNotFound', updateTabs);

      scope.$on('$destroy', unbindStateChangeSuccess);
      scope.$on('$destroy', unbindStateChangeError);
      scope.$on('$destroy', unbindStateChangeCancel);
      scope.$on('$destroy', unbindStateNotFound);

    }
  }
};
module.exports.$inject = ['$rootScope', '$state', '$log'];

