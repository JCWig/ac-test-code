'use strict';

var utils = require('../utilities');
var translationMock = {
    "components": {
        "pagination": {
            "label": {
                "results": "Results: ",
                "show-entries": "Show Entries: "
            }
        }
    }
};

var PREVIOUS_BUTTON = '.pagination li:first-child';
var NEXT_BUTTON = '.pagination li:last-child'
var TOTAL_ITEMS_SPAN = '.total-items';
var PAGINATION_INDEX_NTH =  '.pagination li:nth-child';
var PAGINATION_INDEX_REVERSE =  '.pagination li:nth-last-child';
var PAGE_SIZE_SMALLEST = '.page-size li:first-child';
var PAGE_SIZE_LARGEST = '.page-size li:last-child';
var PAGE_SIZE_NTH = '.page-size li:nth-child';
var PAGE_SIZES= '.page-size li'
describe('akam-pagination directive', function() {
    beforeEach(function() {
        var self = this;
        var spyOnChangePage = null;
        angular.mock.module(require('../../src/pagination').name);
        angular.mock.module(function($provide, $translateProvider) {
            $provide.factory('i18nCustomLoader', function($q, $timeout) {
                return function(options) {
                    var deferred = $q.defer();
                    $timeout(function() {
                        deferred.resolve(translationMock);
                    });
                    return deferred.promise;
                };
            });
            $translateProvider.useLoader('i18nCustomLoader');
        });
        inject(function($compile, $rootScope, $timeout) {
            var markup = '<akam-pagination total-items="pager.count" ' +
                'current-page="pager.page" onchangepage="onchangepage(page)" ' +
                'page-size="pager.size" onchangesize="onchangesize(size)">' +
                '</akam-pagination>';

            self.scope = $rootScope.$new();
            self.timeout = $timeout;
            self.scope.onchangepage = function(page){};
            self.scope.onchangesize = function(size){};
            spyOn(self.scope,"onchangepage");
            spyOn(self.scope,"onchangesize");
            self.scope.pager = {
                count: 220,
                page: 5,
                size: 25
            };
            self.element = $compile(markup)(self.scope)[0];
            self.scope.$digest();
        });
    });

    describe('when rendering', function() {
        it('should display the total item count', function() {
            var totalNumberOfItemsSpan = this.element.querySelector(TOTAL_ITEMS_SPAN);
            expect(totalNumberOfItemsSpan.textContent).toMatch(new RegExp(this.scope.pager.count));
        });

        it('should highlight the current active page', function() {
            var currentPageThatIsActivate = this.element.querySelector('.pagination li.active');
            expect(currentPageThatIsActivate.textContent).toMatch(new RegExp(this.scope.pager.page));
        });

        it('should display a previous button', function() {
            var previousPageButtonIcon = this.element.querySelector(PREVIOUS_BUTTON+' i');
            expect(previousPageButtonIcon.classList.contains('luna-arrow_smLeft')).toBe(true);
        });

        it('should display a next button', function() {
            var nextPageButtonIcon = this.element.querySelector(NEXT_BUTTON+' i');
            expect(nextPageButtonIcon.classList.contains('luna-arrow_smRight')).toBe(true);
        });

        it('should display the first page', function() {
            var firstPageIndex = this.element.querySelector(PAGINATION_INDEX_NTH+'(2)');
            expect(firstPageIndex.textContent).toMatch(/1/);
        });

        it('should display the last page', function() {
            var finalPageIndex = this.element.querySelector(PAGINATION_INDEX_REVERSE+'(2)');
            expect(finalPageIndex.textContent).toMatch(/9/);
        });

        it('should display pages', function() {
            var pageIndexesAndForwardBackWardButtons;

            this.scope.pager.count = 53;
            this.scope.pager.page = 2;
            this.scope.$digest();

            // the list contains 3 pages and the next/previous buttons
            pageIndexesAndForwardBackWardButtons = this.element.querySelectorAll('.pagination li');
            expect(pageIndexesAndForwardBackWardButtons.length).toEqual(3 + 2);
        });

        it('should display a maximum of seven pages', function() {
            var pageIndexesAndForwardBackWardButtons = this.element.querySelectorAll('.pagination li');

            // the list contains 2 ellipsis and the next/previous buttons in
            // addition to the 7 maximum pages
            expect(pageIndexesAndForwardBackWardButtons.length).toEqual(7 + 2 + 2);
        });

        it('should display the page size options', function() {
            var pageSizeOptions = this.element.querySelectorAll(PAGE_SIZES);
            expect(pageSizeOptions.length).toEqual(3);
        });

        describe('when the page size is not set', function() {
            it('should default to 10', function() {
                var pageSizeTen;

                this.scope.pager.size = null;
                this.scope.$digest();

                pageSizeTen = this.element.querySelector(PAGE_SIZE_SMALLEST);
                expect(pageSizeTen.classList.contains('active')).toBe(true);
            });
        });

        describe('when the current page is not set', function() {
            it('should default to the first page', function() {
                var firstPageIndex;

                this.scope.pager.page = null;
                this.scope.$digest();

                firstPageIndex = this.element.querySelector(PAGINATION_INDEX_NTH+'(2)');
                expect(firstPageIndex.classList.contains('active')).toBe(true);
            });
        });

        describe('when total item count is less than two pages', function() {
            beforeEach(function() {
                this.scope.pager.count = 9;
                this.scope.pager.size = 10;
                this.scope.$digest();
            });

            it('should display only 1 page', function() {
                var pageOneIndex = this.element.querySelector('.pagination li.active');
                expect(pageOneIndex.textContent).toMatch(/1/);
            });
            it('should disable previous and forward arrows', function() {
                var nextButton = this.element.querySelector(NEXT_BUTTON);
                var previousButton = this.element.querySelector(PREVIOUS_BUTTON);

                expect(nextButton.classList.contains('disabled')).toBe(true);
                expect(previousButton.classList.contains('disabled')).toBe(true);
            });

            it('should not hide page size options', function() {
                var pageSizeOptions = this.element.querySelector('.page-size');
                expect(pageSizeOptions).not.toBe(null);
            });

            it('should display the the total item count', function() {
                var totalNumberOfItemsSpan = this.element.querySelector(TOTAL_ITEMS_SPAN);
                expect(totalNumberOfItemsSpan).not.toBe(null);
            });
        });

        describe('when total item count is less than a page size', function() {
            it('should not disable the page size', function() {
                var pageSizes;
                var smallestPageSizeOption;
                var secondSmallestPageSizeOption;
                this.scope.pager.count = 24;
                this.scope.pager.size = 10;
                this.scope.$digest();

                pageSizes = this.element.querySelectorAll(PAGE_SIZES);
                smallestPageSizeOption = pageSizes[0];
                secondSmallestPageSizeOption = pageSizes[1];

                expect(smallestPageSizeOption.classList.contains('disabled')).toBe(false);
                expect(secondSmallestPageSizeOption.classList.contains('disabled')).toBe(false);

                utils.click(secondSmallestPageSizeOption.querySelector('a'));
                secondSmallestPageSizeOption = this.element.querySelector(PAGE_SIZE_NTH+'(2)');
                
                expect(secondSmallestPageSizeOption.classList.contains('active')).toBe(true);
            });
        });
        describe('when total item count is 0 ', function() {
            it('should show one page', function() {
                this.scope.pager.count = 0;
                this.scope.pager.size = 10;
                this.scope.$digest();

                var pageOneIndex = this.element.querySelector('.pagination li.active');
                expect(pageOneIndex.textContent).toMatch(/1/);
            });
            it('should still be able to change page size', function() {
                this.scope.pager.count = 0;
                this.scope.pager.size = 10;
                this.scope.$digest();

                var pageSizes = this.element.querySelectorAll(PAGE_SIZES);
                var smallestPageSizeOption = pageSizes[0];
                var secondSmallestPageSizeOption = pageSizes[1];

                expect(smallestPageSizeOption.classList.contains('disabled')).toBe(false);
                expect(secondSmallestPageSizeOption.classList.contains('disabled')).toBe(false);

                utils.click(secondSmallestPageSizeOption.querySelector('a'));
                secondSmallestPageSizeOption = this.element.querySelector(PAGE_SIZE_NTH+'(2)');
                
                expect(secondSmallestPageSizeOption.classList.contains('active')).toBe(true);
                
                var pageOneIndex = this.element.querySelector('.pagination li.active');
                expect(pageOneIndex.textContent).toMatch(/1/);
            });
        });
        describe('when total item count is changed to less than 0 ', function() {
            it('should change to zero', function() {
                this.scope.pager.count = 1;
                this.scope.pager.size = 10;
                this.scope.$digest();
                this.scope.pager.count = -11;
                this.scope.$digest();
                expect(this.scope.pager.count).toEqual(0);
            });
            it('should change starting value to zero', function() {
                this.scope.pager.count = -11;
                this.scope.pager.size = 10;
                this.scope.$digest();
                expect(this.scope.pager.count).toEqual(0);
            });

        });

        describe('when the last page is the current page', function() {
            it('should disable the next button', function() {
                var nextButton = this.element.querySelector(NEXT_BUTTON);

                expect(nextButton.classList.contains('disabled')).toBe(false);

                this.scope.pager.page = 9;
                this.scope.$digest();

                nextButton = this.element.querySelector(NEXT_BUTTON);
                expect(nextButton.classList.contains('disabled')).toBe(true);
            });
        });

        describe('when the first page is the current page', function() {
            it('should disable the previous button', function() {
                var previousButton = this.element.querySelector(PREVIOUS_BUTTON);

                expect(previousButton.classList.contains('disabled')).toBe(false);

                this.scope.pager.page = 1;
                this.scope.$digest();

                previousButton = this.element.querySelector(PREVIOUS_BUTTON);
                expect(previousButton.classList.contains('disabled')).toBe(true);
            });
        });

        describe('when the current page is > 3 away from the first', function() {
            it('should display an ellipsis after the first page', function() {
                var thirdClickablePaginationIndex = this.element.querySelector(PAGINATION_INDEX_NTH+'(3)');

                expect(thirdClickablePaginationIndex.textContent).toEqual(String.fromCharCode(8230));

                this.scope.pager.page = 3;
                this.scope.$digest();

                thirdClickablePaginationIndex = this.element.querySelector(PAGINATION_INDEX_NTH+'(3)');
                expect(thirdClickablePaginationIndex.textContent).not.toEqual(String.fromCharCode(8230));
            });
        });

        describe('when the current page is > 3 away from the last', function() {
            it('should display an ellipsis before the last page', function() {
                var thirdToLastClickablePaginationIndex =
                    this.element.querySelector(PAGINATION_INDEX_REVERSE+'(3)');

                expect(thirdToLastClickablePaginationIndex.textContent).toEqual(String.fromCharCode(8230));

                this.scope.pager.page = 7;
                this.scope.$digest();

                thirdToLastClickablePaginationIndex = this.element.querySelector(PAGINATION_INDEX_REVERSE+'(3)');
                expect(thirdToLastClickablePaginationIndex.textContent).not.toEqual(String.fromCharCode(8230));
            });
        });
    });

    describe('when a page is clicked', function() {
        it('should highlight the clicked page', function() {
            var fourthClickablePaginationIndex = this.element.querySelector(PAGINATION_INDEX_NTH+'(4)');

            expect(fourthClickablePaginationIndex.classList.contains('active')).toBe(false);

            utils.click(fourthClickablePaginationIndex.querySelector('a'));
            this.scope.$digest();

            fourthClickablePaginationIndex = this.element.querySelector(PAGINATION_INDEX_NTH+'(4)');
            expect(fourthClickablePaginationIndex.classList.contains('active')).toBe(true);
        });

        it('should trigger the onchangepage callback', function() {
            var fourthClickablePaginationIndex = this.element.querySelector(PAGINATION_INDEX_NTH+'(4)');

            utils.click(fourthClickablePaginationIndex.querySelector('a'));
            this.scope.$digest();

            expect(this.scope.onchangepage).toHaveBeenCalledWith(3);
        });
    });

    describe('when an active page is clicked', function() {
        it('should do nothing', function() {
            var sixthClickablePaginationIndex = this.element.querySelector(PAGINATION_INDEX_NTH+'(6)');

            expect(sixthClickablePaginationIndex.classList.contains('active')).toBe(true);

            utils.click(sixthClickablePaginationIndex.querySelector('a'));
            this.scope.$digest();

            expect(this.scope.onchangepage).not.toHaveBeenCalled();
        });
    });

    describe('when the previous button is clicked', function() {
        it('should highlight the previous page', function() {
            var previousButton = this.element.querySelector(PREVIOUS_BUTTON);

            utils.click(previousButton.querySelector('a'));
            this.scope.$digest();

            var paginationIndexBeforeOldSelectedIndex = this.element.querySelector(PAGINATION_INDEX_NTH+'(5)');
            expect(paginationIndexBeforeOldSelectedIndex.classList.contains('active')).toBe(true);
        });

        it('should trigger the onchangepage callback', function() {
            var previousButton = this.element.querySelector(PREVIOUS_BUTTON);

            utils.click(previousButton.querySelector('a'));
            this.scope.$digest();

            expect(this.scope.onchangepage).toHaveBeenCalledWith(4);
        });
    });

    describe('when the next button is clicked', function() {
        it('should highlight the next page', function() {
            var nextButton = this.element.querySelector(NEXT_BUTTON);

            utils.click(nextButton.querySelector('a'));
            this.scope.$digest();

            var paginationIndexAfterOldSelectedIndex = this.element.querySelector(PAGINATION_INDEX_REVERSE+'(5)');
            expect(paginationIndexAfterOldSelectedIndex.classList.contains('active')).toBe(true);
        });

        it('should trigger the onchangepage callback', function() {
            var nextButton = this.element.querySelector(NEXT_BUTTON);

            utils.click(nextButton.querySelector('a'));
            this.scope.$digest();

            expect(this.scope.onchangepage).toHaveBeenCalledWith(6);
        });
    });

    describe('when a page size is clicked', function() {
        it('should highlight the new page size', function() {
            var greatestPageSizeOption = this.element.querySelector(PAGE_SIZE_LARGEST);

            utils.click(greatestPageSizeOption.querySelector('a'));
            this.scope.$digest();

            greatestPageSizeOption = this.element.querySelector(PAGE_SIZE_LARGEST);
            expect(greatestPageSizeOption.classList.contains('active')).toBe(true);

        });

        it('should trigger the onchangesize callback', function() {
            var greatestPageSizeOption = this.element.querySelector(PAGE_SIZE_LARGEST);

            utils.click(greatestPageSizeOption.querySelector('a'));
            this.scope.$digest();

            expect(this.scope.onchangesize).toHaveBeenCalledWith(50);
        });
        it('should trigger the change total number of pages', function() {
            var greatestPageSizeOption = this.element.querySelector(PAGE_SIZE_LARGEST);
            utils.click(greatestPageSizeOption.querySelector('a'));
            this.scope.$digest();

            var lastPage = this.element.querySelector(PAGINATION_INDEX_REVERSE+'(2)');

            expect(lastPage.textContent).toMatch(/5/);
        });
    });

    describe('when the active page size is clicked', function() {
        it('should do nothing', function() {
            var secondLargestPageSizeOption = this.element.querySelector(PAGE_SIZE_NTH+'(2)');

            expect(secondLargestPageSizeOption.classList.contains('active')).toBe(true);

            utils.click(secondLargestPageSizeOption.querySelector('a'));
            this.scope.$digest();

            secondLargestPageSizeOption = this.element.querySelector(PAGE_SIZE_NTH+'(2)');
            expect(secondLargestPageSizeOption.classList.contains('active')).toBe(true);
        });
    });

    describe('when setting page outside of the given range', function() {
        it('should default to greatest page when greater than it', function() {
            this.scope.pager.page = 100;
            this.scope.$digest();
            
            expect(this.scope.pager.page).toEqual(1)
        });
        it('should default to first page when negative than it', function() {
            this.scope.pager.page = -1;
            this.scope.$digest();
            this.scope.$digest();
            
            expect(this.scope.pager.page).toEqual(1)
        });
    });

    describe('when the total item count is updated', function() {
        it('should display the updated total item count', function() {
            var totalNumberOfItemsSpan;

            this.scope.pager.count = 450;
            this.scope.$digest();

            totalNumberOfItemsSpan = this.element.querySelector(TOTAL_ITEMS_SPAN);
            expect(totalNumberOfItemsSpan.textContent).toMatch(new RegExp(this.scope.pager.count));
        });

        it('should update the pagination controls', function() {
            var highestPaginationIndex;

            this.scope.pager.count = 500;
            this.scope.$digest();

            highestPaginationIndex = this.element.querySelector(PAGINATION_INDEX_REVERSE+'(2)');
            expect(highestPaginationIndex.textContent).toMatch(/20/);
        });
    });

    describe('after rendering', function() {
        it('should translated result label display correctly', function() {
            var totalNumberOfItemsSpan;

            this.timeout.flush();
            this.scope.$digest();

            totalNumberOfItemsSpan = this.element.querySelector(TOTAL_ITEMS_SPAN);
            expect(totalNumberOfItemsSpan.textContent).toMatch(/Results: /);
        });

        it('should translated show entries label display correctly', function() {
            var showEntriesSpan;

            this.timeout.flush();
            this.scope.$digest();

            showEntriesSpan = this.element.querySelector('.page-size').childNodes[1];
            expect(showEntriesSpan.textContent).toMatch(/Show Entries: /);
        });
    });
});
