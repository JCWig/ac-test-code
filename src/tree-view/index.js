'use strict';

var angular = require('angular');

module.exports = angular.module('akamai.components.tree-view', [
	require('../indeterminate-progress').name,
	require('../tool-tip').name,
	require('../utils').name
])

.directive('akamTreeView', require('./tree-view-directive'))

.directive('akamTreeViewParentSelector', require('./tree-view-parent-selector-directive'));
