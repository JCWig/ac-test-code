module.exports = function() {

  return {
    restrict: 'A',
    require: '^akamListBox',
    scope: {},

    link: function(scope, elem, attrs, ctrl) {
      elem.on('scroll', function() {
        var element = this;
        var viewBottom = element.scrollTop + element.offsetHeight;
        var remaining = element.scrollHeight - viewBottom;

        if (remaining <= 0) {
          ctrl.loadMoreData();
          scope.$apply();
        }
      });
    }
  };
};