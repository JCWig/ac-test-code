 'use strict';

 var angular = require('angular');

 var formatConfig = {
   meridianOn: "hh:mm a",
   meridianOff: "HH:mm"
 };

 /* @ngInject */
 module.exports = function($filter) {

   var directive = {
     restrict: 'A',
     require: 'ngModel',
     scope: {
       showMeridian: '='
     },
     link: link
   };

   return directive;

   function link(scope, element, attrs, ngModel) {

     ngModel.$parsers.push(parseTime);
     ngModel.$formatters.push(displayTime);

     scope.$watch('showMeridian', function(value) {
       var value = ngModel.$modelValue;
       if (value) {
         element.val(displayTime(value));
       }
     });

     //may use moment.js here
     function parseTime(viewValue) {

       if (!viewValue) {
         ngModel.$setValidity('time', true);
         return null;
       } else if (angular.isDate(viewValue) && !isNaN(viewValue)) {
         ngModel.$setValidity('time', true);
         return viewValue;
       } else if (angular.isString(viewValue)) {
         var timeRegex = /^(0?[0-9]|1[0-2]):[0-5][0-9] ?[a|p]m$/i;
         if (!scope.showMeridian) {
           timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
         }
         if (!timeRegex.test(viewValue)) {
           ngModel.$setValidity('time', false);
           return undefined;
         } else {
           ngModel.$setValidity('time', true);
           var date = new Date();
           var sp = viewValue.split(":");
           var apm = sp[1].match(/[a|p]m/i);
           if (apm) {
             sp[1] = sp[1].replace(/[a|p]m/i, '');
             if (apm[0].toLowerCase() == 'pm') {
               sp[0] = sp[0] + 12;
             }
           }
           date.setHours(sp[0], sp[1]);
           return date;
         };
       } else {
         ngModel.$setValidity('time', false);
         return undefined;
       };
     }

     function displayTime(data) {
       parseTime(data);
       var timeFormat = (!scope.showMeridian) ?
        formatConfig.meridianOff : formatConfig.meridianOn;

       return $filter('date')(data, timeFormat);
     }
   }
 }
