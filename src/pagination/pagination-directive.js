'use strict';

/* @ngInject */
module.exports = function(translate) {
    return {
        restrict: 'E',
        scope: {
            totalItems: '=',
            currentPage: '=',
            pageSize: '=',
            onchangepage: '&',
            onchangesize: '&'
        },
        template: require('./templates/pagination.tpl.html'),
        link: function(scope, element) {
            var maxPages = 7;
            var defaultSize = 10;

            scope.sizes = [10, 25, 50];

            translate.async("components.pagination.label.results")
                .then(function(value) {
                    scope.resultText = value;
                });

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
                if(isNaN(scope.totalPages) || scope.totalPages <= 0){
                    scope.totalPages = 1;
                }
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

            scope.isSizeActive = function(size) {
                return size === scope.pageSize;
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

            scope.selectSize = function(size) {
                if ((size !== scope.pageSize)) {
                    scope.pageSize = size;
                    scope.onchangesize({ size: size });
                }
            };
            scope.hasOnlyOnePage = function(){
                return scope.totalPages === 1; 
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
