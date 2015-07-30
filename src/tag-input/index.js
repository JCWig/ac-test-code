var angular = require('angular');

require('ui-select');
module.exports = angular.module('akamai.components.tag-input', [
  'ui.select',
  require('../i18n').name
])

/**
 * @ngdoc directive
 *
 * @name akamai.components.tag-input-directive:akamTagInput
 *
 * @description Creates a input designed for multiple tags
 *
 * @restrict E
 *
 * @param {Array} ngModel The strings that have been selected
 *
 * @param {Array} availableItems The list of strings that
 * will appear as selectable items in a dropdown
 *
 * @param {String} taggingLabel A string which will appear next to
 * a string that is being input
 *
 * @param {Function} sortFunction A function that if given will sort
 * the tags that have been chosen
 *
 * @param {Boolean} dragDroppable A value that represents if the tags
 * can be drag and dropped.
 *
 * @param {String} placeholder A value that will be displayed when no
 * tag have been chosen
 *
 * @param {Boolean} restricted A value that if true will not allow any
 * tags to be input that are not in the available items list.
 *
 * @param {Function} validateFunction A function that will be triggered
 * when a new value is input. It should return true if the input is allowed
 * false is the input is not a valid input, we do not allow blank, undefined or
 * null inputs
 */
  .directive('akamTagInput', require('./tag-input-directive'));
