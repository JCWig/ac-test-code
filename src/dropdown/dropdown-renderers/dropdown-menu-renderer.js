import angular from 'angular';
import DropdownRenderer from './dropdown-renderer';

export default class DropdownMenuRenderer extends DropdownRenderer {
  constructor(ctrl) {
    super(ctrl, 'option', ctrl.templateData.menu);
  }

  set filterPlaceholder(newFilterPlaceholder) {
    if (angular.isDefined(this.scope)) {
      this.scope.dropdown.filterPlaceholder = newFilterPlaceholder;
    }
  }

  render() {
    let compiledTemplate = super.render();

    if (this.ctrl.appendToBody) {
      this.ctrl.appendToBodyService.appendToBody(this.elem, compiledTemplate,
        () => {
          this.ctrl.$scope.$watch(`${this.componentName}.isOpen`, (isOpen) => {
            compiledTemplate.toggleClass('util-show', isOpen);
            compiledTemplate.toggleClass('util-hide', !isOpen);
            this.ctrl.initFilterClick();
          });
        }
      );
    } else {
      this.elem.children(0).append(compiledTemplate);
    }
  }
}
