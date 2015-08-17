import template from './templates/content-panel-header.tpl.html';

export default () => {
  return {
    restrict: 'E',
    transclude: 'true',
    replace: true,
    template: template,
    link: function(scope, elem, attrs, ctrl, transclude) {
      transclude(scope, function(transcludeEl) {
        elem.append(transcludeEl);
      });
    }
  };
};
