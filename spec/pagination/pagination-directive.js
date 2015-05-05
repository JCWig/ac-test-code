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
var LIBRARY_PATH = /\/libs\/akamai-core\/[0-9]*.[0-9]*.[0-9]*\/locales\/en_US.json/;
var CONFIG_PATH = '/apps/appname/locales/en_US.json';
var PREVIOUS_BUTTON = '.pagination li:first-child';
var NEXT_BUTTON = '.pagination li:last-child';
var TOTAL_ITEMS_SPAN = '.total-items';
var PAGINATION_INDEX_NTH = '.pagination li:nth-child';
var PAGINATION_INDEX_REVERSE = '.pagination li:nth-last-child';
var PAGE_SIZE_SMALLEST = '.page-size li:first-child';
var PAGE_SIZE_LARGEST = '.page-size li:last-child';
var PAGE_SIZE_NTH = '.page-size li:nth-child';
var PAGE_SIZES = '.page-size li';
describe('akam-pagination directive', function() {
  var compile = null;
  var self = this;
  beforeEach(function() {
    angular.mock.module(require('../../src/pagination').name);
    angular.mock.module(function($provide, $translateProvider) {
      $translateProvider.useLoader('i18nCustomLoader');
    });
    inject(function($compile, $rootScope, $timeout, $httpBackend) {
      self.scope = $rootScope.$new();
      self.timeout = $timeout;
      compile = $compile;
      $httpBackend.when('GET', LIBRARY_PATH).respond(translationMock);
      $httpBackend.when('GET', CONFIG_PATH).respond({});
      $httpBackend.flush();
    });
    var markup = '<akam-pagination total-items="pager.count" ' +
      'current-page="pager.page" onchangepage="onchangepage(page)" ' +
      'page-size="pager.size" onchangesize="onchangesize(size)">' +
      '</akam-pagination>';
    self.scope.onchangepage = function(page) {};
    self.scope.onchangesize = function(size) {};
    spyOn(self.scope, "onchangepage");
    spyOn(self.scope, "onchangesize");
    self.scope.pager = {
      count: 220,
      page: 5,
      size: 25
    };
    addElement(markup);
  });
  function addElement(markup) {
    self.el = compile(markup)(self.scope);
    self.scope.$digest();
    self.element = document.body.appendChild(self.el[0]);
  }

  afterEach(function() {
    if (self.element) {
      document.body.removeChild(self.element);
      self.element = null;
    }
  });
  describe('when rendering', function() {
    it('should display the total item count', function() {
      var totalNumberOfItemsSpan = self.element.querySelector(TOTAL_ITEMS_SPAN);
      expect(totalNumberOfItemsSpan.textContent).toMatch(new RegExp(self.scope.pager.count));
    });

    it('should highlight the current active page', function() {
      var currentPageThatIsActivate = self.element.querySelector('.pagination li.active');
      expect(currentPageThatIsActivate.textContent).toMatch(new RegExp(self.scope.pager.page));
    });

    it('should display a previous button', function() {
      var previousPageButtonIcon = self.element.querySelector(PREVIOUS_BUTTON + ' i');
      expect(previousPageButtonIcon.classList.contains('luna-arrow_smLeft')).toBe(true);
    });

    it('should display a next button', function() {
      var nextPageButtonIcon = self.element.querySelector(NEXT_BUTTON + ' i');
      expect(nextPageButtonIcon.classList.contains('luna-arrow_smRight')).toBe(true);
    });

    it('should display the first page', function() {
      var firstPageIndex = self.element.querySelector(PAGINATION_INDEX_NTH + '(2)');
      expect(firstPageIndex.textContent).toContain("1");
    });

    it('should display the last page', function() {
      var finalPageIndex = self.element.querySelector(PAGINATION_INDEX_REVERSE + '(2)');
      expect(finalPageIndex.textContent).toContain("9");
    });

    it('should display pages', function() {
      var pageIndexesAndForwardBackWardButtons;

      self.scope.pager.count = 53;
      self.scope.pager.page = 2;
      self.scope.$digest();

      // the list contains 3 pages and the next/previous buttons
      pageIndexesAndForwardBackWardButtons = self.element.querySelectorAll('.pagination li');
      expect(pageIndexesAndForwardBackWardButtons.length).toEqual(3 + 2);
    });

    it('should display a maximum of seven pages', function() {
      var pageIndexesAndForwardBackWardButtons = self.element.querySelectorAll('.pagination li');

      // the list contains 2 ellipsis and the next/previous buttons in
      // addition to the 7 maximum pages
      expect(pageIndexesAndForwardBackWardButtons.length).toEqual(7 + 2 + 2);
    });

    it('should display the page size options', function() {
      var pageSizeOptions = self.element.querySelectorAll(PAGE_SIZES);
      expect(pageSizeOptions.length).toEqual(3);
    });

    describe('when the page size is set to null or NaN', function() {
      it('should default to 10', function() {
        var pageSizeTen;

        self.scope.pager.size = null;
        self.scope.$digest();

        pageSizeTen = self.element.querySelector(PAGE_SIZE_SMALLEST);
        expect(pageSizeTen.classList.contains('active')).toBe(true);
      });
      it('should default to 10', function() {
        var pageSizeTen;

        self.scope.pager.size = "Hello";
        self.scope.$digest();

        pageSizeTen = self.element.querySelector(PAGE_SIZE_SMALLEST);
        expect(pageSizeTen.classList.contains('active')).toBe(true);
      });
    });

    describe('when the current page is not set', function() {
      it('should default to the first page', function() {
        var firstPageIndex;

        self.scope.pager.page = null;
        self.scope.$digest();

        firstPageIndex = self.element.querySelector(PAGINATION_INDEX_NTH + '(2)');
        expect(firstPageIndex.classList.contains('active')).toBe(true);
      });
    });

    describe('when total item count is less than two pages', function() {
      beforeEach(function() {
        self.scope.pager.count = 9;
        self.scope.pager.size = 10;
        self.scope.$digest();
      });

      it('should display only 1 page', function() {
        var pageOneIndex = self.element.querySelector('.pagination li.active');
        expect(pageOneIndex.textContent).toContain("1");
      });
      it('should disable previous and forward arrows', function() {
        var nextButton = self.element.querySelector(NEXT_BUTTON);
        var previousButton = self.element.querySelector(PREVIOUS_BUTTON);

        expect(nextButton.classList.contains('disabled')).toBe(true);
        expect(previousButton.classList.contains('disabled')).toBe(true);
      });

      it('should not hide page size options', function() {
        var pageSizeOptions = self.element.querySelector('.page-size');
        expect(pageSizeOptions).not.toBe(null);
      });

      it('should display the the total item count', function() {
        var totalNumberOfItemsSpan = self.element.querySelector(TOTAL_ITEMS_SPAN);
        expect(totalNumberOfItemsSpan).not.toBe(null);
      });
    });

    describe('when total item count is less than a page size', function() {
      it('should not disable the page size', function() {
        var pageSizes;
        var smallestPageSizeOption;
        var secondSmallestPageSizeOption;
        self.scope.pager.count = 24;
        self.scope.pager.size = 10;
        self.scope.$digest();

        pageSizes = self.element.querySelectorAll(PAGE_SIZES);
        smallestPageSizeOption = pageSizes[0];
        secondSmallestPageSizeOption = pageSizes[1];

        expect(smallestPageSizeOption.classList.contains('disabled')).toBe(false);
        expect(secondSmallestPageSizeOption.classList.contains('disabled')).toBe(false);

        utils.click(secondSmallestPageSizeOption.querySelector('a'));
        secondSmallestPageSizeOption = self.element.querySelector(PAGE_SIZE_NTH + '(2)');

        expect(secondSmallestPageSizeOption.classList.contains('active')).toBe(true);
      });
    });
    describe('when total item count is 0 ', function() {
      it('should show one page', function() {
        self.scope.pager.count = 0;
        self.scope.pager.size = 10;
        self.scope.$digest();

        var pageOneIndex = self.element.querySelector('.pagination li.active');
        expect(pageOneIndex.textContent).toContain("1");
      });
      it('should still be able to change page size', function() {
        self.scope.pager.count = 0;
        self.scope.pager.size = 10;
        self.scope.$digest();

        var pageSizes = self.element.querySelectorAll(PAGE_SIZES);
        var smallestPageSizeOption = pageSizes[0];
        var secondSmallestPageSizeOption = pageSizes[1];

        expect(smallestPageSizeOption.classList.contains('disabled')).toBe(false);
        expect(secondSmallestPageSizeOption.classList.contains('disabled')).toBe(false);

        utils.click(secondSmallestPageSizeOption.querySelector('a'));
        secondSmallestPageSizeOption = self.element.querySelector(PAGE_SIZE_NTH + '(2)');

        expect(secondSmallestPageSizeOption.classList.contains('active')).toBe(true);

        var pageOneIndex = self.element.querySelector('.pagination li.active');
        expect(pageOneIndex.textContent).toContain("1");
      });
    });
    describe('when total item count is changed to less than 0 ', function() {
      it('should change to zero', function() {
        self.scope.pager.count = 1;
        self.scope.pager.size = 10;
        self.scope.$digest();
        self.scope.pager.count = -11;
        self.scope.$digest();
        expect(self.scope.pager.count).toEqual(0);
      });
      it('should change starting value to zero', function() {
        self.scope.pager.count = -11;
        self.scope.pager.size = 10;
        self.scope.$digest();
        expect(self.scope.pager.count).toEqual(0);
      });

    });

    describe('when the last page is the current page', function() {
      it('should disable the next button', function() {
        var nextButton = self.element.querySelector(NEXT_BUTTON);

        expect(nextButton.classList.contains('disabled')).toBe(false);

        self.scope.pager.page = 9;
        self.scope.$digest();

        nextButton = self.element.querySelector(NEXT_BUTTON);
        expect(nextButton.classList.contains('disabled')).toBe(true);
      });
    });

    describe('when the first page is the current page', function() {
      it('should disable the previous button', function() {
        var previousButton = self.element.querySelector(PREVIOUS_BUTTON);

        expect(previousButton.classList.contains('disabled')).toBe(false);

        self.scope.pager.page = 1;
        self.scope.$digest();

        previousButton = self.element.querySelector(PREVIOUS_BUTTON);
        expect(previousButton.classList.contains('disabled')).toBe(true);
      });
    });

    describe('when the current page is > 3 away from the first', function() {
      it('should display an ellipsis after the first page', function() {
        var thirdClickablePaginationIndex = self.element.querySelector(PAGINATION_INDEX_NTH + '(3)');

        expect(thirdClickablePaginationIndex.textContent).toEqual(String.fromCharCode(8230));

        self.scope.pager.page = 3;
        self.scope.$digest();

        thirdClickablePaginationIndex = self.element.querySelector(PAGINATION_INDEX_NTH + '(3)');
        expect(thirdClickablePaginationIndex.textContent).not.toEqual(String.fromCharCode(8230));
      });
    });

    describe('when the current page is > 3 away from the last', function() {
      it('should display an ellipsis before the last page', function() {
        var thirdToLastClickablePaginationIndex =
          self.element.querySelector(PAGINATION_INDEX_REVERSE + '(3)');

        expect(thirdToLastClickablePaginationIndex.textContent).toEqual(String.fromCharCode(8230));

        self.scope.pager.page = 7;
        self.scope.$digest();

        thirdToLastClickablePaginationIndex = self.element.querySelector(PAGINATION_INDEX_REVERSE + '(3)');
        expect(thirdToLastClickablePaginationIndex.textContent).not.toEqual(String.fromCharCode(8230));
      });
    });
  });

  describe('when a page is clicked', function() {
    it('should highlight the clicked page', function() {
      var fourthClickablePaginationIndex = self.element.querySelector(PAGINATION_INDEX_NTH + '(4)');

      expect(fourthClickablePaginationIndex.classList.contains('active')).toBe(false);

      utils.click(fourthClickablePaginationIndex.querySelector('a'));
      self.scope.$digest();

      fourthClickablePaginationIndex = self.element.querySelector(PAGINATION_INDEX_NTH + '(4)');
      expect(fourthClickablePaginationIndex.classList.contains('active')).toBe(true);
    });

    it('should trigger the onchangepage callback', function() {
      var fourthClickablePaginationIndex = self.element.querySelector(PAGINATION_INDEX_NTH + '(4)');

      utils.click(fourthClickablePaginationIndex.querySelector('a'));
      self.scope.$digest();

      expect(self.scope.onchangepage).toHaveBeenCalledWith(3);
    });
  });

  describe('when an active page is clicked', function() {
    it('should do nothing', function() {
      var sixthClickablePaginationIndex = self.element.querySelector(PAGINATION_INDEX_NTH + '(6)');

      expect(sixthClickablePaginationIndex.classList.contains('active')).toBe(true);

      utils.click(sixthClickablePaginationIndex.querySelector('a'));
      self.scope.$digest();

      expect(self.scope.onchangepage).not.toHaveBeenCalled();
    });
  });

  describe('when the previous button is clicked', function() {
    it('should highlight the previous page', function() {
      var previousButton = self.element.querySelector(PREVIOUS_BUTTON);

      utils.click(previousButton.querySelector('a'));
      self.scope.$digest();

      var paginationIndexBeforeOldSelectedIndex = self.element.querySelector(PAGINATION_INDEX_NTH + '(5)');
      expect(paginationIndexBeforeOldSelectedIndex.classList.contains('active')).toBe(true);
    });

    it('should trigger the onchangepage callback', function() {
      var previousButton = self.element.querySelector(PREVIOUS_BUTTON);

      utils.click(previousButton.querySelector('a'));
      self.scope.$digest();

      expect(self.scope.onchangepage).toHaveBeenCalledWith(4);
    });
  });

  describe('when the next button is clicked', function() {
    it('should highlight the next page', function() {
      var nextButton = self.element.querySelector(NEXT_BUTTON);

      utils.click(nextButton.querySelector('a'));
      self.scope.$digest();

      var paginationIndexAfterOldSelectedIndex = self.element.querySelector(PAGINATION_INDEX_REVERSE + '(5)');
      expect(paginationIndexAfterOldSelectedIndex.classList.contains('active')).toBe(true);
    });

    it('should trigger the onchangepage callback', function() {
      var nextButton = self.element.querySelector(NEXT_BUTTON);

      utils.click(nextButton.querySelector('a'));
      self.scope.$digest();

      expect(self.scope.onchangepage).toHaveBeenCalledWith(6);
    });
  });

  describe('when a page size is clicked', function() {
    it('should highlight the new page size', function() {
      var greatestPageSizeOption = self.element.querySelector(PAGE_SIZE_LARGEST);

      utils.click(greatestPageSizeOption.querySelector('a'));
      self.scope.$digest();

      greatestPageSizeOption = self.element.querySelector(PAGE_SIZE_LARGEST);
      expect(greatestPageSizeOption.classList.contains('active')).toBe(true);

    });

    it('should trigger the onchangesize callback', function() {
      var greatestPageSizeOption = self.element.querySelector(PAGE_SIZE_LARGEST);

      utils.click(greatestPageSizeOption.querySelector('a'));
      self.scope.$digest();

      expect(self.scope.onchangesize).toHaveBeenCalledWith(50);
    });
    it('should trigger the change total number of pages', function() {
      var greatestPageSizeOption = self.element.querySelector(PAGE_SIZE_LARGEST);
      utils.click(greatestPageSizeOption.querySelector('a'));
      self.scope.$digest();

      var lastPage = self.element.querySelector(PAGINATION_INDEX_REVERSE + '(2)');
      expect(lastPage.textContent).toContain("5");
    });
    it('should change to greatest page if switching to a page that is greater than the new maximum', function() {
      var smallestPageSizeOption = self.element.querySelector(PAGE_SIZE_SMALLEST);
      var greatestPageSizeOption = self.element.querySelector(PAGE_SIZE_LARGEST);
      utils.click(smallestPageSizeOption.querySelector('a'));
      self.scope.$digest();

      var lastPage = self.element.querySelector(PAGINATION_INDEX_REVERSE + '(2)');
      utils.click(lastPage.querySelector('a'));
      self.scope.$digest();

      expect(lastPage.textContent).toContain("22");
      expect(lastPage.classList.contains('active')).toBe(true);

      utils.click(greatestPageSizeOption.querySelector('a'));
      self.scope.$digest();

      expect(lastPage.textContent).toContain("5");
      expect(lastPage.classList.contains('active')).toBe(true);
    });
  });

  describe('when the active page size is clicked', function() {
    it('should do nothing', function() {
      var secondLargestPageSizeOption = self.element.querySelector(PAGE_SIZE_NTH + '(2)');

      expect(secondLargestPageSizeOption.classList.contains('active')).toBe(true);

      utils.click(secondLargestPageSizeOption.querySelector('a'));
      self.scope.$digest();

      secondLargestPageSizeOption = self.element.querySelector(PAGE_SIZE_NTH + '(2)');
      expect(secondLargestPageSizeOption.classList.contains('active')).toBe(true);
    });
  });

  describe('when setting page outside of the given range', function() {
    it('should default to greatest page when greater than it', function() {
      self.scope.pager.page = 100;
      self.scope.$digest();

      expect(self.scope.pager.page).toEqual(9);
    });
    it('should default to first page when negative than it', function() {
      self.scope.pager.page = -1;
      self.scope.$digest();
      self.scope.$digest();

      expect(self.scope.pager.page).toEqual(1);
    });
  });

  describe('when the total item count is updated', function() {
    it('should display the updated total item count', function() {
      var totalNumberOfItemsSpan;

      self.scope.pager.count = 450;
      self.scope.$digest();

      totalNumberOfItemsSpan = self.element.querySelector(TOTAL_ITEMS_SPAN);
      expect(totalNumberOfItemsSpan.textContent).toMatch(new RegExp(self.scope.pager.count));
    });

    it('should update the pagination controls', function() {
      var highestPaginationIndex;

      self.scope.pager.count = 500;
      self.scope.$digest();

      highestPaginationIndex = self.element.querySelector(PAGINATION_INDEX_REVERSE + '(2)');
      expect(highestPaginationIndex.textContent).toContain("20");
    });
  });

  describe('after rendering', function() {
    it('should translated result label display correctly', function() {
      var totalNumberOfItemsSpan;

      self.timeout.flush();
      self.scope.$digest();

      totalNumberOfItemsSpan = self.element.querySelector(TOTAL_ITEMS_SPAN);
      expect(totalNumberOfItemsSpan.textContent).toContain("Results: ");
    });

    it('should translated show entries label display correctly', function() {
      var showEntriesSpan;

      self.timeout.flush();
      self.scope.$digest();

      showEntriesSpan = self.element.querySelector('.page-size').childNodes[1];
      expect(showEntriesSpan.textContent).toContain("Show Entries: ");
    });
  });
  describe('when changing html inputs', function() {
    it('should throw angular error if current page not given', function() {
      var markup = '<akam-pagination total-items="pager.count" ' +
        'onchangepage="onchangepage(page)" ' +
        'page-size="pager.size" onchangesize="onchangesize(size)">' +
        '</akam-pagination>';
      try {
        addElement(markup);
      } catch (e) {
        expect(e.message).toContain('errors.angularjs');
      }
    });
    it('should default to 10 page size if none provided', function() {
      var markup = '<akam-pagination total-items="pager.count" ' +
        'current-page="pager.page" onchangepage="onchangepage(page)" ' +
        'onchangesize="onchangesize(size)">' +
        '</akam-pagination>';
      try {
        addElement(markup);
      } catch (e) {
        expect(e.message).toContain('errors.angularjs');
      }
    });
    it('should not be able to change pages if no onchangepage provided', function() {
      self.scope.pager.page = 1;
      var markup = '<akam-pagination total-items="pager.count" ' +
        'current-page="pager.page" ' +
        'page-size="pager.size" onchangesize="onchangesize(size)">' +
        '</akam-pagination>';
      addElement(markup);
      var thirdClickablePaginationIndex = self.element.querySelector(PAGINATION_INDEX_NTH + '(3)');

      utils.click(thirdClickablePaginationIndex);
      self.scope.$digest();

      var pageOneIndex = self.element.querySelector('.pagination li.active');
      expect(pageOneIndex.textContent).toContain("1");
    });
    it('should not be able to change page size if no onchangesize provided', function() {
      self.scope.pager.size = 10;
      var markup = '<akam-pagination total-items="pager.count" ' +
        'current-page="pager.page" onchangepage="onchangepage(page)" ' +
        'page-size="pager.size" >' +
        '</akam-pagination>';
      addElement(markup);

      var pageSizeTen = self.element.querySelector(PAGE_SIZE_SMALLEST);
      expect(pageSizeTen.classList.contains('active')).toBe(true);

      utils.click(PAGE_SIZE_LARGEST);
      self.scope.$digest();

      expect(pageSizeTen.classList.contains('active')).toBe(true);
    });
  });
});