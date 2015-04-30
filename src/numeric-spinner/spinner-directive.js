'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($log, $compile) {
  var defaults = {
    VALUE: 0,
    STEP: 1,
    MIN: 0,
    MAX: 3000,
    REQUIRED: false
  }

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
  }

  return directive;

  function link(scope, element, attrs, ngModel) {

    scope.label = '';

    if (angular.isDefined(attrs.label)) {
        attrs.$observe('label', function(value) {
            scope.label = ' ' + value;
            ngModel.$render();
        });
    }

    initialize();
    //validateInput();

    scope.isUnderMin = function(strict) {
      var offset = strict ? 0 : 1;
      return (angular.isDefined(scope.min)
        && (ngModel.$viewValue - offset) < parseInt(scope.min, 10));
    };

    scope.isOverMax = function(strict) {
      var offset = strict ? 0 : 1;
      return (angular.isDefined(scope.max)
        && (ngModel.$viewValue + offset) > parseInt(scope.max, 10));
    };

    // update the value when user clicks the buttons
    scope.stepup = function() {
      updateInput(+1);
    };
    scope.stepdown = function() {
      updateInput(-1);
    };

    ngModel.$render = function() {
      //validateInput();
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

    function initialize() {
      scope.min = scope.min || defaults.MIN;
      scope.max = scope.max || defaults.MAX;
      scope.required = scope.required || defaults.REQUIRED;
      scope.label = scope.label || '';
      scope.ngModel = ngModel.$viewValue || defaults.VALUE;

      ngModel.$render();
    }

    function getValidNumber(value) {
      var n = parseInt(value, 10),
        badNumber = isNaN(n),
        okNumber = defaults.VALUE;

      if (!badNumber) {
        okNumber = n;
      }
      return okNumber;
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
}
