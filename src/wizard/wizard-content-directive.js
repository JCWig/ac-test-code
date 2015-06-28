'use strict';

/* @ngInject */
module.exports = function($compile, $templateCache, $http, $q) {

  function getStepTemplate(step) {
    if (step.template) {
      return $q.when(step.template);
    } else {
      return $http.get(step.templateUrl, {cache: $templateCache})
        .then(function(result) {
          return result.data;
        });
    }
  }

  return {
    restrict: 'E',
    template: '<div class="modal-body"><div ng-if="processing" class="backwash"></div></div>',

    link: function(scope, element) {
      scope.$watch('stepIndex', function(stepIndex) {
        getStepTemplate(scope.steps[stepIndex])
          .then(function(content) {
            element.empty();
            element.append($compile(content)(scope.contentScope));
          });
      });

    }
  };
};
