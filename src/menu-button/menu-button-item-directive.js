export default function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    bindToController: {
      text: '@'
    },
    controller: function() { },
    controllerAs: 'menuButtonItem',
    template:
      `<li>
        <a href="javascript:void(0);" translate="{{ ::menuButtonItem.text }}"></a>
      </li>`
  };
}
