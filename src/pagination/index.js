var angular = require('angular');

/**
 * @ngdoc module
 * @name akamai.components.pagination
 * @image pagination
 *
 * @description
 * Pagination is a page design pattern where a large amount of content is split into
 * smaller "chunks,"
 * decreasing the load on the server to deliver a complete set of data at one request.
 * This pattern is familiar from interfaces (like search) that manage large numbers of items and
 * is often combined with a data table presentation.
 *
 * @guideline Use large targets for the next and previous buttons so they are easy to click.
 * @guideline Make sure the selected page is easy to scan.
 * @guideline Disable buttons if they cannot be clicked, rather than removing them.
 *
 * @example index.html
 * <akam-pagination
 *   total-items="pager.totalItems"
 *   current-page="pager.page"
 *   page-size="pager.size"
 *   onchangepage="pageChanged(page)">
 * </akam-pagination>
 *
 */
module.exports = angular.module('akamai.components.pagination', [
  require('../i18n').name
])

/**
 * @ngdoc directive
 *
 * @name akamPagination
 *
 * @description Creates a pagination control to display pages of results.
 *
 * @restrict E
 *
 * @param {Number} [totalItems] The number of results in the list to
 * page.
 *
 * @param {Number} [currentPage=1] The currently selected page.
 *
 * @param {Number} [pageSize=10] The page size (valid sizes include
 * 10, 25, and 50).
 *
 * @param {expression} [onchangepage] An angular expression to
 * evaluate when the page changes. Page number is available as `page`.
 *
 * @param {expression} [onchangesize] An angular expression to
 * evaluate when the page size changes. Page size is available as
 * `size`.
 *
 */
  .directive('akamPagination', require('./pagination-directive'));
