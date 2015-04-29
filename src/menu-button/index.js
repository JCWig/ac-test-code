'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 *
 * @name akamai.components.menu-button
 *
 * @description Provides a set of directives to use in order to
 * create Pulsar-compatible menu buttons.
 *
 */
module.exports = angular.module('akamai.components.menu-button', [
  require('angular-bootstrap-npm')
])

/**
 * @ngdoc directive
 *
 * @name akamai.components.menu-button.directive:akamMenuButton
 *
 * @description Creates a menu button control.
 *
 * @restrict E
 *
 * @param {String} [label=""] The label to use for the menu button.
 *
 * @example
 * <example module="menuButtonDemo">
 * <file name="index.html" >
 * <div ng-controller="Ctrl" class="common-css">
 *   <akam-menu-button label="Choose an application to navigate to">
 *     <akam-menu-button-item ng-repeat="item in items track by item.id"
 *        text="{{item.appName}}" ng-click="process(item)"></akam-menu-button-item>
 *   </akam-menu-button>
 * </div>
 * </file>
 * <file name="Ctrl.js">
 *   var app = angular.module("menuButtonDemo", ["akamai.components.menu-button"]);
 *   app.controller("Ctrl", function($scope, $log) {
     *    $scope.items = [
     *      { appName : 'Tranquility', id : 'tranq' },
     *      { appName : 'Billing Center', id : 'bc' },
     *      { appName : 'Property Manager', id : 'pm' }
     *    ];
     *
     *    $scope.process = function(item){
     *       $log.info('you clicked on the the app: ' + item.appName + '. AppId: ' + item.id);
     *    };
     *   });
 * </file>
 * </example>
 *
 */
  .directive('akamMenuButton', require('./menu-button-directive'))

/**
 * @ngdoc directive
 *
 * @name akamai.components.menu-button.directive:akamMenuButtonItem
 *
 * @description Creates a menu button item within the menu button
 * control.
 *
 * @restrict E
 *
 * @param {String} [label=""] The label to use for the menu.
 *
 * @example see {@link akamai.components.menu-button.directive:akamMenuButton}
 *
 **/
  .directive('akamMenuButtonItem', require('./menu-button-item-directive')({
    require: 'akamMenuButton'
  }));
