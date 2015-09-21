import angular from 'angular';
import paneTemplate from './templates/pane.tpl.html';

function paneDir() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {},
    require: '^akamSplitter',
    controller: 'akamPaneController',
    controllerAs: "paneController",
    link: function($scope, $element, $attrs, splitterController, transcludeFn) {
      $scope.size = {
          "flex": !angular.isUndefined($attrs["size"]) && !isNaN(parseFloat($attrs["size"])) ? [$attrs["size"], "0px"].join(" ") : "6 0px"
      };
      transcludeFn($scope.$parent, function(clone){
        $element.append(clone);
      });
      splitterController.registerPane($scope.paneController);
    },
    template: paneTemplate
  };
};

export default paneDir;
