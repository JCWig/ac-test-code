import angular from 'angular';
import indeterminateProgressDirective from './indeterminate-progress-directive';
import i18n from '../i18n';

/**
 * @ngdoc module
 * @name akamai.components.indeterminate-progress
 * @image indeterminate-progress
 *
 * @description
 * Indeterminate progress indicator provides feedback to the user that an operation is
 * in progress when status information cannot be accurately measured.
 * This component can be accompanied by a message about the ongoing activity.
 *
 * @guideline Use progress spinner that are appropriate in size for space that is
 * waiting system response
 * @guideline Set timeout for spinners used.
 * @guideline Provide messaging to users when possible when there is an error with loading data.
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
export default angular.module('akamai.components.indeterminate-progress', [
  i18n.name
])

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
 * spinner.  If omitted, the label does not display. Will apply i18n translation
 * on label.
 *
 * @param {Boolean} [failed=false] Indicates if the indeterminate
 * progress encountered a `failed` state.
 *
 * @param {Boolean} [completed=false] Indicates if the
 * indeterminate progress encountered a `completed` state.
 *
 */
  .directive('akamIndeterminateProgress', indeterminateProgressDirective);
