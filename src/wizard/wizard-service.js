'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($templateCache, $log, $modal) {

  return {
    open: function(options) {
      var wizardScope = options.scope;

      options = angular.extend(options, {
        title: 'Wizard Example',
        previousLabel: 'Previous',
        nextLabel: 'Next',
        successMessage: 'Success Message',
        errorMessage: 'Error Message',
        steps: [
          {
            name: 'Step 1',
            templateId: 'step1'
          },
          {
            name: 'Step 2',
            templateId: 'step2'
          },
          {
            name: 'Step 3',
            templateId: 'step3'
          },
          {
            name: 'Step 4',
            templateId: 'step4'
          }
        ]
      });

      var scope = options.scope;

      for (var i = 0; i < options.steps.length; i++) {
        options.steps[i].template = $templateCache.get(options.steps[i].templateId);
      }

      scope.steps = options.steps;
      scope.stepIndex = 0;

      scope.previousStep = function() {
        scope.stepIndex--;
      };

      scope.nextStep = function(validate) {
        if (validate) {
          validate(scope.stepIndex);
        }
        scope.stepIndex++;
      };

      var instance = $modal.open(angular.extend(options, {
        scope: scope,
        template: require('./templates/wizard.tpl.html')
      }));

    }
  };
};
