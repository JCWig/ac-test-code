import angular from 'angular';
import ngAnimate from 'angular-animate';
import ProgressBarDirective from './progress-bar-directive';
import bootstrap from 'angular-bootstrap-npm';
import i18n from '../i18n';

/**
* @ngdoc module
* @name akamai.components.deterimate-progress
* @image progress-bar
*
* @description
* A progress bar directive that is focused on providing
* feedback on the progress of a workflow or action.
* This component could be presented in a pop-up window, or inline within a component or page.
*
* @guideline Use progress bars only when progress can be accurately assessed and when
* the operation will likely take more than five seconds.
* @guideline Provide message to users to describe progress towards end state
*
* @example index.html
*   <akam-progress-bar value="currentValue" max="maxValue" state="state"
*   animate={{ animate }} label="label" label-align={{ labelAlign }}></akam-progress-bar>
*
* @example index.js
* var controllerFunction = function($scope) {
*   $scope.currentValue = '45';
*   $scope.maxValue = '100';
*   $scope.state = '';
*   $scope.animate = 'true';
*   $scope.label = '45% Complete';
*   $scope.labelAlign = 'left';
* };
* controllerFunction.$inject = ['$scope'];
* var app = angular.module("progressBarDemo",
*   ["akamai.components.progress-bar"]);
*
* app.controller("Ctrl", controllerFunction);
*
*/
export default angular.module('akamai.components.progress-bar', [
  ngAnimate,
  bootstrap,
  i18n.name
  ])

/**
* @ngdoc directive
*
* @name akamProgressBar
*
* @description Creates a determinate progress bar control
*
* @restrict E
*
* @param {Number} value The current value of progress completed.
*
* @param {Number} max A number that specifies the total value of bars that is required.
* If omitted, the value of max will default to 100.
*
* @param {String} state The current state of the progress bar.
* When an error occurs, change the state to 'error' and
* update the label to an appropriate error message.
* When the progress is completed, state will automatically change to 'completed'.
*
* @param {String} label The descriptive text under progress bar.
* If omitted, no text will be displayed under the progress bar.
* Will apply i18n translation on label.
*
* @param {String} label-align='left' The label position under the progress bar.
* Possible values are 'left', 'center' and 'right'.
*
* @param {Boolean} animate When animate is true, progress bar is animated
* with moving strips and updated in real-time. If omitted, defaults to false.
*/
.directive('akamProgressBar', ProgressBarDirective);