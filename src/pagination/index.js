import angular from 'angular';
import i18n from '../i18n';
import paginationDirective from './pagination-directive';

module.exports = angular.module('akamai.components.pagination', [
  i18n.name
])
  .directive('akamPagination', paginationDirective);
