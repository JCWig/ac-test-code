'use strict';

/* @ngInject */
module.exports = function($compile) {
    return {
        restrict: 'EA',
        link: function(scope, element, attrs) {
            element.append($compile(scope.bodyContent)(scope));
        }
    };
}
