'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($interval, uuid) {

  var directive = {
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

    scope.isUpArrowDisabled = function() {
      return scope.isOverMax() || scope.disabled === 'disabled' ? 'disabled' : '';
    };

    scope.isDownArrowDisabled = function() {
      return scope.isUnderMin() || scope.disabled === 'disabled' ? 'disabled' : '';
    };

    scope.isUnderMin = function(strict) {
      var offset = strict ? 0 : 1;

      return scope.min && ngModel.$viewValue - offset < parseInt(scope.min, 10);
    };

    scope.isOverMax = function(strict) {
      var offset = strict ? 0 : 1;

      return scope.max && ngModel.$viewValue + offset > parseInt(scope.max, 10);
    };

    scope.startStepUp = function(event) {
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
      stopIntrnalEvents(event);
    };

    scope.stopStepUp = function(event) {
      if (angular.isDefined(upMouseDownPromise)) {
        $interval.cancel(upMouseDownPromise);
        upMouseDownPromise = undefined;
      }
      stopIntrnalEvents(event);
    };

    scope.startStepDown = function(event) {
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
      stopIntrnalEvents(event);
    };

    scope.stopStepDown = function(event) {
      if (angular.isDefined(downMouseDownPromise)) {
        $interval.cancel(downMouseDownPromise);
        downMouseDownPromise = undefined;
      }
      stopIntrnalEvents(event);
    };

    // when model change, cast to integer
    ngModel.$formatters.push(function(value) {
      if (validateInput(value)) {
        scope.inputValue = parseInt(value, 10);
      }
      return scope.inputValue;
    });

    // when view change, cast to integer
    ngModel.$parsers.push(function(value) {
      return parseInt(value, 10);
    });

    ngModel.$render = function() {
      validateInput();
      return this;
    };

    //just in case ngModel is not defined, then the code won't break
    ngModel = ngModel || {$setViewValue: angular.noop};
    initialize();

    function initialize() {
      scope.ngModel = ngModel.$viewValue || 0;
      scope.disabled = scope.disabled === 'disabled' ? scope.disabled : '';
      scope.spinnerId = uuid.guid();
      scope.placeholder = '0';

      ngModel.$render();
    }

    function validateInput(value) {
      var valid = true;

      if (scope.disabled === 'disabled') {
        return !valid;
      }

      //it is not really do anything... yet
      valid = !(scope.isUnderMin(true) || scope.isOverMax(true));

      if (!valid) {
        ngModel.$setValidity('outOfBounds', valid);
        return valid;
      }

      valid = !isNaN(parseInt(value, 10));
      return valid;
    }

    function updateInput(offset) {
      if (!ngModel.$viewValue) {
        ngModel.$setViewValue(0);
      }
      ngModel.$setViewValue(ngModel.$viewValue + offset);
      ngModel.$render();
    }

    function stopIntrnalEvents(event) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }
};
