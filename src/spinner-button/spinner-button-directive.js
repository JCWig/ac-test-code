import template from './templates/spinner-button.tpl.html';

export default () => {
  return {
    restrict: 'E',
    template: template,
    controller: () => {},
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
