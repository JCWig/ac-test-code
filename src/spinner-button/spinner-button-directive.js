import template from './templates/spinner-button.tpl.html';

class SpinnerButtonController {}

export default () => {
  return {
    restrict: 'E',
    template: template,
    controller: SpinnerButtonController,
    controllerAs: 'spinnerButton',
    bindToController: {
      text: '@?',
      disabled: '=?',
      processing: '=?'
    },
    scope: {},
    replace: true
  };
};
