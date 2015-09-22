import template from './templates/spinner-button.tpl.html';

class SpinnerButtonController {
  constructor(translateValueSupport) {
    this.translateValueSupport = translateValueSupport;
  }
  set translateValues(values) {
    this.translateValueSupport.setValues(this, 'textContent', values);
  }
}

function spinnerButtonDirective() {
  return {
    restrict: 'E',
    template: template,
    controller: SpinnerButtonController,
    controllerAs: 'spinnerButton',
    bindToController: {
      textContent: '@?',
      disabled: '=?',
      processing: '=?'
    },
    scope: {},
    replace: true,
    link: (scope, elem, attr) => {
      scope.spinnerButton.translateValues = attr.textContentValues;
    }
  };
}
SpinnerButtonController.$inject = ['translateValueSupport'];
export default spinnerButtonDirective;
