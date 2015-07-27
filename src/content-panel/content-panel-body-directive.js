<<<<<<< HEAD
var angular = require('angular');

=======
>>>>>>> develop
module.exports = function() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
<<<<<<< HEAD
    template: require('./templates/content-panel-body.tpl.html'),
    link: function(scope, elem, attrs, ctrl, transclude) {
      transclude(function(transcludeEl) {
        angular.element(elem[0].querySelector('.content-wrapper')).append(transcludeEl);
      });
    }
=======
    template: require('./templates/content-panel-body.tpl.html')
>>>>>>> develop
  };
};
