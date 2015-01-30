'use strict';

var angular = require('angular');

/**
 * @ngdoc overview
 *
 * @name akamai.components.modal-window
 *
 * @description Presents a dialog to the user requiring an action to continue the
 * application workflow.
 */
module.exports = angular.module('akamai.components.modal-window', [
    require('angular-bootstrap-npm')
])

/**
 * @ngdoc service
 *
 * @name akamai.components.modal-window.service:modalWindow
 *
 * @description Provides a function to open new modal windows
 *
 * @example
 * <example module="example">
 * <file name="index.html">
 * <div ng-controller="ExampleController" class="common-css">
 *   <a href="" ng-click="open()" class="util-clickable">Open Modal Window</a>
 * </div>
 * </file>
 *
 * <file name="script.js">
 * angular.module('example', ['akamai.components.modal-window']) 
 * 
 * .controller('ExampleController', function($scope, $rootScope, modalWindow) {
 *   var modalScope = $rootScope.$new();
 *
 *   modalScope.name = 'Akamai';
 *   $scope.open = function() {
 *     modalWindow.open({
 *       template: '<span>Hello {{ name }}</span>',
 *       scope: modalScope
 *     });
 *
 *     // hack for ngdocs
 *     setTimeout(function() {
 *       $rootScope.$apply();
 *     });
 *   };
 * });
 * </file>
 * </example>
 */
.factory('modalWindow', require('./modal-window-service'))

.directive('akamModalWindowBody', require('./modal-window-body-directive'));
