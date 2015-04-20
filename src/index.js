'use strict';

var angular = require('angular');

angular.module('akamai.components', [
    require('./modules/uuid').name,
    require('./modules/i18n').name,
    require('./modules/indeterminate-progress').name,
    require('./modules/content-panel').name,
    require('./modules/menu-button').name,
    require('./modules/modal-window').name,
    require('./modules/message-box').name,
    require('./modules/status-message').name,
    require('./modules/date-picker').name,
    require('./modules/pagination').name,
    require('./modules/list-box').name,
    require('./modules/data-table').name,
    require('./modules/utils').name
]);