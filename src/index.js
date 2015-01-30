'use strict';

var angular = require('angular');

angular.module('akamai.components', [
    require('./menu-button').name,
    require('./modal-window').name
])

.constant('VERSION', require('../package.json').version);
