import angular from 'angular';
import template from './templates/content-panel-body.tpl.html';

module.exports = function() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: template,
    link: function(scope, elem, attrs, ctrl, transclude) {
      transclude(function(transcludeEl) {
        angular.element(elem[0].querySelector('.content-wrapper')).append(transcludeEl);
      });
    }
  };
};
