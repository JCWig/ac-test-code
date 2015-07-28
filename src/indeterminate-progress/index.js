import angular from 'angular';
import indeterminateProgress from './indeterminate-progress';

const MODULE_NAME = 'akamai.components.indeterminate-progress';

/**
 * @ngdoc module
 *
 * @name akamai.components.indeterminate-progress
 * @display Indeterminate Progress
 *
 * @description Provides a directive that creates Luna- and
 * Pulsar-compatible indeterminate progress elements. These
 * elements provide users feedback that an operation is in progress,
 * status of which can't be accurately measured.
 *
 */
export default angular.module(MODULE_NAME, [])

/**
 * @ngdoc directive
 *
 * @name akamai.components.indeterminate-progress.directive:akamIndeterminateProgress
 *
 * @description Creates an indeterminate progress control
 *
 * @restrict AE
 *
 * @param {String} label The label to display beneath the
 * spinner.  If omitted, the label does not display.
 *
 * @param {Boolean} [failed=false] Indicates if the indeterminate
 * progress encountered a `failed` state.
 *
 * @param {Boolean} [completed=false] Indicates if the
 * indeterminate progress encountered a `completed` state.
 *
 */
  .directive('akamIndeterminateProgress', indeterminateProgress);
