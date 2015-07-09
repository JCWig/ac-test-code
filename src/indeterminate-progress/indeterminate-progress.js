const WRAPPER_CLASS_NAME = 'indeterminate-progress-wrapper',
  CLASS_NAME = 'indeterminate-progress',
  SIZE_SMALL = 'small',
  SIZE_NORMAL = 'normal',
  SIZE_LARGE = 'large',
  STATE_STARTED = 'started',
  STATE_COMPLETED = 'completed',
  STATE_FAILED = 'failed';

class IndeterminateProgressController {

  get size() {
    switch (this.spinnerSize) {
      case SIZE_SMALL:
        return SIZE_SMALL;
      case SIZE_LARGE:
        return SIZE_LARGE;
      default:
        return SIZE_NORMAL;
    }
  }

  get state() {
    if (this.failed) {
      return STATE_FAILED;
    }

    if (this.completed) {
      return STATE_COMPLETED;
    }

    return STATE_STARTED;
  }

  get completed() {
    return this.stateCompleted === 'true';
  }

  get failed() {
    return this.stateFailed === 'true';
  }
}

export default () => {

  return {
    restrict: 'AE',
    scope: {},
    bindToController: {
      label: '@label',
      stateFailed: '@failed',
      stateCompleted: '@completed',
      spinnerSize: '@size'
    },
    controller: IndeterminateProgressController,
    controllerAs: 'indeterminateProgress',
    link: ($scope, element) => {

      //add or remove the class based on whether or not the element is "completed".
      $scope.$watch('indeterminateProgress.stateFailed', () => {
        element.toggleClass('failed', $scope.indeterminateProgress.failed);
      }, true);

      //add or remove the class based on whether or not the element is "completed".
      $scope.$watch('indeterminateProgress.stateCompleted', () => {
        element.parent().toggleClass(CLASS_NAME, !$scope.indeterminateProgress.completed);
      }, true);

      //remove the indeterminate progress if the element is removed.
      element.on('$destroy', () => {
        element.parent().removeClass(CLASS_NAME);
      });

      element.addClass(WRAPPER_CLASS_NAME);
      element.addClass($scope.indeterminateProgress.size);
    },
    template: `<div class="indeterminate-progress-spinner"></div>
    <label ng-if="indeterminateProgress.label"
      class="indeterminate-progress-label">{{ indeterminateProgress.label }}</label>`
  };
};
