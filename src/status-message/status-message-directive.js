import template from './templates/status-message-directive.tpl.html';

const DEFAULT_TIMEOUT = 2000;
const [SUCCESS] = ['success'];

class StatusMessageController {

  static get $inject() {
    return ['$log', '$timeout', 'statusMessage'];
  }

  constructor($log, $timeout, statusMessage) {
    this.statusMessage = statusMessage;
    this.$log = $log;
    this.$timeout = $timeout;
    this.closing = false;
    this.timeout = null;

    if (!this.status) {
      this.status = SUCCESS;
    }
  }

  enableTimer() {
    if (this.timeout && this.timeout > 0) {
      this.timer = this.$timeout(() => {
        this.close();
      }, this.timeout);
    }
  }

  close() {
    //make sure we're not allowing the callback to (also) occur if the user clicked close
    this.cancelTimer();
    this.closing = true;
    this.$timeout(() => {
      this.statusMessage.remove(this.itemId);
      this.closing = false;
    }, 500);
  }

  cancelTimer() {
    if (this.timer != null) {
      this.$timeout.cancel(this.timer);
      this.timer = null;
    }
  }
}

function linkFn(scope, element, attrs, ctrl) {
  element.addClass(ctrl.status);

  let timeoutValue = attrs.timeout;

  timeoutValue = !timeoutValue ? DEFAULT_TIMEOUT : parseInt(timeoutValue, 10);

  if (isNaN(timeoutValue) || timeoutValue < 0) {
    timeoutValue = DEFAULT_TIMEOUT;
  }

  ctrl.timeout = timeoutValue;

  element.on('$destroy', () => {
    ctrl.close();
    element.off('mouseenter', () => ctrl.cancelTimer());
    element.off('mouseleave', () => ctrl.enableTimer());
  });

  element.on('mouseenter', () => ctrl.cancelTimer());
  element.on('mouseleave', () => ctrl.enableTimer());

  ctrl.enableTimer();
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
