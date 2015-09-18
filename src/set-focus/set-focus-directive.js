export default function setFocusDirective($parse, $timeout) {
  function link(scope, element, attrs) {
    let model = $parse(attrs.akamSetFocus);

    scope.$watch(model, value => {
      if (value) {
        $timeout(() => element[0].focus());
      }
    });

    // resets bound value to false when element is blurred
    element.bind('blur', () => {
      scope.$apply(model.assign(scope, false));
    });
  }

  return {
    restrict: 'A',
    link
  };
}

setFocusDirective.$inject = ['$parse', '$timeout'];
