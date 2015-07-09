var angular = require('angular');

require('angular-sanitize');

/**
 * @ngdoc overview
 *
 * @name akamai.components.list-box
 *
 * @description Provides a directive that creates a Luna- and
 * Pulsar-compatible list box.
 *
 */
module.exports = angular.module('akamai.components.list-box', [
  'ngSanitize',
  require('../uuid').name,
  require('../indeterminate-progress').name,
  require('../i18n').name,
  require('../utils').name
])

/**
 * @ngdoc directive
 *
 * @name akamai.components.list-box.directive:akamListBox
 *
 * @description Creates a list box control.
 *
 * @restrict E
 *
 * @param {Array|Promise} data The array of data to show within
 * the listbox.  If `data` is a promise, an indeterminate progress
 * control displays in place of the contents until the promise is
 * resolved or rejected. Note that the data is bound to the table
 * cells with `ng-bind-html` and thus runs through ngSanitize.
 * Any unsafe content that needs to be trusted must run through
 * `$sce.trustAs` on the consumer's side.
 *
 * @param {Array} columns The array of columns that describes the
 * schema to the list box layout and formatting.
 *
 */
  .directive('akamListBox', require('./list-box-directive'))

  .directive('akamInfiniteScroll', require('./infinite-scroll-directive'));
