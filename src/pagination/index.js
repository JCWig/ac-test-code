'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 *
 * @name akamai.components.pagination
 *
 * @description
 * Enable a user to page through a set of results and set the page size.
 */
module.exports = angular.module('akamai.components.pagination', [
    require('../i18n').name
])

/**
 * @ngdoc directive
 *
 * @name akamai.components.pagination.directive:akamPagination
 *
 * @description Creates a pagination control for displaying pages of results
 *
 * @restrict E
 *
 * @param {Number} [totalItems] The number of results in the list to page.
 * @param {Number} [currentPage=1] The currently selected page.
 * @param {Number} [pageSize=10] The page size (valid sizes include 10, 25, and 50).
 * @param {expression} [onchangepage] An angular expression to evaluate when the
 *   page changes. Page number is available as `page`.
 * @param {expression} [onchangesize] An angular expression to evaluate when the
 *   page size changes. Page size is available as `size`.
 */
.directive('akamPagination', require('./pagination-directive'));
