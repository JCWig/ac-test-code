'use strict';
var angular = require('angular');

require('ui-select');
module.exports = angular.module('akamai.components.tag-input', [
  'ui.select'
])
.directive('akamTagInput', require('./tag-input-directive'));
