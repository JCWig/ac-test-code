'use strict';

module.exports = function() {
    return {
        restrict: 'E',
        scope: {
            totalItems: '=',
            currentPage: '=',
            pageSize: '=',
            onchangepage: '&',
            onchangesize: '&'
        },
        link: function(scope, element) {
        }
    };
};
