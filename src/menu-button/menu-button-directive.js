'use strict';

/* @ngInject */
module.exports = function($log) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            label: '@',
            icon : '@'
        },
        template: require('./templates/menu-button.tpl.html'),
        link: function() {

        }
    };
};
