import angular from 'angular';
import template from './templates/indeterminate-progress-directive.tpl.html';

const WRAPPER_CLASS_NAME = 'indeterminate-progress-wrapper',
  CLASS_NAME = 'indeterminate-progress',
  SIZE_MICRO = 'micro',
  SIZE_SMALL = 'small',
  SIZE_NORMAL = 'normal',
  SIZE_LARGE = 'large',
  SIZES = [SIZE_LARGE, SIZE_NORMAL, SIZE_SMALL, SIZE_MICRO],
  STATE_STARTED = 'started',
  STATE_COMPLETED = 'completed',
  STATE_FAILED = 'failed',
  STATE_SUCCESS = 'success';

class IndeterminateProgressController {
  get size() {
    return SIZES.indexOf(this.spinnerSize) > -1 ? this.spinnerSize : SIZE_NORMAL;
  }

  get state() {
    if (this.failed) {
      return STATE_FAILED;
    }

    if (this.success) {
      return STATE_SUCCESS;
    }

    if (this.completed) {
      return STATE_COMPLETED;
    }

    return STATE_STARTED;
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

function indeterminateProgressDirective(translate) {

  return {
    restrict: 'AE',
    scope: {},
    bindToController: {
      label: '@?label',
      stateFailed: '@?failed',
      stateCompleted: '@?completed',
      stateSuccess: '@?success',
      spinnerSize: '@?size'
    },
    controller: IndeterminateProgressController,
    controllerAs: 'indeterminateProgress',
    link: (scope, element, attrs, ctrl) => {
      if (angular.isDefined(ctrl.label) && ctrl.label !== '') {
        translate.async(ctrl.label)
          .then(value => ctrl.label = value);
      }

      //add or remove the class based on whether or not the element is "failed".
      scope.$watch('indeterminateProgress.stateFailed', () => {
        element.toggleClass('failed', ctrl.failed);
      }, true);

      //add or remove the class based on whether or not the element is "success"
      scope.$watch('indeterminateProgress.stateSuccess', () => {
        element.toggleClass('success', ctrl.success);
      }, true);

      //add or remove the class based on whether or not the element is "completed".
      scope.$watch('indeterminateProgress.stateCompleted', () => {
        element.parent().toggleClass(CLASS_NAME, !ctrl.completed);
      }, true);

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

indeterminateProgressDirective.$inject = ['translate'];

export default indeterminateProgressDirective;
