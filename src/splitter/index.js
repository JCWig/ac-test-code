import angular from 'angular';
import uuid from '../uuid';

import splitterDirective from './splitter-directive';
import splitterController from './splitter-controller';
import paneDirective from './pane-directive';
import paneController from './pane-controller';

/**
 * @ngdoc module
 * @name akamai.components.splitter
 * @image splitter
 *
 * @description
 *
 * @example index.html
 * <akam-splitter
 *   type="vertical"
     direction="left"
     collapsed="true"
     freeze-divider="false"
     freeze-collapse="false">
        <akam-split-pane></akam-split-pane>
        <akam-split-pane></akam-split-pane>
 * </akam-splitter>
 *
 */

 export default angular.module('akamai.components.splitter', [])

 /**
  * @ngdoc directive
  * @name akam-splitter
  *
  * @description
  * Splitter directive helps in splitting a container into two panes.
  * A container can either be splitted Horizontally or Vertically
  * Horizontal splitter direction can either be top or bottom.
  * Horizontal splitter of top direction will collapse to top when clicked on resizer.
  * Horizontal splitter of bottom direction will collapse to bottom when clicked on resizer.
  * Vertical splitter direction can either be left or right.
  * Vertical splitter of left direction will collapse to left when clicked on resizer.
  * Vertical splitter of right direction will collapse to right when clicked on resizer.
  * Collapsible behavior can be controlled using freezeCollapse property.
  * Setting freezeCollapse to true, one cannot expand/collapse the splitter.
  * Visibility of resizer can be controlled using freezeDivider property.
  * Setting freezeCollapse to true, resizer will not be shown.
  *
  * @param {String} type, can either be horizontal or vertical, optional.
  * Default is vertical.
  *
  * @param {String} direction, in what direction the splitter has to be collapsed, optional.
  * Default is left for vertical and top for horizontal type splitters.
  *
  * @param {boolean} collapsed, has splitter been collapsed, optional.
  * Default is false.
  *
  * @param {boolean} freeze-collapse, a boolean value intend to freeze collapsible/expand behavior, optional.
  * Default is false.
  *
  * @param {boolean} freeze-resizer, a boolean value intend to freeze the resizer, optional.
  * Default is false.
  *
  */
    .directive('akamSplitter', splitterDirective)
    .controller('akamSplitterController', splitterController)
    .directive('akamSplitPane', paneDirective)
    .controller('akamPaneController', paneController);
