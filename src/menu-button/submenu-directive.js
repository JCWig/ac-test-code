'use strict';

import submenuTemplate from './templates/submenu.tpl.html';

const defaultPosition = 'right';

class SubmenuDirectiveController {
  initialize(akamMenuButtonController) {
    this.size = this.size || akamMenuButtonController.size;
    this.position = this.position || akamMenuButtonController.position || defaultPosition;

    this.positionClass = `nested-menu-${this.position}`;
  }
}

function SubmenuDirective() {

  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    require: '^akamMenuButton',
    scope: {},
    template: submenuTemplate,
    bindToController: {
      text: '@',
      size: '@',
      position: '@',
      isDisabled: '=?'
    },
    controller: SubmenuDirectiveController,
    controllerAs: 'submenu',
    link: linkFunction
  };
}

function linkFunction(scope, element, atrs, akamMenuButtonController) {
  scope.submenu.initialize(akamMenuButtonController)
}

export default SubmenuDirective;