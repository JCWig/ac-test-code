'use strict';

/* @ngInject */
module.exports = function($compile, $http, $templateCache, $q, $log) {

  return {
    restrict: 'E',
    template: '<div class="modal-body"><div></div></div>',
    link: function(scope, element) {

      scope.$watch('currentStep', function(currentStep) {
        $log.log('in wizard-content-directive link function');
        element.html(($compile(currentStep.template)(scope.contentScope))[0].outerHTML);
      });
    }
  };
};
