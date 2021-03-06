import angular from 'angular';
import DropdownRenderer from './dropdown-renderer';

export default class DropdownSelectedRenderer extends DropdownRenderer {
  constructor(ctrl) {
    super(ctrl, 'selected', ctrl.templateData.selected);
  }
  set selectedItem(newSelectedItem) {
    if (angular.isDefined(this.scope)) {
      this.scope[this.componentName].selectedItem = newSelectedItem;
    }
  }

  set placeholder(newPlaceholder) {
    if (angular.isDefined(this.scope)) {
      this.scope[this.componentName].placeholder = newPlaceholder;
    }
  }

  render() {
    angular.element(
      this.elem[0].querySelector('div.dropdown-toggle')
    ).append(super.render());
  }
}