import template from './templates/status-message-directive.tpl.html';

const DEFAULT_TIMEOUT = 2000;
const [SUCCESS] = ['success'];

class StatusMessageController {
  constructor($log, $timeout) {
    this.$log = $log;
    this.$timeout = $timeout;

    this.timeout = null;
    this.closing = false;

    if (!this.status) {
      this.status = SUCCESS;
    }
  }
}

StatusMessageController.$inject = ['$log', '$timeout'];

function linkFn(scope, element, attrs) {
  let timer = null,
    ctrl = scope.statusMessage;

  element.addClass(ctrl.status);

  ctrl.timeout = !attrs.timeout ? DEFAULT_TIMEOUT : window.parseInt(attrs.timeout, 10);
  if (isNaN(ctrl.timeout) || ctrl.timeout < 0) {
    ctrl.timeout = DEFAULT_TIMEOUT;
  }

  scope.close = function() {
    //make sure we're not allowing the callback to (also) occur if the user clicked close
    cancelTimer();
    ctrl.closing = true;
    ctrl.$timeout(() => {
      element.remove();
      ctrl.closing = false;
    }, 500);
  };

  element.on('$destroy', () => {
    scope.$emit('akam-status-message-destroyed', ctrl.itemId);
    element.off('mouseenter', cancelTimer);
    element.off('mouseleave', enableTimer);
  });

  function enableTimer() {
    if (ctrl.timeout > 0) {
      timer = ctrl.$timeout(() => {
        scope.close();
      }, ctrl.timeout);
    }
  }

  function cancelTimer() {
    if (timer != null) {
      ctrl.$timeout.cancel(timer);
      timer = null;
    }
  }

  element.on('mouseenter', cancelTimer);
  element.on('mouseleave', enableTimer);

  enableTimer();
}

export default () => {
  return {
    restrict: 'E',
    scope: {},
    replace: true,
    template: template,
    link: linkFn,
    controller: StatusMessageController,
    controllerAs: 'statusMessage',
    bindToController: {
      itemId: '@',
      text: '@',
      status: '@'
    }
  };
};
