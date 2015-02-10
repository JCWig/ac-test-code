'use strict';

var angular = require('angular');

module.exports = angular.module('akamai.components.pagination', [])

.directive('akamPagination', require('./pagination-directive'));
