import angular from 'angular';
import template from './templates/wizard.tpl.html';

class WizardController {

  static get $inject() {
    return ['$scope', '$rootScope', '$controller', '$translate',
            '$templateCache', '$q', 'statusMessage', '$log'];
  }

  constructor($scope, $rootScope, $controller, $translate,
              $templateCache, $q, statusMessage, $log) {
    let options = $scope.options;

    $scope.wizard = this;

    this.$q = $q;
    this.statusMessage = statusMessage;
    this.$log = $log;
    this.processing = false;

    this.contentScope = options.contentScope ? options.contentScope.$new() : $rootScope.$new();
    this.contentScope.processing = this.processing;
    this.contentScope.setOnSubmit = fn => this.onSubmit = fn;
    this.contentScope.close = () => this.close();

    if (angular.isDefined(options.appController)) {
      $controller(options.appController, {$scope: this.contentScope});
    }

    this.title = options.title;
    this.icon = options.icon;

    this.cancelLabel = $translate.instant(options.cancelLabel ||
      'components.wizard.label.cancel');
    this.previousLabel = $translate.instant(options.previousLabel ||
      'components.wizard.label.previous');
    this.nextLabel = $translate.instant(options.nextLabel || 'components.wizard.label.next');
    this.submitLabel = $translate.instant(options.submitLabel || 'components.wizard.label.submit');
    this.successMessage = $translate.instant(options.successMessage ||
      'components.wizard.successMessage');
    this.submitErrorMessage = $translate.instant(options.errorMessage ||
      'components.wizard.errorMessage');

    this.instance = options.instance;

    this.instance.result.finally(() => this.contentScope.$destroy());

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
    this.$scope = $scope;
    this.activateStep(0, true);
  }

  getNextLabel() {
    // if last step, return submitLabel
    if (this.stepIndex === this.steps.length - 1) {
      return this.submitLabel;
    } else {
      return this.nextLabel;
    }
  }

  goForward() {
    if (this.stepIndex === this.steps.length - 1) {
      this.submit();
    } else {
      this.nextStep();
    }
  }

  close(returnValue) {
    if (angular.isDefined(this.instance)) {
      this.instance.close(returnValue);
      this.contentScope.$destroy();
      this.$scope.$destroy();
    }
  }

  currentStep() {
    return this.steps[this.stepIndex];
  }

  previousStep() {
    if (this.stepIndex > 0) {
      this.activateStep(this.stepIndex - 1);
    }
  }

  nextStep() {
    if (this.stepIndex < this.steps.length - 1) {
      this.activateStep(this.stepIndex + 1);
    }
  }

  isValid(stepNumber) {
    let step = angular.isNumber(stepNumber) ? this.steps[stepNumber] : this.currentStep();

    if (!step) {
      this.$log.warn('No step to validate');
      return false;
    }

    if (!angular.isFunction(step.validate)) {
      return true;
    }

    return step.validate(this.contentScope);
  }

  startProcessing() {
    this.processing = true;
    this.contentScope.processing = true;
  }

  stopProcessing() {
    this.processing = false;
    this.contentScope.processing = false;
  }

  activateStep(stepNumber, init) {

    let goToStep = () => {
      this.stepIndex = stepNumber;
      this.currentStep().visited = true;

      this.stopProcessing();
      this.errorMessage = null;
    };

    // If a prepare function is supplied for the step, execute it and process the
    // returned promise
    if (angular.isFunction(this.steps[stepNumber].initialize)) {

      this.startProcessing();

      let nextStepPromise = this.steps[stepNumber].initialize();

      nextStepPromise.then(angular.bind(this, goToStep), reason => {
        if (init) {
          this.$log.warn('Step 1 failed to initialize.');
          goToStep();
        } else {
          this.stopProcessing();
          this.errorMessage = reason;
        }
      });
    } else {
      goToStep();
    }
  }

  jumptToVisitedStep(stepNumber) {
    if (this.steps[stepNumber].visited && this.previousStepsValid(stepNumber)) {
      this.activateStep(stepNumber);
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

  submit() {
    let result;

    if (angular.isFunction(this.onSubmit)) {
      result = this.onSubmit();
    } else {
      result = angular.noop;
    }

    // check to see if the onSubmit returns a promise
    if (result && angular.isFunction(result.then)) {
      this.startProcessing();
    } else if (!result) {
      this.stopProcessing();
      this.errorMessage = this.submitErrorMessage;
      return;
    }

    this.$q.when(result).then(
      (returnValue) => {
        this.stopProcessing();
        this.close(returnValue);
        this.statusMessage.showSuccess({text: this.successMessage});
        this.errorMessage = null;
      }
    ).catch(
      () => {
        this.stopProcessing();
        this.errorMessage = this.submitErrorMessage;
      }
    );
  }

}

function wizard($modal, $rootScope) {

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
    * @param {String} [options.cancelLabel=Cancel] A label for the wizard's
     * cancel button
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

      options.appController = options.controller;
      options.contentScope = options.scope;

      scope.options = options;

      options.instance = $modal.open(angular.extend(options, {
        scope: scope,
        backdrop: 'static',
        windowClass: 'wizard',
        template: template,
        controller: WizardController,
        controllarAs: 'wizard',
        bindToController: true
      }));

      return options.instance;
    }
  };
}

wizard.$inject = ['$modal', '$rootScope', '$q', 'statusMessage'];

export default wizard;