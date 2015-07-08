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
      $log.error('The model controller is undefined.');
      return !valid;
    }

    if (scope.min && isNaN(parseInt(scope.min, 10))) {
      $log.error('Min value has to be number.');
      return !valid;
    }

    if (scope.max && isNaN(parseInt(scope.max, 10))) {
      $log.error('Max value has to be number.');
      return !valid;
    }

    if (scope.min && scope.max) {
      if (scope.min >= scope.max) {
        $log.error('Min value has to be less than max value.');
        return !valid;
      }
    }
    return valid;

  };

  NumericValidator.prototype.isOutOfBounds =
    function(value, minOrMax, isUpperBound, offset) {
      var num = parseInt(value, 10);

      minOrMax = parseInt(minOrMax, 10);
      offset = offset ? 0 : 1;

      return isUpperBound ? num + offset > minOrMax : num - offset < minOrMax;
    };

  NumericValidator.prototype.isNumeric = function(value) {
    return !isNaN(parseInt(value, 10));
  };

  return {
    isOutOfBounds: function(value, minOrMax, isUpperBound, offset) {
      return getInstance().isOutOfBounds(value, minOrMax, isUpperBound, offset);
    },
    isNumeric: function(value) {
      return getInstance().isNumeric(value);
    },
    validateScopeVars: function(scope, ngModel) {
      return createValidatorInstance().validateScopeVars(scope, ngModel);
    }
  };
};
module.exports.$inject = ['$log'];