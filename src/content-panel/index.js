var angular = require('angular');

/**
 * @ngdoc module
 * @name akamai.components.content-panel
 *
 * @description
 * Basic panel is a building block of most user interfaces. Besides containing components,
 * panels themselves can be placed within containers, which allows for orderly layouts.
 * Panels can contain toolbars at the top or bottom of the panel, with separate header,
 * footer, and body sections.
 *
 * @guideline Use toolbars for secondary features, not for the main work or user tasks to
 * be accomplished within the panel.
 *
 * @guideline Be sure to consider how the collapsible, expandable, and closable behaviors are used.
 *
 * @guideline For more sophisticated interfaces, take advantage of placing panels within containers
 * or layouts to create the overall interface layout.
 *
 * @example index.html
 * <akam-content-panel header="Panel Title">
 *   Panel Body
 * </akam-content-panel>
 *
 * <!-- Or this if you need custom markup in your header: -->
 * <akam-content-panel>
 *   <akam-content-panel-header><b>Panel</b> Title</akam-content-panel-header>
 *   <akam-content-panel-body>Panel Body</akam-content-panel-body>
 * </akam-content-panel>
 */
module.exports = angular.module('akamai.components.content-panel', [
  require('angular-bootstrap-npm'),
  require('../utils').name
])

/**
 * @ngdoc directive
 * @name akamContentPanel
 * @description Creates a content panel control.
 *
 * @restrict E
 *
 * showing expand/collapse icon, otherwise icon will not hidden to user.
 * @param {Boolean} [is-collapsed=false] if provided true value, icon will be
 * rendered collapsed state,  otherwise it will be rendered expanded state that
 * includes is-collapsed attribute not present.
 *
 * @param {*} [not-collapsable] a attribute if presented, will hide the collapse / expand icon and
 * making haeder un-clickable and in expanded state
 *
 * @param {String} [header] String to use as the panel header
 *
 * @param {Function} [on-toggle] A callback function when user clicks expanded and collapsed icon
 *
 */
  .directive('akamContentPanel', require('./content-panel-directive'))

/**
 * @name akamContentPanelHeader
 *
 * @description Use inside of an `<akam-content-panel>` directive to specify panel header markup.
 * Do not use the `header` attribute on `<akam-content-panel>` if you use this directive.
 *
 * @restrict E
 */
  .directive('akamContentPanelHeader', require('./content-panel-header-directive'))

/**
 * @name akamContentPanelBody
 *
 * @description Use inside of an `<akam-content-panel>` directive to specify panel body markup.
 * Do not use the `header` attribute on `<akam-content-panel>` if you use this directive.
 *
 * @restrict E
 */
  .directive('akamContentPanelBody', require('./content-panel-body-directive'));
