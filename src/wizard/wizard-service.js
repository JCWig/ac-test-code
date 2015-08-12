import angular from 'angular';
import template from './templates/wizard.tpl.html';

class WizardController {

  static get $inject() {
    return ['$scope', '$rootScope', '$controller', 'translate',
            '$templateCache'];
  }

  constructor($scope, $rootScope, $controller, translate,
              $templateCache) {
    let options = $scope.options;

    $scope.wizard = this;

    this.contentScope = options.contentScope ? options.contentScope : $rootScope.$new();

    if (angular.isDefined(options.appController)) {
      $controller(options.appController, {$scope: this.contentScope});
    }

    this.processing = false;
    this.contentScope.process = this.processing;

    this.title = options.title;
    this.icon = options.icon;
    this.previousLabel = options.previousLabel ||
      translate.sync('components.wizard.label.previous');
    this.nextLabel = options.nextLabel || translate.sync('components.wizard.label.next');
    this.submitLabel = options.submitLabel || translate.sync('components.wizard.label.submit');
    this.successMessage = options.successMessage ||
      translate.sync('components.wizard.successMessage');
    this.errorMessage = options.errorMessage || translate.sync('components.wizard.errorMessage');

    this.showSubmitError = false;

    options.steps.forEach((step, i) => {
      step.id = i;
      if (!step.template && step.templateId) {
        step.template = $templateCache.get(step.templateId);
      }

      if (!(angular.isDefined(step.template) || angular.isDefined(step.templateUrl))) {
        throw new Error('Wizard template or templateUrl option required');
      }

      if (i === 0) {
        step.visited = true;
      }
    });

    this.steps = options.steps;
    this.stepIndex = 0;
  }

  currentStep() {
    return this.steps[this.stepIndex];
  }

  previousStep() {
    if (this.stepIndex > 0) {
      this.stepIndex--;
    }
  }

  nextStep() {
    if (this.stepIndex < this.steps.length - 1) {
      this.stepIndex++;
      this.currentStep().visited = true;
    }
  }

  isValid(stepNumber) {
    let step = angular.isNumber(stepNumber) ? this.steps[stepNumber] : this.currentStep();

    if (!angular.isFunction(step.validate)) {
      return true;
    }

    return step.validate(this.contentScope);
  }

  activateStep(stepNumber) {
    if (this.steps[stepNumber].visited && this.previousStepsValid(stepNumber)) {
      this.stepIndex = stepNumber;
    }
  }

  previousStepsValid(stepNumber) {
    for (let i = 0; i < stepNumber; i++) {
      if (!this.isValid(i)) {
        return false;
      }
    }
    return true;
  }

  stepClasses(stepNumber) {
    let current = true, maxStepIndex = this.steps.length - 1;

    if (stepNumber > maxStepIndex) {
      return {};
    } else if (stepNumber < maxStepIndex) {
      current = !this.steps[stepNumber + 1].visited || !this.previousStepsValid(stepNumber + 1);
    }

    return {
      active: stepNumber === this.stepIndex,
      visited: this.steps[stepNumber].visited && this.previousStepsValid(stepNumber),
      current: current
    };
  }

}

function wizard($modal, $rootScope, $q, statusMessage) {

/*
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
*/

  return {

    /**
     * @ngdoc method
     *
     * @name wizard#open
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
      let scope = $rootScope.$new();
      let onSubmit = angular.noop;

      options.appController = options.controller ? options.controller : undefined;
      options.contentScope = options.scope ? options.scope : undefined;
      scope.options = options;

      // TODO: Time permitting, add controller and controllerAs
      let instance = $modal.open(angular.extend(options, {
        scope: scope,
        backdrop: 'static',
        windowClass: 'wizard',
        template: template,
        controller: WizardController,
        controllarAs: 'wizard',
        bindToController: true
      }));

      scope.setOnSubmit = function(fn) {
        onSubmit = fn;
      };

      scope.close = function() {
        instance.dismiss();
      };

      scope.submit = function(wizardController) {
        let result;

        wizardController.showSubmitError = false;

        if (angular.isFunction(onSubmit)) {
          result = onSubmit();
        } else {
          result = onSubmit;
        }

        // check to see if the onSubmit returns a promise
        if (result && angular.isFunction(result.then)) {
          wizardController.processing = true;
          wizardController.contentScope.processing = true;
        } else if (!result) {
          wizardController.processing = false;
          wizardController.contentScope.processing = false;
          wizardController.showSubmitError = true;
        }

        $q.when(result).then(
          (returnValue) => {
            instance.close(returnValue);
            statusMessage.showSuccess({text: wizardController.successMessage});
            wizardController.processing = false;
            wizardController.contentScope.processing = false;
          }
        ).catch(
          () => {
            wizardController.processing = false;
            wizardController.contentScope.processing = false;
            wizardController.showSubmitError = true;
          }
        );
      };

      return instance;
    }
  };
}

wizard.$inject = ['$modal', '$rootScope', '$q', 'statusMessage'];

export default wizard;