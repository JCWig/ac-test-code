import angular from 'angular';
import template from './templates/tag-input.tpl.html';

function tagInput(translate) {
  class TagInputController {
    constructor() {
      this.invalidInputs = [];
      this.data = {items: this.items};
    }

    validate(item) {
      if (typeof this.validateFunction === 'function') {
        return this.validateFunction(item);
      }
      return true;
    }

    sortItems(items) {
      if (typeof this.sortFunction === 'function') {
        return this.sortFunction(items);
      } else {
        return items;
      }
    }

    removeItem(item) {
      let index = this.data.items.indexOf(item);

      if (index > -1) {
        this.items.splice(index, 1);
        this.data.items = this.items;
      }
    }
  }

  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {},
    bindToController: {
      items: '=ngModel',
      availableItems: '=',
      taggingLabel: '@',
      sortFunction: '=',
      dragDropable: '@',
      placeholder: '@',
      restricted: '@',
      validateFunction: '='
    },
    controller: TagInputController,
    controllerAs: 'tagInput',
    template: template,
    link: function(scope, element, attrs, ngModel) {
      let ctrl = scope.tagInput;

      if (!ctrl.taggingLabel) {
        translate.async('components.tag-input.taggingLabel')
          .then( value => ctrl.taggingLabel = value );
      }
      if (!ctrl.placeholder) {
        translate.async('components.tag-input.placeholder')
          .then( value => ctrl.placeholder = value );
      }
      function removeClasses() {
        let stillDropping =
          element.querySelectorAll('.droppping, .dropping-before, .dropping-after');

        angular.forEach(stillDropping, ele => angular.element(ele)
          .removeClass('dropping dropping-before dropping-after'));
      }
      ngModel.$isEmpty = function(value) {
        return value.length === 0;
      };
      ngModel.$validators.invalidTagInput = function(modelValue, viewValue) {
        let flag = true;
        let i;

        for (i = 0; i < viewValue.length; i++) {
          if (!ctrl.validate(viewValue[i])) {
            flag = false;
            ctrl.invalidInputs.push(i);
          }
        }
        return flag;
      };
      scope.applyInvalidTags = function() {
        let tags = element.querySelectorAll('.ui-select-match-item');

        if (tags.length) {
          angular.forEach(scope.invalidInputs, index => {
            if (tags[index]) {
              tags[index].classList.add('invalid-tag');
            }
          });
        }
      };
      scope.setValues = function(newItems) {
        ctrl.items = newItems;
        ngModel.$setViewValue(newItems);
        ngModel.$setTouched();
      };
      scope.onSelect = function(item) {
        let index = ctrl.availableItems.indexOf(item);
        // console.log(index);
        if (!item) {
          ctrl.removeItem(item);
        } else if (ctrl.restricted && ctrl.restricted === 'true' &&
          ctrl.availableItems && index < 0) {
          ctrl.removeItem(item);
        }
        ngModel.$validate();
        scope.applyInvalidTags();
      };
      scope.$watch('tagInput.data.items', function(newItems) {
        let sortedItems = ctrl.sortItems(newItems);

        ctrl.invalidInputs = [];
        scope.setValues(sortedItems);
        ngModel.$validate();
      });
      scope.$on('uiSelectSort:change', function(e, model) {
        scope.setValues(model.array);
      });
      scope.$on('uiSelectSort:failed', function() {
        removeClasses();
      });
    }
  };
}

tagInput.$inject = ['translate'];

export default tagInput;