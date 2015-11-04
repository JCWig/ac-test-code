import template from './templates/menu-button.tpl.html';

function menuButton(translateValueSupport) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: template,
    scope: {},
    bindToController: {
      position: '@?',
      size: '@?',
      onClick: '&?',
      defaultText: '@?',
      isDisabled: '=?'
    },
    // there isn't actually any reason to have a controller other than to support the usage of
    // 'controllerAs' for the "position" attribute.
    controller: () => {},
    controllerAs: 'menuButton',
    link: (scope, elem, attr) => {
      translateValueSupport.setValues(scope.menuButton, 'defaultText', attr.defaultTextValues);
      switch (attr.size) {
        case 'small':
          scope.menuButton.btnSize = 'btn-sm';
          break;
        case 'large':
          scope.menuButton.btnSize = 'btn-lg';
          break;
      }
    }
  };
}
menuButton.$inject = ['translateValueSupport'];

export default menuButton;
