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
    }
  };
}
menuButton.$inject = ['translateValueSupport'];

export default menuButton;
