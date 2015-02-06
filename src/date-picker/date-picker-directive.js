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
            mode : '@'
        },
        template: require('./templates/date-picker.tpl.html'),
        link: function($scope, element, attrs) {
            $scope.opened = false; // always default to not opened
            $scope.mode = ($scope.mode in PICKER_TYPES) ? $scope.mode : PICKER_TYPES.day;
            $scope.format = attrs.format || "yyyy-MM-dd";
            
            $scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened = true;
            };
            
            $scope.dateOptions = {
              format: $scope.format,
              startingDay: 1,
              minMode: 'month'
            };
            
            //$scope.format = 
            $log.info('Hello Date Picker!');
        }
    };
};
