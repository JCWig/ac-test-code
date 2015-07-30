import angular from 'angular';
import indeterminateProgress from './indeterminate-progress';

const MODULE_NAME = 'akamai.components.indeterminate-progress';

/**
 * @ngdoc module
 *
 * @name akamai.components.indeterminate-progress
 * @guideline use this component blah
 * @guideline use this component todo
 * @guideline this is another guideline
 *
 * @description Provides a directive that creates Luna- and
 * Pulsar-compatible indeterminate progress elements. These
 * elements provide users feedback that an operation is in progress,
 * status of which can't be accurately measured.
 *
 * @example index.html
 * <div class="common-css luna">
 *   <div class="container" id="smallspinner">
 *    <akam-indeterminate-progress completed="{{completed}}" failed="{{failed}}"
 *      size="small" label="{{label}}"></akam-indeterminate-progress>
 *   </div>
 * </div>
 * @example index.js
 * var controllerFunction = function($scope) {
 *    $scope.completed = false;
 *    $scope.failed = false;
 * };
 * controllerFunction.$inject = ["$scope"];
 * var app = angular.module("indeterminateProgressDemo",
 *  ["akamai.components.indeterminate-progress"]);
 *
 * app.controller("Ctrl", controllerFunction);
 */
export default angular.module(MODULE_NAME, [])

/**
 * @ngdoc directive
 *
 * @name akamIndeterminateProgress
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
