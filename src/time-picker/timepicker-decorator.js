'use strict';

/* @ngInject */
module.exports = function($provide) {
  $provide.decorator('timepickerDirective', function($delegate) {
    var directive = $delegate[0];

    // override the default template for timepicker
    directive.template = require('./templates/time-picker-popup.tpl.html');
    directive.templateUrl = undefined;

    return $delegate;
  });
};
