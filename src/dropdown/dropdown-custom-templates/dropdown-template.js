import angular from 'angular';

export default class DropdownTemplate {
  constructor(ctrl, name, templateData) {
    this.elem = ctrl.elem;
    this.name = name;
    this.ctrl = ctrl;
    this.componentName = ctrl.name;
    this.placeholderName = `akam-${this.componentName + '-' + this.name}-placeholder`;
    this.template = angular.element(templateData.template);
    this.customContent = this.getCustomContent();
    this.insertionNode = angular.element(
      this.template[0].querySelector(templateData.customSelector)
    );

    if (angular.isDefined(this.customContent)) {
      this.scope = ctrl.$scope.$parent.$new();
      this.scope[this.componentName] = ctrl;
    }
  }

  getCustomContent() {
    return this.elem.find(this.placeholderName).remove().html() || undefined;
  }

  render() {
    if (angular.isDefined(this.customContent) && angular.isDefined(this.insertionNode)) {
      this.insertionNode.html(this.customContent);
    }

    let compiledTemplate;

    if (angular.isDefined(this.scope)) {
      compiledTemplate = this.ctrl.$compile(this.template)(this.scope);
    } else {
      compiledTemplate = this.ctrl.$compile(this.template)(this.ctrl.$scope);
    }

    return compiledTemplate;
  }
}
