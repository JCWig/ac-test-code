import angular from 'angular';
import textOverflowDirective from './text-overflow-directive.js';
import standaloneDirective from './standalone-directive.js';

/**
 * @ngdoc module
 * @name akamai.components.utils
 * @description Utility methods for the akamai components
 *
 * @example index.html
 * <span akam-text-overflow="vm.somethingWithALongValue">{{vm.somethingWithALongValue}}</span>
 *
 * <akam-table akam-standalone></akam-table>
 */
module.exports = angular.module('akamai.components.utils', [])

/**
 * @ngdoc directive
 *
 * @name akamTextOverflow
 *
 * @description will add a html tooltip if needed to some text
 *
 * @restrict A
 *
 * @param {String} akamTextOverflow Should be set to the value that
 * should be presented in a tooltip if needed. It default watches
 * this value so that if it changes we will update it. To avoid this
 * we recommend one time binding any text that does not change to prevent
 * additional watches.
 *
 */
  .directive('akamTextOverflow', textOverflowDirective)
/**
 * @ngdoc directive
 *
 * @name akamStandalone
 *
 * @description adds an css class (standalone) to the element
 *
 * @restrict A
 *
 */
  .directive('akamStandalone', standaloneDirective);