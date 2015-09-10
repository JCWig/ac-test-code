export default function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    bindToController: {
      text: '@',
      isDisabled: '=?'
    },
    controller: function() { },
    controllerAs: 'menuButtonItem',
    template:
      `<li ng-class="{'disabled-item' : menuButtonItem.isDisabled}">
        <a href="javascript:void(0);" translate="{{ ::menuButtonItem.text }}"></a>
      </li>`
  };
}
