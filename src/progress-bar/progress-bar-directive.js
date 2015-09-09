import template from './templates/progress-bar-directive.tpl.html';
import angular from 'angular';

class ProgressBarController {
  static get $inject() {
    return ['$scope', '$animate', '$translate'];
  }

  constructor($scope, $animate, $translate) {
    this.$scope = $scope;
    this.$animate = $animate;
    this.$translate = $translate;

    this.animate = angular.isDefined(this.animate) ? this.animate : false;

    $scope.$watch('progressBar.state', (newValue) => {
      switch (newValue) {
        case 'error':
        this.type = 'danger';
        this.value = this.max;
        break;
        case 'completed':
        this.type = 'success';
        break;
        case 'inprogress':
        this.type = '';
        break;
      }
    });

    $scope.$watch('progressBar.value', (newValue) => {
      this.state = newValue === this.max && this.state !== 'error' ? 'completed' : this.state;
    });

    $scope.$watch('progressBar.label', (newValue) => {
      if (angular.isDefined(newValue) && newValue !== '') {
        $translate(newValue)
          .then(value => {
            this.label = value;
          });
      }
    });
  }

  progressBarStyles() {
    let styles = [];

    if (this.animate === 'true') {
      styles.push('progress-striped active');
    }

    if (!this.value) {
      styles.push('remove-right-border');
    }

    return styles.join(' ');
  }
}

function progressBarDirective() {
  return {
    restrict: 'E',
    template: template,
    scope: {},
    bindToController: {
      value: '=',
      max: '=?',
      state: '=',
      label: '=?',
      labelAlign: '@',
      animate: '@'
    },
    controller: ProgressBarController,
    controllerAs: 'progressBar'
  };
}

export default progressBarDirective;