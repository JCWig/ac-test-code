var angular = require('angular');

module.exports = function() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: require('./templates/content-panel-body.tpl.html'),
    link: function(scope, elem, attrs, ctrl, transclude) {
      transclude(function(transcludeEl) {
        angular.element(elem[0].querySelector('.content-wrapper')).append(transcludeEl);
      });
    }
  };
};
