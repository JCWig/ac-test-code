import angular from 'angular';
import template from './templates/datetime-picker.tpl.html';

class DatetimePickerController {
  constructor($timeout) {

    this.$timeout = $timeout;
    //this.min = this.min ||

  }

  /*
    <akam-date-picker
    ng-model="dt"
    min="datetime.min"
    max="datetime.max"
    mode="datetime.mode"
    placeholder='datetime.placeholder'
    on-change="dateChanged()"
    format="datetime.dateFormat"
    is-disabled="datetime.disabled">
  </akam-date-picker>
  <akam-time-picker
    ng-model="dt"
    minute-step="datetime.minuteStep"
    hour-step="datetime.hourStep"
    on-change="timeChanged()"
    placeholder='datetime.placeholder'
    is-disabled="datetime.disabled"
    show-meridian="datetime.showMeridian">
  </akam-time-picker>
   */
}

DatetimePickerController.$inject = ['$timeout'];

function LinkFn(scope, elem, attr, ngModel) {

  if (!ngModel) {
    return;
  }

  /*  ctrl.$timeout(() => {
      ctrl.opened = false;
    }, config.DELAY_CLOSING);
  */
}

export default () => {
  return {
    restrict: 'E',
    require: '^ngModel',
    controller: DatetimePickerController,
    controllerAs: 'datetime',
    bindToController: {
      //datetime: '=ngModel',
      onChange: '&',
      format: '@?',
      min: '@?',
      max: '@?',
      minuteStep: '@?',
      hourStep: '@?',
      showMeridain: '@?',
      mode: '@? ',
      isDisabled: '=?'
    },
    scope: {},
    link: LinkFn,
    template: template
  };
};
