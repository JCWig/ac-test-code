import angular from 'angular';
import sanitize from 'angular-sanitize';
import uuid from '../uuid';
import indeterminateProgress from '../indeterminate-progress';
import i18n from '../i18n';
import utils from '../utils';
import listBoxDirective from './list-box-directive';
import infiniteScrollDirective from './infinite-scroll-directive';

module.exports = angular.module('akamai.components.list-box', [
  sanitize,
  uuid.name,
  indeterminateProgress.name,
  i18n.name,
  utils.name
])
  .directive('akamListBox', listBoxDirective)

  .directive('akamInfiniteScroll', infiniteScrollDirective);
