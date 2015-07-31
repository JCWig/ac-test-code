var angular = require('angular');
var sanitize = require('angular-sanitize');

/**
 * @ngdoc module
 * @name akamai.components.popover
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
 * <span akam-popover position="top"
 *   popover-content="Text Content Only."
 *   trigger="click">Click Here - Top
 * </span>
 *
 * <span akam-popover position="left"
 *   popover-content="Text Content Only."
 *   trigger="hover">Hover Here - Left
 * </span>
 *
 * <span akam-popover position="right"
 *   header="Header Title"
 *   custom-content="aTemplateId.html"
 *   trigger="hover">Hover Here - Right
 * </span>
 *
 * @example index.js
 *
 * function configFn($templateCache) {
 *   $templateCache.put('aTemplateId.html', '...');
 * }
 *
 */
module.exports = angular.module('akamai.components.popover', [
  sanitize,
  require('angular-bootstrap-npm')
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
 * @param {String} position Where popover appears
 * [top, bottom, left, right]
 *
 * @param {String} header What header should appear on
 * popover
 *
 * @param {String} trigger What triggers the popover
 * ['click', 'hover']
 *
 * @param {String} popover-content What text content
 * should appear in the popover
 *
 * @param {String} custom-content What html content
 * should appear in the popover
 *
 * @param {String} link-text What text a link should show
 *
 * @param {String} link-url Where link should take
 * user
 *
 * @param {String} button-text What text content
 * should appear on a button in a popover
 *
 * @param {String} button-function What function should
 * fire when button is pressed
 */
  .directive('akamPopover', require('./popover-directive'));
