import debounce from 'lodash/function/debounce';
import angular from 'angular';

function textOverflowDirective($timeout, $window) {
  return {
    restrict: 'A',
    scope: {},
    bindToController: {
      akamTextOverflow: '='
    },
    controller: () => {},
    controllerAs: 'textOverflow',
    link: function(scope, element) {
      let ctrl = scope.textOverflow;

      function giveTitles() {
        $timeout(function() {
          let scrollWidth = element[0].scrollWidth;
          let width = element[0].offsetWidth;

          if (scrollWidth > width) {
            element.prop('title', ctrl.akamTextOverflow.trim());
          } else {
            element.removeAttr('title');
          }
        }, 100);
      }

      angular.element(window).on('resize', debounce(giveTitles, 200));
      scope.$watch('akamTextOverflow', function() {
        giveTitles();
      });
      giveTitles();

      scope.$on('$destroy', function() {
        $window.removeEventListener('resize', giveTitles);
      });
    }
  };
}

textOverflowDirective.$inject = ['$timeout', '$window'];

export default textOverflowDirective;