'use strict';

var angular = require('angular');

    /**
    * @ngdoc overview
    *
    * @name akamai.components.indeterminate-progress
    *
    * @description Provides a directive to use in order to create Luna and Pulsar compatible indeterminate progress elements.
    *
    */
    module.exports = angular.module('akamai.components.indeterminate-progress', [])

    /**
     * @ngdoc directive
     *
     * @name akamai.components.indeterminate-progress.directive:akamIndeterminateProgress
     *
     * @description Creates an indeterminate progress control
     *
     * @restrict E
     *
     * @param {String} [label=''] The label to display underneath the
     * spinner.  If omitted, the label does not display.
     *
     * @param {Boolean} [failed=false] Indicates if the indeterminate
     * progress encountered a `failed` state.
     *
     * @param {Boolean} [completed=false] Indicates if the
     * indeterminate progress encountered a `completed` state.
     *
     * @example This example shows the minimum configuration needed to
     * initialize an `indeterminateProgress` component.
     *
     * <example module="indeterminateProgressDemo">
     * <file name="index.html">
     * <div ng-controller="Ctrl" class="common-css">
     *   <div style="height: 100px;">
     *       <akam-indeterminate-progress label="Loading your property version" completed="{{completed}}"></akam-indeterminate-progress>
     *       The above spinner changes from started to completed state after 5 seconds.
     *   </div>
     * </div>
     * </file>
     * <file name="Ctrl.js">
     *   var app = angular.module("indeterminateProgressDemo", ["akamai.components.indeterminate-progress"]);
     *   app.controller("Ctrl", ["$scope", "$timeout", function($scope, $timeout) {
     *    $scope.completed = false;
     *    $timeout(function(){ $scope.completed = true; }, 5000);
     *   }]);
     * </file>
     * </example>
     *
     */
.directive("akamIndeterminateProgress", require('./indeterminate-progress'));