var angular = require('angular');

/**
 * @ngdoc overview
 *
 * @name akamai.components.content-panel
 *
 * @description Provides a set of directives that create
 * Pulsar-compatible content panels.
 *
 */
module.exports = angular.module('akamai.components.content-panel', [
  require('angular-bootstrap-npm'),
  require('../utils').name
])

/**
 * @ngdoc directive
 *
 * @name akamai.components.content-panel.directive:akamContentPanel
 *
 * @description Creates a content panel control.
 *
 * Use the following markup if your header is plain text:
 * <pre>
 *   <akam-content-panel header="Panel Title">
 *     Panel Body
 *   </akam-content-panel>
 * </pre>
 *
 * Or this if you need custom markup in your header:
 * <pre>
 *   <akam-content-panel>
 *     <akam-content-panel-header><b>Panel</b> Title</akam-content-panel-header>
 *     <akam-content-panel-body>Panel Body</akam-content-panel-body>
 *   </akam-content-panel>
 * </pre>
 *
 * @restrict E
 *
 * showing expand/collapse icon, otherwise icon will not hidden to user.
 * @param {Boolean} [isCollapsed=true] if provided true value, icon will be rendered collapsed
 * state,  otherwise it will be rendered expanded state that includes attrribute not present.
 * @param {String} [header] String to use as the panel header
 * @param {Function} [onToggle] A callback function when user clicks expanded and collapsed icon
 *
 */
  .directive('akamContentPanel', require('./content-panel-directive'))

/**
 * @ngdoc directive
 *
 * @name akamai.components.content-panel.directive:akamContentPanelHeader
 *
 * @description Use inside of an `<akam-content-panel>` directive to specify panel header markup.
 * Do not use the `header` attribute on `<akam-content-panel>` if you use this directive.
 *
 * @restrict E
 */
  .directive('akamContentPanelHeader', require('./content-panel-header-directive'))

/**
 * @ngdoc directive
 *
 * @name akamai.components.content-panel.directive:akamContentPanelBody
 *
 * @description Use inside of an `<akam-content-panel>` directive to specify panel body markup.
 * Do not use the `header` attribute on `<akam-content-panel>` if you use this directive.
 *
 * @restrict E
 */
  .directive('akamContentPanelBody', require('./content-panel-body-directive'));
