class SpinnerService {
  contructor($log) {
    this.$log = $log;
  }

  isOutOfBounds(value, minOrMax, isUpperBound, offset) {
    let num = parseInt(value, 10);

    minOrMax = parseInt(minOrMax, 10);
    offset = offset ? 0 : 1;

    return isUpperBound ? num + offset > minOrMax : num - offset < minOrMax;
  }

  isNumeric(value) {
    return !isNaN(parseInt(value, 10));
  }

  validateScopeVars(ctrl) {
    let valid = true;

    if (ctrl.min && isNaN(parseInt(ctrl.min, 10))) {
      this.$log.error('Min value has to be number.');
      return !valid;
    }

    if (ctrl.max && isNaN(parseInt(ctrl.max, 10))) {
      this.$log.error('Max value has to be number.');
      return !valid;
    }

    if (ctrl.min && ctrl.max) {
      if (ctrl.min >= ctrl.max) {
        this.$log.error('Min value has to be less than max value.');
        return !valid;
      }
    }
    return valid;
  }
}

function spinnerService($log) {
  if (!SpinnerService.instance) {
    SpinnerService.instance = new SpinnerService($log);
  }
  return SpinnerService.instance;
}

spinnerService.$inject = ['$log'];
export default spinnerService;
