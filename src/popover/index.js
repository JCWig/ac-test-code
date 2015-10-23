import angular from 'angular';
import sanitize from 'angular-sanitize';
import bootstrap from 'angular-bootstrap-npm';
import i18n from '../i18n';

import popoverPopupDirective from './popover-popup-directive';
import popoverDirective from './popover-directive';
import popoverTemplatePopupDirective from './popover-template-popup-directive';
import popoverTemplateDirective from './popover-template-directive';

/**
 * @ngdoc module
 * @name akamai.components.popover
 * @image popover
 *
 * @description
 * Popover is a UI element that allows for content to be displayed on top of other content on
 * a page. It is triggered by user behavior and is triggered by hover or by click events.
 *
 * @guideline Use popover when you need to communicate additional information about item or
 * feature in interface.
 * @guideline Use popovers to communicate small to medium amounts of information to user.
 * @guideline Do not use popovers for displaying large amounts of information to user.
 *
 * @example index.html
 * <span akam-popover="Text Content Only." popover-placement="top"
 *   popover-trigger="click">Click Here - Top
 * </span>
 *
 * <span akam-popover="Text Content Only." popover-placement="left"
 *   popover-trigger="mouseenter">Hover Here - Left
 * </span>
 *
 * <span akam-popover="{{safeHtml}}" popover-placement="top"
 *   popover-trigger="click">Using trusted html
 * </span>
 *
 * <span akam-popover-template="custom-template"
 *   popover-placement="right"
 *   popover-title="Header Title"
 *   popover-trigger="mouseenter">Hover Here - Right
 * </span>
 *
 * @example index.js
 *
 * $scope.safeHtml = '<h2>HTML Binding</h2><br/><br/><p>Used in <strong>popover</strong>.</p>';
 * $scope.customData = 'aTemplateId.html';
 *
 * function configFn($templateCache) {
 *   $templateCache.put('aTemplateId.html', '...');
 * }
 *
 */
module.exports = angular.module('akamai.components.popover', [
  sanitize,
  bootstrap,
  i18n.name
])

/**
 * @ngdoc directive
 *
 * @name akamPopover
 *
 * @description Creates a tool tip for an element
 *
 * @restrict A
 *
 * @param {String} akam-popover What text content should appear in the popover.
 * Also takes an expression that evaluates to an html string.
 *
 * @param {String} popover-placement Where popover appears
 * [top, bottom, left, right]
 *
 * @param {String} popover-title What header should appear on
 * popover
 *
 * @param {String} popover-trigger What triggers the popover
 * ['click', 'mouseenter']
 *
 * @param {Boolean} popover-animation Should it fade in and out? Defaults to "true".
 *
 * @param {Integer} popover-popup-delay For how long should the user have to wait
 * before the popover shows (in milliseconds) after trigger? Defaults to 0.
 *
 * @param {Boolean} popover-append-to-body Should the popover be
 * appended to body instead of the parent element? Defaults to "false".
 *
 */
.directive('akamPopover', popoverDirective)
.directive('akamPopoverPopup', popoverPopupDirective)

/**
 * @ngdoc directive
 *
 * @name akamPopoverTemplate
 *
 * @description Creates a tool tip for an element using custom html template
 *
 * @restrict A
 *
 * @param {String} akam-popover-template Takes text that specifies the location of
 * a template to use for the popover body
 *
 * @param {String} popover-placement Where popover appears
 * [top, bottom, left, right]
 *
 * @param {String} popover-title What header should appear on
 * popover
 *
 * @param {String} popover-trigger What triggers the popover
 * ['click', 'mouseenter']
 *
 * @param {Boolean} popover-animation Should it fade in and out? Defaults to "true".
 *
 * @param {Integer} popover-popup-delay For how long should the user have to wait
 * before the popover shows (in milliseconds) after trigger? Defaults to 0.
 *
 * @param {Boolean} popover-append-to-body Should the popover be
 * appended to body instead of the parent element?
 *
 */
.directive('akamPopoverTemplate', popoverTemplateDirective)
.directive('akamPopoverTemplatePopup', popoverTemplatePopupDirective);
