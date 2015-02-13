'use strict';

var angular = require('angular');

    /**
    * @ngdoc overview
    *
    * @name akamai.components.status-message
    *
    * @description Provides a directive that creates Luna- and
    * Pulsar-compatible status messages. These provide users with
    * unobtrusive, transient feedback on their actions and emerging
    * system conditions, but without interrupting their workflow.
    *
    */
    module.exports = angular.module('akamai.components.status-message', [])

    /**
     * @ngdoc directive
     *
     * @name akamai.components.status-message.directive:akamStatusMessage
     *
     * @description Creates a status message control.
     *
     * @restrict E
     *
     * @param {String} [text=''] The text to display.
     *
     * @param {String} [title=''] The title to display.
     *
     * @example This example shows the minimum configuration needed to
     * initialize a `akamStatusMessage` component.
     *
     * <example module="statusMessageDemo">
     * <file name="index.html">
     * <div ng-controller="Ctrl" class="common-css">
     *   <div style="height: 100px;">
     *       <akam-status-message text="Loading your property version" title="some title"></akam-status-message>
     *   </div>
     * </div>
     * </file>
     * <file name="Ctrl.js">
     *   var app = angular.module("statusMessageDemo", ["akamai.components.status-message"]);
     *   app.controller("Ctrl", ["$scope", "$timeout", function($scope, $timeout) {
     *   }]);
     * </file>
     * </example>
     *
     */
.directive("akamStatusMessage", require('./status-message-directive'))

    /**
     * @ngdoc directive
     *
     * @name akamai.components.status-message.directive:akamStatusMessageGroup
     *
     * @description Creates a status message group control.
     *
     * @restrict E
     *
     * @param {Array} [items=empty array] Status message object items
     * to display.
     *
     * @example This example shows the minimum configuration needed to
     * initialize a `akamStatusMessageGroup` component.
     *
     * <example module="statusMessageDemo">
     * <file name="index.html">
     * <div ng-controller="Ctrl" class="common-css">
     *   <div style="height: 100px;">
     *       <akam-status-message-group items={{items}}></akam-status-message-group>
     *   </div>
     * </div>
     * </file>
     * <file name="Ctrl.js">
     *   var app = angular.module("statusMessageDemo", ["akamai.components.status-message"]);
     *   app.controller("Ctrl", ["$scope", function($scope) {
     *     $scope.items = [{title: "congrats", text: "you won the lottery", timeout: 0, itemId: 'congrats-message'}}];
     *   }]);
     * </file>
     * </example>
     *
     */
.directive("akamStatusMessageGroup", require('./status-message-group-directive'))
    
    /**
     * @ngdoc object
     *
     * @name akamai.components.status-message.statusMessage
     *
     * @object
     *
     * @description Displays an action's status.
     *
     * @example
        <example module="statusMessageServiceDemo">
            <file name="statusMessage-demo.html">
                <body ng-app="statusMessageServiceDemo" style="margin: 200px;" class="common-css">
                    <div ng-controller="Ctrl">
                        <button class="button" ng-click="submit()">Show notification</button>
                    </div>
            </file>
            
            <file name="Ctrl.js">
                var app = angular.module("statusMessageServiceDemo", ["akamai.components.status-message"]);
                app.controller("Ctrl", ["$scope", "statusMessage", function($scope, statusMessage) {
                    $scope.submit = function(){
                        statusMessage.show({text: 'Recent action successful'});
                    };
                }]);
           </file>
        </example>
     */
.factory('statusMessage', require('./status-message-service'));
