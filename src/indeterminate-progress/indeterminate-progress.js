'use strict';

/* @ngInject */
module.exports = function() {
    return {
        restrict: "AE",
        scope: {
            label: "@label",
            stateFailed: "@failed",
            stateCompleted: "@completed",
            spinnerSize : "@size"
        },
        template: require('./templates/indeterminate-progress.tpl.html'),
        link: function ($scope, element, attrs) {
            element.addClass('indeterminate-progress-wrapper');

            $scope.size = function(){
                switch ($scope.spinnerSize) {
                    case 'small':
                        return 'small';
                    case 'large':
                        return 'large';
                    default:
                        return 'normal';
                }
            };

            element.addClass($scope.size());

            $scope.state = function(){
                if ($scope.failed()) {
                    return 'failed';
                }

                if ($scope.completed()) {
                    return 'completed';
                }

                return 'started';
            };

            $scope.completed = function(){
                return $scope.stateCompleted === "true";
            };

            $scope.failed = function(){
                return $scope.stateFailed === "true";
            };

            $scope.$watch('stateFailed', function(newval, oldval){
                //add or remove the class based on wether or not the element is "completed".
                element.toggleClass('failed', $scope.failed());
            }, true);

            $scope.$watch('stateCompleted', function(newval, oldval){
                //add or remove the class based on wether or not the element is "completed".
                element.parent().toggleClass('indeterminate-progress', !$scope.completed());
            }, true);

            //remove the indeterminate progress if the element is removed.
            element.on('$destroy', function() {
                element.parent().removeClass('indeterminate-progress');
            });
        }
    };
};
