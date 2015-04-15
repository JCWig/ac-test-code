'use strict';

/* @ngInject */
module.exports = function($log, $position, $compile, $timeout) {
    return {
        restrict: 'AE',
        replace : true,
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
        //template: require('./templates/tool-tip-2.tpl.html'), 
        link: function(scope, element, attrs) {            
            scope.opened = true;
            scope.popupDelay = 500;
            scope.animation = true; 
                
            var content = require('./templates/tool-tip-2.tpl.html');
            var toolTip = $compile(content)(scope);
            element.after(toolTip);
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

            if(scope.trigger === "click"){
                element.on("click", function(){
                    scope.toggle();
                });
            } else {
                element.on("mouseover", function(){
                    $timeout(function(){
                        scope.toggle();
                    }, 500);
                });
                element.on("mouseleave", function(){
                    scope.toggle();
                });
            }

            if(scope.hasButton() && scope.buttonFunction != null){
                toolTip.children('button').on("click", function(){
                    scope.buttonFunction();
                });
            } 
            setCoords();

            function setCoords(){
                var pageMidCoords = document.body.clientWidth / 2;
                
                var elementOffsetLeft = element[0].offsetLeft;
                var elementOffsetTop = element[0].offsetTop;

                var onLeftSideHuh = elementOffsetLeft < pageMidCoords;
                
                var toolTipWidth = (toolTip[0].clientWidth || toolTip[0].offsetWidth);
                var toolTipHeight = (toolTip[0].clientHeight || toolTip[0].offsetHeight);

                var elementWidth = element[0].clientWidth || element[0].offsetWidth;
                var elementHeight = element[0].clientHeight || element[0].offsetHeight;

                if(onLeftSideHuh){
                    if(scope.placement === 'bottom'){
                        scope.toolTipLeft = (elementOffsetLeft - 21) + 'px';
                        scope.toolTipTop = (elementOffsetTop + elementHeight / 2 + 15) + "px"; 
                        
                        scope.arrowLeft = "21px";
                        scope.arrowTop = "-11px";

                    } else if(scope.placement === 'top'){
                        scope.toolTipLeft = (elementOffsetLeft - 21) + 'px';
                        scope.toolTipTop = (elementOffsetTop - toolTipHeight - 15) + "px"; 
                        
                       //scope.arrowTop = toolTipHeight + 11 + "px";
                        //scope.arrowLeft = "21px";

                    }  else if(scope.placement === 'right'){
                        scope.toolTipLeft = (elementOffsetLeft + elementWidth + 5) + 'px';
                        scope.toolTipTop = (elementOffsetTop - 21) + "px"; 

                      //  scope.arrowTop = "21px";
                      //  scope.arrowLeft = "-11px";

                    } else if(scope.placement == 'left'){
                        scope.toolTipLeft = (elementOffsetLeft - toolTipWidth - 15) + 'px';
                        scope.toolTipTop = (elementOffsetTop - 21) + "px"; 

                      //  scope.arrowTop = "21px";
                      //  scope.arrowLeft = toolTipWidth + 11 + "px";
                    }
                } else {
                    if(scope.placement === 'bottom'){
                        scope.toolTipLeft = (elementOffsetLeft - toolTipWidth) + 'px';
                        scope.toolTipTop = (elementOffsetTop + elementHeight /2 + 15) + "px"; 

                        scope.arrowLeft = toolTipWidth + "px";
                        scope.arrowTop = "-11px";

                    } else if(scope.placement === 'top'){
                        scope.toolTipLeft = (elementOffsetLeft - toolTipWidth + elementWidth + 31) + 'px';
                        scope.toolTipTop = (elementOffsetTop - toolTipHeight - 15) + "px"; 
                        
                     //   scope.arrowTop = toolTipHeight + 11 + "px";
                     //   scope.arrowLeft = toolTipWidth - 16 - 21+ "px";
                    
                    }  else if(scope.placement === 'right'){
                        scope.toolTipLeft = (elementOffsetLeft - toolTipWidth + elementWidth - 21) + 'px';
                        scope.toolTipTop = (elementOffsetTop - 21) + "px"; 

                      //  scope.arrowTop = "21px";

                    } else if(scope.placement == 'left'){
                        scope.toolTipLeft = (elementOffsetLeft - toolTipWidth - 15) + 'px';
                        scope.toolTipTop = (elementOffsetTop - 21) + "px"; 

                      //  scope.arrowTop = "21px";
                      //  scope.arrowLeft = toolTipWidth + 11 + "px";
                    }
                }
            }
        }
    };
};
