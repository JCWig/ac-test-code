import template from './templates/switch-button-directive.tpl.html';

const SIZE_SMALL = 'small',
  SIZE_MEDIUM = 'medium',
  STATE_DISABLED = 'disabled',
  // STATE_ON = 'On', // never used
  // STATE_OFF = 'Off', // never used
  GRAYSCALE = 'grayscale',
  COLOR = 'color';

function switchButton(translateValueSupport) {
  class SwitchButtonController {
    filterDisabled(disabled) {
      return disabled === 'true' ? disabled : 'false';
    }

    setDefaultScopeValues() {
      this.onLabel = this.onLabel || 'components.switch-button.onLabel';
      this.offLabel = this.offLabel || 'components.switch-button.offLabel';
      this.disabled = this.filterDisabled(this.disabled);
    }

    labelTranslateValues(values, name) {
      translateValueSupport.setValues(this, name, values);
    }
  }

  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {},
    bindToController: {
      on: '=ngModel',
      disabled: '@?',
      onLabel: '@?',
      offLabel: '@?'
    },
    controller: SwitchButtonController,
    controllerAs: 'switchButton',
    template: template,
    link: function(scope, elem, attrs, ngModel) {
      let ctrl = scope.switchButton;
      let size = attrs.size !== SIZE_SMALL && attrs.size !== SIZE_MEDIUM ? SIZE_SMALL : attrs.size;
      let theme = attrs.theme === GRAYSCALE ? attrs.theme : COLOR;
      let element = elem.children(0);
      let clickBound = false;

      function switchClick() {
        ngModel.$setViewValue(!ngModel.$viewValue);
      }

      ctrl.setDefaultScopeValues(attrs);

      ctrl.labelTranslateValues(attrs.onLabelValues, 'onLabel');
      ctrl.labelTranslateValues(attrs.offLabelValues, 'offLabel');

      element.toggleClass(SIZE_MEDIUM, size === SIZE_MEDIUM);
      element.toggleClass(GRAYSCALE, theme === GRAYSCALE);

      scope.$watch('switchButton.disabled', function(disabled) {
        ctrl.disabled = ctrl.filterDisabled(disabled);
        element.toggleClass(STATE_DISABLED, ctrl.disabled === 'true');

        if (ctrl.disabled === 'false' && !clickBound) {
          clickBound = true;
          elem.on('click', switchClick);
        } else if (ctrl.disabled === 'true') {
          clickBound = false;
          elem.off('click', switchClick);
        }
      });
    }
  };
}

switchButton.$inject = ['translateValueSupport'];

export default switchButton;
