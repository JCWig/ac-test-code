'use strict';

/* @ngInject */
module.exports = function($log) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            isCollapsed: '=?',
            onToggle: '&?'
        },
        template: require('./templates/content-panel.tpl.html'),
        link: function(scope) {
            scope.isCollapsed = !!scope.isCollapsed;
            
            scope.$watch('isCollapsed', function(newValue, oldValue){
                if (newValue !== oldValue) {
                    scope.$eval(scope.onToggle);
                }
            });
        }
    };
};
