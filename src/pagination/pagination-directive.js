'use strict';

/* @ngInject */
module.exports = function() {
    return {
        restrict: 'E',
        scope: {
            totalItems: '=',
            currentPage: '=',
            pageSize: '=',
            onchangepage: '&'
        },
        template: require('./templates/pagination.tpl.html'),
        link: function(scope, element) {
            var maxPages = 7;
            var defaultSize = 25;

            scope.sizes = [25, 50, 100];

            function inBounds(page) {
                return page >= 1 && page <= scope.totalPages;
            }

            function isValidSize(size) {
                return scope.sizes.some(function(item) {
                    return size === item;
                });
            }

            // TODO look at eliminating double update when setting default values
            function update() {
                var start;
                var count;

                // setup page size
                scope.pageSize = parseInt(scope.pageSize, 10);
                if ((scope.pageSize == null) || (!isValidSize(scope.pageSize))) {
                    scope.pageSize = defaultSize;
                }

                // setup total page count
                scope.totalPages = Math.ceil(
                    parseInt(scope.totalItems, 10) / scope.pageSize);

                // setup current page
                scope.currentPage = parseInt(scope.currentPage, 10);
                if ((scope.currentPage == null) || (!inBounds(scope.currentPage))) {
                    scope.currentPage = 1;
                }

                // calculate the starting page and number of pages to display
                start = scope.currentPage - Math.floor((maxPages - 2) / 2);
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
                        active: start + i === scope.currentPage
                    });
                }
            }

            scope.hasPages = function() {
                return scope.totalItems > scope.pageSize; 
            };

            scope.isSizeActive = function(size) {
                return size === scope.size;
            };

            scope.isFirstPageActive = function() {
                return scope.currentPage === 1;
            };

            scope.isLastPageActive = function() {
                return scope.currentPage === scope.totalPages;
            };

            scope.showFirstPageEllipsis = function() {
                return scope.currentPage - 1 > 3 && scope.totalPages > maxPages;
            };

            scope.showLastPageEllipsis = function() {
                return scope.totalPages - scope.currentPage > 3 &&
                    scope.totalPages > maxPages;
            };

            scope.selectPage = function(page) {
                if ((page !== scope.currentPage) && (inBounds(page))) {
                    scope.currentPage = page;
                    scope.onchangepage({ page: page });
                }
            };

            scope.$watch('[totalItems, currentPage, pageSize]', function(val, old) {
                if (val !== old) {
                    update();
                }
            });

            update();
        }
    };
};
