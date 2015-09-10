export default function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    bindToController: {
      text: '@',
      isItemDisabled: '=?'
    },
    controller: function() { },
    controllerAs: 'menuButtonItem',
    template:
      `<li ng-class="{'disabled-item' : menuButtonItem.isItemDisabled}">
        <a href="javascript:void(0);" translate="{{ ::menuButtonItem.text }}"></a>
      </li>`
  };
}
