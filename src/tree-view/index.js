'use strict';

var angular = require('angular');

module.exports = angular.module('akamai.components.tree-view', [
	require('../indeterminate-progress').name,
	require('../tool-tip').name,
	require('../utils').name
])

/**
 * @ngdoc directive
 *
 * @name akamai.components.tooltip.directive:akamTreeView
 *
 * @description Creates a naviagatable tree view
 *
 * @restrict E
 *
 * @param {JSON} contextData The data that will be displayed to the user
 * Should be in the following format
 * {
 * parent : Array or JSON,
 * current: JSON,
 * children : Array of JSON,
 *}
 * JSON should be in the following format
 * {title: "Whatever title you want displayed"}
 *
 * @param {function} onContextChange A function that will be triggered
 * whenever a new child/parent node is selected. With the corresponding JSON object as a parameter
 * To update our data it must either update the conxtedData parameter
 * or return the new child nodes.
 *
 * NOTE: take only one of these options:
 * (return children or update contextData) when updating children
 */

.directive('akamTreeView', require('./tree-view-directive'))

/**
 * @ngdoc directive
 *
 * @name akamai.components.tooltip.directive:akamTreeViewParentSelector
 *
 * @description Creates a tooltip like drop down to navigate up a tree view
 *
 * @restrict A
 *
 * @param {Array} parentTree an array of the parent nodes available to
 * navigate to. JSON should be in the following format.
 * {title: "Whatever title you want displayed"}
 *
 * @param {function} changeParent A function that will be triggered
 * whenever a new parent node is selected. With the corresponding JSON object as a parameter
 *
 *
 */
.directive('akamTreeViewParentSelector', require('./tree-view-parent-selector-directive'));
