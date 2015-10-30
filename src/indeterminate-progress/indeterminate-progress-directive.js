import angular from 'angular';
import template from './templates/indeterminate-progress-directive.tpl.html';

const WRAPPER_CLASS_NAME = 'indeterminate-progress-wrapper',
  CLASS_NAME = 'indeterminate-progress',
  SIZE_MICRO = 'micro',
  SIZE_SMALL = 'small',
  SIZE_NORMAL = 'normal',
  SIZE_LARGE = 'large',
  SIZES = [
    SIZE_LARGE,
    SIZE_NORMAL,
    SIZE_SMALL,
    SIZE_MICRO
  ],
  STATES = {
    STARTED: 'started',
    COMPLETED: 'completed',
    FAILED: 'failed',
    SUCCESS: 'success'
  };

class IndeterminateProgressController {
  constructor($translate) {
    if (angular.isDefined(this.label) && this.label !== '') {
      $translate(this.label)
        .then(value => this.label = value);
    }
  }

  static get $inject() {
    return ['$translate'];
  }

  get size() {
    return SIZES.indexOf(this.spinnerSize) > -1 ? this.spinnerSize : SIZE_NORMAL;
  }

  get state() {
    if (this.failed) {
      return STATES.FAILED;
    }

    if (this.success) {
      return STATES.SUCCESS;
    }

    if (this.completed) {
      return STATES.COMPLETED;
    }

    return STATES.STARTED;
  }

  get success() {
    return this.stateSuccess === 'true';
  }

  get completed() {
    return this.stateCompleted === 'true';
  }

  get failed() {
    return this.stateFailed === 'true';
  }
}

function indeterminateProgressDirective() {

  return {
    restrict: 'AE',
    scope: {},
    bindToController: {
      label: '@label',
      stateFailed: '@failed',
      stateCompleted: '@completed',
      stateSuccess: '@success',
      spinnerSize: '@size'
    },
    controller: IndeterminateProgressController,
    controllerAs: 'indeterminateProgress',
    link: (scope, element, attrs, ctrl) => {
      //add or remove the class based controller state
      scope.$watch(()=> ctrl.state, () => {
        element.toggleClass('success', ctrl.success);
        element.toggleClass('failed', ctrl.failed);
        element.parent().toggleClass(CLASS_NAME, !ctrl.completed);
      });

      //remove the indeterminate progress if the element is removed.
      element.on('$destroy', () => {
        element.parent().removeClass(CLASS_NAME);
      });

      element.addClass(WRAPPER_CLASS_NAME);
      element.addClass(ctrl.size);
    },
    template: template
  };
}

export default indeterminateProgressDirective;
