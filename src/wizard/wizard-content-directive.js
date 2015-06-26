'use strict';

/* @ngInject */
module.exports = function($compile, $http, $templateCache, $q, $log) {

  return {
    restrict: 'E',
    template: '<div class="modal-body"><div></div></div>',

    link: function(scope, element) {
      scope.$watch('stepIndex', function(stepIndex) {
        element.empty();
        element.append($compile(scope.steps[stepIndex].template)(scope.contentScope));
      });

    }
  };
};
