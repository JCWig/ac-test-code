'use strict';

var angular = require('angular');

angular.module('akamai.components', [
    require('./menu-button').name,
    require('./i18n').name
])

.constant('VERSION', require('../package.json').version);
