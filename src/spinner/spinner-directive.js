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

    if (scope.disabled === 'disabled') {
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

  function stopIntrnalEvents(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  function link(scope, element, attrs, ngModelController) {
    var upMouseDownPromise, downMouseDownPromise;

    //ngModelController has to be defined
    if (!ngModelController) {
      return;
    }

    initialize();

    scope.isUpArrowDisabled = function() {
      return scope.isOverMax() || scope.disabled === 'disabled';
    };

    scope.isDownArrowDisabled = function() {
      return scope.isUnderMin() || scope.disabled === 'disabled';
    };

    scope.isUnderMin = function(strict) {
      return isOutOfBound(strict, 'min');
    };

    scope.isOverMax = function(strict) {
      return isOutOfBound(strict, 'max');
    };

    scope.startStepUp = function(event) {
      stopIntrnalEvents(event);
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
      stopIntrnalEvents(event);
      if (angular.isDefined(upMouseDownPromise)) {
        $interval.cancel(upMouseDownPromise);
        upMouseDownPromise = undefined;
      }
    };

    scope.startStepDown = function(event) {
      stopIntrnalEvents(event);
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
      stopIntrnalEvents(event);
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
      var maxlength;

      scope.disabled = scope.disabled === 'disabled' ? scope.disabled : '';
      scope.spinnerId = uuid.guid();

      scope.dynamicMinWidth = {};
      if (scope.max) {
        maxlength = scope.max.length;
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
  }
};
