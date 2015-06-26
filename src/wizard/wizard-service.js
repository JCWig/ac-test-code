'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($templateCache, $log, $modal, $controller, $rootScope) {

  function initializeScope(options) {
    var wizardScope = $rootScope.$new();

    wizardScope.contentScope = options.scope ? options.scope : $rootScope.$new();

    wizardScope.title = options.title;
    wizardScope.previousLabel = options.previousLabel;
    wizardScope.nextLabel = options.nextLabel;
    wizardScope.submitLabel = options.submitLabel;
    wizardScope.successMessage = options.successMessage;
    wizardScope.errorMessage = options.errorMessage;
    wizardScope.stepIndex = 0;
    wizardScope.steps = options.steps;

    $controller(options.controller, {$scope: wizardScope.contentScope});

    return wizardScope;
  }

  return {

    /* @ngInject */
    WizardController: function($scope, $rootScope) {

      var optionScope = $scope.options.scope;

      this.contentScope = optionScope && optionScope.$new ?
        optionScope.$new() : $rootScope.$new();

    },

    open: function(options) {

      var wizardScope = initializeScope(options), i;

      for (i = 0; i < options.steps.length; i++) {
        options.steps[i].template = $templateCache.get(options.steps[i].templateId);
        options.steps[i].id = i;
        if (i === 0) {
          options.steps[i].visited = true;
        }
      }

      wizardScope.steps = options.steps;
      wizardScope.stepIndex = 0;


      wizardScope.previousStep = function() {
        if (wizardScope.stepIndex > 0) {
          wizardScope.stepIndex--;
        }
      };

      wizardScope.nextStep = function() {
        if (wizardScope.stepIndex < wizardScope.steps.length - 1) {
          wizardScope.stepIndex++;
          wizardScope.steps[wizardScope.stepIndex].visited = true;
        }
      };

      wizardScope.isValid = function() {
        if (!angular.isFunction(wizardScope.steps[wizardScope.stepIndex].validate)) { return true; }

        return wizardScope.steps[wizardScope.stepIndex].validate(wizardScope.contentScope);
      };

      wizardScope.activateStep = function(stepNumber) {
        if (wizardScope.steps[stepNumber].visited) {
          wizardScope.stepIndex = stepNumber;
        }
      };

      wizardScope.stepClasses = function(stepNumber) {

        var current = true, maxStepIndex = wizardScope.steps.length-1;

        if (stepNumber > maxStepIndex) {
          return {};
        } else if (stepNumber < maxStepIndex) {
          current = !wizardScope.steps[stepNumber+1].visited;
        }

        return {
          active: stepNumber == wizardScope.stepIndex,
          visited: wizardScope.steps[stepNumber].visited,
          current: current
        };

      };

      wizardScope.submit = angular.noop;

      $modal.open(angular.extend(options, {
        scope: wizardScope,
        template: require('./templates/wizard.tpl.html')
      }));

    }
  };
};
