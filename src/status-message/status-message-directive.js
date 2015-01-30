'use strict';

/* @ngInject */
module.exports = function($log, $timeout) {
    return {
        restrict: 'E',
        scope: {
            itemId: '@',
            title: '@',
            text: '@'
        },
        template: require('./templates/status-message-directive.tpl.html'),
        link: function(scope, element, attrs) {
            var defaultTimeout = 10000;
            var timer = null;
            
            scope.timeout = attrs.timeout == null ? defaultTimeout : window.parseInt(attrs.timeout, 10);
            if (isNaN(scope.timeout)) {
                scope.timeout = defaultTimeout;
            }
            
            $log.info('creating status message directive');
            
            element.on('$destroy', function() {
                $log.info('destroying status message');
            });
            
            function enableTimer() {
                $log.info('enabling timer');
                if (scope.timeout > 0) {
                    timer = $timeout(function() {
                        element.remove();
                    }, scope.timeout);
                }
            }
            
            function cancelTimer() {
                $log.info('canceling timer');
                if (timer != null) {
                    $timeout.cancel(timer);
                    timer = null;
                }
            }
            
            element.on('mouseenter', function(){
                cancelTimer();
            });
            
            element.on('mouseleave', function(){
                enableTimer();
            });
            
            enableTimer();
        }
    };
};