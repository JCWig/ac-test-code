import angular from 'angular';

function wizardContent($compile, $templateCache, $http, $q) {

  let backwashTemplate = '<div ng-show="processing" class="backwash"></div>';

  function getStepTemplate(step) {
    if (!step) {
      return $q.when();
    } else if (step.template) {
      return $q.when(step.template);
    } else {
      return $http.get(step.templateUrl, {cache: $templateCache})
        .then(result => result.data);
    }
  }

  return {
    restrict: 'E',
    template: `<div class="modal-body" ng-class="{'processing': wizard.processing}"></div>`,
    link: function(scope, element) {
      scope.$watch('wizard.stepIndex', stepIndex => getStepTemplate(scope.wizard.steps[stepIndex])
          .then((content) => {
            var modalBodyElem = element.children(0);

            content = angular.isUndefined(content) ?
              '<akam-indeterminate-progress></akam-indeterminate-progress>' : content;

            modalBodyElem.empty();
            modalBodyElem.append($compile(backwashTemplate + content)(scope.wizard.contentScope));
          })
      );
    }
  };

}

wizardContent.$inject = ['$compile', '$templateCache', '$http', '$q'];

export default wizardContent;
