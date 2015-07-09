module.exports = function($compile, $templateCache, $http, $q) {

  var backwashTemplate = '<div ng-if="processing" class="backwash"></div>';

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
    template: '<div class="modal-body"></div>',
    link: function(scope, element) {
      scope.$watch('stepIndex', function(stepIndex) {
        getStepTemplate(scope.steps[stepIndex])
          .then(function(content) {
            var modalBodyElem = element.children(0);

            modalBodyElem.empty();
            modalBodyElem.append($compile(backwashTemplate + content)(scope.contentScope));
          });
      });

    }
  };
};
module.exports.$inject = ['$compile', '$templateCache', '$http', '$q'];
