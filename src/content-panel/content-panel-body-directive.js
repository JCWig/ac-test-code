module.exports = function() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: require('./templates/content-panel-body.tpl.html')
  };
};
