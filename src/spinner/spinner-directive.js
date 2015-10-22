import angular from 'angular';
import template from './templates/spinner.tpl.html';

const defaults = {
  VALUE: 0,
  STEP: 1,
  INTERVAL: 80
};

class SpinnerController {
  constructor(scope, $interval, uuid) {
    this.scope = scope;
    this.$interval = $interval;
    this.uuid = uuid;

    this.initialize();
  }

  initialize() {
    let maxlength;

    this.max = isNaN(this.max) || !this.max ? '' : parseInt(this.max, 10);
    this.min = isNaN(this.min) || !this.min ? '' : parseInt(this.min, 10);
    this.spinnerId = this.uuid.guid();

    this.dynamicMinWidth = {
      'min-width': 'calc(1em+10px)'
    };
    if (this.max) {
      maxlength = String(this.max).length;
      this.dynamicMinWidth = {
        'min-width': 'calc(' + maxlength + 'em + 10px)'
      };
    }
  }

  isUnderMin(offset = 1) {
    return SpinnerController.isOutOfBounds(this.inputValue, this.min, false, offset);
  }

  isOverMax(offset = 1) {
    return SpinnerController.isOutOfBounds(this.inputValue, this.max, true, offset);
  }

  clickNoop(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  static isOutOfBounds(inputValue, minOrMax, isUpperBound, offset) {
    if (!minOrMax) {
      return false;
    }
    inputValue = parseInt(inputValue, 10);
    minOrMax = parseInt(minOrMax, 10);
    offset = offset ? offset : 0;
    return isUpperBound ?
      inputValue + offset > minOrMax : inputValue - offset < minOrMax;
  }
}

SpinnerController.$inject = ['$scope', '$interval', 'uuid'];

function linkFn(scope, element, attrs, ngModel) {
  let ctrl = scope.spinner;

  scope.upMouseDownPromise = undefined;
  scope.downMouseDownPromise = undefined;

  //only the first time rendering, $render gets called
  ngModel.$render = () => {
    setStepValue();
    ctrl.inputValue = parseInt(ngModel.$viewValue, 10);
  };

  // when model change, parse to integer, this sets up to the ngModelController
  ngModel.$formatters.push((value) => {
    let parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
      ctrl.inputValue = defaults.VALUE;
      parsedValue = 0;
      updateInput(0);
    } else { //it is number, do some validations from min and max
      if (ctrl.max) {
        if (SpinnerController.isOutOfBounds(parsedValue, ctrl.max, true, 0)) {
          parsedValue = ngModel.$viewValue;
          updateInput(0);
        }
      }

      if (ctrl.min) {
        if (SpinnerController.isOutOfBounds(parsedValue, ctrl.min, false, 0)) {
          parsedValue = ngModel.$viewValue;
          updateInput(0);
        }
      }
    }
    return parsedValue;
  });

  ngModel.$parsers.push((value) => {
    return parseInt(value, 10);
  });

  scope.changed = () => {
    if (!ctrl.inputValue) {
      ctrl.inputValue = defaults.VALUE;
      updateInput(0);
    } else {
      if (ctrl.max) {
        if (SpinnerController.isOutOfBounds(ctrl.inputValue, ctrl.max, true, 1)) {
          updateInput(0);
        }
      }

      if (ctrl.min) {
        if (SpinnerController.isOutOfBounds(ctrl.inputValue, ctrl.min, false, 1)) {
          updateInput(0);
        }
      }
    }
  };

  scope.startStepUp = (event) => {
    if (ctrl.disabled) {
      return scope.upMouseDownPromise;
    }
    setStepValue();
    event.stopPropagation();
    if (angular.isDefined(scope.upMouseDownPromise)) {
      return scope.upMouseDownPromise;
    }

    scope.upMouseDownPromise = ctrl.$interval(() => {
      if (ctrl.isOverMax()) {
        scope.stopStepUp(event);
      } else {
        updateInput(+ctrl.step);
      }
    }, defaults.INTERVAL);
  };

  scope.stopStepUp = (event) => {
    if (ctrl.disabled) {
      return;
    }
    event.stopPropagation();
    if (angular.isDefined(scope.upMouseDownPromise)) {
      ctrl.$interval.cancel(scope.upMouseDownPromise);
      scope.upMouseDownPromise = undefined;
    }
  };

  scope.startStepDown = (event) => {
    if (ctrl.disabled) {
      return scope.downMouseDownPromise;
    }
    setStepValue();
    event.stopPropagation();
    if (angular.isDefined(scope.downMouseDownPromise)) {
      return scope.downMouseDownPromise;
    }

    scope.downMouseDownPromise = ctrl.$interval(() => {
      if (ctrl.isUnderMin()) {
        scope.stopStepDown(event);
      } else {
        updateInput(-ctrl.step);
      }
    }, defaults.INTERVAL);
  };

  scope.stopStepDown = (event) => {
    if (ctrl.disabled) {
      return;
    }
    event.stopPropagation();
    if (angular.isDefined(scope.downMouseDownPromise)) {
      ctrl.$interval.cancel(scope.downMouseDownPromise);
      scope.downMouseDownPromise = undefined;
    }
  };

  function setStepValue() {
    let step = parseInt(ctrl.step, 10);

    if (isNaN(step)) {
      ctrl.step = defaults.STEP;
    } else {
      ctrl.step = step < 1 ? defaults.STEP : step;
    }
  }

  function updateInput(offset = 1) {
    ctrl.inputValue = ctrl.inputValue + offset;
    ngModel.$setViewValue(ctrl.inputValue);
    ngModel.$setTouched();
  }
}

export default () => {
  return {
    require: 'ngModel',
    restrict: 'E',
    template: template,
    link: linkFn,
    controller: SpinnerController,
    controllerAs: 'spinner',
    bindToController: {
      min: '@?',
      max: '@?',
      disabled: '=isDisabled',
      step: '@customStep'
    },
    scope: {}
  };
};
