'use strict';
require('ui-select');

var angular = require('angular');
module.exports = angular.module('akamai.components.tag-input', [
	'ui.select'
])
.directive('akamTagInput', require('./tag-input-directive'));
