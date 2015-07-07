'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($templateCache, $log, $modal, $controller,
                          $rootScope, $q, statusMessage, translate) {

  function initializeScope(options) {
    var scope = $rootScope.$new();

    scope.contentScope = options.scope ? options.scope : $rootScope.$new();

    if (angular.isDefined(options.controller)) {
      $controller(options.controller, {$scope: scope.contentScope});
    }

    scope.processing = false;
    scope.contentScope.process = scope.processing;

    scope.title = options.title;
    scope.icon = options.icon;

    scope.previousLabel = options.previousLabel ||
      translate.sync('components.wizard.label.previous');
    scope.nextLabel = options.nextLabel || translate.sync('components.wizard.label.next');
    scope.submitLabel = options.submitLabel || translate.sync('components.wizard.label.submit');
    scope.successMessage = options.successMessage ||
      translate.sync('components.wizard.successMessage');
    scope.errorMessage = options.errorMessage || translate.sync('components.wizard.errorMessage');

    scope.showSubmitError = false;

    angular.forEach(options.steps, function(step, i) {
      step.id = i;
      if (!step.template && step.templateId) {
        step.template = $templateCache.get(step.templateId);
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

    /**
     * @ngdoc method
     *
     * @name wizard#open
     *
     * @methodOf akamai.components.wizard.service:wizard
     *
     * @description Opens a wizard in a modal window
     *
     * @param {Object} options A hash with the options specified below.
     **
     * @param {Function} [options.controller] A controller for the wizard *****
     * instance that can initialize scope.
     *
     * @param {Scope} [options.scope=$rootScope] A scope instance to use for
     * the wizard content body
     *
     * @param {String} [options.title] A title for the wizard
     *
     * @param {String} [options.icon] A CSS class representing an
     * icon to display to the left of the wizard title
     *
     * @param {String} [options.previousLabel=Previous] A label for the
     * wizard's previous button
     *
     * @param {String} [options.nextLabel=Next] A label for the wizard's next
     * button
     *
     * @param {String} [options.submitLabel=Submit] A label for the wizard's
     * submit button
     *
     * @param {String} [options.successMessage] A message to display after the
     * wizard is successfully submitted
     *
     * @param {String} [options.errorMessage] A message to display if the wizard
     * is unsuccessfully submitted
     *
     * @param {Object[]} options.steps An array of step objects with the
     * following properties. Note: the requirements for templating are one of
     * `template`, `templateId` or `templateUrl`
     *
     * - `name` {String} The name of the wizard step. Shown in the wizard step
     *   navigation bar
     *
     * - `template` {String} An inline template to render within the body of
     *   the wizard.
     *
     * - `templateId` {String} A templateId to retrieve the template used to
     *    render within the body of the wizard
     *
     * - `templateUrl` {String} A URL referencing a template to render within
     *   the body of the wizard
     *
     * - `validation` {Function} A validation function that returns true when
     *   the step is valid. The step's next button is enabled when the function
     *   returns true.
     *
     * @return {Object} An instance of the wizard with the following
     * properties:
     *
     * - `close` (Function) A method to close the wizard that accepts a result
     *    as an argument.
     *
     * - `dismiss` (Function) A method to dismiss the wizard, rejecting the
     *   `result` promise.
     *
     * - `result` (Promise) A promise representing the result when the wizard
     *    is closed.
     *
     */
    open: function(options) {
      var scope = initializeScope(options),
        onSubmit = angular.noop,
        instance;

      scope.currentStep = function() {
        return scope.steps[scope.stepIndex];
      };

      scope.previousStep = function() {
        if (scope.stepIndex > 0) {
          scope.stepIndex--;
        }
      };

      scope.nextStep = function() {
        if (scope.stepIndex < scope.steps.length - 1) {
          scope.stepIndex++;
          scope.currentStep().visited = true;
        }
      };

      scope.isValid = function(stepNumber) {
        var step = angular.isNumber(stepNumber) ? scope.steps[stepNumber] : scope.currentStep();

        if (!angular.isFunction(step.validate)) {
          return true;
        }

        return step.validate(scope.contentScope);
      };

      scope.activateStep = function(stepNumber) {
        if (scope.steps[stepNumber].visited && scope.previousStepsValid(stepNumber)) {
          scope.stepIndex = stepNumber;
        }
      };

      scope.previousStepsValid = function(stepNumber) {
        var i;

        for (i = 0; i < stepNumber; i++) {
          if (!scope.isValid(i)) {
            return false;
          }
        }
        return true;
      };

      scope.stepClasses = function(stepNumber) {
        var current = true, maxStepIndex = scope.steps.length - 1;

        if (stepNumber > maxStepIndex) {
          return {};
        } else if (stepNumber < maxStepIndex) {
          current = !scope.steps[stepNumber + 1].visited ||
            !scope.previousStepsValid(stepNumber + 1);
        }

        return {
          active: stepNumber === scope.stepIndex,
          visited: scope.steps[stepNumber].visited && scope.previousStepsValid(stepNumber),
          current: current
        };
      };

      // TODO: Time permitting, add controller and controllerAs
      instance = $modal.open(angular.extend(options, {
        scope: scope,
        backdrop: 'static',
        windowClass: 'wizard',
        template: require('./templates/wizard.tpl.html')
      }));

      scope.close = function() {
        instance.dismiss();
      };

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
          scope.processing = true;
          scope.contentScope.processing = true;
        } else if (!result) {
          scope.processing = false;
          scope.contentScope.processing = false;
          scope.showSubmitError = true;
        }

        $q.when(result).then(
          function(returnValue) {
            instance.close(returnValue);
            statusMessage.showSuccess({text: scope.successMessage});
            scope.processing = false;
            scope.contentScope.processing = false;
          }
        ).catch(
          function() {
            scope.processing = false;
            scope.contentScope.processing = false;
            scope.showSubmitError = true;
          }
        );
      };
      return instance;

    }
  };
};
