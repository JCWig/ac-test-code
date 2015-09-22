function menuButtonDirective(translateValueSupport) {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    bindToController: {
      text: '@',
      isDisabled: '=?'
    },
    controller: function() {},
    controllerAs: 'menuButtonItem',
    link: (scope, elem, attr) => {
      translateValueSupport.setValues(scope.menuButtonItem, 'text', attr.textValues);
    },
    template: `<li ng-class="{'disabled' : menuButtonItem.isDisabled}">
        <a href="javascript:void(0);" translate="{{ ::menuButtonItem.text }}"
        translate-values="{{::menuButtonItem.textValues}}"></a>
        </li>`
  };
}
menuButtonDirective.$inject = ['translateValueSupport'];
export default menuButtonDirective;
