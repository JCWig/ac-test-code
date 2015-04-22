'use strict';

var angular = require('angular');
var _ = require('lodash');
var POPUP_DELAY = 500;
/* @ngInject */
module.exports = function($log, $position, $compile, $timeout, $sce) {
    return {
        restrict: 'A',
        replace: true,
        scope : {
            position: "@",
            header:"@",
            trigger:"@",
            tooltipContent: "@",
            customContent: "=",
            linkText:"@",
            linkUrl:"@",
            buttonText:"@",
            buttonFunction: "=",
        }, 
        link: function(scope, element, attrs) {
            scope.opened = false;
            scope.animation = true; 
            var template = require('./templates/tooltip.tpl.html');
            var toolTip = $compile(template)(scope,function(toolTip){
                element.after(toolTip);
            });
            var triggerElement = element;
            scope.useCustomContent = function(){
                return !!scope.customContent;
            };
            scope.isOpen = function(){
                return scope.opened;
            };
            scope.toggle = function(){
                $timeout(function(){
                    scope.opened = !scope.opened;
                    toolTip.toggleClass('in', scope.opened);
                });
            };
            scope.isAnimation = function(){
                return scope.animation;
            };
            scope.hasHeader = function(){
                return scope.header && scope.header.length > 0;
            };
            scope.hasButton = function(){
                return scope.buttonText && scope.buttonText.length > 0;
            };
            scope.hasLink = function(){
                return scope.linkText && scope.linkText.length > 0 && scope.linkUrl && scope.linkUrl.length > 0;
            };
            if(scope.trigger === "click"){
                triggerElement.on("click", function(){
                    scope.toggle();
                });
            } else {
                triggerElement.on("mouseover", function(){
                    $timeout(function(){
                        scope.toggle();
                    }, POPUP_DELAY);
                });
                triggerElement.on("mouseleave", function(){
                    scope.toggle();
                });
            }
            function setCoords(){
                var pageMidCoords = document.body.clientWidth / 2;
                var triggerElementOffsetLeft = triggerElement[0].offsetLeft;
                var isOnLeftSide = triggerElementOffsetLeft < pageMidCoords;
                var elementOffsetTop = triggerElement[0].offsetTop;
                var toolTipWidth = (toolTip[0].offsetWidth || toolTip[0].clientWidth);
                var toolTipHeight = (toolTip[0].offsetHeight || toolTip[0].clientHeight);
                var triggerElementWidth = triggerElement[0].offsetWidth || triggerElement[0].clientWidth;
                var triggerElementHeight = triggerElement[0].offsetHeight || triggerElement[0].clientHeight;
                var arrowWidth = 16;
                var arrowHeight = 11;
                var toolTipArrowOffset = 21;

                if (scope.position === 'right') {
                    scope.toolTipLeft = (triggerElementOffsetLeft + arrowHeight + triggerElementWidth);
                    scope.toolTipTop = (elementOffsetTop - toolTipArrowOffset);
                    scope.arrowTop = toolTipArrowOffset;
                    scope.arrowLeft = -arrowHeight;
                } else if(scope.position === 'left') {
                    scope.toolTipLeft = (triggerElementOffsetLeft - toolTipWidth - arrowHeight);
                    scope.toolTipTop = (elementOffsetTop - toolTipArrowOffset);
                    scope.arrowTop = toolTipArrowOffset;
                    scope.arrowLeft = toolTipWidth;
                } else if (scope.position === 'bottom') {
                    scope.toolTipLeft = isOnLeftSide ? 
                        (triggerElementOffsetLeft - toolTipArrowOffset):
                        (triggerElementOffsetLeft - toolTipWidth + triggerElementWidth + toolTipArrowOffset);
                    scope.toolTipTop = (elementOffsetTop + arrowHeight + triggerElementHeight);
                    scope.arrowLeft = isOnLeftSide ? 
                        toolTipArrowOffset : 
                        (toolTipWidth - toolTipArrowOffset - arrowWidth);
                    scope.arrowTop = -arrowHeight;
                } else if (scope.position === 'top') {
                    scope.toolTipLeft = isOnLeftSide ? 
                        (triggerElementOffsetLeft - toolTipArrowOffset):
                        (triggerElementOffsetLeft - toolTipWidth + triggerElementWidth + toolTipArrowOffset);
                    scope.toolTipTop = (elementOffsetTop  - toolTipHeight - arrowHeight);
                    scope.arrowTop = toolTipHeight;
                    scope.arrowLeft = isOnLeftSide ? 
                        toolTipArrowOffset:
                        toolTipWidth - arrowWidth - toolTipArrowOffset;
                }
                
                scope.toolTipTop = scope.toolTipTop + "px";    
                scope.toolTipLeft = scope.toolTipLeft + "px";
                scope.arrowTop = scope.arrowTop + "px";
                scope.arrowLeft = scope.arrowLeft + "px";
            }
            angular.element(window).on('resize', _.debounce(setCoords, 200));
            $timeout(function(){
                setCoords();
            },0);
        }
    };
};
