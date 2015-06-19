'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($templateCache, $log, $modal, $controller) {

  return {
    open: function(options) {
      var wizardScope = options.scope.$new();
      wizardScope.contentScope = options.scope;
      delete options.scope;

      $controller(options.controller, {$scope: wizardScope.contentScope});
      delete options.controller;

      options = angular.extend(options, {
        title: 'Wizard Example',
        previousLabel: 'Previous',
        nextLabel: 'Next',
        successMessage: 'Success Message',
        errorMessage: 'Error Message',
        steps: [
          {
            name: 'Step 1',
            templateId: 'step1',
            validate: function(scope) {
              $log.log('step1 validate', scope);
              return true;
            }
          },
          {
            name: 'Step 2',
            templateId: 'step2',
            validate: function(scope) {
              $log.log('step2 validate', scope);
              return true;
            }

          },
          {
            name: 'Step 3',
            templateId: 'step3',
            validate: function(scope) {
              $log.log('step3 validate', scope);
              return false;
            }

          },
          {
            name: 'Step 4',
            templateId: 'step4',
            validate: function(scope) {
              $log.log('step4 validate', scope);
              return true;
            }

          }
        ]
      });

      for (var i = 0; i < options.steps.length; i++) {
        options.steps[i].template = $templateCache.get(options.steps[i].templateId);
      }

      wizardScope.steps = options.steps;
      wizardScope.stepIndex = 0;

      wizardScope.previousStep = function() {
        wizardScope.stepIndex--;
      };

      wizardScope.nextStep = function() {
        wizardScope.stepIndex++;
      };

      wizardScope.isValid = function() {
        return wizardScope.steps[wizardScope.stepIndex].validate(wizardScope.contentScope);
      };

      var instance = $modal.open(angular.extend(options, {
        scope: wizardScope,
        template: require('./templates/wizard.tpl.html')
      }));

    }
  };
};
