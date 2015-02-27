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
            value : '=ngModel',
            placeholder: '@',
            mode : '@',
            onchange: '&',
            min : '@',
            max : '@',
            format: '@'
        },
        template: require('./templates/date-picker.tpl.html'),
        link: {
            pre: function(scope) {
                scope.opened = false; // always default to not opened
                scope.mode = (scope.mode in PICKER_TYPES) ? scope.mode : PICKER_TYPES.day;

                if ( scope.mode === PICKER_TYPES.day) {
                    scope.format = scope.format || 'EEE, MMM dd, yyyy';
                    scope.dateOptions = {
                      startingDay: 0,
                      showWeeks: false,
                      autoclose: true,
                      minMode: 'day',
                      maxMode: 'day'
                    };
                }else{
                    scope.format= scope.format || 'MMM yyyy';
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
                    return; // do nothing if no ng-model
                }
                
                var oldValue;
                ngModel.$formatters.push(function(value) {
                    //debugger;
                  var yy = $filter('date')(value, scope.format);
                  ngModel.$viewValue = yy;
                  return yy;
                });
                
                ngModel.$viewChangeListeners.push(function() {
                    debugger;
                    oldValue = ngModel.$modelValue;
                });
                
                /*
                
                ngModel.$setViewValue( $filter('date')(scope.ngModel, scope.format) );
                
                
                ngModel.$render = function() {
                    //element.find('input').val( $filter('date')(ngModel.$viewValue, scope.format) );
                    element.find('input').val( ngModel.$viewValue );
                };
                
                */

            
            /*
                ngModel.$parsers.push(function(val) {
                    return 'yair';
                });
                
                ngModel.$formatters.push(function(val) {
                    return 'yair';
                });
            */
        
                scope.toggle = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                
                    scope.opened = !scope.opened;
                };
                
                scope.$watch('opened', function(newValue){
                    element.toggleClass('opened', newValue);
                });
                
                scope.$watch('value', function(newValue, oldValue){
                    if (scope.onchange && newValue !== oldValue) {
                        scope.onchange({ value: newValue });
                    }
                });
            }
        }
    };
};
