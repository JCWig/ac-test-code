import DropdownRenderer from './dropdown-renderer';

export default class DropdownMenuRenderer extends DropdownRenderer {
  constructor(ctrl) {
    super(ctrl, 'option', ctrl.templateData.menu);
  }

  render() {
    let compiledTemplate = super.render();

    if (this.ctrl.appendToBody) {
      this.ctrl.appendToBodyService.appendToBody(this.elem, compiledTemplate,
        () => {
          this.ctrl.$scope.$watch(`${this.componentName}.isOpen`, (isOpen) => {
            compiledTemplate.toggleClass('util-show', isOpen);
            compiledTemplate.toggleClass('util-hide', !isOpen);
          });
        }
      );
    } else {
      this.elem.children(0).append(compiledTemplate);
    }
  }
}
