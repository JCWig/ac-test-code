'use strict';

/* @ngInject */
module.exports = function() {
    return {
        restrict: 'E',
        scope: {
            totalItems: '=',
            currentPage: '=',
            onchangepage: '&'
        },
        template: require('./templates/pagination.tpl.html'),
        link: function(scope, element) {
            // TODO move to configurable scope
            var pageSize = 10;
            var maxPages = 7;

            function inBounds(page) {
                return page >= 1 && page <= scope.totalPages;
            }

            function update() {
                var start;
                var count;

                // setup total page count
                scope.totalPages = Math.ceil(
                    parseInt(scope.totalItems, 10) /pageSize);

                // setup current page
                if ((scope.currentPage == null) || (!inBounds(scope.currentPage))) {
                    scope.page = 1;
                } else {
                    scope.page = scope.currentPage;
                }

                // calculate the starting page and number of pages to display
                start = scope.page - Math.floor((maxPages - 2) / 2);
                count = scope.totalPages > maxPages ?
                    maxPages - 2 : scope.totalPages - 2;

                // check bounds for pages
                start = start + count > scope.totalPages ?
                    scope.totalPages - (maxPages - 2) : start;
                start = start >= 2 ? start : 2; 

                // setup the page objects for rendering
                scope.pages = [];
                for (var i = 0; i < count; i++) {
                    scope.pages.push({
                        number: start + i,
                        active: start + i === scope.page
                    });
                }
            }

            scope.isFirstPageActive = function() {
                return scope.page === 1;
            };

            scope.isLastPageActive = function() {
                return scope.page === scope.totalPages;
            };

            scope.showFirstPageEllipsis = function() {
                return scope.page - 1 > 3 && scope.totalPages > maxPages;
            };

            scope.showLastPageEllipsis = function() {
                return scope.totalPages - scope.page > 3 &&
                    scope.totalPages > maxPages;
            };

            scope.selectPage = function(page) {
                if ((page !== scope.page) && (inBounds(page))) {
                    scope.currentPage = page;
                    scope.onchangepage({ page: page });
                }
            };

            scope.$watch('[totalItems, currentPage]', function(val, old) {
                if (val !== old) {
                    update();
                }
            });

            update();
        }
    };
};
