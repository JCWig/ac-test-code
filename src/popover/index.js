'use strict';

var angular = require('angular');
var sanitize = require('angular-sanitize');

module.exports = angular.module('akamai.components.popover', [
  sanitize,
  require('angular-bootstrap-npm')
])
/**
 * @ngdoc directive
 *
 * @name akamai.components.popover.directive:akamPopover
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
