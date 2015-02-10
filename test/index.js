'use strict';

var angular = require('angular');

angular.module('component.testing', [
    require('./utilities').name,
])

.constant('VERSION', require('../package.json').version);
