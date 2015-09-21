import angular from 'angular';
import template from './templates/splitter.tpl.html';
import resizerTemplate from './templates/resizer.tpl.html';

function splitterDirective($log, $compile){
  return {
    restrict: 'E',
    controller: 'akamSplitterController',
    controllerAs: 'splitterController',
    transclude: true,
    bindToController: {
        "collapsed": "=?",
        "direction": "@?",
        "type": "@?",
        "freezeDivider": "=?",
        "freezeCollapse": "=?"
    },
    compile: ($element, $attrs, $transcludeFn) => {
        return {
            pre: ($scope, $element, $attrs, splitterController, $transcludeFn) => {
                $transcludeFn($scope.$parent, (clone) => {
                    $element.append(clone);
                });
            },
            post: ($scope, $element, $attrs, splitterController, $transcludeFn) => {
                var i,
                    children = $element.children();
                for (i = 0; i < children.length; i++){
                    if (angular.element(children[i]).hasClass("split-pane")){
                        angular.element(children[i]).after($compile(resizerTemplate)($scope));
                        break;
                    }
                }
                splitterController.initialize($element, $attrs);
            }
        }
    },
    template: template,
    scope: {},
    replace: true
  };
};

splitterDirective.$inject = ['$log', '$compile']
export default splitterDirective;
