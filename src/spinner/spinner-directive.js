'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($interval, $log, uuid) {

  var INITIAL_VALUE = 0,
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

  function link(scope, element, attrs, ngModelController) {
    var upMouseDownPromise, downMouseDownPromise;

    scope.isUpArrowDisabled = function() {
      return scope.isOverMax() || scope.disabled === 'disabled' ? 'disabled' : '';
    };

    scope.isDownArrowDisabled = function() {
      return scope.isUnderMin() || scope.disabled === 'disabled' ? 'disabled' : '';
    };

    scope.isUnderMin = function(strict) {
      var offset = strict ? 0 : 1;

      return scope.min && scope.ngModel - offset < parseInt(scope.min, 10);
    };

    scope.isOverMax = function(strict) {
      var offset = strict ? 0 : 1;

      return scope.max && scope.ngModel + offset > parseInt(scope.max, 10);
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
          updateInput(+1);
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
          updateInput(-1);
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
      validateInput(value);
      return parseInt(value, 10);
    });

    // when view change, parse to integer, this sets up to the ngModelController
    ngModelController.$parsers.push(function(value) {
      validateInput(value);
      return parseInt(value, 10);
    });

    ngModelController.$render = function() {
      //validateInput(scope.ngModel);
    };

    //just in case ngModelController is not defined, then the code won't break
    if (!ngModelController) {
      return;
    }

    initialize();

    function initialize() {
      var maxlength;

      scope.disabled = scope.disabled === 'disabled' ? scope.disabled : '';
      scope.spinnerId = uuid.guid();

      scope.dynamicMinWidth = {};
      if (scope.max) {
        maxlength = scope.max.length;
        scope.dynamicMinWidth = {
          'min-width': 'calc(' + maxlength + 'em + 10px)',
          width: 0
        };
      }
      ngModelController.$render();
    }

    function validateInput(value) {
      var valid = true;

      if (scope.disabled === 'disabled') {
        return !valid;
      }

      value = parseInt(value, 10);

      //check if value is number or not
      valid = !isNaN(value);
      if (!valid) {
        $log.warn('Input is Invalid.');
        scope.ngModel = INITIAL_VALUE;
        //ngModelController.$setValidity('input', valid);
        return valid;
      }

      //check if value is under min value or not
      valid = !scope.isUnderMin(true);
      if (!valid) {
        //ngModelController.$setValidity('outOfBounds', valid);
        $log.warn('Input is under min value.');
        scope.ngModel = parseInt(scope.min, 10);
        return valid;
      }

      //check if value is under min value or not
      valid = !scope.isOverMax(true);
      if (!valid) {
        //ngModelController.$setValidity('outOfBounds', valid);
        $log.warn('Input is over max value.');
        scope.ngModel = parseInt(scope.max, 10);
        return valid;
      }
      return valid;
    }

    function updateInput(offset) {
      ngModelController.$setViewValue(scope.ngModel + offset);
      ngModelController.$setTouched();
      ngModelController.$render();
    }

    function stopIntrnalEvents(event) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }
};
