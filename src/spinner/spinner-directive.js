'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($interval, $log, uuid) {

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
        ngModel: '='
      }
    };

  return directive;

  function validateInput(value, scope) {
    var valid = true;

    if (scope.disabled) {
      return !valid;
    }

    if (!value) {
      $log.warn('Input is Invalid.');
      return !valid;
    }

    //check if value is number or not
    valid = !isNaN(parseInt(value, 10));
    if (!valid) {
      $log.warn('Input is Invalid.');
      return valid;
    }

    //check if value is under min value or not
    valid = !scope.isUnderMin(true);
    if (!valid) {
      $log.warn('Input is under min value.');
      return valid;
    }

    //check if value is under max value or not,
    valid = !scope.isOverMax(true);
    if (!valid) {
      $log.warn('Input is over max value.');
      return valid;
    }
    return valid;
  }

  function stopInternalEvents(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  function link(scope, element, attrs, ngModelController) {
    var upMouseDownPromise, downMouseDownPromise;

    //ngModelController has to be defined
    if (!ngModelController) {
      $log.error('The ngModelController is required to instantiate directive instance.')
      return;
    }

    initialize();

    scope.isDisabled = function() {
      return getDisabledState();
    };

    scope.isUpArrowDisabled = function() {
      return scope.isOverMax() || getDisabledState();
    };

    scope.isDownArrowDisabled = function() {
      return scope.isUnderMin() || getDisabledState();
    };

    scope.isUnderMin = function(strict) {
      return isOutOfBound(strict, 'min');
    };

    scope.isOverMax = function(strict) {
      return isOutOfBound(strict, 'max');
    };

    scope.startStepUp = function(event) {
      stopInternalEvents(event);
      if (angular.isDefined(upMouseDownPromise)) {
        return;
      }
      upMouseDownPromise = $interval(function() {
        if (scope.isOverMax(false)) {
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
        if (scope.isUnderMin(false)) {
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
    ngModelController.$formatters.push(function(value) {
      return parseInt(value, 10);
    });

    // when view change, parse to integer, this sets up to the ngModelController
    ngModelController.$parsers.push(function(value) {
      return parseInt(value, 10);
    });

    ngModelController.$render = function() {
      validateInput(ngModelController.$viewValue, scope);
      ngModelController.$setTouched();
    };

    function initialize() {
      var maxlength, maxValue, minValue;

      //have to use empty string, since max or min will tell browser
      //to constrain it with 0 value, which will not render correctly
      maxValue = parseInt(scope.max, 10);
      scope.max = !isNaN(maxValue) ? maxValue : '';
      minValue = parseInt(scope.min, 10);
      scope.min = !isNaN(minValue) ? minValue : '';
      scope.disabled = getDisabledState();
      scope.spinnerId = uuid.guid();

      scope.dynamicMinWidth = {};
      if (scope.max) {
        maxlength = String(scope.max).length;
        scope.dynamicMinWidth = {
          'min-width': 'calc(' + maxlength + 'em + 10px)'
        };
      }

      ngModelController.$render();
    }

    function updateInput(offset) {
      ngModelController.$setViewValue(scope.ngModel + offset);
      ngModelController.$render();
    }

    function isOutOfBound(strict, type) {
      var offset = strict ? 0 : 1,
        num = parseInt(scope.ngModel, 10),
        isMin = type === 'min';

      if (isNaN(num)) {
        return false;
      }

      return isMin ?
        num - offset < parseInt(scope.min, 10) : num + offset > parseInt(scope.max, 10);
    }

    function getDisabledState() {
      var state = scope.$eval(scope.disabled);

      return state === true;
    }
  }
};
