import angular from 'angular';
import template from './templates/spinner.tpl.html';

const defaults = {
  VALUE: 0,
  STEP: 1,
  INTERVAL: 80
};

class SpinnerController {
  constructor(scope, $interval, uuid, $log, spinnerService) {
    this.scope = scope;
    this.$interval = $interval;
    this.uuid = uuid;
    this.$log = $log;
    this.spinnerService = spinnerService;

    this.initialize();
  }

  initialize() {
    let maxlength;

    this.max = isNaN(this.max) ? '' : parseInt(this.max, 10);
    this.min = isNaN(this.max) ? '' : parseInt(this.min, 10);
    this.disabled = this.scope.$eval(this.disabled) === true;
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

    if (angular.isUndefined(this.inputValue)) {
      if (!isNaN(this.min)) {
        this.inputValue = parseInt(this.min, 10);
      } else {
        this.inputValue = defaults.VALUE;
      }
    }

    this.scope.$watch('spinner.inputValue', (newValue, oldValue) => {
      let isValueUnderMin, isValueOverMax;

      isValueUnderMin = this.spinnerService.isOutOfBounds(
        this.inputValue, this.min, false, 1);
      if (isValueUnderMin) {
        this.inputValue = oldValue;
        return;
      }

      isValueOverMax = this.spinnerService.isOutOfBounds(
        this.inputValue, this.max, true, 1);
      if (isValueOverMax) {
        this.inputValue = oldValue;
      }
    });
  }

  isDisabled() {
    return this.disabled === true || this.scope.$eval(this.disabled) === true;
  }

  isUnderMin(offset) {
    return this.spinnerService.isOutOfBounds(this.inputValue, this.min, false, offset);
  }

  isOverMax(offset) {
    return this.spinnerService.isOutOfBounds(this.inputValue, this.max, true, offset);
  }
}

SpinnerController.$inject = ['$scope', '$interval', 'uuid', '$log', 'spinnerService'];

function linkFn(scope, element, attrs, ngModel) {
  let valid, upMouseDownPromise, downMouseDownPromise,
    ctrl = scope.spinner;

  if (!ngModel) {
    ctrl.$log.error('The model controller is undefined.');
    return;
  }

  valid = ctrl.spinnerService.validateScopeVars(ctrl);

  if (!valid) {
    ctrl.$log.error('Initial validation failed.');
    return;
  }

  ngModel.$render();

  // when model change, parse to integer, this sets up to the ngModelController
  ngModel.$formatters.push(function(value) {
    return parseInt(value, 10);
  });

  // when view change, parse to integer, this sets up to the ngModelController
  ngModel.$parsers.push(function(value) {
    return parseInt(value, 10);
  });

  scope.changed = () => {
    if (angular.isUndefined(ctrl.inputValue)) {
      ctrl.inputValue = ngModel.$viewValue;
    }
  };

  function updateInput(offset) {
    ngModel.$setViewValue(ctrl.inputValue + offset);
    ngModel.$setTouched();
  }

  scope.startStepUp = (event) => {
    event.stopPropagation();
    if (angular.isDefined(upMouseDownPromise)) {
      return;
    }
    upMouseDownPromise = ctrl.$interval(() => {
      if (ctrl.isOverMax()) {
        scope.stopStepUp(event);
      } else {
        updateInput(+defaults.STEP);
      }
    }, defaults.INTERVAL);
  };

  scope.stopStepUp = (event) => {
    event.stopPropagation();
    if (angular.isDefined(upMouseDownPromise)) {
      ctrl.$interval.cancel(upMouseDownPromise);
      upMouseDownPromise = undefined;
    }
  };

  scope.startStepDown = (event) => {
    event.stopPropagation();
    if (angular.isDefined(downMouseDownPromise)) {
      return;
    }

    downMouseDownPromise = ctrl.$interval(() => {
      if (ctrl.isUnderMin()) {
        scope.stopStepDown(event);
      } else {
        updateInput(-defaults.STEP);
      }
    }, defaults.INTERVAL);
  };

  scope.stopStepDown = (event) => {
    event.stopPropagation();
    if (angular.isDefined(downMouseDownPromise)) {
      ctrl.$interval.cancel(downMouseDownPromise);
      downMouseDownPromise = undefined;
    }
  };
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
      disabled: '@?',
      inputValue: '=ngModel'
    },
    scope: {}
  };
};
