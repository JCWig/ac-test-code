'use strict';

var angular = require('angular');

angular.module('akamai.components', [
  require('./uuid').name,
  require('./i18n').name,
  require('./indeterminate-progress').name,
  require('./content-panel').name,
  require('./menu-button').name,
  require('./modal-window').name,
  require('./message-box').name,
  require('./status-message').name,
  require('./date-picker').name,
  require('./pagination').name,
  require('./list-box').name,
  require('./table').name,
  require('./spinner').name,
  require('./utils').name,
  require('./switch-button').name,
  require('./popover').name,
  require('./router').name,
  require('./tree-view').name,
  require('./time-picker').name,
  require('./tag-input').name,
  require('./dropdown').name
]);
