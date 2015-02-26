'use strict';

var angular = require('angular');

angular.module('akamai.components', [
    require('./i18n').name,
    require('./indeterminate-progress').name,
    require('./menu-button').name,
    require('./modal-window').name,
    require('./message-box').name,
    require('./status-message').name,
    require('./date-picker').name,
    require('./pagination').name
])

.constant('VERSION', require('../package.json').version);
