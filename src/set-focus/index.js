import angular from 'angular';
import setFocusDirective from './set-focus-directive';

/**
 * @ngdoc module
 * @name akamai.components.set-focus
 *
 * @description
 * A utility directive that enables a developer to programmatically set focus on a
 * given element.
 */
export default angular.module('akamai.components.set-focus', [])

  /**
   * @ngdoc directive
   * @name akamSetFocus
   * @description Provides a directive to programmatically set focus on a given
   * element.
   *
   * **General Usage**
   *
   * The directive accepts a bound boolean value. When set to true, focus is set
   * and when set to false the element is blurred.
   *
   * ```
   * class MyController {
   *   constructor() {
   *     this.focusEnabled = true;
   *   }
   *   removeFocus() {
   *     this.focusEnabled = false;
   *   }
   * }
   * ```
   *
   * ```
   * <div akam-set-focus="focusEnabled"></div>
   * ```
   */
  .directive('akamSetFocus', setFocusDirective);
