'use strict';

/* @ngInject */
module.exports = function($log) {
    return {
        restrict: 'E',
        scope: {
            items : '='
        },
        replace: true,
        template: require('./templates/status-message-group-directive.tpl.html'),
        link: function(scope, element, attrs) {
            scope.items = scope.items || [];
            
            function removeItemByItemId(itemId) {
                for(var i=0; i<scope.items.length; i++){
                    if (scope.items[i].itemId === itemId) {
                        scope.items.splice(i, 1);
                        return;
                    }
                }
            }

            scope.$on('akam-status-message-destroyed', function (event, itemId) {
                removeItemByItemId(itemId);
            });
        }
    };
};