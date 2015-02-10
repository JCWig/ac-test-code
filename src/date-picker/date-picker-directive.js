'use strict';

/* @ngInject */
module.exports = function($log) {
    var PICKER_TYPES = {
        'day' : 'day',
        'month' : 'month'
    };

    return {
        restrict: 'E',
        scope: {
            value: '=',
            placeholder: '@',
            mode : '@',
            onchange: '&',
            min : '@',
            max : '@'
        },
        template: require('./templates/date-picker.tpl.html'),
        link: {
            pre: function(scope) {
                scope.opened = false; // always default to not opened
                scope.mode = (scope.mode in PICKER_TYPES) ? scope.mode : PICKER_TYPES.day;

                if ( scope.mode === PICKER_TYPES.day) {
                    scope.format= 'yyyy-MM-dd';
                    scope.dateOptions = {
                      startingDay: 1,
                      showWeeks: false,
                      autoclose: true
                    };
                }else{
                    scope.format= 'yyyy-MM';
                    scope.dateOptions = {
                      startingDay: 1,
                      minMode: 'month',
                      showWeeks: false,
                      datepickerMode: 'month',
                      autoclose: true
                    };
                }
            },
            post: function(scope) {
                scope.open = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                
                    scope.opened = true;
                };
                
                scope.$watch('value', function(newValue, oldValue){
                    if (scope.onchange && newValue !== oldValue) {
                        scope.onchange({ value: newValue });
                    }
                });
            }
        }
    };
};
