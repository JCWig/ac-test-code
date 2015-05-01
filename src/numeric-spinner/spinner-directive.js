'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($log, $compile, $interval) {
  var defaults = {
    VALUE: 0,
    STEP: 1,
    MIN: 0,
    //MAX: 3000,
    REQUIRED: false,
    KEY_DOWN: 40,
    KEY_UP: 38
  };

  var directive = {
    require: 'ngModel',
    restrict: 'E',
    template: require('./templates/numeric-spinner.tpl.html'),
    link: link,
    scope: {
      min: '@?',
      max: '@?',
      label: '@?',
      inputValue: '=ngModel'
    }
  };

  return directive;

  function link(scope, element, attrs, ngModel) {

    var upMouseDownPromise, downMouseDownPromise;

    scope.key = function(event) {
      if (event.keyCode === defaults.KEY_UP && !scope.isOverMax(false)) {
        updateInput(+1);
        event.stopPropagation();
        event.preventDefault();
      }else if (event.keyCode === defaults.KEY_DOWN && !scope.isUnderMin(false)) {
        updateInput(-1);
        event.stopPropagation();
        event.preventDefault();
      }
    };

    scope.isUnderMin = function(strict) {
      var offset = strict ? 0 : 1,
        isUnderMin = ngModel.$viewValue - offset < parseInt(scope.min, 10);

      return angular.isDefined(scope.min) && isUnderMin;

    };

    scope.isOverMax = function(strict) {
      var offset = strict ? 0 : 1,
        isOverMax = ngModel.$viewValue + offset > parseInt(scope.max, 10);

      return angular.isDefined(scope.max) && isOverMax;
    };

    scope.startStepUp = function() {
      if (angular.isDefined(upMouseDownPromise)) {
        return;
      }

      upMouseDownPromise = $interval(function() {
        if (scope.isOverMax(false)) {
          scope.stopStepUp();
        } else {
          stepup();
        }
      }, 100);
    };

    scope.stopStepUp = function() {
      if (angular.isDefined(upMouseDownPromise)) {
        $interval.cancel(upMouseDownPromise);
        upMouseDownPromise = undefined;
      }
    };

    scope.startStepDown = function() {
      if (angular.isDefined(downMouseDownPromise)) {
        return;
      }

      downMouseDownPromise = $interval(function() {
        if (scope.isUnderMin(false)) {
          scope.stopStepDown();
        } else {
          stepdown();
        }
      }, 100);
    };

    scope.stopStepDown = function() {
      if (angular.isDefined(downMouseDownPromise)) {
        $interval.cancel(downMouseDownPromise);
        downMouseDownPromise = undefined;
      }
    };

    scope.checkInput = function(value) {
      scope.inputValue = getValidNumber(value);
      return this;
    };

    // when model change, cast to integer
    ngModel.$formatters.push(function(value) {
      scope.inputValue = getValidNumber(value);
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

    initialize();
    //validateInput();

    function initialize() {
      scope.min = scope.min || defaults.MIN;
      //scope.max = scope.max || defaults.MAX;
      scope.required = scope.required || defaults.REQUIRED;
      scope.label = scope.label || '';
      scope.ngModel = ngModel.$viewValue || '';
      scope.placeholder = defaults.VALUE;

      ngModel.$render();
    }

    function stepup() {
      updateInput(+1);
    }

    function stepdown() {
      updateInput(-1);
    }

    function getValidNumber(value) {
      var num = parseInt(value, 10);

      return isNaN(num) ? defaults.VALUE : num;
    }

    function validateInput() {
      var valid = !(scope.isUnderMin(true) || scope.isOverMax(true));

      if (!valid) {
        ngModel.$setValidity('outOfBounds', valid);
      }
    }

    function updateInput(offset) {
      ngModel.$setViewValue(ngModel.$viewValue + offset);
      ngModel.$render();
    }
  }
};
