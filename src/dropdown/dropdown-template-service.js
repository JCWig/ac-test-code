import angular from 'angular';
import selectedElemTemplate from './templates/dropdown-selected.tpl.html';
import menuElemTemplate from './templates/dropdown-menu.tpl.html';

class DropdownTemplate {
  constructor(elem, name, ctrl, template) {
    this.elem = elem;
    this.name = name;
    this.ctrl = ctrl;
    this.componentName = ctrl.name;
    this.placeholderName = `akam-${this.componentName + '-' + this.name}-placeholder`;
    this.template = angular.element(template);
    this.customContent = this.getCustomContent();

    if (angular.isDefined(this.customContent)) {
      this.scope = ctrl.$scope.$parent.$new();
      this.scope[this.componentName] = ctrl;
    }
  }

  getCustomContent() {
    return this.elem.find(this.placeholderName).remove().html() || undefined;
  }

  render(compile) {
    if (angular.isDefined(this.customContent)) {
      this.insertCustomContent();
    }

    let compiledTemplate;

    if (angular.isDefined(this.scope)) {
      compiledTemplate = compile(this.template)(this.scope);
    } else {
      compiledTemplate = compile(this.template)(this.ctrl.$scope);
    }

    return compiledTemplate;
  }

}

DropdownTemplate.$inject = ['$compile'];

class DropdownSelectedTemplate extends DropdownTemplate {
  constructor(elem, ctrl) {
    super(elem, 'selected', ctrl, selectedElemTemplate);

    this.insertCustomContent = () => {
      this.template[0] = angular.element(this.customContent)[0];
    };

    this.insertionNode = angular.element(elem[0].querySelector('div.dropdown-toggle'));

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

  render(compile) {
    angular.element(
      this.elem[0].querySelector('div.dropdown-toggle')
    ).append(super.render(compile));
  }
}

class DropdownMenuTemplate extends DropdownTemplate {
  constructor(elem, ctrl, appendToBodyService) {
    super(elem, 'option', ctrl, menuElemTemplate);

    this.appendToBodyService = appendToBodyService;

    this.insertCustomContent = () => {
      angular.element(this.template[0].querySelector('a.dropdown-item-link'))
        .html(this.customContent);
    };
    this.insertionNode = angular.element(elem[0].querySelector('div.dropdown-toggle'));
  }

  set filterPlaceholder(newFilterPlaceholder) {
    if (angular.isDefined(this.scope)) {
      this.scope.dropdown.filterPlaceholder = newFilterPlaceholder;
    }
  }

  render(compile) {
    let compiledTemplate = super.render(compile);

    if (this.ctrl.appendToBody) {
      this.appendToBodyService.appendToBody(this.elem, compiledTemplate,
        () => {
          this.ctrl.$scope.$watch('dropdown.isOpen', (isOpen) => {
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

function DropdownTemplateService() {

  return {
    stashTemplate: function(tElem, dropdownTemplate, tagName) {
      let dropdownTemplateElem = angular.element(dropdownTemplate);

      if (tElem.find(tagName).length) {
        dropdownTemplateElem.find(tagName + '-placeholder').html(tElem.find(tagName).html());
      }
      return dropdownTemplateElem[0].outerHTML;
    },
    DropdownSelectedTemplate: DropdownSelectedTemplate,
    DropdownMenuTemplate: DropdownMenuTemplate
  };
}

export default DropdownTemplateService;