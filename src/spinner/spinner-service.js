'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($log) {

  var numericValidator;

  function NumericValidator() {}

  function createValidatorInstance() {
    if (!numericValidator) {
      numericValidator = new NumericValidator();
    }
    return numericValidator;
  }

  function getInstance() {
    return numericValidator; //check undefined|null?
  }

  NumericValidator.prototype.validateScopeVars = function(scope, ngModel) {
    var valid = true;
    if (!ngModel) {
      $log.error("The model controller is undefined.");
      return !valid;
    }

    if (scope.min && isNaN(parseInt(scope.min, 10))) {
      $log.error("Min value has to be number.");
      return !valid;
    }

    if (scope.max && isNaN(parseInt(scope.max, 10))) {
      $log.error("Max value has to be number.");
      return !valid;
    }

    if (scope.min && scope.max) {
      if (scope.min >= scope.max) {
        $log.error("Min value has to be less than max value.")
        return !valid;
      }
    }
    return valid;

  };

  NumericValidator.prototype.validateInput = function(value) {

    var valid = true;
    /*
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
    */
  };

  NumericValidator.prototype.isOutOfBound =
    function(value, minOrMax, isUpperBound, offset) {
    var offset = offset ? 0 : 1,
      num = parseInt(value, 10),
      minOrMax = parseInt(minOrMax, 10);

    //invalid chars should not be here
    if (isNaN(num)) {
      return false;
    }

    //this max|min may need to pass in
    return isUpperBound ? num + offset > minOrMax : num - offset < minOrMax;
  };

  NumericValidator.prototype.isNumeric = function(value) {
    return !isNaN(parseInt(value, 10));
  };

  return {
    isValid: function(value) {
      return getInstance().validateInput(value);
    },
    isOutOfBound: function(value, minOrMax, isUpperBound, offset) {
      return getInstance().isOutOfBound(value, minOrMax, isUpperBound, offset);
    },
    isNumeric: function(value) {
      return getInstance().isNumeric(value);
    },
    validateScopeVars: function(scope, ngModel) {
      return createValidatorInstance().validateScopeVars(scope, ngModel);
    }
  };
};
