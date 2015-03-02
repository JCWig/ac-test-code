'use strict';

/* @ngInject */
module.exports = function($log, $filter, $parse) {
    var PICKER_TYPES = {
        'day' : 'day',
        'month' : 'month'
    };

    return {
        replace: true,
        restrict: 'E',
        require: 'ngModel',
        scope: {
            placeholder: '@',
            mode : '@',
            min : '@',
            max : '@',
            format: '@'
        },
        template: require('./templates/date-picker.tpl.html'),
        link: {
            pre: function(scope) {
                scope.opened = false;
                scope.mode = (scope.mode in PICKER_TYPES) ?
                    scope.mode : PICKER_TYPES.day;

                if (scope.mode === PICKER_TYPES.day) {
                    scope.format = scope.format || 'EEE, MMM dd, yyyy';
                    scope.dateOptions = {
                        startingDay: 0,
                        showWeeks: false,
                        autoclose: true,
                        minMode: 'day',
                        maxMode: 'day'
                    };
                } else {
                    scope.format = scope.format || 'MMM yyyy';
                    scope.dateOptions = {
                        startingDay: 0,
                        minMode: 'month',
                        maxMode: 'month',
                        showWeeks: false,
                        datepickerMode: 'month',
                        autoclose: true,
                        formatMonth: 'MMM'
                    };
                }
            },
            post: function(scope, element, attrs, ngModel) {
                if (!ngModel) {
                    return;
                }
                
                ngModel.$render = function() {
                    scope.value =
                        $filter('date')(ngModel.$modelValue, scope.format);
                };

                scope.change = function() {
                    ngModel.$setViewValue(scope.value);
                };
        
                scope.toggle = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                
                    scope.opened = !scope.opened;
                };
                
                scope.$watch('opened', function(newValue){
                    element.toggleClass('opened', newValue);
                });
            }
        }
    };
};
