'use strict';

/* @ngInject */
module.exports = function($log, $position, $compile) {
    return {
        restrict: 'A',
        replace : true,
        scope :{
            placement: "@",
            header:"@",
            trigger:"@",
            content: "@"
        }, 
        //template: require('./templates/tool-tip-2.tpl.html'), 
        link: function(scope, element, attrs) {            
            scope.opened = false;
            scope.popupDelay = 500;
            scope.animation = true; 
            
            var content = require('./templates/tool-tip-2.tpl.html');
            element.append($compile(content)(scope));
            var toolTip = element.children('.tool-tip');
            setCoords();

            if(scope.trigger === "click"){
                element.on("click", function(){
                    scope.toggle();
                });
            } else {
                element.on("mouseover", function(){
                    scope.toggle();
                });
            }
            
            scope.isOpen = function(){
                return scope.opened;
            }
            scope.toggle = function(){
                //setCoords();
                scope.opened = !scope.opened;
                console.log
                toolTip.toggleClass('in', scope.opened);
            }
            scope.isAnimation = function(){
                return scope.animation;
            }
            function setCoords(){
                if(scope.placement === 'bottom'){
                    scope.myLeft = (element[0].offsetLeft - toolTip.clientWidth / 2 + (element[0].clientWidth / 2)) + "px";
                    scope.myTop = (element[0].offsetTop + element[0].clientHeight + 5) + "px"; 
                } else if (scope.placement === 'top'){
                    scope.myLeft = (element[0].offsetLeft - toolTip.clientWidth / 2 + (element[0].clientWidth / 2)) + "px";
                    scope.myTop = (element[0].offsetTop  - toolTip.clientHeight - element[0].clientHeight/2 - 5) + "px"; 
                } else if(scope.placement === 'right'){
                    scope.myLeft = (element[0].offsetLeft + element[0].clientWidth + 5) + "px";
                    scope.myTop = (element[0].offsetTop + (element[0].clientHeight / 2) - (toolTip.clientHeight / 2)) + "px";
                } else if(scope.placement === 'left'){
                    scope.myLeft = (element[0].offsetLeft - toolTip.clientWidth - element[0].clientWidth/2 - 5) + "px";
                    scope.myTop = (element[0].offsetTop + (element[0].clientHeight / 2) - (toolTip.clientHeight / 2)) + "px";     
                }
            }
        }
    };
};
