'use strict';

/* @ngInject */
module.exports = function($log, $timeout) {
  return {
    restrict: 'E',
    scope: {
      itemId: '@',
      text: '@',
      status: '@'
    },
    replace: true,
    template: require('./templates/status-message-directive.tpl.html'),
    link: function(scope, element, attrs) {
      var defaultTimeout = 2000;
      var timer = null;

      if (scope.status == null || scope.status === "") {
        scope.status = 'success';
      }

      element.addClass(scope.status);

      scope.timeout = attrs.timeout == null ? defaultTimeout : window.parseInt(attrs.timeout, 10);
      if (isNaN(scope.timeout) || scope.timeout < 0) {
        scope.timeout = defaultTimeout;
      }

      scope.close = function() {
        //make sure we're not allowing the callback to (also) occur if the user clicked close
        cancelTimer();
        scope.closing = true;
        $timeout(function() {
          element.remove();
        }, 500);
      };

      element.on('$destroy', function() {
        scope.$emit('akam-status-message-destroyed', scope.itemId);
        element.off('mouseenter', cancelTimer);
        element.off('mouseleave', enableTimer);
      });

      function enableTimer() {
        if (scope.timeout > 0) {
          timer = $timeout(function() {
            scope.close();
          }, scope.timeout);
        }
      }

      function cancelTimer() {
        if (timer != null) {
          $timeout.cancel(timer);
          timer = null;
        }
      }

      element.on('mouseenter', cancelTimer);
      element.on('mouseleave', enableTimer);

      enableTimer();
    }
  };
};