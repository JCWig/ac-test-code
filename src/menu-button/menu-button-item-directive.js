'use strict';

module.exports = function(options) {
    return function() {
        return {
            restrict: 'E',
            replace: true,
            require: '^' + options.require,
            scope: {
                text: '@'
            },
            template: '<li><a href="#">{{ text }}</a></li>'
        };
    };
};
