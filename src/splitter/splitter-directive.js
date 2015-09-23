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
                // passing parent scope to the children..
                $transcludeFn($scope.$parent, (clone) => {
                    $element.append(clone);
                });
            },
            post: ($scope, $element, $attrs, splitterController, $transcludeFn) => {
                var i,
                    children = $element.children(),
                    resizer;
                for (i = 0; i < children.length; i++){
                    if (angular.element(children[i]).hasClass("split-pane")){
                        resizer = $compile(resizerTemplate)($scope);
                        angular.element(children[i]).after(resizer);
                        break;
                    }
                }
                splitterController.initialize($element, $attrs, resizer);
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
