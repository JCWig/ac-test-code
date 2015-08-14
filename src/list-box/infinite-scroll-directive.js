export default function() {

  return {
    restrict: 'A',
    require: '^akamListBox',

    link: function(scope, elem, attrs, ctrl) {
      elem.on('scroll', function() {
        let viewBottom = this.scrollTop + this.offsetHeight;
        let remaining = this.scrollHeight - viewBottom;

        if (remaining <= 0) {
          ctrl.loadMoreData();
          scope.$digest();
        }
      });
    }
  };
}