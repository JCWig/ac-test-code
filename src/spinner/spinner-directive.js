'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($interval, uuid, spinnerService) {

  var defaults = {
      VALUE: 0,
      STEP: 1
    },
    directive = {
      require: 'ngModel',
      restrict: 'E',
      template: require('./templates/spinner.tpl.html'),
      link: link,
      scope: {
        min: '@?',
        max: '@?',
        disabled: '@?',
        inputValue: '=ngModel'
      }
    };

  return directive;

  function stopInternalEvents(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  function link(scope, element, attrs, ngModel) {
    var upMouseDownPromise, downMouseDownPromise;

    initialize();

    scope.changed = function() {

      stopInternalEvents(event);

      var valid = true;
      valid = spinnerService.isValid(scope.inputValue);
      if (!valid) {
        //reset to previous value
      }
    }

    scope.isDisabled = function() {
      return scope.$eval(scope.disabled) === true;
    };

    scope.isUnderMin = function(offset) {
      return spinnerService.isOutOfBound(scope.inputValue, scope.min, false, offset);
    };

    scope.isOverMax = function(offset) {
      return spinnerService.isOutOfBound(scope.inputValue, scope.max, true, offset);
    };

    scope.startStepUp = function(event) {
      stopInternalEvents(event);
      if (angular.isDefined(upMouseDownPromise)) {
        return;
      }
      upMouseDownPromise = $interval(function() {
        if (scope.isOverMax()) {
          scope.stopStepUp();
        } else {
          updateInput(+defaults.STEP);
        }
      }, 80);
    };

    scope.stopStepUp = function(event) {
      stopInternalEvents(event);
      if (angular.isDefined(upMouseDownPromise)) {
        $interval.cancel(upMouseDownPromise);
        upMouseDownPromise = undefined;
      }
    };

    scope.startStepDown = function(event) {
      stopInternalEvents(event);
      if (angular.isDefined(downMouseDownPromise)) {
        return;
      }

      downMouseDownPromise = $interval(function() {
        if (scope.isUnderMin()) {
          scope.stopStepDown();
        } else {
          updateInput(-defaults.STEP);
        }
      }, 80);
    };

    scope.stopStepDown = function(event) {
      stopInternalEvents(event);
      if (angular.isDefined(downMouseDownPromise)) {
        $interval.cancel(downMouseDownPromise);
        downMouseDownPromise = undefined;
      }
    };

    // when model change, parse to integer, this sets up to the ngModelController
    ngModel.$formatters.push(function(value) {
      return parseInt(value, 10);
    });

    // when view change, parse to integer, this sets up to the ngModelController
    ngModel.$parsers.push(function(value) {
      return parseInt(value, 10);
    });

    ngModel.$render = function() {
      //validateInput(ngModel.$viewValue, scope);
      ngModel.$setTouched();
    };

    function initialize() {

      var valid = spinnerService.validateScopeVars(scope, ngModel);
      if (!valid) {
        return;
      }
      var maxlength;

      scope.max = spinnerService.isNumeric(scope.max) ? parseInt(scope.max, 10) : '';
      scope.min = spinnerService.isNumeric(scope.min) ? parseInt(scope.min, 10) : '';
      scope.disabled = scope.$eval(scope.disabled) === true;
      scope.spinnerId = uuid.guid();

      scope.dynamicMinWidth = {};
      if (scope.max) {
        maxlength = String(scope.max).length;
        scope.dynamicMinWidth = {
          'min-width': 'calc(' + maxlength + 'em + 10px)'
        };
      }

      ngModel.$render();


      scope.$watch("inputValue", function(newValue, oldValue) {

      });
    }

    function updateInput(offset) {
      ngModel.$setViewValue(scope.inputValue + offset);
      ngModel.$render();
    }
  }
};
