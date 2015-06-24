'use strict';

var angular = require('angular');

module.exports = angular.module('akamai.components.tree-view', [
	require('../indeterminate-progress').name,
	require('../utils').name
])

/**
 * @ngdoc directive
 *
 * @name akamai.components.tree-voew.directive:akamTreeView
 *
 * @description Creates a naviagatable tree view
 *
 * @restrict E
 *
 * @param {JSON} item Contains information that will be displayed to the user
 *
 * @param {function} on-change A callback that occurs whenever a new
 * node, either parent or child, is clicked. Response parameter comes in
 * item variable and is the clicked item as it was passed into the directive
 *
 * @param {String} text-property The JSON key that contains the text the user
 * will see.
 *
 * @param {String} children-property The JSON key that contains the children of the
 * current node
 *
 * @param {String} parent-property The JSON key that contains the parents of the
 * parents node
 *
 * @param {String} root-property The JSON key that contains a boolean value
 * representing the root node from which every other node comes from
 *
 */

.directive('akamTreeView', require('./tree-view-directive'))

/**
 * @ngdoc directive
 *
 * @name akamai.components.tree-view.directive:akamTreeViewParentSelector
 *
 * @description Creates a popover like drop down to navigate up a tree view
 *
 * @restrict A
 *
 * requires akamTreeView and its controller
 *
 */
.directive('akamTreeViewParentSelector', require('./tree-view-parent-selector-directive'));
