'use strict';

/* @ngInject */
module.exports = function($compile, $http, $templateCache, $q, $log) {

  return {
    restrict: 'E',
    template: '<div class="modal-body"><div></div></div>',

    link: function(scope, element) {
      scope.contentScope.$watch('currentStep', function(currentStep) {
        element.html(($compile(currentStep.template)(scope.contentScope))[0].outerHTML);
      });

/*      scope.showContent = function() {
        element.html(($compile(scope.currentStep.template)(scope.contentScope))[0].outerHTML);
      };*/
    }
  };
};
