import template from './templates/tag-input-directive.tpl.html';
import TagInputController from './tag-input-controller';

export default function() {

  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {},

    bindToController: {
      items: '=',
      delimiters: '=?',
      textProperty: '@',
      placeholder: '@',
      newTagLabel: '@',
      isDisabled: '=?',
      isReadonly: '=?',
      onSort: '&?',
      onValidate: '&?'
    },
    controller: TagInputController,
    controllerAs: 'taginput',
    template: template,
    link: function(scope, elem, attrs, ngModel) {
      scope.taginput.initialize(ngModel, attrs);
    }

  };
}
