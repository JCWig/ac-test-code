'use strict';

/* @ngInject */
module.exports = function($log, $position) {
    return {
        restrict: 'E',
        replace : true,
        transclude :true,
        scope :{
            text : "@",
            triggerText: "@",

        }, 
        template: require('./templates/tool-tip.tpl.html'), //'<a href="#" ng-transclude tooltip="{{text}}">{{ hoverText }}</a>',
        link: function(scope, element, attrs) {
            scope.popupDelay = 500;
            scope.animation = true;
            scope.placement = "bottom";
            console.log("HELLO");

            /*scope.trigger = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                scope.close();
            };
            if(scope.text.length() > 60){
                //FAIL SOMEHOW? Just shorten message to 60 characters? WHAT DO I DO JOHNNY WHAT DO I DO?
                //Default take the first 60 characters
                scope.text = scope.text.splice(0,59);
            }
            scope.close = function(){
                scope.closing = true;
                $timeout(function(){
                    element.remove();
                }, 500);
            };*/
        }
    };
};
