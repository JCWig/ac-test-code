'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($templateCache, $log, $modal, $controller) {

  function initializeScope(options) {
    var wizardScope = options.scope.$new();

    wizardScope.contentScope = options.scope;
    delete options.scope;

    wizardScope.title = options.title;
    wizardScope.previousLabel = options.previousLabel;
    wizardScope.nextLabel = options.nextLabel;
    wizardScope.submitLabel = options.submitLabel;
    wizardScope.successMessage = options.successMessage;
    wizardScope.errorMessage = options.errorMessage;
    wizardScope.stepIndex = 0;
    wizardScope.steps = options.steps;

    $controller(options.controller, {$scope: wizardScope.contentScope});
    delete options.controller;

    return wizardScope;
  }

  return {
    open: function(options) {

      var wizardScope = initializeScope(options), i;

      for (i = 0; i < options.steps.length; i++) {
        options.steps[i].template = $templateCache.get(options.steps[i].templateId);
        options.steps[i].id = i;
      }

      wizardScope.previousStep = function() {
        if (wizardScope.stepIndex > 0) {
          wizardScope.stepIndex--;
        }
      };

      wizardScope.nextStep = function() {
        if (wizardScope.stepIndex < wizardScope.steps.length - 1) {
          wizardScope.currentStep.visited = true;
          wizardScope.stepIndex++;
        }
      };

      wizardScope.isValid = function() {
        if (!angular.isFunction(wizardScope.currentStep.validate)) { return true; }

        return wizardScope.currentStep.validate(wizardScope.contentScope);
      };

      wizardScope.activateStep = function(stepNumber) {
        $log.log('stepNumber', stepNumber);
        wizardScope.stepIndex = stepNumber;
      };

      wizardScope.stepClass = function(stepNumber) {
        if (stepNumber == wizardScope.stepIndex) {
          return 'active';
        } else if (wizardScope.steps[stepNumber].visited) {
          return 'visited';
        }
      };

      wizardScope.submit = angular.noop;

      wizardScope.$watch('stepIndex', function(stepIndex) {
        wizardScope.currentStep = wizardScope.steps[stepIndex];
        wizardScope.contentScope.currentStep = wizardScope.steps[stepIndex];
      });

      $modal.open(angular.extend(options, {
        scope: wizardScope,
        template: require('./templates/wizard.tpl.html')
      }));

    }
  };
};
