import template from './templates/status-message-group-directive.tpl.html';

class StatusMessageGroup {
  constructor(scope) {
    this.items = this.items || [];
    this.scope = scope;

    this.scope.$on('akam-status-message-destroyed', (event, itemId) => {
      this.removeItemByItemId(itemId);
    });
  }

  removeItemByItemId(itemId) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].itemId === itemId) {
        this.items.splice(i, 1);
        return;
      }
    }
  }
}

StatusMessageGroup.$inject = ['$scope'];

export default () => {
  return {
    restrict: 'E',
    replace: true,
    template: template,
    controller: StatusMessageGroup,
    controllerAs: 'statusMessageGroup',
    bindToController: {
      items: '='
    },
    scope: {}
  };
};
