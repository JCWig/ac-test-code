import angular from 'angular';
import template from './templates/date-range.tpl.html';

const config = {
  options: {
    startingDay: 0,
    showWeeks: false,
    autoclose: true,
    minMode: 'day',
    maxMode: 'day'
  },
  FORMAT: 'EEE, MMM dd, yyyy',
  DELAY_CLOSING: 600
};

class DateRangeController {
  constructor(scope, $log, $timeout, dateFilter, $rootScope, $translate, uuid, dateRangeService) {
    this.dateRangeService = dateRangeService;
    this.uuid = uuid;
    this.scope = scope;
    this.$log = $log;
    this.$timeout = $timeout;
    this.dateFilter = dateFilter;
    this.$rootScope = $rootScope;
    this.$translate = $translate;

    this.opened = false;
    this.rangeStart = {};
    this.rangeEnd = {};
    this.rangeStart.selectedValue = '';
    this.rangeEnd.selectedValue = '';
    this.rangeSelected = false;
    this.openFromRangeStart = false;
    this.openFromRangeEnd = false;
    this.options = config.options;
    this.rangeSelectedEvent = undefined;

    this.id = `akam-date-range-${scope.$id}-${this.uuid.guid()}`;

    this.scope.$watch('dateRange.max', (newValue) => {
      if (!newValue) {
        return;
      }
      newValue = newValue.replace(/^"(.+)"$/, '$1');
      if (angular.isDate(new Date(newValue))) {
        scope.$broadcast('dateRange.resetMax', {
          maxValue: new Date(newValue)
        });
      }
    });

    this.scope.$watch('dateRange.min', (newValue) => {
      if (!newValue) {
        return;
      }
      newValue = newValue.replace(/^"(.+)"$/, '$1');
      if (angular.isDate(new Date(newValue))) {
        scope.$broadcast('dateRange.resetMin', {
          minValue: new Date(newValue)
        });
      }
    });
  }

  toggle(e, rangePoint = 'start') {
    let focusState = true;

    this.preventOtherEvents(e);

    if (this.rangeSelected) {
      this.scope.$broadcast('dateRange.moveRangePoint', {
        id: this.id,
        rangePoint: rangePoint
      });

      if (rangePoint === 'end') {
        focusState = false;
      }
    } else {
      let sdValue = this.rangeStart.selectedValue,
        edValue = this.rangeEnd.selectedValue;

      if (!sdValue && !edValue) {
        if (rangePoint === 'end') {
          focusState = false;
        }
      } else if (sdValue) {
        focusState = false;
      }
    }
    this.setFocusState(focusState);

    if (!this.isDisabled) {
      this.opened = !this.opened;
    }
  }

  rangeStartToggle(e) {
    this.toggle(e);
  }

  rangeEndToggle(e) {
    this.toggle(e, 'end');
  }

  setFocusState(startBlankToFocus) {
    this.openFromRangeStart = startBlankToFocus;
    this.openFromRangeEnd = !startBlankToFocus;
  }

  preventOtherEvents(e) {
    e.preventDefault();
    e.stopPropagation();
  }
}

DateRangeController.$inject = ['$scope', '$log', '$timeout',
  'dateFilter', '$rootScope', '$translate', 'uuid', 'dateRangeService'
];

function linkFn(scope, elem, attr, ngModel) {

  let initialized = false,
    ctrl = scope.dateRange,
    range;

  if (!ctrl.dateRange || !attr.ngModel) {
    ctrl.$log.error('ng-model is required for date range component directive.');
    return;
  }

  if (attr.placeholder) {
    ctrl.rangeStart.placeholder = ctrl.rangeEnd.placeholder = attr.placeholder;
  } else {
    ctrl.$translate('components.date-range.placeholder').then((value) => {
      ctrl.rangeStart.placeholder = ctrl.rangeEnd.placeholder = value;
    });
  }

  function setViewValue(value, start, end) {
    ctrl.dateRange.startDate = start;
    ctrl.dateRange.endDate = end;

    if (angular.isFunction(ctrl.onSelect) && attr.onSelect) {
      ctrl.onSelect({
        selectedDateRange: value,
        startDate: start,
        endDate: end
      });
    }
    ngModel.$setViewValue({
      startDate: start,
      endDate: end
    });
  }

  scope.setRangeValues = (e, info) => {
    let start, end;

    //if it is not for you, don't handle it
    if (!info || !info.id || info.id !== ctrl.id) {
      e.stopPropagation();
      return;
    }

    start = info.selectedStart;
    end = info.selectedEnd;

    if (info.rangeSelected) {
      ctrl.rangeStart.selectedValue = ctrl.dateFilter(start, ctrl.format);
      ctrl.dateRange.startDate = start;
      ctrl.rangeEnd.selectedValue = ctrl.dateFilter(end, ctrl.format);
      ctrl.dateRange.endDate = end;

      range = ctrl.dateRangeService.getSelectedDateRange(start, end, ctrl.format);
      setViewValue(range, start, end);

      ctrl.rangeSelected = info.rangeSelected;

      ctrl.$timeout(() => {
        ctrl.opened = false;
      }, config.DELAY_CLOSING);

    } else {
      ctrl.rangeStart.selectedValue = ctrl.dateFilter(start, ctrl.format);
      ctrl.dateRange.startDate = start;
      ctrl.rangeEnd.selectedValue = ctrl.dateFilter(end, ctrl.format);
      ctrl.dateRange.endDate = end;

      ctrl.$timeout(() => {
        //assuming only start date has value, calendar stay open - forced
        ctrl.opened = true;
      });

      if (start) {
        ctrl.setFocusState(false);
      } else {
        ctrl.setFocusState(true);
      }
    }
    e.stopPropagation();
  };

  function initialize() {
    let start = '',
      end = '',
      clone;

    if (initialized) {
      return;
    }

    start = ctrl.dateRange.startDate;
    end = ctrl.dateRange.endDate;

    if (start && end) {
      //if startDate greater then endDate, swap date value
      if (start > end) {
        clone = new Date(end);
        end = start;
        start = clone;
      }

      ctrl.rangeStart.selectedValue = ctrl.dateFilter(start, ctrl.format);
      ctrl.rangeEnd.selectedValue = ctrl.dateFilter(end, ctrl.format);
      ctrl.rangeSelected = true;

      range = ctrl.dateRangeService.getSelectedDateRange(start, end, ctrl.format);
      setViewValue(range, start, end);
    }

    ctrl.$timeout(() => {
      //interesting, have to wait for $digest completed
      ctrl.format = ctrl.format || config.FORMAT;

      //send the event to child directive to handle with range values
      //use timeout to make sure the children directives are ready
      scope.$broadcast('dateRange.updateSelected', {
        startDate: start,
        endDate: end,
        id: ctrl.id
      });

      initialized = true;
    });

    //this event is sent from date picker directive when range is selected
    scope.$watch('dateRange.format', () => {
      let sd = ctrl.dateRange.startDate;
      let ed = ctrl.dateRange.endDate;

      if (!initialized) {
        return;
      }

      if (sd) {
        ctrl.rangeStart.selectedValue = ctrl.dateFilter(sd, ctrl.format);
      }

      if (ed) {
        ctrl.rangeEnd.selectedValue = ctrl.dateFilter(ed, ctrl.format);
      }
    });
  }

  //this event is sent from date picker directive when range is selected
  ctrl.rangeSelectedEvent = ctrl.$rootScope.$on('dateRange.rangeSelected', scope.setRangeValues);
  scope.$on('$destroy', () => {
    ctrl.rangeSelectedEvent();
  });

  initialize();
}

export default () => {
  return {
    restrict: 'E',
    require: '^ngModel',
    controller: DateRangeController,
    controllerAs: 'dateRange',
    bindToController: {
      dateRange: '=ngModel',
      onSelect: '&',
      placeholder: '@?',
      isDisabled: '=?',
      format: '@?',
      min: '@?',
      max: '@?'
    },
    scope: {},
    link: linkFn,
    template: template
  };
};
