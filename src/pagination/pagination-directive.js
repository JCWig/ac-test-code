import template from './templates/pagination.tpl.html';

const [MAX_PAGES, DEFAULT_SIZE] = [7, 10];
const SIZES = [10, 25, 50];

class PaginationController {
  constructor(scope, translate) {
    this.translate = translate;
    this.scope = scope;
    this.sizes = SIZES;
    this.maxPages = MAX_PAGES;
    this.pages = [];
    this.resultText = '';

    this.translate.async('components.pagination.label.results')
      .then((value) => {
        scope.pagination.resultText = value;
      });

    //watch collections?
    this.scope.$watch(
      '[pagination.totalItems, pagination.currentPage, pagination.pageSize]', (val, old) => {
        if (val[0] < 0) {
          this.totalItems = 0;
          val = [0, val[1], val[2]];
        }
        if (val !== old) {
          this.update();
        }
      });

    this.update();
  }

  inBounds(page) {
    return page >= 1 && page <= this.totalPages;
  }

  isValidSize(size) {
    return this.sizes.some((item) => {
      return size === item;
    });
  }

  // TODO look at eliminating double update when setting default values
  update() {
    let start, count;

    // setup page size
    this.pageSize = parseInt(this.pageSize, 10);
    if (this.pageSize == null || !this.isValidSize(this.pageSize)) {
      this.pageSize = DEFAULT_SIZE;
    }

    // setup total page count
    this.totalPages = Math.ceil(
      parseInt(this.totalItems, 10) / this.pageSize);
    if (isNaN(this.totalPages) || this.totalPages <= 0) {
      this.totalPages = 1;
    }
    // setup current page
    this.currentPage = parseInt(this.currentPage, 10);
    if (isNaN(this.currentPage) || this.currentPage < 1) {
      this.currentPage = 1;
    } else if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;

      // this handles the case where the user increases the page size, thus decreasing the
      // number of pages. If the user is on a very high page number, they need to be notified
      // that a page change has occurred.
      this.onchangepage({
        page: this.totalPages
      });
    }

    // calculate the starting page and number of pages to display
    start = this.currentPage - Math.floor((this.maxPages - 2) / 2);
    count = this.totalPages > this.maxPages ?
      this.maxPages - 2 : this.totalPages - 2;
    // check bounds for pages
    start = start + count > this.totalPages ?
      this.totalPages - (this.maxPages - 2) : start;
    start = start >= 2 ? start : 2;
    // setup the page objects for rendering
    this.pages = [];
    for (let i = 0; i < count; i++) {
      this.pages.push({
        number: start + i,
        active: start + i === this.currentPage
      });
    }
  }

  isSizeActive(size) {
    return size === this.pageSize;
  }

  isFirstPageActive() {
    return this.currentPage === 1;
  }

  isLastPageActive() {
    return this.currentPage === this.totalPages;
  }

  showFirstPageEllipsis() {
    return this.currentPage - 1 > 3 && this.totalPages > this.maxPages;
  }

  showLastPageEllipsis() {
    return this.totalPages - this.currentPage > 3 &&
      this.totalPages > this.maxPages;
  }

  selectPage(page) {
    if (page !== this.currentPage && this.inBounds(page)) {
      this.currentPage = page;
      this.onchangepage({
        page: page
      });
    }
  }

  selectSize(size) {
    if (size !== this.pageSize) {
      this.pageSize = size;
      this.onchangesize({
        size: size
      });
    }
  }

  hasOnlyOnePage() {
    return this.totalPages === 1;
  }
}

PaginationController.$inject = ['$scope', 'translate'];

export default () => {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      totalItems: '=',
      currentPage: '=',
      pageSize: '=',
      onchangepage: '&',
      onchangesize: '&'
    },
    controller: PaginationController,
    controllerAs: 'pagination',
    template: template
  };
};
