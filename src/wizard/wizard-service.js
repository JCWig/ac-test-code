'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($templateCache, $log, $modal, $controller,
                          $rootScope, $q, statusMessage) {

  function initializeScope(options) {
    var scope = $rootScope.$new();

    scope.contentScope = options.scope ? options.scope : $rootScope.$new();
    $controller(options.controller, {$scope: scope.contentScope});

    scope.title = options.title;
    scope.previousLabel = options.previousLabel;
    scope.nextLabel = options.nextLabel;
    scope.submitLabel = options.submitLabel;
    scope.successMessage = options.successMessage;
    scope.errorMessage = options.errorMessage;
    scope.stepIndex = 0;
    scope.steps = options.steps;
    scope.showSubmitError = false;

    angular.forEach(options.steps, function(step, i) {
      step.id = i;
      if (!step.template) {
        if (step.templateId) {
          step.template = $templateCache.get(step.templateId);
        }
      }

      if (!(angular.isDefined(step.template) ||
        angular.isDefined(step.templateUrl))) {
        throw new Error('Wizard template or templateUrl option required');
      }

      if (i === 0) {
        step.visited = true;
      }
    });

    scope.steps = options.steps;
    scope.stepIndex = 0;

    return scope;
  }

  return {

    open: function(options) {
      var scope = initializeScope(options),
        onSubmit = angular.noop,
        processing,
        instance;

      scope.previousStep = function() {
        if (scope.stepIndex > 0) {
          scope.stepIndex--;
        }
      };

      scope.nextStep = function() {
        if (scope.stepIndex < scope.steps.length - 1) {
          scope.stepIndex++;
          scope.steps[scope.stepIndex].visited = true;
        }
      };

      scope.isValid = function() {
        if (!angular.isFunction(scope.steps[scope.stepIndex].validate)) {
          return true;
        }

        return scope.steps[scope.stepIndex].validate(scope.contentScope);
      };

      scope.activateStep = function(stepNumber) {
        if (scope.steps[stepNumber].visited) {
          scope.stepIndex = stepNumber;
        }
      };

      scope.stepClasses = function(stepNumber) {
        var current = true, maxStepIndex = scope.steps.length - 1;

        if (stepNumber > maxStepIndex) {
          return {};
        } else if (stepNumber < maxStepIndex) {
          current = !scope.steps[stepNumber + 1].visited;
        }

        return {
          active: stepNumber === scope.stepIndex,
          visited: scope.steps[stepNumber].visited,
          current: current
        };
      };

      instance = $modal.open(angular.extend(options, {
        scope: scope,
        template: require('./templates/wizard.tpl.html')
      }));
      
      // setup promise that will resolve when submit button is clicked
      scope.setOnSubmit = function(fn) {
        onSubmit = fn;
      };

      scope.submit = function() {
        var result;

        scope.showSubmitError = false;

        if (angular.isFunction(onSubmit)) {
          result = onSubmit();
        } else {
          result = onSubmit;
        }

        // check to see if the onSubmit returns a promise
        if (result && angular.isFunction(result.then)) {
          processing = true;
        }

        $q.when(result).then(
          function(returnValue) {
            instance.close(returnValue);
            statusMessage.showSuccess({text: scope.successMessage});
          }
        ).catch(
          function() {
            processing = false;
            scope.showSubmitError = true;
          }
        );
      };
      return instance;

    }
  };
};
