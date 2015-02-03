'use strict';

var angular = require('angular');

angular.module('akamai.components', [
    require('./menu-button').name,
    require('./modal-window').name,
    require('./message-box').name
])

.constant('VERSION', require('../package.json').version);
