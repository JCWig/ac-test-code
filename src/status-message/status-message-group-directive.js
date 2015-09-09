import template from './templates/status-message-group-directive.tpl.html';

class StatusMessageGroup {
  static get $inject() {
    return ['statusMessage'];
  }

  constructor(statusMessage) {
    this.items = statusMessage.getItems();
  }
}

export default () => {
  return {
    restrict: 'E',
    replace: true,
    template: template,
    controller: StatusMessageGroup,
    controllerAs: 'statusMessageGroup',
    bindToController: {
    },
    scope: {}
  };
};
