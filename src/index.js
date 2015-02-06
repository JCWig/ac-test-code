'use strict';

var angular = require('angular');

angular.module('akamai.components', [
    require('./indeterminate-progress').name,
    require('./menu-button').name,
    require('./modal-window').name,
    require('./indeterminate-progress').name,
    require('./i18n').name,
    require('./message-box').name,
    require('./status-message').name
])

.constant('VERSION', require('../package.json').version);
