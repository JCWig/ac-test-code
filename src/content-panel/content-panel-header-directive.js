'use strict';

/* @ngInject */
module.exports = function() {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        template: require('./templates/content-panel-header.tpl.html')
    };
};
