var angular = require('angular');

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

  function link(scope, element, attrs, ngModel) {
    var upMouseDownPromise, downMouseDownPromise;

    initialize();

    scope.changed = function() {

      if (angular.isUndefined(scope.inputValue)) {
        scope.inputValue = ngModel.$viewValue;
      }
    };

    scope.isDisabled = function() {
      return scope.disabled === true || scope.$eval(scope.disabled) === true;
    };

    scope.isUnderMin = function(offset) {
      return spinnerService.isOutOfBounds(scope.inputValue, scope.min, false, offset);
    };

    scope.isOverMax = function(offset) {
      return spinnerService.isOutOfBounds(scope.inputValue, scope.max, true, offset);
    };

    scope.startStepUp = function(event) {
      event.stopPropagation();
      if (angular.isDefined(upMouseDownPromise)) {
        return;
      }
      upMouseDownPromise = $interval(function() {
        if (scope.isOverMax()) {
          scope.stopStepUp(event);
        } else {
          updateInput(+defaults.STEP);
        }
      }, 80);
    };

    scope.stopStepUp = function(event) {
      event.stopPropagation();
      if (angular.isDefined(upMouseDownPromise)) {
        $interval.cancel(upMouseDownPromise);
        upMouseDownPromise = undefined;
      }
    };

    scope.startStepDown = function(event) {
      event.stopPropagation();
      if (angular.isDefined(downMouseDownPromise)) {
        return;
      }

      downMouseDownPromise = $interval(function() {
        if (scope.isUnderMin()) {
          scope.stopStepDown(event);
        } else {
          updateInput(-defaults.STEP);
        }
      }, 80);
    };

    scope.stopStepDown = function(event) {
      event.stopPropagation();
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

    function initialize() {
      var maxlength,
        valid = spinnerService.validateScopeVars(scope, ngModel);

      if (!valid) {
        return;
      }

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

      if (angular.isUndefined(scope.inputValue)) {
        scope.inputValue = defaults.VALUE;
      }

      ngModel.$render();

      scope.$watch('inputValue', function(newValue, oldValue) {
        var isValueUnderMin, isValueOverMax;

        isValueUnderMin = spinnerService.isOutOfBounds(scope.inputValue, scope.min, false, 1);
        if (isValueUnderMin) {
          scope.inputValue = oldValue;
          return;
        }

        isValueOverMax = spinnerService.isOutOfBounds(scope.inputValue, scope.max, true, 1);
        if (isValueOverMax) {
          scope.inputValue = oldValue;
        }

      });
    }

    function updateInput(offset) {
      ngModel.$setViewValue(scope.inputValue + offset);
      ngModel.$setTouched();
    }
  }
};
module.exports.$inject = ['$interval', 'uuid', 'spinnerService'];