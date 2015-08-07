module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      items: '=',
      removeItemByItemId: '&'
    },
    replace: true,
    template: require('./templates/status-message-group-directive.tpl.html'),
    link: function(scope) {
      scope.items = scope.items || [];

      function removeItemByItemId(itemId) {
        var i;

        for (i = 0; i < scope.items.length; i++) {
          if (scope.items[i].itemId === itemId) {
            scope.items.splice(i, 1);
            return;
          }
        }
      }

      scope.removeItemByItemId = removeItemByItemId;
      scope.$on('akam-status-message-destroyed', function(event, itemId) {
        removeItemByItemId(itemId);
      });
    }
  };
};