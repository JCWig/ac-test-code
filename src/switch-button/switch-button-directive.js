import template from './templates/switch-button-directive.tpl.html';

const SIZE_SMALL = 'small',
  SIZE_MEDIUM = 'medium',
  // STATE_ON = 'On', // never used
  // STATE_OFF = 'Off', // never used
  GRAYSCALE = 'grayscale',
  COLOR = 'color';

function switchButton(translateValueSupport) {
  class SwitchButtonController {

    initModel(ngModel) {
      this.ngModel = ngModel;

      ngModel.$render = () => {
        this.on = ngModel.$viewValue;
      };
    }
    filterDisabled(disabled) {
      return disabled === 'true' ? disabled : 'false';
    }

    setDefaultScopeValues() {
      this.onLabel = this.onLabel || 'components.switch-button.onLabel';
      this.offLabel = this.offLabel || 'components.switch-button.offLabel';
    }

    labelTranslateValues(values, name) {
      translateValueSupport.setValues(this, name, values);
    }

    toggleSwitch() {
      if (!this.isDisabled && !this.isReadonly) {
        this.on = !this.on;
        this.ngModel.$setViewValue(this.on);
        this.ngModel.$setTouched();
      }
    }
  }

  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {},
    bindToController: {
      onLabel: '@?',
      offLabel: '@?',
      isDisabled: '=?',
      isReadonly: '=?'
    },
    controller: SwitchButtonController,
    controllerAs: 'switchButton',
    template: template,
    link: function(scope, elem, attrs, ngModel) {
      let ctrl = scope.switchButton;
      let size = attrs.size !== SIZE_SMALL && attrs.size !== SIZE_MEDIUM ? SIZE_SMALL : attrs.size;
      let theme = attrs.theme === GRAYSCALE ? attrs.theme : COLOR;
      let element = elem.children(0);

      scope.switchButton.initModel(ngModel);

      ctrl.setDefaultScopeValues(attrs);

      ctrl.labelTranslateValues(attrs.onLabelValues, 'onLabel');
      ctrl.labelTranslateValues(attrs.offLabelValues, 'offLabel');

      element.toggleClass(SIZE_MEDIUM, size === SIZE_MEDIUM);
      element.toggleClass(GRAYSCALE, theme === GRAYSCALE);
    }
  };
}

switchButton.$inject = ['translateValueSupport'];

export default switchButton;
