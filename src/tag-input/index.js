'use strict';
var angular = require('angular');

require('ui-select');
module.exports = angular.module('akamai.components.tag-input', [
  'ui.select',
  require('../i18n').name
])
.directive('akamTagInput', require('./tag-input-directive'));
