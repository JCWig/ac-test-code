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
  DELAY_CLOSING: 2000
};

function moveRangePoint(scope, id, rangePoint) {
  scope.$broadcast('dateRange.moveRangePoint', {
    id: id,
    rangePoint: rangePoint
  });
}

class DateRangeController {
  constructor(scope, $log, $timeout, dateFilter, $rootScope, translate, uuid, dateRangeService) {
    this.dateRangeService = dateRangeService;
    this.uuid = uuid;
    this.scope = scope;
    this.$log = $log;
    this.$timeout = $timeout;
    this.dateFilter = dateFilter;
    this.$rootScope = $rootScope;
    this.translate = translate;

    this.opened = false;
    this.rangeStart = {};
    this.rangeEnd = {};
    this.labels = {};
    this.rangeStart.selectedValue = '';
    this.rangeEnd.selectedValue = '';
    this.rangeSelected = false;
    this.openFromRangeStart = false;
    this.openFromRangeEnd = false;
    this.options = config.options;

    this.id = `akam-date-range-${scope.$id}-${this.uuid.guid()}`;
    this.dateRangeService.setMinMaxDate(this);
  }

  toggle(e, rangePoint = 'start') {
    this.preventOtherEvents(e);

    if (this.rangeSelected) {
      //send event to child directive
      //if it needs to move to start or end month, depends on the direction
      moveRangePoint(this.scope, this.id, rangePoint);
    }

    if (rangePoint === 'start') {
      this.openFromRangeStart = true;
      this.openFromRangeEnd = false;
    }
    if (!this.isDisabled) {
      this.opened = !this.opened;
    }
  }

  rangeStartToggle(e) {
    this.openFromRangeStart = true;
    this.openFromRangeEnd = false;
    this.toggle(e);
  }

  rangeEndToggle(e) {
    this.openFromRangeStart = false;
    this.openFromRangeEnd = true;
    this.toggle(e, 'end');
  }

  preventOtherEvents(e) {
    e.preventDefault();
    e.stopPropagation();
  }
}
DateRangeController.$inject = ['$scope', '$log', '$timeout',
  'dateFilter', '$rootScope', 'translate', 'uuid', 'dateRangeService'
];

function linkFn(scope, elem, attr) {

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
    ctrl.translate.async('components.date-range.placeholder').then((value) => {
      ctrl.rangeStart.placeholder = ctrl.rangeEnd.placeholder = value;
    });
  }

  ctrl.translate.async('components.date-range.labels.from').then((value) => {
    ctrl.labels.from = value;
  });

  ctrl.translate.async('components.date-range.labels.to').then((value) => {
    ctrl.labels.to = value;
  });

  //this event is sent from date picker directive when range is selected
  ctrl.$rootScope.$on('dateRange.rangeSelected', setRangeValues);
  scope.$on('$destroy', setRangeValues);

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
  }

  function setRangeValues(e, info) {
    let start, end;

    //if it is not for you, don't handle it
    if (info.id && info.id !== ctrl.id) {
      return false;
    }

    start = info.selectedStart;
    end = info.selectedEnd;

    if (info.rangeSelected) {
      ctrl.rangeStart.selectedValue = ctrl.dateFilter(start, ctrl.format);
      ctrl.rangeEnd.selectedValue = ctrl.dateFilter(end, ctrl.format);

      range = ctrl.dateRangeService.getSelectedDateRange(start, end, ctrl.format);
      setViewValue(range, start, end);

      ctrl.rangeSelected = info.rangeSelected;

      ctrl.$timeout(() => {
        ctrl.opened = false;
      }, config.DELAY_CLOSING);

    } else {
      ctrl.rangeStart.selectedValue = ctrl.dateFilter(start, ctrl.format);
      ctrl.rangeEnd.selectedValue = ctrl.dateFilter(end, ctrl.format);

      ctrl.$timeout(() => {
        //assuming only start date has value, calendar stay open
        ctrl.opened = true;
      });
    }
  }

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

    scope.$watch('dateRange.maxDate', (newValue) => {
      if (!newValue) {
        return;
      }
      scope.$broadcast('dateRange.resetMax', {
        id: ctrl.id,
        maxValue: new Date(newValue)
      });
    });

    scope.$watch('dateRange.minDate', (newValue) => {
      if (!newValue) {
        return;
      }
      scope.$broadcast('dateRange.resetMin', {
        id: ctrl.id,
        minValue: new Date(newValue)
      });
    });

    //this event is sent from date picker directive when range is selected
    scope.$watch('dateRange.format', () => {
      let sd = ctrl.rangeStart.selectedValue;
      let ed = ctrl.rangeEnd.selectedValue;

      if (!initialized) {
        return;
      }

      if (sd) {
        ctrl.rangeStart.selectedValue = ctrl.dateFilter(new Date(sd), ctrl.format);
      }

      if (ed) {
        ctrl.rangeEnd.selectedValue = ctrl.dateFilter(new Date(ed), ctrl.format);
      }
    });
  }
  initialize();
}

export default () => {
  return {
    restrict: 'E',
    controller: DateRangeController,
    controllerAs: 'dateRange',
    bindToController: {
      dateRange: '=ngModel',
      onSelect: '&',
      placeholder: '@?',
      isDisabled: '=?',
      format: '@?',
      minDate: '@?',
      maxDate: '@?'
    },
    scope: {},
    link: linkFn,
    template: template
  };
};
