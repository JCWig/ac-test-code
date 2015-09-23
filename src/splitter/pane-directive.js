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
      var size = !angular.isUndefined($attrs["size"]) && !isNaN(parseFloat($attrs["size"])) ? parseFloat($attrs["size"]) : 6;

      function setStyle(size){
        $scope.size = {
          "flex": [size, "0px"].join(" ")
        };
      }

      $scope.$watch("paneController.size", (newValue, oldValue) => {
        setStyle(newValue);
      });
      setStyle(size);

      // passing parent scope to the children..
      transcludeFn($scope.$parent, (clone) => {
        $element.append(clone);
      });
      $scope.paneController.setSize(size);
      splitterController.registerPane($scope.paneController);
    },
    template: paneTemplate
  };
};

export default paneDir;
