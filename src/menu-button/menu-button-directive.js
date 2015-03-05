'use strict';

/* @ngInject */
module.exports = function($log) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            label: '@',
            icon : '@',
            position : '@'
        },
        template: require('./templates/menu-button.tpl.html'),
        link: function() {

        }
    };
};
