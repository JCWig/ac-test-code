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
  DELAY_CLOSING: 1800,
  LABELS: {
    FROM: 'From',
    TO: 'To'
  }
};

function moveRangePoint(scope, id, direction) {
  scope.$broadcast('moveRangePoint', {
    id: id,
    direction: direction
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
    this.rangeStart.selectedValue = '';
    this.rangeEnd.selectedValue = '';
    this.rangeSelected = false;
    this.openFromRangeStart = false;
    this.openFromRangeEnd = false;
    this.options = config.options;

    //they need to be getting from locale file
    this.labels = {
      from: config.LABELS.FROM,
      to: config.LABELS.TO
    };

    this.dateRangeService.setMinMaxDate(this.rangeStart, new Date());
    this.id = `akam-date-range-${scope.$id}-${this.uuid.guid()}`;

  }

  toggle(e, direction) {
    this.preventOtherEvents(e);

    if (this.rangeSelected) {
      //send event to child directive
      //if it needs to move to start or end month, depends on the direction
      moveRangePoint(this.scope, this.id, direction);
    }
    if (!this.isDisabled) {
      this.opened = !this.opened;
    }
  }

  rangeStartToggle(e) {
    this.openFromRangeStart = true;
    this.openFromRangeEnd = false;
    this.toggle(e, 'prev');
  }

  rangeEndToggle(e) {
    this.openFromRangeStart = false;
    this.openFromRangeEnd = true;
    this.toggle(e, 'next');
  }

  preventOtherEvents(e) {
    e.preventDefault();
    e.stopPropagation();
  }
}
DateRangeController.$inject = ['$scope', '$log', '$timeout',
  'dateFilter', '$rootScope', 'translate', 'uuid', 'dateRangeService'];

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

  //this event is sent from date picker directive when range is selected
  ctrl.$rootScope.$on('rangeSelected', setRangeValues);
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
      ctrl.closingRange = true;

      ctrl.$timeout(() => {
        ctrl.opened = false;
        ctrl.closingRange = false;
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
      scope.$broadcast('initialDateRange', {
        startDate: start,
        endDate: end,
        id: ctrl.id
      });

      initialized = true;
    });

    //this event is sent from date picker directive when range is selected
    scope.$watch('dateRange.format', () => {
      start = ctrl.rangeStart.selectedValue;
      end = ctrl.rangeEnd.selectedValue;

      if (!initialized) {
        return;
      }

      if (start) {
        ctrl.rangeStart.selectedValue = ctrl.dateFilter(new Date(start), ctrl.format);
      }

      if (end) {
        ctrl.rangeEnd.selectedValue = ctrl.dateFilter(new Date(end), ctrl.format);
      }
    });
  }
  initialize();
}

function DateRangeDirective() {
  return {
    restrict: 'E',
    controller: DateRangeController,
    controllerAs: 'dateRange',
    bindToController: {
      dateRange: '=ngModel',
      onSelect: '&',
      placeholder: '@?',
      isDisabled: '=?',
      format: '@?'
    },
    scope: {},
    link: linkFn,
    template: template
  };
}

export default DateRangeDirective;
