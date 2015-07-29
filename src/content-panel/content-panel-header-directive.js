module.exports = function() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: require('./templates/content-panel-header.tpl.html'),
    link: function(scope, elem, attrs, ctrl, transclude) {
      transclude(function(transcludeEl) {
        elem.append(transcludeEl.attr('ng-class', '{"is-collapsable":collapsable}'));
      });
    }
  };
};
