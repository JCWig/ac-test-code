var angular = require('angular');

/**
 * @ngdoc module
 * @name akamai.components.tree-view
 *
 * @description
 * Tree views are used to browse and work with hierarchically organized collections of objects.
 * It is conventional to refer to trees as consisting of nodes. Trees lend themselves naturally
 * to use as a browsing interface for orderly and hierarchical collections of objects.
 *
 * @guideline Use tree views as navigational elements for highly structured collections of objects.
 *
 * @example index.html
 * <akam-tree-view
 *   item="vm.info"
 *   children-property="children"
 *   parent-property="parents"
 *   text-property="name"
 *   on-change="fn(item)">
 * </akam-tree-view>
 *
 * @example index.js
 *
 * function MyController() {
 *    this.info = {
 *      name: 'Group Name',
 *      children: [{
 *        name: 'Child Group Name'
 *      }],
 *      parents: [{
 *        name: 'Parent Group Name'
 *      }]
 *    }
 * }
 *
 */
module.exports = angular.module('akamai.components.tree-view', [
  require('../indeterminate-progress').name,
  require('../utils').name
])

/**
 * @ngdoc directive
 * @name akamTreeView
 * @restrict E
 *
 * @description Creates a naviagatable tree view
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
 * @name akamTreeViewParentSelector
 * @description Creates a popover like drop down to navigate up a tree view
 * @restrict A
 * @requires akamTreeView
 */
  .directive('akamTreeViewParentSelector', require('./tree-view-parent-selector-directive'));
