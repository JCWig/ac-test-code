import angular from 'angular';
import template from './templates/menu-button.tpl.html';

const defaultActionSelector = 'akam-menu-button-placeholder',
  itemsSelector = 'akam-menu-button-item',
  menuButtonSelector = '.menu-button',
  splitButtonSelector = '.split-button';

function menuButton($compile) {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    bindToController: {
      position: '@'
    },

    // similar to data-table we have to manually compile the template and move some stuff around
    // if an akam-menu-item has an attribute named "default-action", we should use a split button
    // but if not, we should just show a regular gear icon with the menu dropdown.
    template: function(element) {
      let menuButtonItems = element.find(itemsSelector),
        thisTemplate = angular.element(template),
        defaultAction;

      angular.forEach(menuButtonItems, (item) => {
        if (item.hasAttribute('default-action')) {
          defaultAction = item;
        }
      });

      thisTemplate.find(`${itemsSelector}-placeholder`).append(menuButtonItems);

      if (defaultAction) {
        angular.element(thisTemplate[0].querySelector(menuButtonSelector)).remove();
        thisTemplate.find(defaultActionSelector).html(defaultAction.outerHTML);
      } else {
        angular.forEach(thisTemplate[0].querySelectorAll(splitButtonSelector), (elem) => {
          angular.element(elem).remove();
        });
      }

      return thisTemplate[0].outerHTML;
    },

    link: (scope, element) => {
      let compileScope,
        defaultAction = element.find(defaultActionSelector),
        items = element.find(`${itemsSelector}-placeholder`);

      // manually compile the default action into the button, if necessary
      if (defaultAction.length) {
        compileScope = scope.$parent.$new();
        defaultAction.replaceWith(
          $compile(defaultAction.children()[0].outerHTML)(compileScope)
        );
      }

      // manually compile each of the akam-menu-button-item directives with a new scope
      angular.forEach(items.children(), (child) => {
        compileScope = scope.$parent.$new();
        items.parent().append(
          $compile(child.outerHTML)(compileScope)
        );
      });
      items.replaceWith('');
    },

    // there isn't actually any reason to have a controller other than to support the usage of
    // 'controllerAs' for the "position" attribute.
    controller: () => {},
    controllerAs: 'menuButton'
  };
}

menuButton.$inject = ['$compile'];

export default menuButton;
