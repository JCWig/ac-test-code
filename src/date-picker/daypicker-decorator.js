'use strict';

module.exports = function($provide) {
  $provide.decorator('daypickerDirective', function($delegate) {
    var directive = $delegate[0];
    
    directive.template = require('./templates/date-picker-day-popup.tpl.html');
    directive.templateUrl = undefined;
    
    var link = directive.link;

    directive.compile = function() {
      return function(scope, element, attrs, ctrl) {
        link.apply(this, arguments);
        
        //disable navigation according to the range
        scope.daypickerNavPrevDisabled = function(){
            var year = ctrl.activeDate.getFullYear(),
                month = ctrl.activeDate.getMonth(),
                firstDayOfMonth = new Date(year, month, 1);
              
            return ctrl.minDate && (firstDayOfMonth <= ctrl.minDate);
        };
        scope.daypickerNavNextDisabled = function() {
            var year = ctrl.activeDate.getFullYear(),
              month = ctrl.activeDate.getMonth(),
              lastDayOfMonth = new Date(year, month+1, 0);
          
            return ctrl.maxDate && (lastDayOfMonth > ctrl.maxDate); };
      };
    };

    return $delegate;
  });
};