'use strict';

module.exports = function($provide) {
  $provide.decorator('monthpickerDirective', function($delegate) {
    var directive = $delegate[0];
    
    directive.template = require('./templates/date-picker-month-popup.tpl.html');
    directive.templateUrl = undefined;
    
    var link = directive.link;

    directive.compile = function() {
      return function(scope, element, attrs, ctrl) {
        link.apply(this, arguments);
        
        //disable navigation according to the range
        scope.monthpickerNavPrevDisabled = function(){
            var firstMonth = new Date(ctrl.activeDate.getFullYear(), 0, 1);
            return ctrl.minDate && (firstMonth < ctrl.minDate);
        };
        scope.monthpickerNavNextDisabled =  function() {
            var lastMonth = new Date(ctrl.activeDate.getFullYear(), 11, 1);
            return ctrl.maxDate && (lastMonth > ctrl.maxDate);
        };
      };
    };

    return $delegate;
  });
};