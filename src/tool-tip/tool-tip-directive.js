'use strict';

/* @ngInject */
module.exports = function($log, $position, $compile, $timeout) {
    return {
        restrict: 'E',
        replace : true,
        transclude:true,
        scope :{
            placement: "@",
            header:"@",
            trigger:"@",
            content: "@",
            linkText:"@",
            linkUrl:"@",
            buttonText:"@",
            buttonFunction: "=",
            forEle: "@"
        }, 
        template: require('./templates/tool-tip-2.tpl.html'), 
        link: function(scope, element, attrs) {            
            scope.opened = true;
            scope.popupDelay = 500;
            scope.animation = true; 
            var toolTip = element;
            var triggerElement = angular.element(document.querySelector(scope.forEle));

            scope.isOpen = function(){
                return scope.opened;
            }
            scope.toggle = function(){
                //setCoords();
                scope.opened = !scope.opened;
                toolTip.toggleClass('in', scope.opened);
            }
            scope.isAnimation = function(){
                return scope.animation;
            }
            scope.hasHeader = function(){
                return scope.header && scope.header.length > 0;
            }
            scope.hasButton = function(){
                return scope.buttonText && scope.buttonText.length > 0;
            }
            scope.hasLink = function(){
                return scope.linkText && scope.linkText.length > 0 && scope.linkUrl && scope.linkUrl.length > 0;
            }
            scope.useContent = function(){
                return scope.content && scope.content.length > 0;
            }

            if(scope.trigger === "click"){
                triggerElement.on("click", function(){
                    scope.toggle();
                });
            } else {
                triggerElement.on("mouseover", function(){
                    $timeout(function(){
                        scope.toggle();
                    }, 500);
                });
                triggerElement.on("mouseleave", function(){
                    scope.toggle();
                });
            }
            function setCoords(){
                var pageMidCoords = document.body.clientWidth / 2;
                    
                var elementOffsetLeft = triggerElement[0].offsetLeft;
                var elementOffsetTop = triggerElement[0].offsetTop;

                var onLeftSideHuh = elementOffsetLeft < pageMidCoords;
                    
                var toolTipWidth = (toolTip[0].clientWidth || toolTip[0].offsetWidth);
                var toolTipHeight = (toolTip[0].clientHeight || toolTip[0].offsetHeight);

                var elementWidth = triggerElement[0].clientWidth || triggerElement[0].offsetWidth;
                var elementHeight = triggerElement[0].clientHeight || triggerElement[0].offsetHeight;

                if(scope.placement === 'left' || scope.placement==='right'){
                    if(scope.placement === 'right'){
                        scope.toolTipLeft = (elementOffsetLeft + elementWidth + 11) + "px"
                        scope.toolTipTop = (elementOffsetTop - 21) + "px"; 

                        scope.arrowTop = "21px";
                        scope.arrowLeft = "-11px";

                    } else if(scope.placement == 'left'){
                        scope.toolTipLeft = (elementOffsetLeft - toolTipWidth - 11) + 'px';
                        scope.toolTipTop = (elementOffsetTop - 21) + "px"; 

                        scope.arrowTop = "21px";
                        scope.arrowLeft = toolTipWidth + "px";
                    }
                } else {
                    if(onLeftSideHuh){
                        if(scope.placement === 'bottom'){
                            scope.toolTipLeft = (elementOffsetLeft - 21) + 'px';
                            scope.toolTipTop = (elementOffsetTop + elementHeight / 2 + 15) + "px"; 
                            
                            scope.arrowLeft = "21px";
                            scope.arrowTop = "-11px";

                        } else if(scope.placement === 'top'){
                            scope.toolTipLeft = (elementOffsetLeft - 21) + 'px';
                            scope.toolTipTop = (elementOffsetTop - elementHeight /2 - toolTipHeight) + "px"; 
                                
                            scope.arrowTop = toolTipHeight + "px";
                            scope.arrowLeft = "21px";

                        }
                    } else {
                        if(scope.placement === 'bottom'){
                            scope.toolTipLeft = (elementOffsetLeft - toolTipWidth + elementWidth - 21) + 'px';
                            scope.toolTipTop = (elementOffsetTop + elementHeight /2 + 15) + "px"; 

                            scope.arrowLeft = (toolTipWidth - 37)+ "px";
                            scope.arrowTop = "-11px";

                        } else if(scope.placement === 'top'){
                            scope.toolTipLeft = (elementOffsetLeft - toolTipWidth + elementWidth - 21) + 'px';
                            scope.toolTipTop = (elementOffsetTop - elementHeight /2 - toolTipHeight) + "px"; 
                                
                            scope.arrowTop = toolTipHeight + "px";
                            scope.arrowLeft = toolTipWidth - 16 - 21+ "px";
                            
                        }
                    }
                }
            }
            $timeout(function(){
                setCoords();
            },0);
        }
    };
};
