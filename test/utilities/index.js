'use strict';

var angular = require('angular');

module.exports = angular.module('component.testing.utilities', [])

.factory('utilityService', require('./utilities'));
